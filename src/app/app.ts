import {Component, computed, input, QueryList, signal, ViewChildren} from '@angular/core';
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
  protected currentPopulation = signal<string[]>([])

  protected targetAaSequence = signal<string>('')
  private currentEpsilon = computed<number>(() => 0.0)

  private isAbortRequested = false

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
      this.currentPopulation.set(this.breedNextGeneration())
      await waitForNextFrame()
    }

    this.isRunning.set(false)
    this.isAbortRequested = false
  }

  private initialisePopulation(){
    this.currentPopulation.set(
      Array.from(
        { length: this.geneticAlgorithmConfig.populationSize },
        () => this.sequenceRandomiser.randomTranslatableDna()
      )
    )
    this.currentGenerationNumber.set(1)
  }

  private breedNextGeneration(): string[]{
    //TODO
    return Array.from(
      { length: this.geneticAlgorithmConfig.populationSize },
      () => this.sequenceRandomiser.randomTranslatableDna()
    )
  }

}
