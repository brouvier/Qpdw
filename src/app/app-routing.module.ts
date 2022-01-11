import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommandPadComponent } from './components/buzzer-game-board/command-pad/command-pad.component';
import { FourOhFourComponent } from './components/four-oh-four/four-oh-four.component';
import { GameBoardComponent } from './components/game-board/game-board.component';
import { LightBoardComponent } from './components/buzzer-game-board/light-board/light-board.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { BuzzerComponent } from './components/buzzer-game-board/buzzer/buzzer.component';
import { VotePadComponent } from './components/vote-game-board/vote-pad/vote-pad.component';
import { VotePadManagerComponent } from './components/vote-game-board/vote-pad-manager/vote-pad-manager.component';
import { VoteGameBoardComponent } from './components/vote-game-board/vote-game-board/vote-game-board.component';
import { VoteQrcodeComponent } from './components/vote-game-board/vote-qrcode/vote-qrcode.component';
import { BuzzerQrcodeComponent } from './components/buzzer-game-board/buzzer-qrcode/buzzer-qrcode.component';


const routes: Routes = [
  { path: 'voteQrcode', component: VoteQrcodeComponent },
  { path: 'votePad', component: VotePadComponent },
  { path: 'votePadManager', component: VotePadManagerComponent },
  { path: 'voteBoard', component: VoteGameBoardComponent },
  { path: 'buzzerQrcode', component: BuzzerQrcodeComponent },
  { path: 'buzzer', component: BuzzerComponent },
  { path: 'gameBoard', component: GameBoardComponent },
  { path: 'lightBoard', component: LightBoardComponent },
  { path: 'commandPad', component: CommandPadComponent },
  { path: '', component: HomePageComponent },
  { path: 'not-found', component: FourOhFourComponent },
  { path: '**', redirectTo: 'not-found' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: true,
    relativeLinkResolution: 'legacy',
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }