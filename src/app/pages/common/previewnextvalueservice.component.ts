import { Injectable } from '@angular/core';

@Injectable({
    providedIn:'root',
})
export class PreviewNextValueService {
   constructor() { }
   lstValus=[];

   SetListValues(val)
   {
       this.lstValus=val;
   }

   SetListValuesNew(val:any)
   {
       let array:any=[];
       val.forEach((element:any) => {
           let temp={
               "key":JSON.stringify(element.SequenceNo),
               "value":element
           }
        array.push(temp)

       });
      // console.log(array);
       this.lstValus=array;
   }

   GetListValues()
   {
      return this.lstValus;
   }
}