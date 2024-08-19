import { Mission } from "../metrics/mission";

export interface CreateMission {
    missionDate: Date;
    platformID: string;
    sortieID: number;
    exploitation: string;
    primaryDCGS: string;
    communications: string;
    tailNumber: string;
    overlap: number;
    executed: boolean;
    aborted: boolean;
    cancelled: boolean;
    indefDelay: boolean;
    sensors: string[];
}

export interface UpdateMission {
    id: string;
    sensorID?: string;
    imageTypeID?: string;
    imageSubTypeID?: string;
    field: string;
    value: string;
}

export interface MissionResponse {
    mission: Mission;
    exception: string;
}

export interface MissionsResponse {
    missions: Mission[];
    exception: string;
}

export interface ReportRequest {
    report: string;
    reportType: string;
    reportPeriod: number;
    startDate: string;
    endDate?: string;
    includeDaily: boolean
  }