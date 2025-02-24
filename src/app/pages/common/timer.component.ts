import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Subscription } from "rxjs";
import { timer } from 'rxjs';

@Component({
    selector: 'Timer',
    template: `{{CountDownValue}}`,
})

export class TimerComponent {
    @Input()
    set RunCountDown(value: boolean) {
        if (value == true) {
            this.counter = 120;
            this.runCountDownValue = true;
            this.startTimerCountDown();
        }
        else if (value == false) {
            this.countDown.unsubscribe();
            this.counter = 120;
            this.runCountDownValue = false;
        }
    }

    @Output() TimeOut: EventEmitter<any> = new EventEmitter();
    constructor() {

    }

    private countDown = new Subscription()
    counter;
    tick = 1220;
    runCountDownValue = false;
    CountDownValue;
    startTimerCountDown() {
        this.CountDownValue = this.counter;
        this.countDown = timer(100, this.tick).subscribe(() => {
            --this.counter;
            this.CountDownValue = this.formatTime(this.counter);
            if (0 == this.counter && this.runCountDownValue == true) {
                this.countDown.unsubscribe();
                this.TimeOut.emit(this.counter);
            }

        });
    }

    formatTime(value: number) {
        const minutes: number = Math.floor(value / 60);
        return (
            ("00" + minutes).slice(-2) +
            ":" +
            ("00" + Math.floor(value - minutes * 60)).slice(-2)
        );

    }
}
