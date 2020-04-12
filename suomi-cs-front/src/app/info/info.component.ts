import { Component, OnInit } from '@angular/core';
import {Time} from '@angular/common'

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {

  public time : Time;
  public date : Date;

  constructor() {
    this.time = {hours: 21, minutes: 30};
    this.date = new Date();
   }

  ngOnInit(): void {
  }

}
