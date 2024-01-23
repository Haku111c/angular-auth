import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "../services/auth.service";
import {AuthStatus} from "../interfaces";

export const isAuthenticatedGuard: CanActivateFn = (route, state) => {
  //vamos a extraer el url que se encuentra en el state
  // const url = state.url
  //vamos a guardar nuestra url en el localStorage
  // localStorage.setItem('url', url)
  const authService = inject(AuthService);
  const router = inject(Router)
  console.log(authService.authStatus())
  if (authService.authStatus() === AuthStatus.authenticated) return true
  // if (authService.authStatus() === AuthStatus.checking) return false
  router.navigateByUrl('/auth/login')
  return false;
};
