import { Component, OnDestroy, OnInit } from '@angular/core';
import { Mutex } from 'async-mutex';
import { interval } from 'rxjs';
import { AudioService } from 'src/app/services/audio.service';
import { LogService } from 'src/app/services/log.service';
import { qpdwCmd, qpdwMessage, StackService } from 'src/app/services/stack.service';
import { TeamList, TeamService } from 'src/app/services/team.service';
import { environment } from 'src/environments/environment';

declare var $: any;

interface party {
  showTimer: boolean,
  stackInterval: undefined|number,
  timerInterval: undefined|number,
  timerValue: number,
  teamResponse: { [index: string]: string }
}

@Component({
  selector: 'app-vote-game-board',
  templateUrl: './vote-game-board.component.html',
  styles: []
})
export class VoteGameBoardComponent implements OnInit, OnDestroy {

  production = environment.production;
  mutex = new Mutex();
  teams: TeamList;
  currentParty: party = {
    showTimer: false,
    stackInterval: undefined,
    timerInterval: undefined,
    timerValue: 0,
    teamResponse: {}
  }

  constructor(private logger: LogService, private stack: StackService, private audio: AudioService, private team: TeamService) {
    this.teams = this.team.getTeams();
  }

  ngOnInit(): void {
    this.stack.clearStack();
    this.currentParty.stackInterval = setInterval(this.readMessage, 200, this);
  }

  ngOnDestroy(): void {
    clearInterval(this.currentParty.stackInterval);
    clearInterval(this.currentParty.timerInterval);
  }

  readMessage(_self: VoteGameBoardComponent) {
    // Mise en place d'un mutex pour s'assurer de ne traiter qu'un message à la fois
    _self.mutex.runExclusive(async function () {
      const next: qpdwMessage|undefined = await _self.stack.getNextMessage().toPromise();
      if (next == null) { return } // La pile n'a pas renvoyé de message

      _self.logger.info('# Message ' + next.cmd + ' - ' + _self.logger.getCurrentTime(), next);
      switch (next.cmd) {
        // Gestion du timer
        case qpdwCmd.start:
          if (!_self.currentParty.showTimer) { _self.startTimer() }; break;
        case qpdwCmd.vote:
          if (_self.currentParty.showTimer && _self.currentParty.timerInterval !== undefined) { _self.teamVote(next!.param, next.param2) }; break;
        case qpdwCmd.finalVode:
          if (_self.currentParty.showTimer) { _self.stopTimer(next!.param) }; break;
        case qpdwCmd.victory:
          if (!_self.currentParty.showTimer) { _self.final() }; break;
          case qpdwCmd.plus:
            if (!_self.currentParty.showTimer) { _self.plus(next!.param) }; break;
          case qpdwCmd.moins:
            if (!_self.currentParty.showTimer) { _self.moins(next!.param) }; break;
        default:
          _self.logger.error('Message inconnu');
      }

      _self.logger.info('# Fin de traitement du message ' + next.cmd + ' - ' + _self.logger.getCurrentTime());
    })
  }

  teamVote(teamCode: string|undefined, teamResponse: string|undefined) {
    if(!teamCode){
      this.logger.error('Paramètre teamCode manquant');
      return;  
    }
    if(!teamResponse){
      this.logger.error('Paramètre teamResponse manquant');
      return;  
    }

    // On ne prend en compte que la première réponse de chaque équipe
    if (!this.currentParty.teamResponse.hasOwnProperty(teamCode))
      this.currentParty.teamResponse[teamCode] = teamResponse
  }

  // Bouton start
  startTimer() {
    this.logger.info('start');
    this.currentParty.showTimer = true;
    this.currentParty.timerValue = 12; // initialisation du timer
    $("#timerModal").modal("toggle"); // ouverture de la modal
    this.currentParty.timerInterval = setInterval(this.updateTimer, 1000, this); // démarrage du timer
    this.audio.playSong(); // démarrage de la musique
  };

  // Ecoulement du timer
  updateTimer(_self: VoteGameBoardComponent) {
    if (_self.currentParty.timerValue === undefined) {
      this.logger.error("Update sur un timer null !!!")
      _self.endTimer();
      return;
    }

    if (_self.currentParty.timerValue > 0) {
      _self.currentParty.timerValue--;
    } else {
      _self.audio.playEndTimer();
      _self.endTimer();
    }
  };

  // Bouton stop
  stopTimer(correctResponse: string|undefined) {
    if(!correctResponse){
      this.logger.error('Paramètre manquant');
      return;  
    }

    this.logger.info('Réponse correcte : ', correctResponse);
    this.audio.stopSong();

    for (var key in this.teams) {
      // On considaire que le score est fausse si l'équipe n'a pas répondue ou n'a pas répondue correctement
      this.team.calculateNewScore(this.teams[key],
        this.currentParty.teamResponse.hasOwnProperty(key) && this.currentParty.teamResponse[key] === correctResponse)
    }
    this.currentParty.teamResponse = {};
    this.currentParty.showTimer = false;
    this.endTimer();
    $("#timerModal").modal("hide"); // fermeture de la modal
  }

  // Arret du timer
  endTimer() {
    this.logger.info('endTimer');
    clearInterval(this.currentParty.timerInterval); // arret du timer
    this.currentParty.timerInterval = undefined;
  }

  // Identification des gagants
  final() {
    // Calcul du plus haut score
    let maxScore: number = 0;
    for (var key in this.teams) {
      if (this.teams.hasOwnProperty(key) && this.teams[key].score > maxScore)
        maxScore = this.teams[key].score;
    }
    // Modification des icones en fonction du score
    for (var key in this.teams) {
      if (this.teams.hasOwnProperty(key)) {
        if (this.teams[key].score > 0 && this.teams[key].score === maxScore) {
          this.teams[key].message = "Victoire !";
          this.teams[key].star = "star";
          this.teams[key].starColor = 'text-warning';
        } else {
          this.teams[key].message = "";
          this.teams[key].star = "star_border";
          this.teams[key].starColor = 'text-dark'
        }
      }
    }
    // On joue le son que si le score retenu est suppérieur à 0
    if (maxScore > 0)
      this.audio.playVictory();
  }

	plus(teamCode: string|undefined) {
    if(!teamCode){
      this.logger.error('Paramètre manquant');
      return;  
    }
    
		if (this.teams[teamCode].score < 100 && this.teams[teamCode].score + 10 < 100) {
			this.teams[teamCode].score = this.teams[teamCode].score + 10;
		} else {
			this.teams[teamCode].score = 100
		}
	}

	moins(teamCode: string|undefined) {
    if(!teamCode){
      this.logger.error('Paramètre manquant');
      return;  
    }
    
		if (this.teams[teamCode].score > 0) {
			this.teams[teamCode].score = this.teams[teamCode].score - 10;
		} else {
			this.teams[teamCode].score = 0
		}
	};

  teamResponseClass(teamCode: string): string {
    if (this.currentParty.teamResponse.hasOwnProperty(teamCode))
      return 'bg';
    else
      return 'text';
  }

}
