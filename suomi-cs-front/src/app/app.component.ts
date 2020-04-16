import { Component } from '@angular/core';

import { NodeService, Teams } from './services/node.service';
import { TeamComponent } from './team/team.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Suomi-CS';

  teams : Array<Teams> = [];
  teamstring : string;
  teamjson : any;
  haveData : boolean = false;

  constructor(private nodeService: NodeService) {
    this.teams = [];
  }

  fetchTeams() {
    this.nodeService.fetchTeams().subscribe((data: Array<Teams>) => {
      this.teams = { ...data };
      this.haveData = true;
    });
    this.teamstring = JSON.stringify(this.teams)
    this.teamjson = JSON.parse(this.teamstring)
    console.log(this.teamstring);
    console.log(this.teamjson)
  }
}
