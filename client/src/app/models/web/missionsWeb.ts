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
    missions: Mission[];
    exceptions: string;
}

export interface ReportRequest {
    report: string;
    reportType: string;
    reportPeriod: number;
    startDate: Date;
    endDate?: Date;
    includeDaily: boolean
  }