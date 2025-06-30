import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class GeneticAlgorithmConfig{
  readonly populationSize: number = 200
  readonly maxGenerationSafeguard = 10_000
  readonly minEpsilon = 1
  readonly baseMutationRate = 0.01
  readonly stabilisationRate = 1/500
}
