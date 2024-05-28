import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Mission } from 'src/app/models/metrics/mission';
import { AuthService } from 'src/app/services/auth.service';
import { MissionService } from 'src/app/services/mission.service';

@Component({
  selector: 'app-missions-sensors',
  templateUrl: './missions-sensors.component.html',
  styleUrls: ['./missions-sensors.component.scss']
})
export class MissionsSensorsComponent {
  @Input() mission: Mission = new Mission();
  @Output() changed = new EventEmitter<Mission>();

  constructor(
    protected authService: AuthService,
    protected msnService: MissionService
  ) { }
  
  showTab(tabName: string): boolean {
    let bExploit = false;
    if (this.authService.systemInfo && this.authService.systemInfo.platforms) {
      this.authService.systemInfo.platforms.forEach(plat => {
        if (plat.id.toLowerCase() === this.mission.platformID.toLowerCase()) {
          plat.sensors.forEach(pSen => {
            pSen.exploitations.forEach(pSenExp => {
              if (this.mission && this.mission.missionData 
                && this.mission.missionData.exploitation 
                && pSenExp.exploitation.toLowerCase().indexOf(
                this.mission.missionData.exploitation.toLowerCase()) >= 0) {
                switch (tabName.toLowerCase()) {
                  case "geoint":
                    if (pSenExp.showOnGEOINT || pSenExp.showOnGSEG) {
                      bExploit = true;
                    }
                    break;
                  case "xint":
                    if (pSenExp.showOnXINT) {
                      bExploit = true;
                    }
                    break;
                  case "mist":
                    if (pSenExp.showOnMIST) {
                      bExploit = true;
                    }
                    break;
                }
              }
            });
          });
        }
      });
    }
    let bRole = this.authService.hasRole(tabName) 
      || this.authService.hasRole("ADMIN");
    return bExploit && bRole;
  }

  show(): boolean {
    return (this.mission !== undefined && this.mission.missionData !== undefined
      && this.mission.missionData.sensors !== undefined
      && this.mission.missionData.sensors.length > 0);
  }

  onChange(msn: Mission) {
    this.changed.emit(msn);
  }
}
