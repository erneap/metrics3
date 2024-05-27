import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MissionsComponent } from './missions.component';
import { MaterialModule } from '../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MissionsChangeSortieDialogComponent } from './missions-change-sortie-dialog/missions-change-sortie-dialog.component';
import { MissionsSensorsComponent } from './missions-sensors/missions-sensors.component';
import { MissionsSensorsImintComponent } from './missions-sensors/missions-sensors-imint/missions-sensors-imint.component';
import { MissionsSensorsCommComponent } from './missions-sensors/missions-sensors-comm/missions-sensors-comm.component';
import { MissionsSensorsXintComponent } from './missions-sensors/missions-sensors-xint/missions-sensors-xint.component';
import { MissionDeleteDialogComponent } from './mission-delete-dialog/mission-delete-dialog.component';
import { MissionNewDialogComponent } from './mission-new-dialog/mission-new-dialog.component';

@NgModule({
  declarations: [
    MissionsComponent,
    MissionsChangeSortieDialogComponent,
    MissionsSensorsComponent,
    MissionsSensorsImintComponent,
    MissionsSensorsCommComponent,
    MissionsSensorsXintComponent,
    MissionDeleteDialogComponent,
    MissionNewDialogComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class MissionsModule { }
