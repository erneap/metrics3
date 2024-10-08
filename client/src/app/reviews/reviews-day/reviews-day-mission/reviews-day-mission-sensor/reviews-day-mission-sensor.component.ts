import { Component, Input } from '@angular/core';
import { IMissionSensor, MissionSensor } from 'src/app/models/metrics/missionSensor';

@Component({
  selector: 'app-reviews-day-mission-sensor',
  templateUrl: './reviews-day-mission-sensor.component.html',
  styleUrls: ['./reviews-day-mission-sensor.component.scss']
})
export class ReviewsDayMissionSensorComponent {
  sensorOutage: number = 0;
  @Input() width: number = 700;
  private _sensor: MissionSensor = new MissionSensor();
  @Input()
  public set sensor(s: IMissionSensor) {
    this._sensor = new MissionSensor(s);
    if (this._sensor.sensorOutage.partialHBOutageMinutes > 0 
      || this._sensor.sensorOutage.partialLBOutageMinutes > 0) {
      this.sensorOutage = this._sensor.sensorOutage.partialHBOutageMinutes
        + this._sensor.sensorOutage.partialLBOutageMinutes;
    } else {
      this.sensorOutage = this._sensor.sensorOutage.totalOutageMinutes;
    }
    
  }
  get sensor(): MissionSensor {
    return this._sensor;
  }
  @Input() showOutages: boolean = false;

  protected convertToHHMM(time?: number): string {
    let answer = '';
    if (time) {
      let hours = Math.floor(time / 60);
      let minutes = time - (hours * 60);
      if (hours < 10) {
        answer += "0";
      }
      answer += `${hours}:`;
      if (minutes < 10) {
        answer += "0";
      }
      answer += `${minutes}`;
    } 
    return answer;
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
