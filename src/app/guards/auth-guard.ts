import { Injectable, EventEmitter } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from "@angular/router";
import { Observable } from "rxjs";

@Injectable()
export class AuthGuard implements CanActivate {
  mostrarMenuEmitter = new EventEmitter<boolean>();
  usuarioAtivo = new EventEmitter<boolean>();
  constructor(private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {

    if (sessionStorage.getItem('token')) {
      this.usuarioAtivo.emit(true);
      this.mostrarMenuEmitter.emit(true);
      return true;
    } else {
      this.router.navigate(['/'])
      return false;
    }

  }
}
