import {Injectable} from '@angular/core';
import {assert} from '@angular/compiler-cli/linker';

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

    return ''
  }
}
