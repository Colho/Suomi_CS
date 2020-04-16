import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';



export interface Teams {
  team_name: null,
  team_id: null,
  team_image_url: null,
  players: Array<Player>
}

export interface Player {
  name: null
}

@Injectable({
  providedIn: 'root'
})
export class NodeService {

  teams : Array<Teams> = new Array();

  constructor(private http: HttpClient) { }

  fetchTeams(): Observable<Object> {
    return this.http.get<Array<Teams>>('/api/getTeams');
  }

  getTeams() {
    this.http.get<Array<Teams>>('/api/getTeams').subscribe((data: Array<Teams>) => {
      this.teams = { ...data };
    });
  }
}
