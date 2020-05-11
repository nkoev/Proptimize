import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppMaterialModule } from './modules/material.module';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [],
  imports: [CommonModule, AppMaterialModule, RouterModule, ReactiveFormsModule],
  exports: [CommonModule, AppMaterialModule, RouterModule, ReactiveFormsModule],
})
export class SharedModule {}
