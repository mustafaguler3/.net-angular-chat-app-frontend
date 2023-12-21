import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AccountService } from '../services/account.service';
import { ToastrService } from 'ngx-toastr';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  @Input() usersFromHomeComponent: any;
  @Output() cancelRegister = new EventEmitter();
  registerForm: FormGroup;
  maxDate: Date = new Date();
  validationErrors: string[] = [];

  constructor(
    private accountService: AccountService,
    private toastService: ToastrService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.maxDate.setFullYear(this.maxDate.getFullYear())
  }

  initializeForm() {
    this.registerForm = this.fb.group({
      gender: ["male"],
      knownAs: ["",Validators.required],
      dateOfBirth: ["",Validators.required],
      city: ["",Validators.required],
      country: ["",Validators.required],
      username: ["",Validators.required],
      password: ["",[Validators.required,Validators.minLength(4),Validators.maxLength(8)]],
      confirmPassword: ["",[Validators.required,this.matchValues("password")]],
    });

    this.registerForm.controls['password'].valueChanges.subscribe({
      next: () => this.registerForm.controls['confirmPassword'].updateValueAndValidity()
    })
  }

  matchValues(machTo: string) : ValidatorFn {
    return (control: AbstractControl) => {
      return control.value === control.parent?.get(machTo)?.value ? null : {notMatching: true}
    }
  }

  register() {
    const dob = this.getDateOnly(this.registerForm.controls["dateOfBirth"].value)
    const values = {...this.registerForm.value, dateOfBirth: dob}
    this.accountService.register(values).subscribe({
      next: () => this.router.navigateByUrl("/members"),
      error: err => this.validationErrors = err
    })
  }

  cancel() {
    this.cancelRegister.emit(false);
  }

  private getDateOnly(dob: string){
    if(!dob) return;
    let theDob = new Date(dob);
    return new Date(theDob.setMinutes(theDob.getMinutes()- theDob.getTimezoneOffset())).toISOString().slice(0,10)
  }
}
