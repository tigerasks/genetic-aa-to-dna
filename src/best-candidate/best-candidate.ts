import {Component, computed, input, signal} from '@angular/core';

@Component({
  selector: 'app-best-candidate',
  imports: [],
  templateUrl: './best-candidate.html',
  styleUrl: './best-candidate.css'
})
export class BestCandidate {
  candidateGeneration = input.required<number>()
  targetAaSequence = input.required<string>()
  candidateDnaSequence =input.required<string>()
  candidateAaSequence = input.required<string>()

  protected doesCharacterMatch = computed<boolean[] | null>(() => {
    const targetAa = this.targetAaSequence()
    const candidateAa = this.candidateAaSequence()

    if(targetAa.length !== candidateAa.length){
      return null
    }
    if(targetAa === ''){
      return null
    }

    const result: boolean[] = []

    for(let i = 0; i < targetAa.length; ++i){
      result.push(targetAa[i] === candidateAa[i])
    }

    return result
  })

  protected matchPercentage = computed<number>(() => {
    const matchesByIndex = this.doesCharacterMatch()
    if(matchesByIndex === null){
      return 0
    }

    const numberOfMatches = matchesByIndex.filter((it: boolean) => it).length
    return numberOfMatches / matchesByIndex.length * 100
  })

  protected individualCandidateAaSymbols = computed<string[] | null>(() => {
    if(this.doesCharacterMatch() === null){
      return null
    }
    if(this.candidateAaSequence() === ''){
      return []
    }

    return [...this.candidateAaSequence()]
  })

  protected individualCandidateDnaTriplets = computed<string[] | null>(() => {
    if(this.doesCharacterMatch() === null){
      return null
    }
    const candidateDna = this.candidateDnaSequence()
    if(candidateDna.length %3 !== 0){
      throw new Error(`Expected DNA sequence length to be a multiple of 3, but was ${candidateDna.length}`)
    }
    if(candidateDna === ''){
      return []
    }

    const result : string[] = []
    for(let i = 2; i < candidateDna.length; i += 3){
      result.push([candidateDna[i-2], candidateDna[i-1], candidateDna[i]].join(''))
    }

    return result
  })

}
