import {SequenceRandomiser} from './sequence-randomiser';
import {TestBed} from '@angular/core/testing';
import {DnaTranslator} from './dna-translator';

describe('SequenceRandomiser', () => {
  let service: SequenceRandomiser;
  let dnaTranslator: DnaTranslator;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SequenceRandomiser,
        DnaTranslator
      ]
    });

    service = TestBed.inject(SequenceRandomiser);
    dnaTranslator = TestBed.inject(DnaTranslator);
  });

  it(`initialisation works`, () => {
    expect(service).toBeTruthy();
    expect(dnaTranslator).toBeTruthy();
  });

  it('randomTranslatableDna should be translatable', () => {
    const randomDna = service.randomTranslatableDna()
    expect(function () {
      dnaTranslator.dnaToAa(randomDna)
    }).not.toThrowError()
  })
});
