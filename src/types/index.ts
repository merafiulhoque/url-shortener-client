

export interface UserInfo {
    email: string
}

export interface LoginData {
    email: string
    password: string
}

// export interface LoginResponse {
//     success: boolean
//     message: string

// }

export interface ApiResponse<T>{
    success: boolean
    message: string
    data?: T
}

export interface URLS {
    id: number;
    originalUrl: string;
    shortnedUrl: string;
    userId: number;
}