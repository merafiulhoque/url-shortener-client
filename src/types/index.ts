

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
    profilePic: string | null
    isPremium: boolean
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
    createdAt: Date;
    updatedAt: Date;
    expiresAt: Date | null;
}

export type EXPIRY_UNITS = "" | "minutes" | "hours" | "days" | "months" | "weeks" | "years"

export interface CreateShortUrlPayload {
    originalUrl: string
    expiryDuration: number
    expiryUnit: EXPIRY_UNITS
    customAlias: string
    password: string
}

export interface CreateResponse {
    success: boolean
    message: string
    status: number
}

export interface CreateResponseWithData<T> {
    success: boolean
    message: string
    data: T
    status: number    
}

export interface Visitor {
    id: number;
    urlId: number;
    ipAddress?: string
    userAgent?: string
    visitedAt?: Date;
}

export interface UrlStatData {
    shortnedUrl: string;
    originalUrl: string;
    createdAt: Date;
    expiresAt?: Date
    visitors?: Visitor[]
}