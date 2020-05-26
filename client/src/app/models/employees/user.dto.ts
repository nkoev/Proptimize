export class UserDTO {
  email: string;
  uid: string;
  firstName: string;
  lastName: string;
  position: string;
  managedBy: any;
  isAdmin: boolean;
  availableHours: number;
  projects: { hours: number; project: string }[];
}
