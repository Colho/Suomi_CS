import { Component, OnInit } from '@angular/core';

import { NodeService, Teams } from '../services/node.service';

@Component({
  selector: 'app-team-container',
  templateUrl: './team-container.component.html',
  styleUrls: ['./team-container.component.css']
})
export class TeamContainerComponent implements OnInit {

  public teams : Teams[];
  public keys : string[];
  public mapped : any;
  public dataLoaded : boolean;

  constructor(private nodeService: NodeService) { }

  ngOnInit(): void {
      this.nodeService.fetchTeams().subscribe((data: Array<Teams>) => {
        this.teams = { ...data };
        this.keys = Object.keys(this.teams);
        this.mapped = Object.keys(this.teams).map(key => ({type: key, value: this.teams[key]}));
        console.log(this.mapped);
        this.dataLoaded = true;
      },
      err => console.log(err));
  }
}
