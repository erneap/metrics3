import { Component, Input } from '@angular/core';
import { IMissionSensor, MissionSensor } from 'src/app/models/metrics/missionSensor';

@Component({
  selector: 'app-reviews-day-mission-sensors',
  templateUrl: './reviews-day-mission-sensors.component.html',
  styleUrls: ['./reviews-day-mission-sensors.component.scss']
})
export class ReviewsDayMissionSensorsComponent {
  sensorOutage: number = 0;
  groundOutage: number = 0;
  @Input() width: number = 700;
  private _sensors: MissionSensor[] = [];
  @Input()
  public set sensors(sens: IMissionSensor[]) {
    this._sensors = [];
    sens.forEach(s => {
      const sen = new MissionSensor(s);
      this._sensors.push(sen);
      if (sen.sensorOutage.partialHBOutageMinutes > 0 
        || sen.sensorOutage.partialLBOutageMinutes > 0) {
        this.sensorOutage += sen.sensorOutage.partialHBOutageMinutes 
          + sen.sensorOutage.partialLBOutageMinutes;
      } else {
        this.sensorOutage += sen.sensorOutage.totalOutageMinutes;
      }
      this.groundOutage += sen.groundOutage;
    });
    this._sensors.sort((a,b) => a.compareTo(b));
  }
  get sensors(): MissionSensor[] {
    return this._sensors;
  }

  sensorStyle(): string {
    let ratio = this.width / 700;
    if (ratio > 1.0) ratio = 1.0;
    const fontSize = ratio;
    const width = Math.floor(100 * ratio);
    const height = Math.floor(20 * ratio);
    return `width: ${width}px;height: ${height}px;font-size: ${fontSize}rem;`;
  }
}
