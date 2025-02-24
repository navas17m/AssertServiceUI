
import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';


@Pipe({
    name: 'dateFormat'
})

export class ExtendDatePipe extends DatePipe implements PipeTransform {
    transform(value: any, format = 'DD/MM/YYYY'): any {

        if (value != null && value != '') {
            //value = value.toString().replace(' ', 'T');
            format = format.replace(/d/g, 'D');
            format = format.replace(/y/g, 'Y');
            return moment(value).format(format);
        }
    }

}

@Pipe({ name: 'filter' })
export class FilterPipes implements PipeTransform {

    transform(items: any[], field: string, value: string): any[] {

        if (!items) return [];
        return items.filter(it => it[field] == value);
    }
}

@Pipe({ name: 'FilterLike' })
export class FilterLikePipes implements PipeTransform {

    transform(items: any[], field: string, value: string): any[] {
        if (!items) return [];
        return items.filter(it => it[field].indexOf(value) != -1);
    }
}

@Pipe({ name: 'ddlBr' })
export class ddlBrPipes implements PipeTransform {

    transform(value: string) {
        if (value && value.indexOf("<br/>") != -1) {
            var fields = value.split('<br/>');

            return fields[1];
        }
        else return value;

    }
}

@Pipe({ name: 'FilterTwoValue' })
export class FilterTwoValuePipes implements PipeTransform {

    transform(items: any[], field: string, value: string, fieldNot: string, valueNot: string): any[] {

        if (!items) return [];
        return items.filter(it => it[field] == value && it[fieldNot] != valueNot);
    }
}

@Pipe({ name: 'NotEqual' })
export class NotEqualPipes implements PipeTransform {

    transform(items: any[], field: string, value: string): any[] {

        if (!items) return [];
        return items.filter(it => it[field] != value);
    }
}




@Pipe({ name: 'groupBy' })
export class GroupByPipe implements PipeTransform {
    transform(value: Array<any>, field: string): Array<any> {
        const groupedObj = value.reduce((prev, cur) => {
            if (!prev[cur[field]]) {
                prev[cur[field]] = [cur];
            } else {
                prev[cur[field]].push(cur);
            }
            return prev;
        }, {});
        return Object.keys(groupedObj).map(key => ({ key, value: groupedObj[key] })).reverse();
    }
}

@Pipe({
    name: 'capitalize'
})
export class CapitalizePipe implements PipeTransform {

    transform(value: any, words: boolean) {

        if (value) {
            value = value.toLowerCase();
            if (words) {
                return value.replace(/\b\w/g, first => first.toLocaleUpperCase());
            } else {
                return value.charAt(0).toUpperCase() + value.slice(1);
            }
        }

        return value;
    }
}
//@Pipe({ name: 'AgePipe' })
//export class AgePipe {

//    // Transform is the new "return function(value, args)" in Angular 1.x
//    transform(value, args?) {
//        // ES6 array destructuring
//        let [minAge] = args;
//        return value.filter(person => {
//            return person.age >= +minAge;
//        });
//    }

//}

@Pipe({ name: 'SearchFilter' })
export class SearchPipeForm implements PipeTransform {
    transform(value, fieldCSV: string, args?): Array<any> {
        if (args == null || args.length == 0)
            return value;
        if (value) {
            var fields = fieldCSV.split(',');
            let searchText = new RegExp(args, 'ig');
            return value.filter(item => {
                for (var field of fields) {
                    var fieldNames = field.split('.');
                    if (fieldNames.length == 1) {
                        if (item[field] && item[field].search(searchText) !== -1) {
                            return true;
                        }
                    }
                    else {
                        var moduleName = item[fieldNames[0]];
                        for (var i = 1; i < fieldNames.length - 1; i++) {
                            if (moduleName == null)
                                break;
                            moduleName = moduleName[fieldNames[i]];
                        }
                        if (moduleName && moduleName[fieldNames[fieldNames.length - 1]]
                            && moduleName[fieldNames[fieldNames.length - 1]].search(searchText) !== -1) {
                            return true;
                        }
                    }
                }
                return false;
            });
        }
    }
}
@Pipe({ name: 'SearchDynamicFilter' })
export class SearchDynamicFilter implements PipeTransform {
    transform(value, fieldCSV: string, args?): Array<any> {

        if (args == null || args.length == 0)
            return value;
        if (value) {
            var fields = fieldCSV.split(',');
            let searchText = new RegExp(args, 'ig');
            return value.filter(item => {
                var items = item.value.filter(data => {
                    for (var field of fields) {
                        if (data.FieldName == field && data.FieldValue != null && data.FieldValue.search(searchText) !== -1) {
                            return true;
                        }
                    }
                    return false;
                });
                return (items != null && items.length > 0);
            });
        }
    }
}



