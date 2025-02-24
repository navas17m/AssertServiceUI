import { Component, Input } from '@angular/core';


@Component({
    selector: 'Checkboxlist',
    templateUrl: './checkboxlist.component.template.html',
  

})

export class CheckBoxListComponet {

    checkboxvalue: any;
    selected = [];
    selectedValues = [];
    @Input()
    set checkboxlist(val: any) {
        this.checkboxvalue = val;
        if (val.FieldValue != null) {
            this.selected = val.FieldValue.split(',')
            this.selectedValues = val.FieldValue;

           
        }

    }
    get checkboxlist(): any {
        return this.selected;
    }

    updateChecked(event) {
      
        var index = this.selected.indexOf(event.target.value);
        if (index === -1) {
            this.selected.push(event.target.value);
        } else {
            this.selected.splice(index, 1);
        }
    }

    exists(id) {
       
        return this.selectedValues.indexOf(id) > -1;
    }


    //checkAll(val) {



    //    this.checkboxvalue.ConfigTableValues.forEach(item => {

    //        var index = this.selected.indexOf(item.CofigTableValuesId);
           
    //        if (index === -1 && val.target.checked) {
              
    //            this.selected.push(item.CofigTableValuesId);
    //            this.exists(item.CofigTableValuesId)
    //        }
    //        else if (val.target.checked == false) {
    //            this.selected.splice(index, 1);
    //        }


    //    });



    //}


}