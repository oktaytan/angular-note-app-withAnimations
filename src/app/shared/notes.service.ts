import { Injectable } from '@angular/core';
import { Note } from './note.model';

@Injectable({
  providedIn: 'root',
})
export class NotesService {
  notes: Note[] = new Array<Note>();

  constructor() {}

  getAll() {
    return this.notes;
  }

  get(id: number) {
    return this.notes[id];
  }

  getId(note: Note) {
    return this.notes.indexOf(note);
  }

  add(note: Note) {
    let newLength = this.notes.push(note);
    let index = newLength - 1;
    return index;
  }

  update(note: Note) {
    let { id, title, body } = note;
    let updatedNote = this.notes[id];
    updatedNote.title = title;
    updatedNote.body = body;
  }

  delete(id: number) {
    this.notes.splice(id, 1);
  }
}
