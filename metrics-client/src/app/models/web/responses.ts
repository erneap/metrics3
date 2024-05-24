import { IUser } from "../users/user";

export interface AuthenticationResponse {
  user?: IUser;
  token: string;
  exception: string;
}