import { Component, OnInit } from '@angular/core';

import { NodeService, Matches } from '../services/node.service';

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.css']
})
export class MatchComponent implements OnInit {

  public matches : Matches[];
  public matchKeys : string[];
  public mappedMatches : any;
  public matchDataLoaded : boolean;

  constructor(private nodeService: NodeService) { }

  ngOnInit(): void {
    this.nodeService.fetchUpcoming().subscribe((data: Array<Matches>) => {
      this.matches = { ...data };
      this.matchKeys = Object.keys(this.matches);
      this.mappedMatches = Object.keys(this.matches).map(key => ({type: key, value: this.matches[key]}));
      console.log(this.mappedMatches);
      this.matchDataLoaded = true;
    },
    err => console.log(err));
  }

}
