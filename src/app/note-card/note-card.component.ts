import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'note-card',
  templateUrl: './note-card.component.html',
  styleUrls: ['./note-card.component.scss'],
})
export class NoteCardComponent implements OnInit {
  @Input('title') title: string;
  @Input('body') body: string;
  @Input('link') link: string;

  @Output('delete') deleteEvent: EventEmitter<void> = new EventEmitter<void>();

  constructor() {}

  ngOnInit() {}

  delete() {
    this.deleteEvent.emit();
  }
}
