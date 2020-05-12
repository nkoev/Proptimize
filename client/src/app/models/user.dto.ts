export class UserDTO {
  firstName: string;
  lastName: string;
  position: string;
  subordinates: any[];
  isAdmin: boolean;
  availableHours: number;
  projects: { hours: number; project: string }[];
}
