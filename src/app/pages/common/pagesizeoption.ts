import { Component, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'PageSize',
    template: `<div>
                  <table class="tableOne">
                    <tr>
                        <td>
                        <ul class="pagination loat-sm-right" (click)="onClick($event)">
                            <li class="page-item" [ngClass]="{'active': pageSize == 10}">
                              <a class="page-link" style="cursor: pointer">10</a>
                            </li>
                            <li class="page-item" [ngClass]="{'active': pageSize == 25}">
                              <a class="page-link" style="cursor: pointer">25</a>
                            </li>
                            <li class="page-item" [ngClass]="{'active': pageSize == 50}">
                              <a class="page-link" style="cursor: pointer">50</a>
                            </li>
                            <li class="page-item" [ngClass]="{'active': pageSize == 100}">
                              <a class="page-link" style="cursor: pointer">100</a>
                            </li>
                        </ul>
                        </td>
                    </tr>
                  </table>
                </div>`,

})

export class PageSizeComponent {
  pageSize: number = 10;
  @Output() childPageSizeEvent = new EventEmitter<string>();
  onClick(elem){
    this.pageSize = elem.target.innerHTML;
    this.childPageSizeEvent.emit(this.pageSize.toString());
  }
}
