import {Component, computed, effect, inject} from '@angular/core';
import {AuthService} from "./auth/services/auth.service";
import {AuthStatus} from "./auth/interfaces";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'authApp';
  //vamos a llamar aqui a nuestro check-token ya que todas las aplicaciones de nuestro proyecto pasan por aqui
  private authService= inject(AuthService);
  private router = inject(Router)
  public finishedAuthChecking = computed<boolean>(()=>{
    console.log('app',this.authService.authStatus())
    //mientras se esta checkeando el status entonces debemos de sacar al usaurio y no dejarlo ingresar hacia el dashboard ni al login
    if (this.authService.authStatus() === AuthStatus.checking){
      return false
    }
    return true
  })
  // si nuestro authService.authStatus cambia de valor entonce se realizara el efecto
  public authStatusChangeEffect = effect(()=>{
    //cada vez que cambien nuestro authStatus entonce se lanzara este efecto y verificara su valor
    //dependiendo su valor lo mandara a una ruta respectiva
    switch (this.authService.authStatus()) {
      case AuthStatus.checking:
        return
      case AuthStatus.authenticated:
        this.router.navigateByUrl('/dashboard')
        return
      case AuthStatus.notAuthenticated:
        this.router.navigateByUrl('/auth/login')
        return;
    }
  })

}
