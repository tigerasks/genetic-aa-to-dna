import {Injectable} from '@angular/core';
import {DnaTranslator} from './dna-translator';
import {dnaTripletToAaSymbol} from './dna-to-aa-map';

@Injectable({providedIn: 'root'})
export class SequenceRandomiser {
  private static readonly unwantedAaSymbols = new Set(['X', '*']);
  private static readonly validTriplets = Array
    .from(dnaTripletToAaSymbol.entries())
    .filter(([dna, aa]) => !SequenceRandomiser.unwantedAaSymbols.has(aa))
    .map(([dna,aa])=>dna);

  constructor(
    private dnaTranslator: DnaTranslator,
  ){}

  randomTranslatableDna(length: number = 75): string {
    if(!Number.isInteger(length)){
      throw new Error(`length must be an integer but was ${length}`)
    }
    if(length % 3 !== 0){
      throw new Error(`length must be a multiple of 3 but was ${length}`)
    }

    const result: string[] = []
    for(let i = 0; i < length; i+=3){
      const randomIndex = Math.floor(Math.random() * SequenceRandomiser.validTriplets.length)
      result.push(SequenceRandomiser.validTriplets[randomIndex])
    }
    return result.join('')
  }

  randomAaSequence(length: number = 25){
    const dna = this.randomTranslatableDna(length * 3)
    return this.dnaTranslator.dnaToAa(dna)
  }
}
