import React, { useState } from "react";
import {
  Calendar,
  Hash,
  MapPin,
  User,
  Edit2,
  Save,
  X,
  Check,
  AlertCircle,
  FileText,
  Shield
} from "lucide-react";
import type { AadharData } from "@/types/aadhar-data.types";
import { saveData } from "@/services/save.data";

interface ResultSectionProps {
  extractedData: AadharData;
  onDataUpdate?: (updatedData: AadharData) => void;
}

const validateData = async (data: AadharData) => {
  const errors: Record<string, string> = {};

  if (!data.name?.trim()) errors.name = "Name is required";
  if (!data.gender) errors.gender = "Gender is required";
  if (!data.dob) errors.dob = "Date of birth is required";
  if (!data.aadhaarNumber?.trim()) errors.aadhaarNumber = "Aadhaar number is required";

  if (data.aadhaarNumber) {
    const cleanedAadhaarNumber = data.aadhaarNumber.replace(/\s/g, '').replace(/\D/g, '');
    if (cleanedAadhaarNumber.length !== 12) {
      errors.aadhaarNumber = "Aadhaar number must be 12 digits";
    }
  }

  if (!data.address?.trim()) errors.address = "Address is required";

  if (Object.keys(errors).length > 0) {
    throw { name: "ValidationError", inner: Object.entries(errors).map(([path, message]) => ({ path, message })) };
  }
};

const formatToISO = (date: string) => {
  if (!date) return "";
  // Handle different date formats
  if (date.includes("/")) {
    const parts = date.split("/");
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
    }
  }
  // If already in ISO format or other format, return as is
  return date;
};

export const ResultSection: React.FC<ResultSectionProps> = ({ extractedData, onDataUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<AadharData>(extractedData);
  const [isSaving, setIsSaving] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData(extractedData);
    setFormErrors({});
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData(extractedData);
    setFormErrors({});
  };

  const showToastMessage = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const dataToValidate = {
      ...editedData,
      dob: formatToISO(editedData.dob || ""),
    };

    try {
      setFormErrors({});
      await validateData(dataToValidate);

      const response = await saveData(dataToValidate);

      onDataUpdate?.(dataToValidate);
      setIsEditing(false);
      showToastMessage(response.message || "Data saved successfully!", 'success');
    } catch (error: any) {
      console.error('Error saving data:', error);

      if (error.name === "ValidationError") {
        const fieldErrors: Record<string, string> = {};
        error.inner.forEach((e: any) => {
          if (e.path) fieldErrors[e.path] = e.message;
        });
        setFormErrors(fieldErrors);
        showToastMessage("Please fix the validation errors", 'error');
      } else {
        // Handle API errors
        const errorMessage = error.response?.data?.message ||
          error.message ||
          "Failed to save data. Please try again.";
        showToastMessage(errorMessage, 'error');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof AadharData, value: string) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear field error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const displayData = isEditing ? editedData : extractedData;
  console.log(displayData)
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Toast Notification */}
      {showToast && (
        <div className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-in slide-in-from-top duration-300 ${toastType === 'success'
          ? 'bg-green-500 text-white'
          : 'bg-red-500 text-white'
          }`}>
          {toastType === 'success' ? (
            <Check className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          {toastMessage}
        </div>
      )}

      {/* Header Card */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-6 text-white shadow-2xl">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <FileText className="h-6 w-6" />
              </div>
              <h1 className="text-2xl font-bold">Extracted Information</h1>
            </div>
            <p className="text-blue-100">Information extracted from your Aadhaar card</p>
          </div>
          <div className="flex gap-2">
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all duration-200 flex items-center gap-2 text-white font-medium"
              >
                <Edit2 className="h-4 w-4" />
                Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all duration-200 flex items-center gap-2 text-white font-medium"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save
                    </>
                  )}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 text-white font-medium"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Personal Information */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500 rounded-lg">
                <User className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Personal Details</h2>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Full Name</label>
                {isEditing ? (
                  <div className="space-y-1">
                    <input
                      type="text"
                      value={displayData.name || ""}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg font-medium ${formErrors.name ? 'border-red-300' : 'border-gray-200'
                        }`}
                      placeholder="Enter full name"
                    />
                    {formErrors.name && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {formErrors.name}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-lg font-bold text-gray-800 bg-gray-50 px-4 py-3 rounded-lg">
                    {displayData.name || "Not provided"}
                  </p>
                )}
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Gender</label>
                {isEditing ? (
                  <div className="space-y-1">
                    <select
                      value={displayData.gender || ""}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                      className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${formErrors.gender ? 'border-red-300' : 'border-gray-200'
                        }`}
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    {formErrors.gender && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {formErrors.gender}
                      </p>
                    )}
                  </div>
                ) : (
                  <span className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {displayData.gender || "Not specified"}
                  </span>
                )}
              </div>

              {/* Date of Birth */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Date of Birth</label>
                {isEditing ? (
                  <div className="space-y-1">
                    <input
                      type="date"
                      value={displayData.dob ? formatToISO(displayData.dob) : ""}
                      onChange={(e) => handleInputChange('dob', e.target.value)}
                      className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${formErrors.dob ? 'border-red-300' : 'border-gray-200'
                        }`}
                    />
                    {formErrors.dob && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {formErrors.dob}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="flex items-center gap-2 text-gray-800 bg-gray-50 px-4 py-3 rounded-lg">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    {displayData.dob || "Not provided"}
                  </p>
                )}
              </div>

              {/* Father's Name */}
              {displayData.fatherName && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Father's Name</label>
                  {isEditing ? (
                    <div className="space-y-1">
                      <input
                        type="text"
                        value={displayData.fatherName || ""}
                        onChange={(e) => handleInputChange('fatherName', e.target.value)}
                        className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${formErrors.fatherName ? 'border-red-300' : 'border-gray-200'
                          }`}
                        placeholder="Enter father's name"
                      />
                      {formErrors.fatherName && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" />
                          {formErrors.fatherName}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-800 bg-gray-50 px-4 py-3 rounded-lg">
                      {displayData.fatherName}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Aadhaar Details Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500 rounded-lg">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Aadhaar Details</h2>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Aadhaar Number</label>
              {isEditing ? (
                <div className="space-y-1">
                  <input
                    type="text"
                    value={displayData.aadhaarNumber || ""}
                    onChange={(e) => handleInputChange('aadhaarNumber', e.target.value)}
                    className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xl font-mono font-bold text-purple-600 ${formErrors.aadhaarNumber ? 'border-red-300' : 'border-gray-200'
                      }`}
                    maxLength={12}
                    placeholder="Enter 12-digit number"
                  />
                  {formErrors.aadhaarNumber && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {formErrors.aadhaarNumber}
                    </p>
                  )}
                </div>
              ) : (
                <div className="bg-gradient-to-r from-purple-100 to-indigo-100 p-4 rounded-lg">
                  <p className="text-2xl font-mono font-bold text-purple-700 flex items-center gap-2">
                    <Hash className="h-5 w-5" />
                    {displayData.aadhaarNumber || "Not provided"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Address Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500 rounded-lg">
              <MapPin className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Address Information</h2>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Full Address</label>
            {isEditing ? (
              <div className="space-y-1">
                <textarea
                  value={displayData.address || ""}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-h-[120px] resize-none ${formErrors.address ? 'border-red-300' : 'border-gray-200'
                    }`}
                  placeholder="Enter full address..."
                />
                {formErrors.address && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {formErrors.address}
                  </p>
                )}
              </div>
            ) : (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-800 leading-relaxed">
                  {displayData.address || "Address not provided"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};