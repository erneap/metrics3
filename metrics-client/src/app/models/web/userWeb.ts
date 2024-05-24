import { SystemInfo } from "../systems";
import { IUser } from "../users/user";

export interface UsersResponse {
  users: IUser[];
  exception: string;
}

export interface ExceptionResponse {
  exception: string;
}

export interface PasswordResetRequest {
  emailAddress: string;
  password: string;
  token: string;
  application?: string;
}

export interface UserResponse {
  user: IUser,
  exception: string
}

export interface SystemInfoResponse {
  systemInfo: SystemInfo,
  exception: string
}