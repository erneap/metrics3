import { IMissionData, IMissionSensor, MissionData, MissionSensor } from "./missionSensor";

export interface IMission {
    id?: string;
    missionDate: Date;
    platformID: string;
    sortieID: number;
    exploitation: string;
    tailNumber: string;
    communications: string;
    primaryDCGS: string;
    executed: boolean;
    cancelled: boolean;
    aborted: boolean;
    indefDelay: boolean;
    missionOverlap: number;
    comments: string;
    sensors: IMissionSensor[];
    _id?: string;
}

export class Mission implements IMission{
    public id?: string;
    public missionDate: Date;
    public platformID: string;
    public sortieID: number;
    public exploitation: string;
    public tailNumber: string;
    public communications: string;
    public primaryDCGS: string;
    public executed: boolean;
    public cancelled: boolean;
    public aborted: boolean;
    public indefDelay: boolean;
    public missionOverlap: number;
    public comments: string;
    public sensors: MissionSensor[];

    constructor(iMission?: IMission) {
        this.id = (iMission && iMission.id) 
            ? iMission.id : '';
        this.missionDate = (iMission && iMission.missionDate) 
            ? new Date(iMission.missionDate) : new Date(0);
        this.platformID = (iMission && iMission.platformID) 
            ? iMission.platformID : '';
        this.sortieID = (iMission && iMission.sortieID) 
            ? iMission.sortieID : 0;
        this.exploitation = (iMission && iMission.exploitation) 
            ? iMission.exploitation : 'Primary';
        this.tailNumber = (iMission && iMission.tailNumber) ? iMission.tailNumber : '';
        this.communications = (iMission && iMission.communications) 
            ? iMission.communications : 'LOS';
        this.primaryDCGS = (iMission && iMission.primaryDCGS) ? iMission.primaryDCGS : '';
        this.executed = (iMission && iMission.executed) ? true : false;
        this.cancelled = (iMission && iMission.cancelled) ? true : false;
        this.aborted = (iMission && iMission.aborted) ? true : false;
        this.indefDelay = (iMission && iMission.indefDelay) ? true : false;
        this.missionOverlap = (iMission && iMission.missionOverlap) 
            ? iMission.missionOverlap : 0;
        this.comments = (iMission && iMission.comments) ? iMission.comments : '';
        this.sensors = [];
        if (iMission && iMission.sensors && iMission.sensors.length > 0) {
            for (let i=0; i < iMission.sensors.length; i++) {
                let sen = iMission.sensors[i];
                this.sensors.push(new MissionSensor(sen));
            }
        }
    }
}