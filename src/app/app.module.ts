import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FourOhFourComponent } from './components/four-oh-four/four-oh-four.component';
import { CommonService } from './services/common.service';
import { LogService } from './services/log.service';
import { HttpClientModule } from '@angular/common/http';
import { GameBoardComponent } from './components/game-board/game-board.component';
import { AudioService } from './services/audio.service';
import { LightBoardComponent } from './components/buzzer-game-board/light-board/light-board.component';
import { CommandPadComponent } from './components/buzzer-game-board/command-pad/command-pad.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { StackService } from './services/stack.service';
import { TeamService } from './services/team.service';
import { BuzzerComponent } from './components/buzzer-game-board/buzzer/buzzer.component';
import { VotePadComponent } from './components/vote-game-board/vote-pad/vote-pad.component';
import { VotePadManagerComponent } from './components/vote-game-board/vote-pad-manager/vote-pad-manager.component';
import { VoteGameBoardComponent } from './components/vote-game-board/vote-game-board/vote-game-board.component';
import { VoteQrcodeComponent } from './components/vote-game-board/vote-qrcode/vote-qrcode.component';
import { BuzzerQrcodeComponent } from './components/buzzer-game-board/buzzer-qrcode/buzzer-qrcode.component';
import { QrCodeModule } from 'ng-qrcode';

@NgModule({
  declarations: [
    AppComponent,
    FourOhFourComponent,
    GameBoardComponent,
    LightBoardComponent,
    CommandPadComponent,
    HomePageComponent,
    BuzzerComponent,
    VotePadComponent,
    VotePadManagerComponent,
    VoteGameBoardComponent,
    VoteQrcodeComponent,
    BuzzerQrcodeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    QrCodeModule
  ],
  providers: [
    CommonService,
    LogService,
    AudioService,
    StackService,
    TeamService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
