import { Component, Input } from '@angular/core';



@Component({
    selector: 'radiolist',
    //templateUrl: './radiolist.component.template.html',
  template:`<div *ngFor="let op of checkboxvalue.ConfigTableValues"  class="abc-radio">
      
  <input type="radio" 
        [id]="'rdo'+op.CofigTableValuesId" [name]="insFieldCnfgId"
        [value]="op.CofigTableValuesId" 
        [checked]="exists(op.CofigTableValuesId)" (change)="updateChecked(op.CofigTableValuesId)"
        />
        <label [for]="'rdo'+op.CofigTableValuesId">  {{op.Value}}</label>

        </div>`,

})

export class RadioListListComponet {
    insFieldCnfgId;
    checkboxvalue: any;
    selected = [];
    selectedValues = [];
    @Input()
    set List(val: any) {
        //console.log(val);
        this.insFieldCnfgId=val.FieldCnfg.FieldCnfgId;
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
     //  console.log(event);
       //console.log(this.checkboxvalue);
       this.checkboxvalue.FieldValue=JSON.stringify(event);
    //     var index = this.selected.indexOf(event.target.value);
    //     if (index === -1) {
    //         this.selected.push(event.target.value);
    //     } else {
    //         this.selected.splice(index, 1);
    //     }
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