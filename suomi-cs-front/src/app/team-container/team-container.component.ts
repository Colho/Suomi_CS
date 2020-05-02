import { Component, OnInit } from '@angular/core';

import { NodeService, Teams } from '../services/node.service';

@Component({
  selector: 'app-team-container',
  templateUrl: './team-container.component.html',
  styleUrls: ['./team-container.component.css']
})
export class TeamContainerComponent implements OnInit {

  public teams : Teams[];
  public teamKeys : string[];
  public mappedTeams : any;
  public teamDataLoaded : boolean;

  constructor(private nodeService: NodeService) { }

  ngOnInit(): void {
      this.nodeService.fetchTeams().subscribe((data: Array<Teams>) => {
        this.teams = { ...data };
        this.teamKeys = Object.keys(this.teams);
        this.mappedTeams = Object.keys(this.teams).map(key => ({type: key, value: this.teams[key]}));
        console.log(this.mappedTeams);
        this.teamDataLoaded = true;
      },
      err => console.log(err));
  }
}
