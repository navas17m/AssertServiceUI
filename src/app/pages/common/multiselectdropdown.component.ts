// import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
// //import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';

// @Component({
//     selector: 'Multiselect-Dropdown',
//     template: `<div><ss-multiselect-dropdown [options]="myOptions" [texts]="myTexts"
//     [settings]="mySettings" [(ngModel)]="optionsModel" (ngModelChange)="onChange($event)" [disabled]="disable"></ss-multiselect-dropdown></div>`,

// })

// export class MultiselectDropdown implements OnInit, AfterViewInit {

//     lstBindValue = [];
//     defaultSelection = [];
//     @Output() selected = new EventEmitter<any>();
//     @Input()
//     set BindValue(value: any) {
//         this.optionsModel = [];
//         this.lstBindValue = value;
//         this.myOptions = this.lstBindValue;

//         // this.mySettings.showUncheckAll = true;
//     }
//     rtnval = 1;
//     get BindValue(): any {
//         return this.optionsModel;
//     }

//     @Input()
//     set DefaultSelection(value: any) {
//         this.defaultSelection = value;
//     }

//     fnSetDefaultSelection(value) {
//         if (value)
//             this.optionsModel = value;
//     }

//     public disable: boolean = false;

//     public optionsModel: number[]; // Default selection
//     myOptions: IMultiSelectOption[];
//     ngOnInit() {
//         this.myOptions = this.lstBindValue;

//     }
//     ngAfterViewInit() {
//         this.optionsModel = this.defaultSelection;

//     }
//     onChange(event) {
//         this.selected.emit(this.optionsModel);

//     }
//     mySettings: IMultiSelectSettings = {
//         pullRight: false,
//         enableSearch: true,
//         checkedStyle: 'checkboxes',
//         buttonClasses: 'btn btn-default',
//         selectionLimit: 0,
//         closeOnSelect: false,
//         showCheckAll: true,
//         showUncheckAll: true,
//         dynamicTitleMaxItems: 2,
//         maxHeight: '300px',
//     };

//     myTexts: IMultiSelectTexts = {
//         checkAll: 'Check all',
//         uncheckAll: 'Uncheck all',
//         checked: 'checked',
//         checkedPlural: 'checked',
//         searchPlaceholder: 'Search...',
//         defaultTitle: 'Select',

//     };
// }
