import { Component, OnDestroy, OnInit } from '@angular/core';
import { AudioService } from 'src/app/services/audio.service';
import { LogService } from 'src/app/services/log.service';
import { qpdwCmd, qpdwMessage, StackService } from 'src/app/services/stack.service';
import { Team, TeamList, TeamService } from 'src/app/services/team.service';
import { environment } from 'src/environments/environment';
import { Mutex } from 'async-mutex';

declare var $: any;

interface party {
	showTimer: boolean,
	timerInterval: undefined|number,
	timerValue: undefined|number,
	currentTeamBuzz: undefined|Team
}

@Component({
	selector: 'app-light-board',
	templateUrl: './light-board.component.html',
	styles: []
})
export class LightBoardComponent implements OnInit, OnDestroy {

	production = environment.production;
	mutex = new Mutex();
	teams: TeamList;
	private stackInterval: any;
	currentParty: party = {
		showTimer: false,
		timerInterval: undefined,
		timerValue: undefined,
		currentTeamBuzz: undefined
	}

	constructor(private logger: LogService, private stack: StackService, private audio: AudioService, private team: TeamService) {
		this.teams = this.team.getTeams();
	}

	ngOnInit(): void {
		this.stack.clearStack();
		this.stackInterval = setInterval(this.readMessage, 200, this);
	}

	ngOnDestroy(): void {
		clearInterval(this.stackInterval);
		clearInterval(this.currentParty.timerInterval);
	}

	readMessage(_self: LightBoardComponent) {
		// Mise en place d'un mutex pour s'assurer de ne traiter qu'un message à la fois
		_self.mutex.runExclusive(async function () {
			const next: undefined|qpdwMessage = await _self.stack.getNextMessage().toPromise();
			if (next == null) { return } // La pile n'a pas renvoyé de message

			_self.logger.info('# Message ' + next.cmd + ' - ' + _self.logger.getCurrentTime(), next);
			switch (next.cmd) {
				// Gestion du timer
				case qpdwCmd.start:
					if (_self.currentParty.timerInterval === undefined) { _self.startTimer() }; break;
				case qpdwCmd.stop:
					if (_self.currentParty.timerInterval !== undefined) { _self.stopTimer() }; break;
				case qpdwCmd.buzz:
					if (_self.currentParty.timerInterval !== undefined) { _self.buzzTimer(next.param) }; break;
				// Gestion des scores
				case qpdwCmd.plus:
					if (_self.currentParty.timerInterval === undefined) { _self.plus(next!.param) }; break;
				case qpdwCmd.moins:
					if (_self.currentParty.timerInterval === undefined) { _self.moins(next.param) }; break;
				case qpdwCmd.victory:
					if (_self.currentParty.timerInterval === undefined) { _self.final(next.param) }; break;
			}

			_self.logger.info('# Fin de traitement du message ' + next.cmd + ' - ' + _self.logger.getCurrentTime());
		})
	}

	// Bouton start
	startTimer() {
		this.logger.info('start');
		this.currentParty.timerValue = 12; // initialisation du timer
		$("#timerModal").modal("toggle"); // ouverture de la modal
		this.currentParty.timerInterval = setInterval(this.updateTimer, 1000, this); // démarrage du timer
		this.audio.playSong(); // démarrage de la musique
	};

	// Ecoulement du timer
	updateTimer(_self: LightBoardComponent) {
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
	stopTimer() {
		this.logger.info('stop');
		this.audio.playStopTimer();
		this.endTimer();
	}

	// Bouton buzz
	buzzTimer(teamCode: string|undefined) {
		if(!teamCode){
		  this.logger.error('Paramètre manquant');
		  return;  
		}
		
		this.logger.info('buzz for' + teamCode);
		this.currentParty.currentTeamBuzz = this.teams[teamCode];
		this.audio.playStopTimer();
		this.endTimer();
		$("#teamModal").modal("toggle"); // ouverture de la modal
	}

	// Arret du timer
	endTimer() {
		clearInterval(this.currentParty.timerInterval); // arret du timer
		this.currentParty.timerInterval = undefined;
		this.currentParty.timerValue = undefined;
		$("#timerModal").modal("hide"); // fermeture de la modal
	}

	plus(teamCode: string|undefined) {
		if(!teamCode){
		  this.logger.error('Paramètre manquant');
		  return;  
		}
		
		if (this.currentParty.timerInterval === undefined)
			$("#timerModal").modal("hide"); // fermeture de la modal

		$("#teamModal").modal("hide"); // fermeture de la modal
		if (this.teams[teamCode].score < 100 && this.teams[teamCode].score + 10 < 100) {
			this.audio.playPlus();
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
		
		$("#teamModal").modal("hide"); // fermeture de la modal
		if (this.teams[teamCode].score > 0) {
			this.audio.playMoins();
			this.teams[teamCode].score = this.teams[teamCode].score - 10;
		} else {
			this.teams[teamCode].score = 0
		}
	};

	final(teamCode: string|undefined) {
		if(!teamCode){
		  this.logger.error('Paramètre manquant');
		  return;  
		}
		
		$("#teamModal").modal("hide"); // fermeture de la modal
		if (this.teams[teamCode].star == "star_border") {
			this.audio.playVictory();
			this.teams[teamCode].message = "Victoire !";
			this.teams[teamCode].star = "star";
			this.teams[teamCode].starColor = 'text-warning';
		} else {
			this.teams[teamCode].message = "";
			this.teams[teamCode].star = "star_border";
			this.teams[teamCode].starColor = 'text-dark'
		}
	};

}
