// import { Component, Input,Output,EventEmitter } from "@angular/core";
// import { DataTable } from "angular2-datatable";
// import * as moment from 'moment';
// //import * as _ from "lodash";

// @Component({
//     selector: "mfDynamicTableSorter",
//     template: `
//         <a style="cursor: pointer" (click)="sort()" class="text-nowrap">
//             <ng-content></ng-content>
//             <span *ngIf="isSortedByMeAsc" class="glyphicon glyphicon-triangle-top" aria-hidden="true"></span>
//             <span *ngIf="isSortedByMeDesc" class="glyphicon glyphicon-triangle-bottom" aria-hidden="true"></span>
//         </a>`
// })
// export class DynamicTableSorter {
//     @Input("by") sortBy: string;
// 	@Input("dateType") dateType: string = 'false';


//     @Input()
//     set DefaultSortOrder(value: string) {
//         if (value != null && value != '') {
//             this.isDefaultSortOrder = value;
//             this.sort();
//         }
//     }

//     @Output() GetListValue: EventEmitter<any> = new EventEmitter();

//     lastSortedField: string;
//     lastSortOrder: string;
//     isDefaultSortOrder: string;
//     isSortedByMeAsc: boolean = false;
//     isSortedByMeDesc: boolean = false;

//     public constructor(private mfTable: DataTable) {
//     }

//     sort() {
//         var sortBy = this.sortBy;
//         var dateType = this.dateType;
//         var dateTimeFormat = "YYYY-MM-DD HH:mm";

//         this.lastSortOrder = (this.lastSortedField == sortBy && this.lastSortOrder == "asc") ? "desc" : "asc";
//         if (this.isDefaultSortOrder != null && this.isDefaultSortOrder != '') {
//             this.lastSortOrder = this.isDefaultSortOrder;
//             this.isDefaultSortOrder = null;
//         }

//         this.lastSortedField = sortBy;

//         var unsortedData = this.mfTable.inputData;

//         var emptyValueRecords = unsortedData.filter(function (item) {
//             return item.value.find(function (subitem) {
//                 return subitem.FieldName == sortBy && subitem.FieldValue == null;
//             })
//         });

//         var nonEmptyValueRecords = unsortedData.filter(function (item) {
//             return item.value.find(function (subitem) {
//                 return subitem.FieldName == sortBy && subitem.FieldValue != null;
//             })
//         });


//         var sortedData = nonEmptyValueRecords.sort(function (a, b) {

//             var matchA = a.value.find(function (element) {
//                 return element.FieldName == sortBy;
//             });

//             var matchB = b.value.find(function (element) {
//                 return element.FieldName == sortBy;
//             });

//             var result = matchA.FieldValue.localeCompare(matchB.FieldValue);
//             if (dateType === 'true') {
//                 result = compare(matchA.FieldValue, matchB.FieldValue);
//             }

//             return result;
//         });

//         function compare(dateTimeA, dateTimeB) {

//             var momentA = moment(dateTimeA, dateTimeFormat).format();
//             var momentB = moment(dateTimeB, dateTimeFormat).format();

//             if (momentA > momentB) return 1;
//             else if (momentA < momentB) return -1;
//             else return 0;
//         };

//         sortedData = this.lastSortOrder == "asc" ? sortedData : sortedData.reverse();

//         //console.log("emptyValueRecords"+emptyValueRecords.length)

//         if (emptyValueRecords !== undefined && emptyValueRecords.length != 0) {

//             if (this.lastSortOrder == "asc") {

//                 var arrayLength = emptyValueRecords.length;
//                 for (var i = 0; i < arrayLength; i++) {
//                     sortedData.unshift(emptyValueRecords[i]);
//                 }

//             } else {

//                 var arrayLength = emptyValueRecords.length;
//                 for (var i = 0; i < arrayLength; i++) {
//                     sortedData.push(emptyValueRecords[i]);
//                 }

//             }

//         }

//         this.mfTable.inputData = sortedData;
//         this.GetListValue.emit(this.mfTable.inputData);
//        // console.log(this.mfTable);
//     }


// }
