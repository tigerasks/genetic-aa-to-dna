import {Injectable} from '@angular/core';
import {dnaTripletToAaSymbol} from './dna-to-aa-map';

@Injectable({
  providedIn: 'root'
})
export class DnaTranslator {
  private static invalidDnaPattern = new RegExp(/[^CGAT]/g)

  public dnaToAa(dna: string) : string {
    if(dna.length % 3 !== 0){
      throw Error('input length must be a multiple of 3')
    }
    if(DnaTranslator.invalidDnaPattern.test(dna)){
      throw Error('input is not a valid DNA sequence')
    }

    const result: string[] = []
    const next = new Array<string>(3).fill('')
    let i = 0
    for(const symbol of dna){
      next[i++ % 3] = symbol

      if(i % 3 == 0){
        const triplet = next.join('')
        const aa = dnaTripletToAaSymbol.get(triplet)
        if(aa === undefined){
          throw new Error(`Failed to translate triplet ${triplet}`)
        }
        result.push(aa)
      }
    }

    return result.join('')
  }
}
