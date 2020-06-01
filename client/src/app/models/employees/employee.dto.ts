export class EmployeeDTO {
  firstName: string;
  lastName: string;
  position: string;
  managedBy: any;
  skills: any[];
  availableHours: number;
  projects: {
    name: string;
    id: string;
    dailyInput: { skill: string; hours: number }[];
  }[];
}
