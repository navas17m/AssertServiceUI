
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContactComponet } from './contact.component';
import { NgSelectModule } from '@ng-select/ng-select';
@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, NgSelectModule],
    declarations: [ContactComponet],
    exports: [ContactComponet]
})
export class ContactInfoModule { }