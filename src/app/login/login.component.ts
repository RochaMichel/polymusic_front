import { Component, OnInit, ViewChild } from "@angular/core";
import { PoDialogService,  PoModalComponent } from "@po-ui/ng-components";
import { PoModalPasswordRecoveryComponent } from "@po-ui/ng-templates";
import { AuthService } from "./auth.service";
import { Usuario } from "./usuario";
import { Router } from "@angular/router";
import { ListaDeperfildeacessoService } from "../perfil-de-acesso/perfil-de-acesso.service";
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  usuario: Usuario = new Usuario();
  user!: string;
  password!: string;
  isHideLoading: Boolean = true;
  constructor(
    private authService: AuthService,
    private listaPerfilAcessoService: ListaDeperfildeacessoService,
    private poDialog: PoDialogService,
    private router: Router
  ) {}

  ngOnInit() {
    if(sessionStorage.getItem('token')) {
      this.router.navigate(['/grafico']);
    }
  }

  @ViewChild(PoModalPasswordRecoveryComponent)
  poModalPasswordRecovery!: PoModalPasswordRecoveryComponent;
  @ViewChild(PoModalComponent, { static: true }) poModal!: PoModalComponent;

  ClickLogin() {
    this.isHideLoading = false;
    this.usuario.user = this.user;
    //this.usuario.senha = btoa(this.password); //com Base64
    this.usuario.senha = this.password; //sem Base64
    this.isHideLoading = this.authService.ClickLogin(this.usuario);
    this.isHideLoading = true;
  }

  EnviaEmail(email: { email: string }) {
    //console.log(email.email);
    this.authService
      .enviaEmail(email.email)
      .subscribe((response) => {
        this.poDialog.alert({ title: "Recuperação de senha", message: response.status });
      });
    this.poModalPasswordRecovery.completed();
  }
}
