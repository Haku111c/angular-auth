import {computed, inject, Injectable, signal} from '@angular/core';
import {environment} from "../../../environments/environments";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, map, Observable, of, throwError} from "rxjs";
import {AuthStatus, CheckTokenResponse, LoginResponse, User} from "../interfaces";


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //readonly => solo de lectura
  private readonly baseUrl: string = environment.baseUrl
  private http = inject(HttpClient);
  //vamos a crear una señal que puede ser de tipo User o null a su vez su valor inicial sera null
  private _currentUser = signal<User | null>(null)
  //esta señal nos va a indicar si el usuario esta logeado si no lo esta o si es la primera vez que ingresa
  //para ello nuestra seña sera de tipo AuthStatus y recibira como valor inicial el checking
  private _authStatus = signal<AuthStatus>(AuthStatus.checking)

  //PARA MANEJRAR NUESTRA VARIABLE PRIVADA VAMOS A USAR SEÑALES COMPUTADAS
  public currentUser = computed(() => this._currentUser())
  public authStatus = computed(() => this._authStatus())

  constructor() {
    //ahora vamos a llamar a nuestro checkout para verificar constantemente si hay un token
    this.checkAuthStatus().subscribe()
  }

  private setAuthentication(user: User, token: string): boolean {
    //a nuestra señal _currentUser le asignamos el usuario
    this._currentUser.set(user);
    //y cambiamos el valor de nuestro _authStatus
    this._authStatus.set(AuthStatus.authenticated)
    //luego guardamos el token en localStorage
    console.log({user, token})
    localStorage.setItem('token', token)
    return true;
  }

  login(email: string, password: string): Observable<boolean> {
    const url = `${this.baseUrl}auth/login`;
    const body = {email, password};
    return this.http.post<LoginResponse>(url, body)
      .pipe(
        map(({user, token}) => this.setAuthentication(user, token)),
        //TODO ESTE CODIGO LO HEMOS SIMPLIFICADO CON LA FUNCION DE ARRIBA
        //usando el tap vamos a lanzar varios efectos secundarios, desestructuramos
        //la rspuesta y obtenemos el usuario y token
        // tap(({user, token}) => {
        //a nuestra señal _currentUser le asignamos el usuario
        // this._currentUser.set(user);
        //y cambiamos el valor de nuestro _authStatus
        // this._authStatus.set(AuthStatus.authenticated)
        //luego guardamos el token en localStorage
        // console.log({user, token})
        // localStorage.setItem('token', token)
        // }),
        //luego usando el map transformamos la peticion a un true ya que esto es lo que nos pide que regresemos nuestra funcion
        // map(() => true),
        //TODO: ERRORES
        //con el catchError vamos a capturar todos los errores que sucedan en nuestra peticion
        catchError(err => {
          console.log(err)
          //el throwError es una forma de decirle a angular que algo salio mal y espera una funcion como parametro
          //esto va a ser lo que devuelva y lo que vamos a recibir en el componente donde hacemos la peticion a nuestro servicio
          //EN ESTE CASO PODEMOS OBTENER EL MENSAJE DE NUESTRO ERROR
          return throwError(() => err.error.message)
        })
      )
  }

  checkAuthStatus(): Observable<boolean> {
    const url = `${this.baseUrl}auth/check-token`;
    const token = localStorage.getItem('token')
    if (!token) {
      this.logout()
      return of(false);
    }
    //para enviar los headers vamos a usar la clase HttpHeaders y creamos una instancia
    //de esta clase podemos usar el metodo set que pide como primer parametro el nombre de header(Authorization)
    //luego como segundo parametro el tipo de header en este caso es Bearer y agregamos el token
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
    return this.http.get<CheckTokenResponse>(url, {headers})
      .pipe(
        map(({token, user}) => {
          //a nuestra señal _currentUser le asignamos el usuario
          this._currentUser.set(user);
          //y cambiamos el valor de nuestro _authStatus
          this._authStatus.set(AuthStatus.authenticated)
          //luego guardamos el token en localStorage
          console.log({user, token})
          localStorage.setItem('token', token)
          return true
        }),
        //si es que ocurre algun error  entonces lo atrapamos con el catchError
        catchError(() => {
          this._authStatus.set(AuthStatus.notAuthenticated)
          return of(false)
        })
      )
  }

  logout(): Observable<boolean> {
    const token = localStorage.getItem('token')
    if (!token) {
      this._authStatus.set(AuthStatus.notAuthenticated)
      return of(false);
    }
    this._currentUser.set(null)
    this._authStatus.set(AuthStatus.notAuthenticated)
    localStorage.removeItem('token')
    return of(true)
  }
}
