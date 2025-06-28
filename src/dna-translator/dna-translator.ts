import {Injectable} from '@angular/core';
import {assert} from '@angular/compiler-cli/linker';

@Injectable({
  providedIn: 'root'
})
export class DnaTranslator {
  public dnaToAa(dna: string) : string {
    if(dna.length % 3 !== 0){
      throw Error('input length must be a multiple of 3')
    }

    return ''
  }
}
