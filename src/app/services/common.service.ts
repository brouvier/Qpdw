import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LogService } from './log.service';

@Injectable()
export class CommonService {

    currentVersion$: Observable<String> = new Observable<String>();

    constructor(private httpClient: HttpClient, private logger: LogService) {        
    }

}