import {Component, computed, inject} from '@angular/core';
import {AuthService} from "../../../auth/services/auth.service";

@Component({
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.css'
})
export class DashboardLayoutComponent {
  private authService = inject(AuthService);
  //podemos crear una señal computada y traer la inforamcion de nuestra señal computada que esta en el service
  public user = computed(()=>this.authService.currentUser())
  //vamos a crear un get para poder obtener nuestro usuario que es una señal computada
  // get user(){
  //   return this.authService.currentUser()
  // }
  onLogout(){
    this.authService.logout().subscribe()
  }
}
