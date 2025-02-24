
import { AfterViewChecked, Component, EventEmitter, Input, Output, Pipe, ViewChild } from '@angular/core';

//.@Pipe({ name: 'groupBy' })
@Component({
    selector: 'Editor',
    template: `<ckeditor #editors [disabled]="insdisabled" [(ngModel)]="content" (change)="onChange($event)"  debounce="500">
    </ckeditor>`,

})



export class EditorComponent implements AfterViewChecked  {

    @ViewChild('editors') ckEditor;
    insdisabled;
    @Output() Change: EventEmitter<any> = new EventEmitter();

    @Input()
    set Value(val) {
        this.content = val
    }
    get Value() {
        return this.content;
    }

    @Input()
    set Disabled(value: any) {
        this.insdisabled = value;
    }


    date;
    content;
    constructor() {
        // console.log("##333");

    }

    onChange(event: any) {
     //   console.log("##333");
       
            this.content = event;
            this.Change.emit(this.content);
        
    }

    fnChange() {
       // console.log("##333");
        this.Change.emit(this.content)
    }

    ngAfterViewChecked() {
        let editor = this.ckEditor.instance;

      ///  editor.config.toolbarGroups = [
       //    { name: 'document', groups: ['mode', 'document', 'doctools'] },
      //      { name: 'editing', groups: ['find', 'selection', 'spellchecker', 'editing'] }
      //  ]

        editor.config.removePlugins = 'blockquote,save,flash,iframe,tabletools,pagebreak,templates,about,showblocks,newpage,language,print,div';
        editor.config.removeButtons = 'Source,Image,Print,Form,TextField,Textarea,Button,CreateDiv,PasteText,PasteFromWord,Select,HiddenField,Radio,Checkbox,ImageButton,Anchor,BidiLtr,BidiRtl,Font,Format,Styles,Preview,Indent,Outdent';
        editor.config.scayt_autoStartup = true;
      //  editor.config.removeButtons = 'Source,Save,Templates,Find,Replace,Scayt,SelectAll,Form,Radio';

    }

}