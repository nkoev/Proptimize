import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppMaterialModule } from './modules/material.module';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NavigationComponent } from './components/navigation/navigation.component';
import { HeaderComponent } from './components/header/header.component';
import { SlidePanelComponent } from './components/slide-panel/slide-panel.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';


@NgModule({
  declarations: [NavigationComponent, HeaderComponent, SlidePanelComponent],
  imports: [
    CommonModule,
    AppMaterialModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    ReactiveFormsModule,
    InfiniteScrollModule,
  ],
  exports: [
    CommonModule,
    AppMaterialModule,
    RouterModule,
    ReactiveFormsModule,
    NavigationComponent,
    HeaderComponent,
    SlidePanelComponent,
    InfiniteScrollModule,
  ],
})
export class SharedModule { }
