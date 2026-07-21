
const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;


export const API_URLS = {
    BASE_URL: BASE_URL,
    SIGNUP: `${BASE_URL}/api/auth/signup`,
    SIGNIN: `${BASE_URL}/api/auth/signin`,
    LOGOUT: `${BASE_URL}/api/auth/signout`,
    GET_ALL_SHORT_URLS: `${BASE_URL}/api/urls/get-all-urls`,
    CREATE_NEW_SHORT_URL: `${BASE_URL}/api/urls/create-new-url`,
    DELETE_SHORT_URL: `${BASE_URL}/api/urls/delete-url`,
    GET_USER: `${BASE_URL}/api/auth/get-user`,
    UPLOAD_PIC: `${BASE_URL}/api/uploads/upload`,
    DELETE_PIC: `${BASE_URL}/api/uploads/delete`
} as const;