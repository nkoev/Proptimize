import { NgModule } from '@angular/core';
import { EmployeesRoutingModule } from './employees-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { AllEmployeesComponent } from './pages/all-employees/all-employees.component';
import { DetailEmployeeComponent } from './pages/detail-employee/detail-employee.component';
import { AddEmployeeComponent } from './components/add-employee/add-employee.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '../core/core.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AllEmployeesComponent,
    DetailEmployeeComponent,
    AddEmployeeComponent,
  ],
  imports: [
    SharedModule,
    EmployeesRoutingModule,
    ReactiveFormsModule,
    CommonModule,
  ],
})
export class EmployeesModule {}
