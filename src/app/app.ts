import {Component, computed, input, QueryList, signal, viewChild, ViewChildren} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Candidate} from '../candidate/candidate';
import {SequenceRandomiser} from '../sequence-handling/sequence-randomiser';
import {GeneticAlgorithmConfig} from '../app-config/genetic-algorithm-config';
import {PopulationDisplay} from '../population-display/population-display';
import {ActionBar} from '../action-bar/action-bar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PopulationDisplay, ActionBar],
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

    const [bestCandidateIndex, fitness] = this.evaluateCandidates(currentCandidates)
    this.currentEpsilon.set(fitness[bestCandidateIndex])

    //TODO: display best candidate

    return Array.from(
      { length: this.geneticAlgorithmConfig.populationSize },
      () => {
        const [a, b] = this.weightedPick(2, fitness)
        return this.mate(currentCandidates[a], currentCandidates[b])
      }
    )
  }

  private evaluateCandidates(candidates: readonly Candidate[]): [number, number[]]{
    const targetSequence = this.targetAaSequence()

    let bestCandidateIndex = -1
    let bestCandidateScore = -1
    let sumOfScores = 0
    const scores = candidates.map((candidate, i) => {
      const candidateSequence = candidate.aa()

      const numberOfCorrectSymbols = this.countNumberOfMatches(targetSequence, candidateSequence)
      const score = 2 ** numberOfCorrectSymbols
      sumOfScores += score

      if(bestCandidateScore < score){
        bestCandidateScore = score
        bestCandidateIndex = i
      }

      return score
    })
    const fitness = scores.map((ithScore) => ithScore / sumOfScores)

    return [bestCandidateIndex, fitness]
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

    const midpoint = Math.floor(Math.random() * dnaA.length)
    const childSequence = dnaA.substring(0, midpoint) + dnaB.substring(midpoint)

    //TODO: mutate

    return childSequence
  }
}
