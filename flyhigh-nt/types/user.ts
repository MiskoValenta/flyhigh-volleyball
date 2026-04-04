export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface UserProfile {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
}

export interface UpdateProfileDto {
    firstName: string;
    lastName: string;
    email: string;
}

export interface ChangePasswordDto {
    oldPassword: string;
    newPassword: string;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export interface SidebarProps {
    user: UserProfile | null;
}