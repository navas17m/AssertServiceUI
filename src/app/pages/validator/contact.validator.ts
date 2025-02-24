import { FormControl } from '@angular/forms';

export class ContactValidator {

    static validateEmail(formControl: FormControl) {
        //console.log(formControl);
        if (formControl.value != null) {
            if (formControl.value.indexOf('.') >= 0 && formControl.value.indexOf('@') >= 0) {
                return null;
            }
        }
        return { NotValidEmailFormat: true };
    }

    static validatePhoneNumber(formControl: FormControl) {
        //console.log(formControl);
        var regEx = /^[0-9\s]{10,20}$/;
        if (formControl.value && formControl.value.match(regEx)) {
            return null;
        }
        return { NotValidPhoneNumber: true }

    }
    static validatePassowrd(formControl: FormControl) {
        //console.log(formControl);
        var regEx = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{6,20}$/;
        if (formControl.value && formControl.value.match(regEx)) {
            return null;
        }
        return { NotValidPassword: true }

    }
}
