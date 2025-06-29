import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class GeneticAlgorithmConfig{
  readonly populationSize: number = 200
}
