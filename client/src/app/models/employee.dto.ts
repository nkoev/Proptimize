export class EmployeeDTO {
  firstName: string;
  lastName: string;
  position: string;
  managedBy: string;
  skills: any[];
  availableHours: number;
  projects: { skill: any; hours: number; project: string }[];
}
