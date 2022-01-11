import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LogService } from './log.service';

export interface qpdwMessage {
    cmd: string;
    param?: string;
    param2?: string;
    queueSize?: number;
}

export enum qpdwCmd {
    // Gestion du timer
    start = 'start',
    stop = 'stop',
    buzz = 'buzz',
    // Gestion des scores
    plus = 'plus',
    moins = 'moins',
    victory = 'victory',
    // Gestion des votes
    vote = 'vote',
    finalVode = 'finalVode'
}

@Injectable()
export class StackService {

    constructor(private logger: LogService, private httpClient: HttpClient) {}

    clearStack(){
        this.logger.info("Nettoyage de la pile");
        this.httpClient.get(environment.apiLocation + "clear").subscribe();
    }

    sendMessage(message: qpdwMessage){
        let url = environment.apiLocation + "push/" + message.cmd;
        if(message.param !== undefined){
            url = url + "/" + message.param;
        }
        if(message.param2 !== undefined){
            url = url + "/" + message.param2;
        }
        this.logger.info("Stack d'un message : ", message, url);
        this.httpClient.get(url).subscribe();
    }

    getNextMessage(): Observable<qpdwMessage>{
        return this.httpClient.get<qpdwMessage>(environment.apiLocation + "shift");
    }

}