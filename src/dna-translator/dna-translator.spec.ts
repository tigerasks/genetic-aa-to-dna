import { DnaTranslator } from './dna-translator'

interface DnaToAaTestcase{
  description: string
  input: string
  expectedOutput?: string
  expectedError?: string
}

describe('DnaTranslator', () => {
  let dnaTranslator = new DnaTranslator()

  let dnaToAaTestcases: Array<DnaToAaTestcase> = [
    {
      description: 'map empty string to empty string',
      input: '',
      expectedOutput: '',
    },

    {
      description: 'throw error if non-empty input too short',
      input: 'A',
      expectedError: 'input length must be a multiple of 3',
    },

    {
      description: 'throw error if input length is not a multiple of 3',
      input: 'GGGCTAT',
      expectedError: 'input length must be a multiple of 3',
    },

    {
      description: 'throw error if input is not a valid DNA sequence',
      input: 'HELOWORLD',
      expectedError: 'input is not a valid DNA sequence',
    },

    {
      description: 'correctly parse example1',
      input: 'GCAGTGTGGGCTATCGTCTGGTACAAAGAGAGTTGGCCCTGCACCGTGGCTAAGGACAGAGGCTGCTGCTGGATA',
      expectedOutput: 'AVWAIVWYKESWPCTVAKDRGCCWI',
    },

    {
      description: 'correctly parse example2',
      input: 'ACGACCTGCGCAACGGGGTGCGGAACTTGTGCGTGCGGAACCTGTGGTGCTGCCACGGGTGGCGCAGCCGCGTGCGGAGCCACTGGGTGTGCCACGTGCACGTGTACGGCCACATGCGCGGCATGCTGTTGTGGGGCGACGTGTGGTGCGGCTGGCGCCGCCACCGCCACGGCGACCGGCACCACAGCTGCCGCTGCTGCGACAGGGGGCGGGGCAGGGGGCTGCACGACTTGTGCCACGGGTTGCGGGACATGTGCTTGCGGCACCTGTGGGGCGGCCACAGGCGGAGCTGCTGCTTGTGGTGCCACAGGTTGTGCAACGTGTACCTGCACGGCTACGTGCGCGGCGTGCTGCTGTGGGGCAACCTGCGGAGCTGCCGGTGCGGCAACTGCTACTGCGACTGGGACGACGGCGGCGGCCGCTGCCACAGGCGGGGGTGCAGGGGGTTGT',
      expectedOutput: 'TTCATGCGTCACGTCGAATGGAAACGATGCATCTCTATCAACCCGATCGAAGAATATATGTTAAAAATGGGAGGCTTCATGCGTCACGTCGAATGGAAACGATGCATCTCTATCAACCCGATCGAAGAATATATGTTAAAAATGGGAGGC',
    },

    {
      description: 'correctly parse example3',
      input: 'CAGCCACGAGGTGTAATGATCGACGGCGTGGTGACTTTCATCATGAAATGGCGACGACAGCCTTGCATGTACTGC',
      expectedOutput: 'QPRGVMIDGVVTFIMKWRRQPCMYC',
    },
  ]

  dnaToAaTestcases.forEach((testCase, index) => {
    it(`dnaToAa[${index}]: ${testCase.description}`, () => {
      if(testCase.expectedOutput === undefined){
        expect(function () {
          dnaTranslator.dnaToAa(testCase.input)
        }).toThrowError(testCase.expectedError)
      }else {
        const actual = dnaTranslator.dnaToAa(testCase.input);
        expect(actual).toBe(testCase.expectedOutput)
      }

    })
  })
});

