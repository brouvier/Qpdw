import { Component, OnInit } from '@angular/core';
import { LogService } from 'src/app/services/log.service';
import { qpdwCmd, StackService } from 'src/app/services/stack.service';
import { EMPTY_TEAM, Team, TeamList, TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-vote-pad',
  templateUrl: './vote-pad.component.html',
  styles: [
  ]
})
export class VotePadComponent implements OnInit {

  teams: TeamList;
  currentTeam: undefined|{key: string, value: Team} = undefined;
  buttonDisable: boolean = false;

  constructor(private logger: LogService, private stack: StackService, private team: TeamService) {
    this.teams = this.team.getTeams();
  }

  /**
   * Désactivation de tous les boutons pour 0.4s
   */
  desableAllButton() {
    this.buttonDisable = true;
    setTimeout(function (_self: VotePadComponent) { _self.buttonDisable = false }, 400, this);
  }

  ngOnInit(): void {

  }

  voteTrue(){
    this.desableAllButton();
    this.logger.info("Vote true !", this.currentTeam);
    this.stack.sendMessage({ cmd: qpdwCmd.vote, param: this.currentTeam?.key, param2: 'true' });
  }

  voteFalse(){
    this.desableAllButton();
    this.logger.info("Vote false !", this.currentTeam);
    this.stack.sendMessage({ cmd: qpdwCmd.vote, param: this.currentTeam?.key, param2: 'false' });
  }

}
