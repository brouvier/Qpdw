import { Component, OnInit } from '@angular/core';
import { qpdwCmd, StackService } from 'src/app/services/stack.service';
import { TeamList, TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-command-pad',
  templateUrl: './command-pad.component.html',
  styles: [
  ]
})
export class CommandPadComponent implements OnInit {

  allButtonDisable: boolean = false;

  teams: TeamList;

  constructor(private stack: StackService, private team: TeamService) {
    this.teams = this.team.getTeams();
  }

  ngOnInit(): void {
  }

  /**
   * Désactivation de tous les boutons pour 0.4s
   */
  desableAllButton() {
    this.allButtonDisable = true;
    setTimeout(function (_self: CommandPadComponent) { _self.allButtonDisable = false }, 400, this);
  }

  stackPlay() {
    this.desableAllButton();
    this.stack.sendMessage({ cmd: qpdwCmd.start });
  }

  stackStop() {
    this.desableAllButton();
    this.stack.sendMessage({ cmd: qpdwCmd.stop });
  }

  stackPlus(teamCode: string) {
    this.desableAllButton();
    this.stack.sendMessage({ cmd: qpdwCmd.plus, param: teamCode });
  }

  stackMoins(teamCode: string) {
    this.desableAllButton();
    this.stack.sendMessage({ cmd: qpdwCmd.moins, param: teamCode });
  }

  stackVictory(teamCode: string) {
    this.desableAllButton();
    this.stack.sendMessage({ cmd: qpdwCmd.victory, param: teamCode });
  }

}
