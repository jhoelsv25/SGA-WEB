export interface LoginCredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface ForgotPasswordPayload {
  username: string;
  birthdate: string; // formato YYYY-MM-DD
}

export interface CurrentUser {
  id: string;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  roles?: string[];
  institutionId?: string;
  institutionName?: string;
  avatarUrl?: string;
}

export interface AuthModule {
  id: string;
  name: string;
  code: string;
  icon?: string;
  path: string;
}

export interface AuthResponse {
  message?: string;
  accessToken?: string;
  user: CurrentUser;
  modules?: AuthModule[];
}
