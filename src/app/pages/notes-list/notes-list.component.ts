import { NotesService } from "./../../shared/notes.service";
import { Note } from "./../../shared/note.model";
import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger,
} from "@angular/animations";

@Component({
  selector: "app-notes-list",
  templateUrl: "./notes-list.component.html",
  styleUrls: ["./notes-list.component.scss"],
  animations: [
    trigger("itemAnim", [
      // ENTRY ANIMATION
      transition("void => *", [
        // Initial state
        style({
          height: 0,
          opacity: 0,
          transform: "scale(0.85)",
          "margin-bottom": 0,

          // we have to 'expand' out the padding properties
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: 0,
          paddingRight: 0,
        }),
        // we first want to animate the spacing (which includes height and margin)
        animate(
          "50ms",
          style({
            height: "*",
            "margin-bottom": "*",
            paddingTop: "*",
            paddingBottom: "*",
            paddingLeft: "*",
            paddingRight: "*",
          }),
        ),
        animate(68),
      ]),

      transition("* => void", [
        // first scale up
        animate(
          50,
          style({
            transform: "scale(1.05)",
          }),
        ),
        // then scale down back to normal size while beginning to fade out
        animate(
          50,
          style({
            transform: "scale(1)",
            opacity: 0.75,
          }),
        ),
        // scale down and fade out completely
        animate(
          "120ms ease-out",
          style({
            transform: "scale(0.68)",
            opacity: 0,
          }),
        ),
        // then animate the spacing (which includes height, margin and padding)
        animate(
          "150ms ease-out",
          style({
            height: 0,
            paddingTop: 0,
            paddingBottom: 0,
            paddingRight: 0,
            paddingLeft: 0,
            "margin-bottom": "0",
          }),
        ),
      ]),
    ]),

    trigger("listAnim", [
      transition("* => *", [
        query(
          ":enter",
          [
            style({
              opacity: 0,
              height: 0,
            }),
            stagger(100, [animate("0.2s ease")]),
          ],
          {
            optional: true,
          },
        ),
      ]),
    ]),
  ],
})
export class NotesListComponent implements OnInit {
  notes: Note[] = new Array<Note>();
  filteredNotes: Note[] = new Array<Note>();

  @ViewChild("filterInput")
  filterInput: ElementRef<HTMLInputElement>;

  constructor(private noteService: NotesService) {}

  ngOnInit(): void {
    this.notes = this.noteService.getAll();
    this.filter("");
  }

  onDelete(note: Note) {
    let noteId = this.noteService.getId(note);
    this.noteService.delete(noteId);
    this.filter(this.filterInput.nativeElement.value);
  }

  genereateNoteURL(note: Note) {
    let noteId = this.noteService.getId(note);
    return noteId;
  }

  filter(query: string) {
    query = query.toLowerCase().trim();
    let allResults: Note[] = new Array<Note>();
    let terms: string[] = query.split(" ");

    terms = this.removeDuplicates(terms);

    terms.forEach((term) => {
      let results: Note[] = this.relevantNotes(term);
      allResults = [...allResults, ...results];
    });

    let uniqueResults = this.removeDuplicates(allResults);
    this.filteredNotes = uniqueResults;

    this.sortByRelevancy(allResults);
  }

  removeDuplicates(arr: Array<any>): Array<any> {
    let uniqueResults: Set<any> = new Set<any>();
    arr.forEach((e) => uniqueResults.add(e));

    return Array.from(uniqueResults);
  }

  relevantNotes(query: string): Array<Note> {
    query = query.toLowerCase().trim();
    let relevantNotes = this.notes.filter((note) => {
      if (note.title && note.title.toLowerCase().includes(query)) {
        return true;
      } else if (note.body && note.body.toLowerCase().includes(query)) {
        return true;
      }
      return false;
    });

    return relevantNotes;
  }

  sortByRelevancy(searchResults: Note[]) {
    let noteCountObj: Object = {};

    searchResults.forEach((note) => {
      let noteId = this.noteService.getId(note);

      if (noteCountObj[noteId]) {
        noteCountObj[noteId] += 1;
      } else {
        noteCountObj[noteId] = 1;
      }
    });

    this.filteredNotes = this.filteredNotes.sort((a: Note, b: Note) => {
      let aId = this.noteService.getId(a);
      let bId = this.noteService.getId(b);

      let aCount = noteCountObj[aId];
      let bCount = noteCountObj[bId];

      return bCount - aCount;
    });
  }
}
