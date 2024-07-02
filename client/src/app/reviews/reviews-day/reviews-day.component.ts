import { Component, Input } from '@angular/core';
import { ReviewDay } from 'src/app/models/metrics/reviewDay';

@Component({
  selector: 'app-reviews-day',
  templateUrl: './reviews-day.component.html',
  styleUrls: ['./reviews-day.component.scss']
})
export class ReviewsDayComponent {
  @Input() width: number = 700;
  @Input() day: ReviewDay = new ReviewDay();

  dayStyle(): string {
    let ratio = this.width / 700;
    if (ratio > 1.0) ratio = 1.0;
    const height = Math.floor(20 * ratio);
    let width = Math.floor(100 * ratio);
    width = (7 * (width + 2)) - 2;
    return `width: ${width}px;height: ${height}px;font-size: ${ratio}rem;`;
  }

  getUTCDate(): string {
    let answer = '';
    let months = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", 
      "Aug", "Sep", "Oct", "Nov", "Dec");
    let weekDays = new Array('Sun', 'Mon', 'Tue', 'Wed', "Thu", "Fri", 'Sat');
    if (this.day.day.getUTCDate() < 10) {
      answer += "0";
    }
    answer += `${this.day.day.getUTCDate()} ${months[this.day.day.getUTCMonth()]} `
      + `${this.day.day.getUTCFullYear()} (${weekDays[this.day.day.getUTCDay()]})`;
    return answer;
  }
}
