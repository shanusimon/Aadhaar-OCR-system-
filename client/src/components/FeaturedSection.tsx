import type React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Scan, Upload, User } from "lucide-react";

export const FeaturesSection: React.FC = () => {
    return (
        <div className="mt-16 grid md:grid-cols-3 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Upload className="h-5 w-5" />
                        Easy Upload
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-600">Simply drag and drop or click to upload both sides of your Aadhaar card</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Scan className="h-5 w-5" />
                        Advanced OCR
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-600">Powered by advanced OCR technology for accurate text extraction</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Organized Results
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-600">Get extracted information in a clean, organized, and easy-to-read format</p>
                </CardContent>
            </Card>
        </div>
    )
}