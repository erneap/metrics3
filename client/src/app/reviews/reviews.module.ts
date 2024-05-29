import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReviewsComponent } from './reviews.component';
import { ReviewsDayComponent } from './reviews-day/reviews-day.component';
import { ReviewsDayMissionComponent } from './reviews-day/reviews-day-mission/reviews-day-mission.component';
import { ReviewsDayMissionSensorsComponent } from './reviews-day/reviews-day-mission/reviews-day-mission-sensors/reviews-day-mission-sensors.component';
import { ReviewsDayMissionSensorComponent } from './reviews-day/reviews-day-mission/reviews-day-mission-sensor/reviews-day-mission-sensor.component';



@NgModule({
  declarations: [
    ReviewsComponent,
    ReviewsDayComponent,
    ReviewsDayMissionComponent,
    ReviewsDayMissionSensorsComponent,
    ReviewsDayMissionSensorComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    ReviewsComponent
  ]
})
export class ReviewsModule { }
