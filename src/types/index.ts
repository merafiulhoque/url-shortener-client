export interface UserInfo {
    email: string
}

export interface ApiResponse<T>{
    success: boolean
    message: string
    data?: T
    error?: T
}

export interface URLS {
    id: number;
    originalUrl: string;
    shortnedUrl: string;
    userId: number;
}