export interface MemberViewInterface {
    id: string;
    userName: string;
    fullName: string;
    phone: string;
    address: string;
    email: string;
    roles: string[];
    dateCreated: Date;
    isLocked: boolean;
    lockoutEnd: string | null;
}

export interface MemberEditInterface {
    id: string,
    userName: string,
    fullName: string,
    roles: string[],
    phone: string,
    address: string,
}