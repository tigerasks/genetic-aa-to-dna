import {Injectable} from '@angular/core';

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
        const aa = dnaToAa.get(triplet)
        if(aa === undefined){
          throw new Error(`Failed to translate triplet ${triplet}`)
        }
        result.push(aa)
      }
    }

    return result.join('')
  }
}

const dnaToAa = new Map([
  ["TTT", "F"],
  ["TTC", "F"],
  ["TTA", "L"],
  ["TTG", "L"],
  ["TCT", "S"],
  ["TCC", "S"],
  ["TCA", "S"],
  ["TCG", "S"],
  ["TAT", "Y"],
  ["TAC", "Y"],
  ["TAA", "*"],
  ["TAG", "*"],
  ["TGT", "C"],
  ["TGC", "C"],
  ["TGA", "*"],
  ["TGG", "W"],
  ["CTT", "L"],
  ["CTC", "L"],
  ["CTA", "L"],
  ["CTG", "L"],
  ["CCT", "P"],
  ["CCC", "P"],
  ["CCA", "P"],
  ["CCG", "P"],
  ["CAT", "H"],
  ["CAC", "H"],
  ["CAA", "Q"],
  ["CAG", "Q"],
  ["CGT", "R"],
  ["CGC", "R"],
  ["CGA", "R"],
  ["CGG", "R"],
  ["ATT", "I"],
  ["ATC", "I"],
  ["ATA", "I"],
  ["ATG", "M"],
  ["ACT", "T"],
  ["ACC", "T"],
  ["ACA", "T"],
  ["ACG", "T"],
  ["AAT", "N"],
  ["AAC", "N"],
  ["AAA", "K"],
  ["AAG", "K"],
  ["AGT", "S"],
  ["AGC", "S"],
  ["AGA", "R"],
  ["AGG", "R"],
  ["GTT", "V"],
  ["GTC", "V"],
  ["GTA", "V"],
  ["GTG", "V"],
  ["GCT", "A"],
  ["GCC", "A"],
  ["GCA", "A"],
  ["GCG", "A"],
  ["GAT", "D"],
  ["GAC", "D"],
  ["GAA", "E"],
  ["GAG", "E"],
  ["GGT", "G"],
  ["GGC", "G"],
  ["GGA", "G"],
  ["GGG", "G"],
])
