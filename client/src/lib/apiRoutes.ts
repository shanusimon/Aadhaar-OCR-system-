
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;


export const API_ROUTES = {
    AADHAR_LIST: "/aadhar-list",
    DELETE_DATA: "/delete-data",
    PARSE_AADHAR: '/extract-data',
    SAVE_DATA: "/save-data",

    CLOUDINARY_API: `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`
} as const
