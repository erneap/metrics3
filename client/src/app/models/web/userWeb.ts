import { ISystemInfo } from "../metrics/systems";
import { IUser } from "../users/user";

export interface UserResponse {
  user: IUser;
  exception: string;
}

export interface UsersResponse {
  users: IUser[];
  exception: string;
}

export interface AddUserRequest {
  emailAddress: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  password: string;
  application: string;
  permissions?: string[];
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

export interface SystemInfoResponse {
  systemInfo?: ISystemInfo,
  exception: string
}