import {Component, input, output} from '@angular/core';

@Component({
  selector: 'app-action-bar',
  imports: [],
  templateUrl: './action-bar.html',
  styleUrl: './action-bar.css'
})
export class ActionBar {
  isComputationRunning = input.required<boolean>()

  onStart = output()
  onStop = output()

  protected start(){
    this.onStart.emit()
  }
  protected stop(){
    this.onStop.emit()
  }
}
