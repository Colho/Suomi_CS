import { Component } from '@angular/core';

import { NodeService, Teams } from './node.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Suomi-CS';

  teams : Array<Teams>;

  constructor(private nodeService: NodeService) {

  }

  fetchTeams() {
    this.nodeService.fetchTeams().subscribe((data: Array<Teams>) => this.teams = { ...data });
    console.log(this.teams);
  }
}
