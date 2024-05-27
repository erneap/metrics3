import { ISystemInfo } from "../metrics/systems";
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

export interface SystemInfoResponse {
  systemInfo?: ISystemInfo,
  exception: string
}