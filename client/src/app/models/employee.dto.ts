export class EmployeeDTO {
  firstName: string;
  lastName: string;
  position: string;
  managedBy: any;
  skills: any[];
  availableHours: number;
  projects: { skill: any; hours: number; project: string }[];
}
