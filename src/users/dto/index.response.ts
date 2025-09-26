import { GenderEnum } from './index.dto';

export class UserResponse {
  id: number;
  first_name: string;
  last_name: string;
  password: string;
  email: string;
  birth_date: Date;
  gender: GenderEnum;
  interests: string;
  city: string;
}
