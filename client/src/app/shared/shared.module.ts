import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppMaterialModule } from './modules/material.module';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [],
  imports: [CommonModule, AppMaterialModule, RouterModule, FormsModule],
  exports: [CommonModule, AppMaterialModule, RouterModule, FormsModule],
})
export class SharedModule {}
