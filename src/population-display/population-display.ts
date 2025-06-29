import {Component, input, QueryList, viewChildren, ViewChildren} from '@angular/core';
import {Candidate} from '../candidate/candidate';

@Component({
  selector: 'app-population-display',
  imports: [
    Candidate
  ],
  templateUrl: './population-display.html',
  styleUrl: './population-display.css'
})
export class PopulationDisplay {
  populationSequences = input<string[]>([])
  candidates = viewChildren(Candidate)
}

