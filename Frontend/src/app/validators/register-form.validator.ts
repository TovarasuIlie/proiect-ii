import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export class UserValidator {
    constructor() {}

    static nameValidator(control: AbstractControl) {
        const name: string = control.value;
    
        if(!name) return;
    
        const hasSpaces = /[ ]/.test(name);
        const hasDashes = /[-]/.test(name);
        const hasAlpha = /[A-Za-z]/.test(name);
        const hasSpecialChars = /[$&+,:;=?@#|'<>.^*()%!]/.test(name);
    
        const valid = ((hasAlpha && hasSpaces) || hasDashes) && !hasSpecialChars;
    
        return valid ? null : {invalidName: true};
    }
    
    
    static passwordStrengthValidator(control: AbstractControl) {
        const password: string = control.value;
    
        if(!password) return;
    
        const hasNumber = /[0-9]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasUppercase = /[A-Z]/.test(password);
    
        const validPassword = hasLowercase && hasUppercase && hasNumber;
    
        return validPassword ? null : {passwordStrength: true}
    }
}

export const passwordConfirmValidator: ValidatorFn = (control: AbstractControl): ValidationErrors|null => {
    if(control.get('password')) {
        return (control.get('password')?.value == control.get('confirmPassword')?.value) ? null : { unmatched: true };
    } else {
        return (control.get('resetPassword')?.value == control.get('resetPasswordConfirm')?.value) ? null : { unmatched: true };
    }
}