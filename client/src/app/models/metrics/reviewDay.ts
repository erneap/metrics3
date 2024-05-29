import { Mission } from "./mission";

export class ReviewDay {
  public day: Date = new Date();
  public missions: Mission[] = [];

  compareTo(other?: ReviewDay): number {
    if (other) {
      return (this.day.getTime() < other.day.getTime()) ? -1 : 1;
    }
    return -1;
  }
}