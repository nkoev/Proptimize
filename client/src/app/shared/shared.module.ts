import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppMaterialModule } from './modules/material.module';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavigationComponent } from './components/navigation/navigation.component';
import { HeaderComponent } from './components/header/header.component';

@NgModule({
  declarations: [
    NavigationComponent,
    HeaderComponent
  ],
  imports: [
    CommonModule,
    AppMaterialModule,
    RouterModule,
    FormsModule
  ],
  exports: [
    CommonModule,
    AppMaterialModule,
    RouterModule,
    FormsModule,
    NavigationComponent,
    HeaderComponent
  ],
})
export class SharedModule { }
