import {Component, computed, input} from '@angular/core';
import {DnaTranslator} from '../sequence-handling/dna-translator';

@Component({
  selector: 'app-candidate',
  imports: [],
  templateUrl: './candidate.html',
  styleUrl: './candidate.css'
})
export class Candidate {
  dna = input.required<string>()
  aa = computed(() => this.dnaTranslator.dnaToAa(this.dna()))
  constructor(
    private dnaTranslator: DnaTranslator,
  ){}
}
