import {User} from "./User.inteface";

export interface LoginResponse {
  user:  User;
  token: string;
}


