import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Database, Upload, Shield, Zap, FileText, Camera, ArrowRight } from "lucide-react";

function Home() {
    const [frontImage, setFrontImage] = useState<File | null>(null);
    const [backImage, setBackImage] = useState<File | null>(null);

    const handleFileUpload = (file: File, type: 'front' | 'back') => {
        if (type === 'front') {
            setFrontImage(file);
        } else {
            setBackImage(file);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, type: 'front' | 'back') => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleFileUpload(file, type);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const features = [
        {
            icon: <Zap className="h-8 w-8 text-blue-600" />,
            title: "Fast Processing",
            description: "Extract information from your Aadhaar card in seconds using advanced OCR technology"
        },
        {
            icon: <Shield className="h-8 w-8 text-green-600" />,
            title: "Secure & Private",
            description: "Your data is processed securely and never stored on external servers"
        },
        {
            icon: <FileText className="h-8 w-8 text-purple-600" />,
            title: "Accurate Results",
            description: "High accuracy text extraction with support for multiple languages"
        }
    ];

    const UploadCard = ({ 
        title, 
        type, 
        image, 
        onFileSelect 
    }: { 
        title: string; 
        type: 'front' | 'back'; 
        image: File | null; 
        onFileSelect: (file: File) => void; 
    }) => (
        <div className="bg-white rounded-lg shadow-md p-6 border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
            <div 
                className="relative"
                onDrop={(e) => handleDrop(e, type)}
                onDragOver={handleDragOver}
            >
                <div className="text-center">
                    <div className="mx-auto mb-4">
                        {image ? (
                            <div className="relative">
                                <img 
                                    src={URL.createObjectURL(image)} 
                                    alt={`${title} preview`}
                                    className="max-h-48 mx-auto rounded-lg shadow-sm"
                                />
                                <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center">
                                <Camera className="h-16 w-16 text-gray-400 mb-4" />
                                <Upload className="h-8 w-8 text-blue-500 mb-2" />
                            </div>
                        )}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
                    <p className="text-sm text-gray-600 mb-4">
                        {image ? 'Image uploaded successfully' : 'Drag and drop or click to upload'}
                    </p>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) onFileSelect(file);
                        }}
                        className="hidden"
                        id={`${type}-upload`}
                    />
                    <label
                        htmlFor={`${type}-upload`}
                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                    >
                        <Upload className="h-4 w-4" />
                        {image ? 'Change Image' : 'Upload Image'}
                    </label>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex justify-between items-center">
                        <div className="text-center flex-1">
                            <h1 className="text-4xl font-bold text-gray-900 mb-2">
                                Aadhaar Card OCR Scanner
                            </h1>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                Upload your Aadhaar card images and extract information automatically using advanced OCR technology
                            </p>
                        </div>
                        <Button
                            onClick={() => console.log('Navigate to data')}
                            variant="outline"
                            className="flex items-center gap-2 bg-white hover:bg-gray-50 border-gray-300 text-gray-700 px-6 py-2"
                        >
                            <Database className="h-4 w-4" />
                            View Saved Data
                        </Button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                {/* Upload Section */}
                <div className="mb-16">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Upload Your Aadhaar Card</h2>
                        <p className="text-gray-600 max-w-xl mx-auto">
                            Upload both front and back sides of your Aadhaar card for complete information extraction
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-8">
                        <UploadCard
                            title="Front Side"
                            type="front"
                            image={frontImage}
                            onFileSelect={(file) => handleFileUpload(file, 'front')}
                        />
                        <UploadCard
                            title="Back Side"
                            type="back"
                            image={backImage}
                            onFileSelect={(file) => handleFileUpload(file, 'back')}
                        />
                    </div>

                    {/* Process Button */}
                    <div className="text-center">
                        <Button
                            disabled={!frontImage || !backImage}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Zap className="h-5 w-5 mr-2" />
                            Process Aadhaar Card
                            <ArrowRight className="h-5 w-5 ml-2" />
                        </Button>
                    </div>
                </div>

                {/* Features Section */}
                <div className="mb-16">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Our OCR Scanner?</h2>
                        <p className="text-gray-600 max-w-xl mx-auto">
                            Experience the power of advanced OCR technology with these key features
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <Card key={index} className="text-center hover:shadow-lg transition-shadow bg-white">
                                <CardHeader className="pb-4">
                                    <div className="mx-auto mb-4 p-3 bg-gray-50 rounded-full w-fit">
                                        {feature.icon}
                                    </div>
                                    <CardTitle className="text-xl font-semibold text-gray-900">
                                        {feature.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-gray-600 text-base">
                                        {feature.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* How it Works Section */}
                <div className="bg-white rounded-xl shadow-sm p-8 border">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
                        <p className="text-gray-600 max-w-xl mx-auto">
                            Simple 3-step process to extract data from your Aadhaar card
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                                <span className="text-blue-600 font-bold text-lg">1</span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Images</h3>
                            <p className="text-gray-600">Upload clear images of both front and back sides</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                                <span className="text-green-600 font-bold text-lg">2</span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Processing</h3>
                            <p className="text-gray-600">Our AI extracts text and information automatically</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                                <span className="text-purple-600 font-bold text-lg">3</span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Get Results</h3>
                            <p className="text-gray-600">View and download extracted data instantly</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;