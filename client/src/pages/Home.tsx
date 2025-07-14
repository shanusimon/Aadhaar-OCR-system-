import { Button } from "@/components/ui/button";
import { Database } from "lucide-react";
import { useNavigate } from "react-router-dom";
import UploadArea from "@/components/UploadArea";
import { useState } from "react";
import type { AadharData } from "@/types/aadhar-data.types";
import { OCRProcessButton } from "@/components/OCRProcessButton";
import { FeaturesSection } from "@/components/FeaturedSection";
import { getImageData } from "@/services/getImageData";
import { ResultSection } from "@/components/ResultSection";

function Home() {
    const [frontImage, setFrontImage] = useState<string | null>(null)
    const [backImage, setBackImage] = useState<string | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [extractedData, setExtractedData] = useState<AadharData | null>(null)
    const navigate = useNavigate();

    const processOCR = async () => {
        setIsProcessing(true)

        const aadharData = await getImageData(frontImage, backImage);
        console.log(aadharData);
        

        setExtractedData((aadharData?.parsedData || []) as AadharData)
        setIsProcessing(false)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            {/* Main Container */}
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Header Section */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
                        <div className="text-center lg:text-left flex-1">
                            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                Aadhaar Card OCR Scanner
                            </h1>
                            <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
                                Upload your Aadhaar card images and extract information automatically using advanced OCR technology
                            </p>
                        </div>
                        <div className="flex justify-center lg:justify-end">
                            <Button
                                onClick={() => navigate("/list")}
                                variant="outline"
                                className="flex items-center gap-3 bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-blue-300 text-gray-700 hover:text-blue-600 px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                            >
                                <Database className="h-5 w-5" />
                                View Saved Data
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Upload Section */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                            Upload Your Aadhaar Card
                        </h2>
                        <p className="text-gray-600">
                            Please upload both front and back images of your Aadhaar card
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-8">
                        <UploadArea
                            side="front"
                            image={frontImage}
                            setBackImage={setBackImage}
                            setFrontImage={setFrontImage}
                        />
                        <UploadArea
                            side="back"
                            image={backImage}
                            setBackImage={setBackImage}
                            setFrontImage={setFrontImage}
                        />
                    </div>
                </div>

                {/* OCR Process Button */}
                {(frontImage && backImage) && (
                    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
                        <div className="text-center">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                Ready to Process
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Both images uploaded successfully. Click below to extract information.
                            </p>
                            <OCRProcessButton
                                isProcessing={isProcessing}
                                processOCR={processOCR}
                            />
                        </div>
                    </div>
                )}

                {/* Results Section */}
                {extractedData && (
                    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
                        <ResultSection extractedData={extractedData} />
                    </div>
                )}

                {/* Features Section */}
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                    <FeaturesSection />
                </div>
            </div>
        </div>
    )
}

export default Home