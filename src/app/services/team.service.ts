import { Injectable } from '@angular/core';
import { AudioService } from './audio.service';

export interface Team {
    icon: string,
    color: string,
    score: number,
    star: string,
    starColor: string,
    buzzerColor?: string,
    message?: string
}

export const EMPTY_TEAM : Team = {icon: "", color: "", score: 0, star: "", starColor: "", buzzerColor: ""}

export interface TeamList {
    [index: string]: Team;
}

@Injectable()
export class TeamService {

    getTeams(): TeamList {

        return {
            "t1": { icon: 'directions_run', color: 'bg-warning', score: 0, star: 'star_border', starColor: 'text-dark', buzzerColor: 'warning' },
            "t2": { icon: 'electric_scooter', color: 'bg-success', score: 0, star: 'star_border', starColor: 'text-dark', buzzerColor: 'success' },
            "t3": { icon: 'pool', color: 'bg-primary', score: 0, star: 'star_border', starColor: 'text-dark', buzzerColor: 'primary' },
            "t4": { icon: 'directions_bike', color: 'bg-secondary', score: 0, star: 'star_border', starColor: 'text-dark', buzzerColor: 'secondary' },
            "t5": { icon: 'rowing', color: 'bg-danger', score: 0, star: 'star_border', starColor: 'text-dark', buzzerColor: 'danger' },
            "t6": { icon: 'motorcycle', color: 'bg-info', score: 0, star: 'star_border', starColor: 'text-dark', buzzerColor: 'info' }
        }
    }

    calculateNewScore(team: Team, responseIsCorrect: boolean) {
        if (responseIsCorrect) {
            if (team.score < 100 && team.score + 10 < 100) {
                team.score = team.score + 10;
            } else {
                team.score = 100
            }
        } else {
            if (team.score > 0) {
                team.score = team.score - 10;
            } else {
                team.score = 0
            }
        }
    }

}

export class QpdwTeam {

    score: number = 0;
    starIcon: string = 'star_border';
    starColor: string = 'text-dark';
    message?: string;

    constructor(public icon: string, public color: string, private audio: AudioService) { }

    plus(playAudio: boolean) {
        if (this.score < 100 && this.score + 10 < 100) {
            this.score = this.score + 10;
            if (playAudio) this.audio.playPlus();
        } else {
            this.score = 100
        }
    }

    moins(playAudio: boolean) {
        if (this.score > 0) {
            this.score = this.score - 10;
            if (playAudio) this.audio.playMoins();
        } else {
            this.score = 0
        }
    };

    victory(victory: boolean, playAudio: boolean) {
        if (victory) {
            if (playAudio) this.audio.playVictory();
            this.message = "Victoire !";
            this.starColor = "star";
            this.starColor = 'text-warning';
        } else {
            this.message = "";
            this.starColor = "star_border";
            this.starColor = 'text-dark'
        }
    }

}