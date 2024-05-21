import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export class EmojiValidator {
    constructor() {}

    static hasEmoji(control: AbstractControl) {
        const text: string = control.value;
    
        if(!text) return;
        
        const hasNumber = /[0-9]/.test(text);
        const hasEmoji = /\p{Emoji}/u.test(text);
    
        return !hasEmoji || hasNumber ? null : {hasEmoji: true};
    }
}