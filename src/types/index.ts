

export interface UserInfo {
    email: string
}

export interface LoginData {
    email: string
    password: string
}

export interface JWT_PAYLOAD {
    id: number
    email: string
}

export interface ApiResponse<T>{
    success: boolean
    message: string
    data?: T
}

export interface LoginResponseData {
    success: boolean
    message: string
    token?: string
    user?: JWT_PAYLOAD
}

export interface URLS {
    id: number;
    originalUrl: string;
    shortnedUrl: string;
    userId: number;
    clicks: number;
}