import { FormGroup } from "@angular/forms";

//Create custom validation
export function confValidator(controlName: string, matchingControlName: string){
return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];
    if (matchingControl.errors && !matchingControl.errors['confValidator']) {
        return;
    }
    if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confValidator: true });
    } else {
        matchingControl.setErrors(null);
    }
}
}