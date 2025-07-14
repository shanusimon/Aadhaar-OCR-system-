import type React from "react";
import { Button } from "./ui/button";
import { Scan } from "lucide-react";

interface OCRProcessButtonProps {
    processOCR: () => Promise<void>;
    isProcessing: boolean
}

export const OCRProcessButton: React.FC<OCRProcessButtonProps> = ({isProcessing, processOCR}) => {
    return (
        <div className="text-center mb-8">
            <Button onClick={processOCR} disabled={isProcessing} size="lg" className="px-8 py-3">
                {isProcessing ? (
                    <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                    </>
                ) : (
                    <>
                        <Scan className="mr-2 h-5 w-5" />
                        Extract Information
                    </>
                )}
            </Button>
        </div>
    )
}