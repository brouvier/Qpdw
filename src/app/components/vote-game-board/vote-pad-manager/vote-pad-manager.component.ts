import { Component, OnInit } from '@angular/core';
import { LogService } from 'src/app/services/log.service';
import { qpdwCmd, StackService } from 'src/app/services/stack.service';

@Component({
  selector: 'app-vote-pad-manager',
  templateUrl: './vote-pad-manager.component.html',
  styles: [".material-icons {font-size: 16vh}"]
})
export class VotePadManagerComponent implements OnInit {
  
  buttonDisable: boolean = false;

  constructor(private logger: LogService, private stack: StackService) { }

  ngOnInit(): void {
  }

  /**
   * Désactivation de tous les boutons pour 0.4s
   */
  desableAllButton() {
    this.buttonDisable = true;
    setTimeout(function (_self: VotePadManagerComponent) { _self.buttonDisable = false }, 400, this);
  }

  stackPlay(){
    this.desableAllButton();
    this.logger.info("stackPlay");
    this.stack.sendMessage({ cmd: qpdwCmd.start });
  }

  stackTrue(){
    this.desableAllButton();
    this.logger.info("stackTrue");
    this.stack.sendMessage({ cmd: qpdwCmd.finalVode, param: 'true' });
  }

  stackFalse(){
    this.desableAllButton();
    this.logger.info("stackFalse");
    this.stack.sendMessage({ cmd: qpdwCmd.finalVode, param: 'false' });
  }

  stackVictory(){
    this.desableAllButton();
    this.logger.info("stackVictory");
    this.stack.sendMessage({ cmd: qpdwCmd.victory });
  }
}
