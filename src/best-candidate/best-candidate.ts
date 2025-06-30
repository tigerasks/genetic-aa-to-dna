import {Component, computed, input, signal} from '@angular/core';
import {BestCandidateData} from './best-candidate.model';

@Component({
  selector: 'app-best-candidate',
  imports: [],
  templateUrl: './best-candidate.html',
  styleUrl: './best-candidate.css'
})
export class BestCandidate {
  candidateGeneration = input.required<number>()
  data = input<BestCandidateData>()
  protected targetAaSequence = computed(() => this.data()?.targetAaSequence)
  protected candidateDnaSequence = computed(() => this.data()?.candidateDnaSequence)
  protected candidateAaSequence = computed(() => this.data()?.candidateAaSequence)

  protected doesCharacterMatch = computed<boolean[] | null>(() => {
    const data = this.data()
    if(!data){
      return null
    }

    const targetAa = data.targetAaSequence
    const candidateAa = data.candidateAaSequence

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
    return parseFloat((numberOfMatches / matchesByIndex.length * 100).toFixed(2))
  })

  protected individualCandidateAaSymbols = computed<string[] | null>(() => {
    const data = this.data()
    if(!data){
      return null
    }
    if(this.doesCharacterMatch() === null){
      return null
    }
    if(data.candidateAaSequence === ''){
      return []
    }

    return [...data.candidateAaSequence]
  })

  protected individualCandidateDnaTriplets = computed<string[] | null>(() => {
    const data = this.data()
    if(!data){
      return null
    }
    if(this.doesCharacterMatch() === null){
      return null
    }
    const candidateDna = data.candidateDnaSequence
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
