import { Component, OnInit } from '@angular/core';
import { LogService } from 'src/app/services/log.service';
import { qpdwCmd, StackService } from 'src/app/services/stack.service';
import { EMPTY_TEAM, Team, TeamList, TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-buzzer',
  templateUrl: './buzzer.component.html',
  styles: [
  ]
})
export class BuzzerComponent implements OnInit {

  teams: TeamList;
  currentTeam: undefined | {key: string, value: Team} = undefined;
  buzzerDisable: boolean = false;

  constructor(private logger: LogService, private stack: StackService, private team: TeamService) {
    this.teams = this.team.getTeams();
  }

  ngOnInit(): void {
  }

  buzz() {
    this.buzzerDisable = true;
    this.logger.info("Buzz !", this.currentTeam);
    this.stack.sendMessage({ cmd: qpdwCmd.buzz, param: this.currentTeam?.key });
    setTimeout(function (_self: BuzzerComponent) { _self.buzzerDisable = false }, 300, this); // basculement du bouton après 0.3 seconde
  }

}
