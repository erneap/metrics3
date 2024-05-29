import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OutagesComponent } from './outages.component';
import { OutagesListComponent } from './outages-list/outages-list.component';
import { OutagesListItemComponent } from './outages-list/outages-list-item/outages-list-item.component';


@NgModule({
  declarations: [
    OutagesComponent,
    OutagesListComponent,
    OutagesListItemComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    OutagesComponent
  ]
})
export class OutagesModule { }
