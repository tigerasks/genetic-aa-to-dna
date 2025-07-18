import {Component, computed,signal, viewChild} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Candidate} from '../candidate/candidate';
import {SequenceRandomiser} from '../sequence-handling/sequence-randomiser';
import {GeneticAlgorithmConfig} from '../app-config/genetic-algorithm-config';
import {PopulationDisplay} from '../population-display/population-display';
import {ActionBar} from '../action-bar/action-bar';
import {BestCandidate} from '../best-candidate/best-candidate';
import {BestCandidateData} from '../best-candidate/best-candidate.model';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PopulationDisplay, ActionBar, BestCandidate],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected isRunning = signal<boolean>(false)
  protected currentGenerationNumber = signal<number>(1)
  protected currentPopulationSequences = signal<string[]>([])

  protected targetAaSequence = signal<string>('')
  private targetDnaLength = computed(() => this.targetAaSequence().length * 3)
  private currentEpsilon = signal<number>(0.0)

  private isAbortRequested = false

  private population = viewChild(PopulationDisplay)
  protected bestCandidate = signal<BestCandidateData | null>( null )

  constructor(
    private geneticAlgorithmConfig: GeneticAlgorithmConfig,
    private sequenceRandomiser: SequenceRandomiser,
  ) {}

  protected stopIteration() {
    this.isAbortRequested = true
  }

  protected startIteration() {
    if (this.targetAaSequence() === '') {
      throw new Error('Iteration on empty target is pointless.')
    }

    this.isRunning.set(true)
    this.initialisePopulation()

    setTimeout(() => this.doIterate(), 0) //allow candidates to be created
  }
    private async doIterate() {
      const waitForNextFrame = () => new Promise(resolve => requestAnimationFrame(resolve))

      this.currentEpsilon.set(0)

      const isComputationOngoing = (i: number) =>
        !this.isAbortRequested
        && i < this.geneticAlgorithmConfig.maxGenerationSafeguard
        && this.currentEpsilon() < this.geneticAlgorithmConfig.minEpsilon

      for(let i = 2; isComputationOngoing(i); ++i){
        this.currentGenerationNumber.set(i)
        this.currentPopulationSequences.set(this.breedNextGeneration())
        await waitForNextFrame()
      }

      this.isRunning.set(false)
      this.isAbortRequested = false
  }

  private initialisePopulation(){
    this.currentPopulationSequences.set(
      Array.from(
        { length: this.geneticAlgorithmConfig.populationSize },
        () => this.sequenceRandomiser.randomTranslatableDna(this.targetDnaLength())
      )
    )
    this.currentGenerationNumber.set(1)
  }

  private breedNextGeneration(): string[]{
    const currentCandidates = this.population()?.candidates()
    if(!currentCandidates || currentCandidates.length < 1){
      throw new Error(`Insufficient candidates found: ${currentCandidates?.length}`)
    }

    const [bestCandidateIndex, fitness, epsilon] = this.evaluateCandidates(currentCandidates)
    this.currentEpsilon.set(epsilon)

    const bestCandidate = currentCandidates[bestCandidateIndex]
    this.bestCandidate.set(
      new BestCandidateData(
        this.targetAaSequence(),
        bestCandidate.aa(),
        bestCandidate.dna(),
    ))

    return Array.from(
      { length: this.geneticAlgorithmConfig.populationSize },
      () => {
        const [a, b] = this.weightedPick(2, fitness)
        return this.mate(currentCandidates[a], currentCandidates[b])
      }
    )
  }

  private evaluateCandidates(candidates: readonly Candidate[]): [number, number[], number]{
    const targetSequence = this.targetAaSequence()

    let bestCandidateIndex = -1
    let bestCandidateScore = -1
    let bestPercentage = 0
    let sumOfScores = 0
    const scores = candidates.map((candidate, i) => {
      const candidateSequence = candidate.aa()

      const numberOfCorrectSymbols = this.countNumberOfMatches(targetSequence, candidateSequence)
      const score = 2 ** numberOfCorrectSymbols
      sumOfScores += score

      if(bestCandidateScore < score){
        bestCandidateScore = score
        bestCandidateIndex = i
        bestPercentage = numberOfCorrectSymbols / targetSequence.length
      }

      return score
    })
    const fitness = scores.map((ithScore) => ithScore / sumOfScores)

    return [bestCandidateIndex, fitness, bestPercentage]
  }

  private countNumberOfMatches(targetSequence: string, candidateSequence: string) {

    if(targetSequence.length !== candidateSequence.length){
      throw new Error(`Candidate sequence length ${candidateSequence.length} does not match target sequence length ${targetSequence.length}`)
    }

    let numberOfCorrectSymbols = 0
    for (let i = 0; i < targetSequence.length; ++i) {
      if (candidateSequence.at(i) === targetSequence.at(i)) {
        ++numberOfCorrectSymbols
      }
    }
    return numberOfCorrectSymbols
  }

  private weightedPick(numberOfPicks: number, normalisedWeights: number[]): number[]{
    return Array.from(
      {length: numberOfPicks},
      () => {
        let target = Math.random()
        for(let i = 0; i < normalisedWeights.length; ++i){
          target -= normalisedWeights[i]
          if(target <= 0){
            return i
          }
        }
        throw new Error(`weighted pick failed unexpectedly for weights [${normalisedWeights}]`)
      }
    )
  }

  private mate(parentA: Candidate, parentB: Candidate): string {
    const dnaA = parentA.dna()
    const dnaB = parentB.dna()

    if(dnaA.length !== dnaB.length){
      throw new Error(`Expected parent B to have same length DNA as parent A (${dnaA.length}) but was ${dnaB.length}`)
    }

    const childSequence: String[] = []
    for(let i = 2; i < dnaA.length; i += 3){
      let pickedSequence: String
      if(Math.random() < 0.5){
        pickedSequence = dnaA
      } else {
        pickedSequence = dnaB
      }
      childSequence.push(pickedSequence[i-2], pickedSequence[i-1], pickedSequence[i])
    }

    return this.mutateDnaSequence(childSequence.join(''))
  }

  private mutateDnaSequence(dna: string): string {
    const stabilisingFactor = (this.currentGenerationNumber() * this.geneticAlgorithmConfig.stabilisationRate)
    const mutationRate = this.geneticAlgorithmConfig.baseMutationRate / stabilisingFactor

    const resultSymbols: string[] = []
    for(let i = 2; i < dna.length; i += 3){
      if(Math.random() <= mutationRate){
        resultSymbols.push(this.sequenceRandomiser.randomTranslatableDna(3))
      } else {
        const originalTriplet = [dna[i-2], dna[i-1], dna[i]].join('')
        resultSymbols.push(originalTriplet)
      }
    }

    return resultSymbols.join('')
  }
}
