import { User, Trash2, Eye } from "lucide-react";
import { useState } from "react";
import type { AadharData } from "@/types/aadhar-data.types";

interface AadhaarCardProps {
  data: AadharData;
  onDelete: (id: string) => void;
}

export const AadhaarCard: React.FC<AadhaarCardProps> = ({ data, onDelete }) => {
  const [showDetails, setShowDetails] = useState<boolean>(false);

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-grey bg-opacity-20 p-2 rounded-full">
              <User className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{data.name}</h3>
              <p className="text-blue-100 text-sm">ID: {data.aadhaarNumber}</p>
            </div>
          </div>
          <button
            onClick={() => onDelete(data._id)}
            className="bg-black bg-opacity-20 hover:bg-opacity-30 p-2 rounded-full transition-all duration-200"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Basic Info */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500">Date of Birth</p>
            <p className="font-medium text-gray-900">{data.dob}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Gender</p>
            <p className="font-medium text-gray-900">{data.gender}</p>
          </div>
        </div>

        {/* Address Preview */}
        <div className="mb-4">
          <p className="text-sm text-gray-500">Address</p>
          <p className="font-medium text-gray-900 truncate">{data.address}</p>
        </div>

        {/* Expandable Details */}
        {showDetails && (
          <div className="border-t pt-4 space-y-3">
            <div>
              <p className="text-sm text-gray-500">Full Address</p>
              <p className="font-medium text-gray-900">{data.address}</p>
            </div>
          </div>
        )}

        {/* Toggle Details Button */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full mt-4 flex items-center justify-center space-x-2 py-2 px-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Eye className="h-4 w-4" />
          <span className="text-sm font-medium">
            {showDetails ? "Hide Details" : "View Details"}
          </span>
        </button>
      </div>
    </div>
  );
};