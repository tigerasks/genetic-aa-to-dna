import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Candidate} from '../candidate/candidate';
import {SequenceRandomiser} from '../sequence-handling/sequence-randomiser';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Candidate],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  constructor(
    private sequenceRandomiser: SequenceRandomiser,
  ) {}

  protected randomDna(): string {
    return this.sequenceRandomiser.randomTranslatableDna()
  }
}
