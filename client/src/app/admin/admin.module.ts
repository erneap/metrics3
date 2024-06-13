import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { AdminProfileComponent } from './admin-profile/admin-profile.component';
import { AdminPurgeComponent } from './admin-purge/admin-purge.component';
import { MaterialModule } from '../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminPurgeDialog } from './admin-purge/admin-purge-dialog/admin-purge-dialog.component';

@NgModule({
  declarations: [
    AdminComponent,
    AdminProfileComponent,
    AdminPurgeComponent,
    AdminPurgeDialog
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AdminModule { }
