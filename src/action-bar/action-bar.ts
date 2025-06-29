import {Component, effect, input, output, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {SequenceRandomiser} from '../sequence-handling/sequence-randomiser';

@Component({
  selector: 'app-action-bar',
  imports: [
    FormsModule
  ],
  templateUrl: './action-bar.html',
  styleUrl: './action-bar.css'
})
export class ActionBar {
  isComputationRunning = input.required<boolean>()
  protected targetAaSequence = signal<string>('')

  onStart = output()
  onStop = output()
  onTargetSequenceChanged = output<string>()

  constructor(
    private sequenceRandomiser: SequenceRandomiser
  ) {
    let lastTargetAaSequence: string
    effect(() => {
      const currentTargetAaSequence = this.targetAaSequence()
      if(currentTargetAaSequence !== lastTargetAaSequence){
        this.onTargetSequenceChanged.emit(currentTargetAaSequence)
      }
      lastTargetAaSequence = currentTargetAaSequence
    });
  }

  protected start(){
    this.onStart.emit()
  }
  protected stop(){
    this.onStop.emit()
  }

  protected translateRandomDna(){
    this.targetAaSequence.set(this.sequenceRandomiser.randomAaSequence())
    this.onStart.emit()
  }
}
