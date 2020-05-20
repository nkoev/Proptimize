import { NgModule } from '@angular/core';
import { EmployeesRoutingModule } from './employees-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { AllEmployeesComponent } from './pages/all-employees/all-employees.component';
import { DetailEmployeeComponent } from './pages/detail-employee/detail-employee.component';
import { AddEmployeeComponent } from './components/add-employee/add-employee.component';
import { CredentialsMemoComponent } from './components/credentials-memo/credentials-memo.component';
import { EmployeesFilteringFormComponent } from './components/employees-filtering-form/employees-filtering-form.component';
import { OrgChartComponent } from './components/orgchart/orgchart.component';
import { GoogleChartsModule } from 'angular-google-charts';

@NgModule({
  declarations: [
    AllEmployeesComponent,
    DetailEmployeeComponent,
    AddEmployeeComponent,
    CredentialsMemoComponent,
    EmployeesFilteringFormComponent,
    OrgChartComponent,
  ],
  imports: [SharedModule, EmployeesRoutingModule, GoogleChartsModule.forRoot()],
})
export class EmployeesModule {}
