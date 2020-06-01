export class UserDTO {
  email: string;
  uid: string;
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
