export class UserDTO {
  email: string;
  id: string;
  firstName: string;
  lastName: string;
  position: string;
  managedBy: any;
  isAdmin: boolean;
  availableHours: number;
  avatarUrl?: string;
  projects: {
    name: string;
    id: string;
    dailyInput: { skill: string; hours: number }[];
  }[];
}
