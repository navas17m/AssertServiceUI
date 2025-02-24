import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';

@Component({
    selector: 'Multiselect-Dropdown-List',
    templateUrl: './multiselectdropdown.component.template.html'

})

export class MultiselectDropdownComponent implements OnInit, AfterViewInit {
    @Output() OptionsValueClick: EventEmitter<any> = new EventEmitter();
    myOptions: IMultiSelectOption[];
    myOptionsTemp = [];
    optionsModel = []; // Default selection
    selectedTexts =[];
    optionsModelTemp = [];
    lstBindValue = [];
    listValue;
    // defaultSelection = [];
    @Input()
    set listoptions(value: any) {

        this.fnLoadOptions(value.ConfigTableValues);

        if (value.FieldValue != '' && value.FieldValue != null && value.ConfigTableValues.length > 0) {
            value.FieldValue.split(',').forEach(data => {
                let ad: number = parseInt(data);
                this.optionsModelTemp.push(ad);
            });
            this.optionsModel = this.optionsModelTemp;
        }

    }
    rtnval = 1;
    get listoptions(): any {
       // console.log(this.myOptionsTemp);
        return this.optionsModel;
    }

    fnLoadOptions(data) {
        if (data) {
            data.forEach(item => {
                this.myOptionsTemp.push({ id: item.CofigTableValuesId, name: item.Value });
            });
        }
    }
    public onChange(): void {
        this.listValue = this.optionsModel.toString();
        if (this.listValue != "")
             this.OptionsValueClick.emit(this.listValue);
        else
             this.OptionsValueClick.emit(null);
     }

    // fnClick($event) {
    //     // this.listValue = "";
    //     // this.optionsModel.forEach(data => {
    //     //     this.listValue += data + ",";
    //     // });
    //     // this.listValue = this.listValue.substring(0, this.listValue.length - 1);
    //     // if (this.listValue != "")
    //     //     this.OptionsValueClick.emit(this.listValue);
    //     // else
    //     //     this.OptionsValueClick.emit(null);
    // }
    ngOnInit() {
        this.myOptions = this.myOptionsTemp;
    }
    ngAfterViewInit() {
    }

    mySettings: IMultiSelectSettings = {
        pullRight: false,
        enableSearch: true,
        checkedStyle: 'checkboxes',
        buttonClasses: 'btn btn-default',
        selectionLimit: 0,
        closeOnSelect: false,
        showCheckAll: false,
        showUncheckAll: false,
        dynamicTitleMaxItems: 1,
        maxHeight: '300px',
    };

    myTexts: IMultiSelectTexts = {
        checkAll: 'Check all',
        uncheckAll: 'Uncheck all',
        checked: 'checked',
        checkedPlural: 'checked',
        searchPlaceholder: 'Search...',
        defaultTitle: 'Select',

    };

}
