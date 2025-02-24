import { AfterViewInit, Component } from '@angular/core';
import { Common } from '../common';

declare var $: any;

@Component({
    selector: 'ViewDisable',
    template: `<div></div>`,

})

export class ViewDisableComponent implements AfterViewInit {

    ngAfterViewInit() {

        let sessionVal = Common.GetSession("ViweDisable");
       
        if (sessionVal == "1") {
          //  var $input = $('input[type="text"],input[type="checkbox"],input[type="date"],input[type="datetime-local"],input[type="time"],input[type="radio"],input[type="number"],input[type="file"],button,Checkboxlist,select,select option,textarea');
          //  $input.attr("disabled", true);
           
            setTimeout(function () {
                var $input = $('#btnSubmit,#downloadbutton,input[type="text"],input[type="checkbox"],input[type="date"],input[type="datetime-local"],input[type="time"],input[type="radio"],input[type="number"],input[type="file"],button,Checkboxlist,select,select option,textarea');
                $input.attr("disabled", true);
             //   var $input = $('#btnSubmit');
             //   $input.hide();

            }.bind(this), 100);


            setTimeout(function () {               
                var $input = $('#btnSubmit,#downloadbutton,input[type="text"],input[type="checkbox"],input[type="date"],input[type="datetime"],input[type="datetime-local"],input[type="time"],input[type="radio"],input[type="number"],input[type="file"],button,Checkboxlist,select,select option,textarea');
                $input.attr("disabled", true);
            //     var $inputdownload = $('#downloadbutton');                              
            //    $inputdownload.removeAttr("disabled");
                Common.SetSession("ViweDisable", "0");
                //console.log("########");
                var $input = $('#BackBtn,#downloadbutton,#btnSuccessModel,#btnInfoModel,#btnWarningModel,#btnDangerModel,.closebtn');
                $input.removeAttr("disabled");
            }.bind(this), 3000);

        
        }
    }

}