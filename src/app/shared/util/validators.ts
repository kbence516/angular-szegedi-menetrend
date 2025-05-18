import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function nonEmptyStringValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const str = control.value?.trim() === '';
    return str ? { nonEmptyString: { value: control.value.trim() } } : null;
  };
}

export function fieldsMatchValidator(field1: string, field2: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return control.get(field1)?.value === control.get(field2)?.value ? null : { fieldsMatchRole: true };
  }
}