import { Component, Input, ViewChild } from '@angular/core';

@Component({
    selector: 'ListBox',
    templateUrl: './listbox.component.template.html',

//     styles: [`[required]  {
//         border-left: 5px solid blue;
//     }

//     .ng-valid[required], .ng-valid.required  {
//             border-left: 5px solid #42A948; /* green */
// }
//     .ng-invalid:not(form)  {
//         border-left: 5px solid #a94442; /* red */
// }`]
})

export class ListBoxComponet {

    @ViewChild('select') selectElRef;
    lstoption: any;
    selectedValues = [];
    IsMandatoryVisible = false;
    color = '1px solid rgb(169, 169, 169)';
    IsMandatory = false;


    @Input()
    set listoptions(option: any) {
        this.lstoption = option;
        //   console.log(option);
        // console.log(this.selectedValues);
        this.selectedValues = option.FieldValue;
        this.IsMandatory = option.IsMandatory;

        if (this.IsMandatory) {
            if (option.FieldValue == null) {
                this.color = '5px solid #a94442';
                this.IsMandatoryVisible = true;
            } else {
                this.IsMandatoryVisible = false;
                this.color = '5px solid #42A948';
            }
        }
    }
    get listoptions(): any {
        return this.getReturnValue();
    }

    rtnalue;
    getReturnValue() {
        return this.selectedValues;
    }


    constructor() {
        // console.clear();
    }


    ngAfterViewInit() {

        this.updateSelectList();
    }

    selectedValuesTemp = [];
    updateSelectList() {

        //this.selectedValues.forEach(item => {
        //    let add: ListValues = new ListValues();
        //    add.Id = item;
        //    this.selectedValuesTemp.push(add);
        //    console.log(item);
        //});
        //console.log(this.selectedValuesTemp);

        let options = this.selectElRef.nativeElement.options;
        //  console.log(this.selectElRef.nativeElement.options);
       // console.log(this.selectedValues);
        if (this.selectedValues != null && this.selectedValues.length > 0 ) {
         //   console.log(1);
            let sValue = [];
            sValue.push(this.selectedValues);
            sValue.forEach(item => {
                item.split(',').forEach(subItem => {
                    let add: ListValues = new ListValues();
                    add.Id = subItem;
                    this.selectedValuesTemp.push(add);
                });

            });
           // console.log(this.selectedValuesTemp);
        }

        // this.selectedValuesTemp.push(this.selectedValues)
        //console.log("ssss");
        //console.log(this.selectedValuesTemp);
        //let val = this.selectedValuesTemp.filter(x => x.Id == 208);
        //console.log(val);

        //this.selectedValues.split(",").forEach(x => {
        //    console.log(x);
        //});

        if (this.selectedValuesTemp != null && this.selectedValuesTemp.length > 0) {
           // console.log(2);
            for (let i = 0; i < options.length; i++) {
                let val = this.selectedValuesTemp.filter(x => x.Id == options[i].value);
             //   console.log(3);
                if (val.length > 0)
                    options[i].selected = true;
                else
                    options[i].selected = false;
                //  options[i].selected = this.selectedValues.indexOf(options[i].value) > -1;
            }
        }

    }

    change(options) {
        this.selectedValues = Array.apply(null, options)
            .filter(option => option.selected)
            .map(option => option.value)

        if (this.IsMandatory) {
            if (this.selectedValues.length > 0) {
                this.color = '5px solid #42A948';
                this.IsMandatoryVisible = false;
            } else {
                this.color = '5px solid #a94442';
                this.IsMandatoryVisible = true;
            }
        }
    }
}

export class ListValues {
    Id: number;
}
