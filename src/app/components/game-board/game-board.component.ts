import { Component, OnInit } from '@angular/core';
import { AudioService } from 'src/app/services/audio.service';
import { Team } from 'src/app/services/team.service';

declare var $: any;

@Component({
	selector: 'app-game-board',
	templateUrl: './game-board.component.html',
	styles: [
	]
})
export class GameBoardComponent implements OnInit {

	// TODO : gérer le nombre d'équipe et la durée du timer

	teams: Team[] = [
		{ icon: 'directions_run', color: 'bg-warning', score: 0, star: 'star_border', starColor: 'text-dark' },
		{ icon: 'electric_scooter', color: 'bg-success', score: 0, star: 'star_border', starColor: 'text-dark' },
		{ icon: 'pool', color: 'bg-primary', score: 0, star: 'star_border', starColor: 'text-dark' },
		{ icon: 'directions_bike', color: 'bg-secondary', score: 0, star: 'star_border', starColor: 'text-dark' },
		{ icon: 'rowing', color: 'bg-danger', score: 0, star: 'star_border', starColor: 'text-dark' },
		{ icon: 'motorcycle', color: 'bg-info', score: 0, star: 'star_border', starColor: 'text-dark' }
	];

	timerRunning: boolean = false;
	intervalId: number = 0;
	timerValue: number = 0;

	constructor(private audio: AudioService) { }

	ngOnInit(): void {
	}

	plus(team: Team) {
		if (team.score < 100 && team.score + 10 < 100) {
			this.audio.playPlus();
			team.score = team.score + 10;
		} else {
			team.score = 100
		}
	};

	moins(team: Team) {
		if (team.score > 0) {
			this.audio.playMoins();
			team.score = team.score - 10;
		} else {
			team.score = 0
		}
	};

	final(team: Team) {
		if (team.star == "star_border") {
			this.audio.playVictory();
			team.message = "Victoire !";
			team.star = "star";
			team.starColor = 'text-warning';
		} else {
			team.message = "";
			team.star = "star_border";
			team.starColor = 'text-dark'
		}
	};

	// Bouton start
	startTimer() {
		this.timerValue = 12; // initialisation du timer
		$("#timerModal").modal("toggle"); // ouverture de la modal
		this.intervalId = setInterval(this.updateTimer, 1000, this); // démarrage du timer
		this.audio.playSong(); // démarrage de la musique
		setTimeout(function(_self: GameBoardComponent){ _self.timerRunning = true }, 300, this); // basculement des boutons après 0.3 seconde
	};

	// Ecoulement du timer
	updateTimer(_self: GameBoardComponent) {
		if(_self.timerValue> 0){
			_self.timerValue--;
		} else {
			_self.audio.playEndTimer();
			_self.endTimer();
		}
	};

	// Bouton stop
	stopTimer() {
		this.audio.playStopTimer();
		this.endTimer();
	}

	// Arret du timer
	endTimer() {
		clearInterval(this.intervalId); // arret du timer
		this.timerRunning = false; // basculement des boutons
		$("#timerModal").modal("hide"); // fermeture de la modal
	}
}
