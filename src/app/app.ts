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

  protected async startIteration(){
    this.isRunning.set(true)
    this.initialisePopulation()

    const isComputationOngoing = (i: number) =>
      !this.isAbortRequested
      && i < this.geneticAlgorithmConfig.maxGenerationSafeguard
      && this.currentEpsilon() < this.geneticAlgorithmConfig.minEpsilon

    const waitForNextFrame = () => new Promise(resolve => requestAnimationFrame(resolve))

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
        () => this.sequenceRandomiser.randomTranslatableDna()
      )
    )
    this.currentGenerationNumber.set(1)
  }

  private breedNextGeneration(): string[]{
    const currentCandidates = this.population()?.candidates()
    if(!currentCandidates){
      throw new Error('No candidates found')
    }

    const [bestCandidateIndex, fitness, totalFitnessWeight] = this.evaluateCandidates(currentCandidates)
    this.currentEpsilon.set(fitness[bestCandidateIndex])

    //TODO: display best candidate

    return Array.from(
      { length: this.geneticAlgorithmConfig.populationSize },
      () => {
        const [a, b] = this.weightedPick(2, fitness, totalFitnessWeight)
        return this.mate(currentCandidates[a], currentCandidates[b])
      }
    )
  }

  private evaluateCandidates(candidates: readonly Candidate[]): [number, number[], number]{
    const fitness = candidates.map(this.calculateFitness.bind(this))
    let bestCandidateIndex = -1
    let bestFitness = -1
    let totalWeight = 0
    fitness.forEach((fitness, i) => {
      totalWeight += fitness

      if(fitness > bestFitness){
        bestFitness = fitness
        bestCandidateIndex = i
      }
    })

    return [bestCandidateIndex, fitness, totalWeight]
  }

  private calculateFitness(candidate: Candidate): number{
    const targetSequence = this.targetAaSequence()
    const candidateSequence = candidate.aa()

    let numberOfCorrectSymbols = this.countNumberOfMatches(targetSequence, candidateSequence);

    return (numberOfCorrectSymbols / targetSequence.length) ** 2
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

  private weightedPick(numberOfPicks: number, weights: number[], totalWeight: number): number[]{
    return Array.from(
      {length: numberOfPicks},
      () => {
        let target = Math.floor(Math.random() * totalWeight)
        for(let i = 0; i < weights.length; ++i){
          target -= weights[i]
          if(target <= 0){
            return i
          }
        }
        throw new Error(`weighted pick failed unexpectedly for weights ${weights}`)
      }
    )
  }

  private mate(parentA: Candidate, parentB: Candidate): string {
    return this.sequenceRandomiser.randomTranslatableDna() //TODO
  }
}
