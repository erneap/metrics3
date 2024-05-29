import { GroundOutage } from "../metrics/groundOutage";

export interface OutageResponse {
  outage?: GroundOutage,
  exception: string
}

export interface OutagesResponse {
  outages?: GroundOutage[],
  exception: string
}