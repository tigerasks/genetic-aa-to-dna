import {Component, input, QueryList, signal, ViewChildren} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Candidate} from '../candidate/candidate';
import {SequenceRandomiser} from '../sequence-handling/sequence-randomiser';
import {GeneticAlgorithmConfig} from '../app-config/genetic-algorithm-config';
import {PopulationDisplay} from '../population-display/population-display';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Candidate, PopulationDisplay],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected currentPopulation = signal<string[]>([])

  constructor(
    private geneticAlgorithmConfig: GeneticAlgorithmConfig,
    private sequenceRandomiser: SequenceRandomiser,
  ) {}

  protected onStart(){
    this.initialisePopulation()
  }

  private initialisePopulation(){
    this.currentPopulation.set(
      Array.from(
        { length: this.geneticAlgorithmConfig.populationSize },
        () => this.sequenceRandomiser.randomTranslatableDna()
      )
    )
  }

}
