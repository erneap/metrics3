export interface AuthenticationRequest {
  emailAddress: string;
  password: string;
  add?: boolean;
}

export interface UpdateRequest {
  id: string;
  optional?: string;
  field: string;
  value: string;
}

export interface CreateUserAccount {
  id: string;
  emailAddress: string;
  lastName: string;
  firstName: string;
  middleName: string;
  password: string;
}

export interface ChangePasswordRequest {
  id: string;
  password: string;
}