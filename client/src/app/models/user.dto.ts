export class UserDTO {
  firstName: string;
  lastName: string;
  position: string;
  managedBy: string;
  availableHours: number;
  projects: { hours: number; project: string }[];
}
