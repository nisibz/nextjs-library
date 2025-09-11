export interface User {
  id: number;
  username: string;
}

export interface AuthCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}
