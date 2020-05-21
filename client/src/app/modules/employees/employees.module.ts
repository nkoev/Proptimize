import { NgModule } from '@angular/core';
import { EmployeesRoutingModule } from './employees-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { AllEmployeesComponent } from './pages/all-employees/all-employees.component';
import { AddEmployeeComponent } from './components/add-employee/add-employee.component';
import { CredentialsMemoComponent } from './components/credentials-memo/credentials-memo.component';
import { EmployeesFilteringFormComponent } from './components/employees-filtering-form/employees-filtering-form.component';
import { OrgChartComponent } from './components/orgchart/orgchart.component';
import { GoogleChartsModule } from 'angular-google-charts';
import { EmployeesListComponent } from './components/employees-list/employees-list.component';
import { DetailEmployeeComponent } from './components/detail-employee/detail-employee.component';

@NgModule({
  declarations: [
    AllEmployeesComponent,
    DetailEmployeeComponent,
    AddEmployeeComponent,
    CredentialsMemoComponent,
    EmployeesFilteringFormComponent,
    OrgChartComponent,
    EmployeesListComponent,
  ],
  imports: [SharedModule, EmployeesRoutingModule, GoogleChartsModule.forRoot()],
})
export class EmployeesModule {}
