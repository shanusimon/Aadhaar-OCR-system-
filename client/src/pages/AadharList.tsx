import { ChevronLeft, User } from "lucide-react";
import { useState, useEffect } from "react";
import { DeleteDialog } from "@/components/DeleteDialog";
import { AadhaarCard } from "@/components/AadhaarCard";
import { deleteData } from "@/services/deleteData";
import { fetchAadharList } from "@/services/fetchAadharList";
import { toast } from "react-toastify";
import type { AadharData } from "@/types/aadhar-data.types";
import { useNavigate } from "react-router-dom";

// Type for the card to delete state
interface CardToDelete {
    id: string;
    name: string;
}

export default function AadhaarDisplayPage() {
    const [aadhaarData, setAadhaarData] = useState<AadharData[]>([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
    const [cardToDelete, setCardToDelete] = useState<CardToDelete | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate()
    const handleDeleteClick = (id: string) => {
        const card = aadhaarData.find(item => item._id === id);
        setCardToDelete({ id, name: card?.name || "Unknown" });
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!cardToDelete) return;
        console.log("Delete triggered for:", cardToDelete);
        try {
            const response = await deleteData(cardToDelete.id);
            setAadhaarData(prevData => prevData.filter(item => item._id !== cardToDelete.id));
            setDeleteDialogOpen(false);
            setCardToDelete(null);
            toast(response.message || "Error deleting data.");
        } catch (error: any) {
            console.error(error);
            toast(error.message);
        }
    };

    const closeDeleteDialog = () => {
        setDeleteDialogOpen(false);
        setCardToDelete(null);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const response = await fetchAadharList();
                setAadhaarData(response?.aadharData || []);
            } catch (error) {
                console.error("Error fetching Aadhaar data:", error);
                toast("Error loading data. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-6" onClick={()=>navigate(-1)}>
                        <ChevronLeft className="h-5 w-5" />
                        <span className="font-medium">Go back</span>
                    </button>

                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-900 mb-3">
                            Aadhaar Records
                        </h1>
                        <p className="text-lg text-gray-600">
                            {isLoading ? (
                                "Loading records..."
                            ) : (
                                `Displaying ${aadhaarData.length} saved Aadhaar record${aadhaarData.length !== 1 ? "s" : ""}`
                            )}
                        </p>
                    </div>
                </div>

                {/* Content */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-16">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : aadhaarData.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-sm">
                            <User className="h-12 w-12 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Aadhaar Records Found</h3>
                        <p className="text-gray-500 max-w-md mx-auto">
                            There are no saved Aadhaar records to display. Add some records to get started.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {aadhaarData.map((data, index) => (
                            <AadhaarCard key={data._id || index} data={data} onDelete={handleDeleteClick} />
                        ))}
                    </div>
                )}
            </div>

            {/* Delete Dialog */}
            <DeleteDialog
                isOpen={deleteDialogOpen}
                onClose={closeDeleteDialog}
                onConfirm={confirmDelete}
                cardName={cardToDelete?.name || ""}
            />
        </div>
    );
}