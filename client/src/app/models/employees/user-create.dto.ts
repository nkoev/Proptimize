export class UserCreateDTO {
  email: string;
  firstName: string;
  lastName: string;
  position: string;
  managedBy: any;
  isAdmin: boolean;
  availableHours: number;
  projects: {
    name: string;
    id: string;
    dailyInput: { skill: string; hours: number }[];
  }[];
}
