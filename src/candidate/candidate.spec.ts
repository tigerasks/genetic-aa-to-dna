
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Candidate } from './candidate';
import { DnaTranslator } from '../sequence-handling/dna-translator';
import {SequenceRandomiser} from '../sequence-handling/sequence-randomiser';

describe('Candidate', () => {
  let fixture: ComponentFixture<Candidate>
  let dnaTranslator: DnaTranslator
  let sequenceRandomiser: SequenceRandomiser

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Candidate],
      providers: [DnaTranslator, SequenceRandomiser]
    }).compileComponents()

    fixture = TestBed.createComponent(Candidate)

    dnaTranslator = TestBed.inject(DnaTranslator)
    sequenceRandomiser = TestBed.inject(SequenceRandomiser)
  });

  it(`aa sequence is correctly translated from input dna`, () => {
    const testDna = sequenceRandomiser.randomTranslatableDna()
    const expectedAa = dnaTranslator.dnaToAa(testDna)

    fixture.componentRef.setInput('dna', testDna)
    fixture.detectChanges();

    expect(fixture.componentInstance.aa()).toBe(expectedAa)
  });

  it(`changes in input dna are reflected on the aa`, () => {
    const firstDna = sequenceRandomiser.randomTranslatableDna()
    const secondDna = sequenceRandomiser.randomTranslatableDna()
    const expectedAa = dnaTranslator.dnaToAa(secondDna)

    fixture.componentRef.setInput('dna', firstDna)
    fixture.detectChanges()

    fixture.componentRef.setInput('dna', secondDna)
    fixture.detectChanges()

    expect(fixture.componentInstance.aa()).toBe(expectedAa)
  });

  it('empty dna is not an issue', () => {
    fixture.componentRef.setInput('dna', '')
    fixture.detectChanges()

    expect(fixture.componentInstance.aa()).toBe('')
  });
})
