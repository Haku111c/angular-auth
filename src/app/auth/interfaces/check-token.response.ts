import {User} from "./User.inteface";

export interface CheckTokenResponse {
  user: User;
  token: string;
}
