export interface LoginCredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface ForgotPasswordPayload {
  username: string;
  birthdate: string; // formato YYYY-MM-DD
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

/** Perfil (acceso) del usuario. RF-001 V2: un usuario puede tener varios. */
export interface AuthProfile {
  id: string;
  name: string;
  isPrincipal: boolean;
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
  mustChangePassword?: boolean;
  profiles?: AuthProfile[];
  activeProfileId?: string;
  activeProfileName?: string;
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
