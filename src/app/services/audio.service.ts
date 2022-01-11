import { Injectable } from '@angular/core';
import { AUDIO_ELEMENTS } from 'src/environments/assetsAudioElement';
import { LogService } from './log.service';

@Injectable()
export class AudioService {

    private victoryAudio: HTMLAudioElement = AUDIO_ELEMENTS.victoryAudio;
    private plusAudio: HTMLAudioElement = AUDIO_ELEMENTS.plusAudio;
    private moinsAudio: HTMLAudioElement = AUDIO_ELEMENTS.moinsAudio;
    private stopTimer: HTMLAudioElement = AUDIO_ELEMENTS.stopTimer;
    private endTimer: HTMLAudioElement = AUDIO_ELEMENTS.endTimer;
    private songList: HTMLAudioElement[] = AUDIO_ELEMENTS.songList;
    private songIndice = 0;

    constructor(private logger: LogService) {
        this.shuffleArray(this.songList);
    }

    private playAudio(sound: HTMLAudioElement) {
        sound.pause(); // dans le doute, on coupe le son
        sound.currentTime = 0; // on se positionne au début du morceau
        sound.play(); // on relance le morceau
    }

    playPlus() {
        this.logger.info("Play plus");
        this.playAudio(this.plusAudio);
    }

    playMoins() {
        this.logger.info("Play moins");
        this.playAudio(this.moinsAudio);
    }

    playVictory() {
        this.logger.info("Play final");
        this.playAudio(this.victoryAudio);
    }

    playStopTimer() {
        this.stopSong();
        this.logger.info("Play stop");
        this.playAudio(this.stopTimer);
    }

    playEndTimer() {
        this.stopSong();
        this.logger.info("Play end");
        this.playAudio(this.endTimer);
    }

    playSong() {
        this.logger.info("Play song " + this.songIndice, this.songList[this.songIndice]);
        this.playAudio(this.songList[this.songIndice]);
    }

    stopSong() {
        this.logger.info("Stop song " + this.songIndice, this.songList[this.songIndice]);
        // Arret de la musique
        this.songList[this.songIndice].pause();
        this.songList[this.songIndice].currentTime = 0;
        // Passage au morceau suivant
        if (this.songIndice >= this.songList.length - 1) {
            this.songIndice = 0;
        } else {
            this.songIndice++;
        }
    }

    private shuffleArray(array: Array<any>) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

}