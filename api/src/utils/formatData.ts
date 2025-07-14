import { AadhaarInfo } from "../types/dto";

export const extractAadhaarInfo = (frontText: string, backText: string): AadhaarInfo => {
    const info: AadhaarInfo = {
        dob: null,
        aadhaarNumber: null,
        gender: null,
        name: null,
        fatherName: null,
        address: null,
    };

    // Helper function to clean up OCR'd text
    const cleanText = (text: string) => text.replace(/\s+/g, ' ').trim();
    const cleanFrontText = cleanText(frontText);
    const cleanBackText = cleanText(backText);

    // Split into lines for line-by-line parsing
    const frontLines = frontText.split(/\r?\n/).map(line => line.trim()).filter(line => line);
    const backLines = backText.split(/\r?\n/).map(line => line.trim()).filter(line => line);

    // Extract DOB - Multiple patterns to handle different formats
    const dobPatterns = [
        /(?:Date of Birth|DOB|जन्म तिथि)\s*:?\s*(\d{2}\/\d{2}\/\d{4})/i,
        /(\d{2}\/\d{2}\/\d{4})/,
        /(?:जन्म तिथि|DOB)\s*(\d{2}\/\d{2}\/\d{4})/i
    ];
    
    for (const pattern of dobPatterns) {
        const match = cleanFrontText.match(pattern);
        if (match) {
            info.dob = match[1];
            break;
        }
    }

    // Extract Aadhaar Number - More flexible pattern
    const aadhaarPatterns = [
        /(\d{4}\s+\d{4}\s+\d{4})/,
        /(\d{4}\s\d{4}\s\d{4})/,
        /(\d{12})/
    ];
    
    for (const pattern of aadhaarPatterns) {
        const match = cleanFrontText.match(pattern);
        if (match) {
            // Format as XXXX XXXX XXXX if it's 12 digits without spaces
            if (match[1].length === 12) {
                info.aadhaarNumber = match[1].replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3');
            } else {
                info.aadhaarNumber = match[1];
            }
            break;
        }
    }

    // Extract Gender - Multiple language support
    const genderPatterns = [
        /\b(Male|Female|Others?|पुरुष|महिला|अन्य)\b/i,
        /\b(M|F)\b/i
    ];
    
    for (const pattern of genderPatterns) {
        const match = cleanFrontText.match(pattern);
        if (match) {
            const gender = match[1].toLowerCase();
            if (gender === 'male' || gender === 'm' || gender === 'पुरुष') {
                info.gender = 'Male';
            } else if (gender === 'female' || gender === 'f' || gender === 'महिला') {
                info.gender = 'Female';
            } else {
                info.gender = 'Others';
            }
            break;
        }
    }

    // Extract Name - Improved logic
    // Look for name in multiple ways
    let nameFound = false;
    
    // Method 1: Look for name above DOB line
    for (let i = 0; i < frontLines.length; i++) {
        if (/DOB|Date of Birth|जन्म तिथि/i.test(frontLines[i])) {
            const potentialNameLine = frontLines[i - 1]?.trim();
            if (potentialNameLine && 
                !/Government|India|Male|Female|DOB|Date|Year|Month|Day|Unique|Identification|Authority/i.test(potentialNameLine)) {
                // Clean the name - remove common OCR artifacts
                let cleanName = potentialNameLine
                    .replace(/^[=\-\s]+/, '') // Remove leading equals, dashes, spaces
                    .replace(/[=\-\s]+$/, '') // Remove trailing equals, dashes, spaces
                    .replace(/^\W+/, '') // Remove leading non-word characters
                    .replace(/\W+$/, '') // Remove trailing non-word characters
                    .trim();
                
                if (cleanName && cleanName.length > 1) {
                    info.name = cleanName;
                    nameFound = true;
                    break;
                }
            }
        }
    }
    
    // Method 2: Look for name pattern in front text if not found
    if (!nameFound) {
        const namePatterns = [
            /([A-Z][a-zA-Z\s]+)\s+(?:DOB|Date of Birth)/i,
            /([A-Z][a-zA-Z\s]+)\s+(?:Male|Female)/i
        ];
        
        for (const pattern of namePatterns) {
            const match = cleanFrontText.match(pattern);
            if (match) {
                let cleanName = match[1].trim()
                    .replace(/^[=\-\s]+/, '')
                    .replace(/[=\-\s]+$/, '');
                
                if (cleanName && cleanName.length > 1) {
                    info.name = cleanName;
                    break;
                }
            }
        }
    }

    // Extract Father's Name - More patterns
    const fatherPatterns = [
        /\b[SCD]\/O[:\-]?\s*([A-Z][a-zA-Z. ]+)/i,
        /(?:Father|पिता)\s*:?\s*([A-Z][a-zA-Z. ]+)/i,
        /C\/O[:\-]?\s*([A-Z][a-zA-Z. ]+)/i
    ];
    
    for (const pattern of fatherPatterns) {
        const match = cleanBackText.match(pattern);
        if (match) {
            info.fatherName = match[1].trim();
            break;
        }
    }

    // Extract Address - Improved cleaning
    let addressFound = false;
    
    // Method 1: Look for explicit Address: pattern
    const addressPatterns = [
        /Address\s*:?\s*([\s\S]*?)(?:\d{6}|$)/i,
        /पता\s*:?\s*([\s\S]*?)(?:\d{6}|$)/i
    ];
    
    for (const pattern of addressPatterns) {
        const match = backText.match(pattern);
        if (match) {
            let rawAddress = match[1];
            // Remove father's name pattern from address
            rawAddress = rawAddress.replace(/\b[SCD]\/O[:\-]?\s*[^\n,]+[,]?/i, '');
            
            info.address = cleanText(rawAddress)
                .replace(/[^\w\s,.-]/g, ' ') // Replace special chars with space
                .replace(/\s+/g, ' ') // Normalize spaces
                .replace(/,\s*,/g, ',') // Remove double commas
                .trim();
            
            addressFound = true;
            break;
        }
    }
    
    // Method 2: Extract from back text lines if no explicit address found
    if (!addressFound) {
        let addressLines = [];
        let startCollecting = false;
        
        for (const line of backLines) {
            // Skip header lines
            if (/Government|India|Authority|Unique|Identification/i.test(line)) {
                continue;
            }
            
            // Skip father's name line
            if (/[SCD]\/O/i.test(line)) {
                continue;
            }
            
            // Skip lines with only numbers or special characters
            if (/^\d+$/.test(line) || /^[^\w\s]*$/.test(line)) {
                continue;
            }
            
            // Skip very short lines (likely OCR artifacts)
            if (line.length < 3) {
                continue;
            }
            
            // Collect address lines
            if (/[A-Za-z]/.test(line)) {
                addressLines.push(line);
            }
        }
        
        if (addressLines.length > 0) {
            info.address = addressLines.join(', ')
                .replace(/[^\w\s,.-]/g, ' ')
                .replace(/\s+/g, ' ')
                .replace(/,\s*,/g, ',')
                .trim();
        }
    }

    return info;
};