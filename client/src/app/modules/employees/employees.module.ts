import { NgModule } from '@angular/core';
import { EmployeesRoutingModule } from './employees-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { AllEmployeesComponent } from './pages/all-employees/all-employees.component';
import { DetailEmployeeComponent } from './pages/detail-employee/detail-employee.component';
import { AddEmployeeComponent } from './components/add-employee/add-employee.component';
import { CredentialsMemoComponent } from './components/credentials-memo/credentials-memo.component';

@NgModule({
  declarations: [
    AllEmployeesComponent,
    DetailEmployeeComponent,
    AddEmployeeComponent,
    CredentialsMemoComponent,
  ],
  entryComponents: [AddEmployeeComponent],
  imports: [SharedModule, EmployeesRoutingModule],
})
export class EmployeesModule {}
