export class UserDTO {
  password: number;
  firstName: string;
  lastName: string;
  position: string;
  isAdmin: boolean;
  availableHours: number;
  projects: { hours: number; project: string }[];
}
