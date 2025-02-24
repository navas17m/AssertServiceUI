import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'ngxdatatable',
  templateUrl: './ngxdatatable.component.html',
  encapsulation: ViewEncapsulation.None
})
export class NgxdatatableComponent {
  //public limit:number =10;
  public searchText: string = "";
  public rows:Array<any>;
  public columns:Array<any>;
  pageSize:number = 10;
  @Input("formCnfgId") formCnfgId: number;
  @Input("searchFilter") searchFilter: boolean;
  @Input("searchFields") searchFields: string;
  @Input() limit:number;
  @Input() footerHeight:number;
  @Input() my_messages= {
    'emptyMessage': '',
    'totalMessage': ' - Records'
  };


  @Input("rows")
  set __rows(value:Array<any>){
    if(value){
      this.rows = value;
    }
  }
  @Input("columns")
  set __columns(value:Array<any>){
    if(value){
      this.columns = value;
    }
  }

  @Output("onEdit") onEdit:EventEmitter<any> = new EventEmitter();
  @Output("onDelete") onDelete:EventEmitter<any> = new EventEmitter();
  @Output("onButtonEvent") onButtonEvent:EventEmitter<any> = new EventEmitter();
  @Output("onSignClick") onSignClick:EventEmitter<any> = new EventEmitter();
  @Output("onFinView") onFinViewClick:EventEmitter<any> = new EventEmitter();
  @Output("onAdd") onAdd:EventEmitter<any> = new EventEmitter();
  @Output("onDownload") onDownload:EventEmitter<any> = new EventEmitter();

  onEditColumn(row){
    this.onEdit.emit(row);
  }
  onDeleteColumn(row){
    this.onDelete.emit(row);
  }
  onButtonClick(name,row)
  {
    row.buttonName= name;
    this.onButtonEvent.emit(row);
  }
  onClickSign(row){
    this.onSignClick.emit(row);
  }
  onFinView(row){
    this.onFinViewClick.emit(row);
  }
  onAddDetails(row){
    this.onAdd.emit(row);
  }
  onDownloadClick(row){
    this.onDownload.emit(row);
  }
  setRowsPerPage(e){
    this.pageSize = e.target.innerHTML;
  }

}
