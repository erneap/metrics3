import { Component, Input } from '@angular/core';
import { IMission, Mission } from 'src/app/models/metrics/mission';
import { MissionSensor } from 'src/app/models/metrics/missionSensor';

@Component({
  selector: 'app-reviews-day-mission',
  templateUrl: './reviews-day-mission.component.html',
  styleUrls: ['./reviews-day-mission.component.scss']
})
export class ReviewsDayMissionComponent {
  @Input() width: number = 700;
  private _mission: Mission = new Mission();
  @Input()
  public set mission(m: IMission) {
    this._mission = new Mission(m);
    this.sensors = [];
    if (this._mission) {
      this._mission.sensors.forEach(sen => {
        this.sensors.push(sen);
      });
    }
  }
  get mission(): Mission {
    return this._mission;
  }
  @Input() more: boolean = false;
  sensors: MissionSensor[] = [];

  fieldStyle(field: string): string {
    let ratio = this.width / 700;
    if (ratio > 1.0) ratio = 1.0;
    const height = Math.floor(20 * ratio);
    let width = Math.floor(100 * ratio);
    if (field.toLowerCase() === 'comments') {
      width = (6 * (width + 2)) - 2;
    } else if (field.toLowerCase() === 'empty') {
      width = (7 * (width + 2)) - 2;
    }
    return `width: ${width}px;height: ${height}px;font-size: ${ratio}rem;`;
  }

  getComments(): string {
    let answer = '';
    if (this.mission?.aborted) {
      answer += 'Msn Aborted';
    } else if (this.mission?.cancelled) {
      answer += 'Msn Cancelled';
    } else if (this.mission?.indefDelay) {
      answer += 'Msn Indef Delay';
    }
    if (this.mission?.comments !== '') {
      if (answer !== '') {
        answer += ', ';
      }
      answer += this.mission?.comments;
    }
    return answer;
  }
}
