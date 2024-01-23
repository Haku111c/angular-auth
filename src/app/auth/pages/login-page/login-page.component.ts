import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";


import Swal from 'sweetalert2'

@Component({
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService)
  private router = inject(Router)
  public myForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  })

  login() {
    //extraemos los valores del my
    const {email, password} = this.myForm.value
    console.log(this.myForm.value)
    this.authService.login(email, password).subscribe({
      next: () => this.router.navigateByUrl('/dashboard'),
      //usando el error, podemos recibir todos los errorers y podemos mostrar el mensaje desde el service
      error: (message) => {
        Swal.fire('Error', message, 'error')
      }
    })
  }


}
