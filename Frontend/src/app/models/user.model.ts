export interface User {
    fullName: string,
    password: string,
    email: string,
    phone: string,
    address: string
}

export interface UserLogin {
    email: string,
    password: string
}