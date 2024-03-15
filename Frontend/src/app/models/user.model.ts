export interface RegisterUserInterface {
    fullName: string,
    password: string,
    email: string,
    phone: string,
    address: string,
}

export interface LoginUserInterface {
    userName: string,
    password: string
}

export interface UserInteface {
    id: string,
    userName: string,
    fullName: string,
    email: string,
    password: string,
    phone: string,
    address: string,
    jwt: string
}