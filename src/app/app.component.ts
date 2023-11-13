import { Component } from '@angular/core';
import { AuthGuard } from './guards/auth-guard';
import { PoMenuItem, PoNavbarIconAction } from '@po-ui/ng-components';
import { AuthService } from './login/auth.service';
import { Router } from '@angular/router';
import { NgSwitchCase } from '@angular/common';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  menuItemSelected: string = '';
  nome: any = sessionStorage.getItem("nome");
  mostrarMenu: boolean = false;
  array_itens: Array<any> = new Array();
  constructor(
    private authGuard: AuthGuard,
    private router: Router,
    private authService: AuthService
  ) { }

   itens(): Array<any> {
    if (sessionStorage.getItem('lvisualiza_usuario') === 'true') {
      this.array_itens.push(
        { label: 'Usuarios', link: '/usuarios' },
      );
    }
    if (sessionStorage.getItem('lvisualiza_perfil_acesso') === 'true') {
      this.array_itens.push(
        { label: 'Perfil de acesso', link: '/perfil-de-acesso' },
      );
    }
    if (sessionStorage.getItem('lvisualiza_artistas') === 'true') {
      this.array_itens.push(
        { label: 'Artistas', link: '/artistas' },
      );
    }
    if (sessionStorage.getItem('lvisualiza_musica') === 'true') {
      this.array_itens.push(
        { label: 'Musicas', link: '/musicas' },
      );
    }
    if (sessionStorage.getItem('lvisualiza_editoras')=== 'true') {
      this.array_itens.push(
        { label: 'Editoras', link: '/editoras' },
      );
    }
    if (sessionStorage.getItem('lvisualiza_etiquetas')=== 'true') {
      this.array_itens.push(
        { label: 'Etiquetas', link: '/etiquetas' },
      );
    }
    if (sessionStorage.getItem('lvisualiza_gravadoras')=== 'true') {
      this.array_itens.push(
        { label: 'Gravadoras', link: '/gravadoras' },
      );
    }
    if (sessionStorage.getItem('lvisualiza_nomes')=== 'true') {
      this.array_itens.push(
        { label: 'Nomes', link: '/nomes' },
      );
    }
    if (sessionStorage.getItem('lvisualiza_tapes')=== 'true') {
      this.array_itens.push(
        { label: 'Tapes', link: '/tapes' },
      );
    }
    if (sessionStorage.getItem('lvisualiza_tipo_tapes')=== 'true') {
      this.array_itens.push(
        { label: 'Tipos de tapes', link: '/tipos-de-tapes' },
      );
    }
    return this.array_itens;
  }
  tape(): string {
    let link = ''
    if (sessionStorage.getItem('lvisualiza_tapes')=== 'true') {
    link = "/tapes"
    }
    return link
  }
  readonly menus: Array<PoMenuItem> = [
    { 
      label: 'Cadastros Gerais',
      icon: 'po-icon po-icon-clipboard',
      shortLabel: 'Cadastros',
      subItems: this.itens(),
    },
  ];
  readonly navActions: Array<PoNavbarIconAction> = [
    {
      icon: "po-icon po-icon-cart",
      label: "Tapes",
      link: this.tape(),
      tooltip: "Tapes"
    },
    // { icon:'po-icon po-icon-users', label: 'Clientes', link: '/customer-list', tooltip: "Clientes" },
    {
      icon: "po-icon po-icon-exit",
      label: "Sair",
      action: () => this.fazerLogout(),
      tooltip: "Sair"
    }
  ]

  ngOnInit() {
    this.authGuard.mostrarMenuEmitter.subscribe(
      (mostrar) => (this.mostrarMenu == mostrar)
    );
    this.authGuard.usuarioAtivo.subscribe((resposta: boolean) => (this.mostrarMenu = resposta));
  }

  fazerLogout() {
    if (confirm("Deseja mesmo sair de sua conta?")) {
      this.authService.fazerLogout();
      window.location.reload();
    }
  }

  poMenus() {
    return this.menus;
  }
}