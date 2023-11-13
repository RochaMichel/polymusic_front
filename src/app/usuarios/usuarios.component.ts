import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PoModalAction, PoModalComponent, PoNotificationService, PoTableColumn } from '@po-ui/ng-components';
import { ListaDeUsuariosService } from './usuarios.service';
import { ListaDeperfildeacessoService } from '../perfil-de-acesso/perfil-de-acesso.service';
import { Exportacao } from '../exportacao/exportacao.service';
import { ListaDeLogService } from '../log/log.service';
@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent {
  constructor(
    private poNotification: PoNotificationService,
    private listausuariosService: ListaDeUsuariosService,
    private listaDePerfilService: ListaDeperfildeacessoService,
    private ListaLogService: ListaDeLogService,
    private exportacao: Exportacao,
    private router: Router
  ) { }
  tipoExport: string = '';
  tipoCliente!: string;
  //usuarios: Array<any> = new Array();
  usuarios: Array<any> = new Array();
  Usuarios: object | undefined;
  listaUsuarios: Array<any> = new Array();
  perfil_de_acesso: Array<any> = new Array();
  acoes: Array<any> = new Array();
  criar = sessionStorage.getItem('lcria_usuario');
  Usuario: any;
  usuarioId!: number;
  altera: boolean = false;
  usuario!: string;
  id!: number;
  nome!: string;
  senha!: string;
  confirmaSenha!: string;
  email!: string;
  cpf!: string;
  perfil_acesso!: number;
  telefone_comercial!: string;
  telefone_celular!: string;
  site!: string;
  cep!: string;
  logradouro!: string;
  numero!: string;
  complemento!: string;
  bairro!: string;
  uf!: string;
  cidade!: string;

  @ViewChild("modalUsuario", { static: true }) modalUsuario!: PoModalComponent;
  @ViewChild("modalUsuarioView", { static: true }) modalUsuarioView!: PoModalComponent;
  @ViewChild('modalExport', { static: true }) modalExport!: PoModalComponent;
  ngOnInit(): void {
    this.carregaLista();
    this.usuarioPerfil();
  }

  public readonly colunas: Array<PoTableColumn> = [
    { property: "id", label: "ID", width: "10%" },
    { property: "usuario", label: "Usuario", width: "30%" },
    { property: "nome", label: "Nome", width: "30%" },
    { property: "cpf", label: "CPF", width: "15%" },
    { property: "email", label: "E-mail", width: "25%" },
    { property: "perfil_acesso", label: "Perfil de acesso", width: "15%" },
    { property: "telefone_celular", label: "Telefone celular", width: "15%" },
    { property: "site", label: "Site", width: "15%" },
    { property: "cep", label: "CEP", width: "15%" },
    { property: "uf", label: "Uf", width: "15%" },
    {
      property: "acoes",
      label: "Ações",
      type: "icon",
      width: "5%",
      icons: this.icons(),
    },
  ];

  icons(): Array<any> {
    this.acoes.push({
      action: this.visualizar.bind(this),
      icon: "po-icon po-icon-eye",
      value: "2",
    });
    if (sessionStorage.getItem('laltera_usuario') === 'true') {
      this.acoes.push({
        action: this.Alterar.bind(this),
        icon: "po-icon po-icon-edit",
        value: "1",
      });
    }
    if (sessionStorage.getItem('lexclui_usuario') === 'true') {
      this.acoes.push({
        action: this.excluir.bind(this),
        icon: "po-icon po-icon-delete",
        value: "3"
      });
    }
    return this.acoes;
  }

  criarUsuario() {
    this.usuario = '';
    this.nome = '';
    this.senha = '';
    console.log("nome do perfil" + sessionStorage.getItem('nome_perfil'))
    this.confirmaSenha = '';
    this.email = '';
    this.cpf = '';
    this.perfil_acesso = 0;
    this.telefone_comercial = '';
    this.telefone_celular = '';
    this.site = '';
    this.cep = '';
    this.logradouro = '';
    this.numero = '';
    this.complemento = '';
    this.bairro = '';
    this.uf = '';
    this.cidade = '';
    this.modalUsuario.open();
  }

  usuarioPerfil() {
    this.listaDePerfilService
      .listaPerfilDeAcesso()
      .subscribe((resposta) => {
        for (let index = 0; index < resposta.length; index++) {
          if (resposta[index].bloqueado === 'N') {
            this.perfil_de_acesso.push(
              {
                label: resposta[index].nome_perfil,
                value: resposta[index].id,
              }
            )
          }
        }
      })
  }

  excluir(usuario: any) {
    if (confirm("Deseja excluir o usuario?")) {
      this.listausuariosService
        .excluirUsuario(usuario.id)
        .subscribe((resposta) => {
          if (resposta.error) {
            this.poNotification.error(resposta.error.retorno);
          } else {
            this.poNotification.success(resposta.retorno);
            this.ngOnInit();
          }
        })
    }
  }

  Alterar(usuarios: any) {
    this.usuarioId = usuarios.id;
    this.listausuariosService
      .carregarUsuario(usuarios.id)
      .subscribe((resposta) => {
        this.perfil_acesso = resposta.perfil_acesso
        this.nome = resposta.nome
        this.usuario = resposta.usuario
        this.senha = resposta.senha
        this.email = resposta.email
        this.telefone_comercial = resposta.telefone_comercial
        this.telefone_celular = resposta.telefone_celular
        this.cpf = resposta.cpf
        this.site = resposta.site
        this.cep = resposta.cep
        this.logradouro = resposta.logradouro
        this.numero = resposta.numero
        this.complemento = resposta.complemento
        this.bairro = resposta.bairro
        this.uf = resposta.uf
        this.cidade = resposta.cidade
        this.altera = true;
        this.modalUsuario.open();
      })
  }

  visualizar(usuarios: any) {
    this.usuarioId = usuarios.id;
    this.listausuariosService
      .carregarUsuario(usuarios.id)
      .subscribe((resposta) => {
        this.perfil_acesso = resposta.perfil_acesso
        this.nome = resposta.nome
        this.usuario = resposta.usuario
        this.senha = resposta.senha
        this.email = resposta.email
        this.telefone_comercial = resposta.telefone_comercial
        this.telefone_celular = resposta.telefone_celular
        this.cpf = resposta.cpf
        this.site = resposta.site
        this.cep = resposta.cep
        this.logradouro = resposta.logradouro
        this.numero = resposta.numero
        this.complemento = resposta.complemento
        this.bairro = resposta.bairro
        this.uf = resposta.uf
        this.cidade = resposta.cidade
        this.modalUsuarioView.open();
      })
  }
  async carregaLista() {
    this.usuarios = [];
    this.listaUsuarios = [];
    await this.listausuariosService
      .listaUsuarios()
      .subscribe((resposta) => {
        for (let index = 0; index < resposta.length; index++) {
          if (resposta[index].bloqueado === 'N') {
            this.usuarios.push(
              {
                id: resposta[index].id,
                usuario: resposta[index].usuario,
                nome: resposta[index].nome,
                cpf: resposta[index].cpf,
                email: resposta[index].email,
                perfil_acesso: resposta[index].Perfil_acesso.nome_perfil,
                telefone_celular: resposta[index].telefone_celular,
                site: resposta[index].site,
                cep: resposta[index].cep,
                numero: resposta[index].numero,
                bairro: resposta[index].bairro,
                uf: resposta[index].uf,
                acoes: ["1", "2", "3"]
              }
            )
          }
        }
        this.listaUsuarios = this.usuarios;
      })
  }
  getDataEHoraAtual(): string {
    const dataEHora = new Date();
    const dia = String(dataEHora.getDate()).padStart(2, '0');
    const mes = String(dataEHora.getMonth() + 1).padStart(2, '0');
    const ano = dataEHora.getFullYear();
    const hora = String(dataEHora.getHours()).padStart(2, '0');
    const minutos = String(dataEHora.getMinutes()).padStart(2, '0');
    const segundos = String(dataEHora.getSeconds()).padStart(2, '0');
    return `${dia}/${mes}/${ano} ${hora}:${minutos}:${segundos}`;

  }
  buscaUsuario(): void {
    if (this.Usuario) {
      this.listausuariosService
        .buscarUsuario(this.Usuario)
        .subscribe((resposta) => {
          this.usuarios = [];
          this.listaUsuarios = [];
          for (let index = 0; index < resposta.length; index++) {
            if (resposta[index].bloqueado === 'N') {
              this.usuarios.push(
                {
                  id: resposta[index].id,
                  usuario: resposta[index].usuario,
                  nome: resposta[index].nome,
                  cpf: resposta[index].cpf,
                  email: resposta[index].email,
                  perfil_acesso: resposta[index].Perfil_acesso.nome_perfil,
                  telefone_celular: resposta[index].telefone_celular,
                  site: resposta[index].site,
                  cep: resposta[index].cep,
                  numero: resposta[index].numero,
                  bairro: resposta[index].bairro,
                  uf: resposta[index].uf,
                  acoes: ["1", "2", "3"]
                }
              )
            }
          }
          this.listaUsuarios = this.usuarios;
        })
    }
    this.carregaLista();
  }

  confirmaUsuario: PoModalAction = {
    action: () => {
      if (this.altera) {
        let Log = {
          descricao_log: 'usuario com ID: ' + this.usuarioId + ' alterado pelo usuario: ' + sessionStorage.getItem('usuario') + ', com ID: ' + sessionStorage.getItem('id'),
          data_log: this.getDataEHoraAtual(),
        }
        this.Usuarios = {
          usuario: this.usuario,
          id: this.usuarioId,
          nome: this.nome,
          senha: this.senha,
          confirmaSenha: this.confirmaSenha,
          perfil_acesso: this.perfil_acesso,
          cpf: this.cpf,
          telefone_comercial: this.telefone_comercial,
          telefone_celular: this.telefone_celular,
          email: this.email,
          site: this.site,
          cep: this.cep,
          logradouro: this.logradouro,
          numero: this.numero,
          complemento: this.complemento,
          bairro: this.bairro,
          uf: this.uf,
          cidade: this.cidade,
        }
        this.listausuariosService
          .alterarUsuario(this.Usuarios)
          .subscribe((res) => {
            this.poNotification.success(res.retorno);
            this.ListaLogService
              .criarLog(Log)
              .subscribe((res) => {
                this.ngOnInit();
                this.altera = false;
                this.modalUsuario.close();
              })
          },
            (err) => {
              this.poNotification.error(err.error.retorno);
              this.altera = false;
              this.ngOnInit();
              this.modalUsuario.close();
            })
      } else {
        let Log = {
          descricao_log: 'usuario: ' + this.usuario + ' alterado pelo usuario: ' + sessionStorage.getItem('usuario') + ', com ID: ' + sessionStorage.getItem('id'),
          data_log: this.getDataEHoraAtual(),
        }
        this.Usuarios = {
          usuario: this.usuario,
          nome: this.nome,
          senha: this.senha,
          email: this.email,
          cpf: this.cpf,
          perfil_acesso: this.perfil_acesso,
          telefone_comercial: this.telefone_comercial,
          telefone_celular: this.telefone_celular,
          site: this.site,
          cep: this.cep,
          logradouro: this.logradouro,
          numero: this.numero,
          complemento: this.complemento,
          bairro: this.bairro,
          uf: this.uf,
          cidade: this.cidade,
        }
        if (this.usuario != '' && this.nome != '' && this.cpf != '') {
          if (this.senha == this.confirmaSenha) {
            if (this.senha != '') {
              this.listausuariosService
                .criarUsuario(this.Usuarios)
                .subscribe((res) => {
                  this.poNotification.success(res.retorno);
                  this.ListaLogService
                    .criarLog(Log)
                    .subscribe((res) => {
                      this.ngOnInit();
                      this.modalUsuario.close();
                    })
                },
                  (err) => {
                    this.poNotification.error(err.error.retorno);
                    this.ngOnInit();
                    this.modalUsuario.close();
                  })
            } else {
              this.poNotification.error('Insira uma senha')
            }
          } else {
            this.poNotification.error('As senhas precisam ser iguais')
          }
        } else {
          this.poNotification.error('Preencha nome, usuário e CPF')
        }
      }
    },
    label: "Confirmar"
  };
  Exportacao() {
    this.modalExport.open();
  }
  cancelarUsuario: PoModalAction = {
    action: () => {
      this.nome = '';
      this.cpf = '';
      this.email = '';
      this.tipoCliente = '';
      this.email = '';
      this.site = '';
      this.cep = '';
      this.logradouro = '';
      this.numero = '';
      this.complemento = '';
      this.bairro = '';
      this.uf = '';
      this.cidade = '';
      this.modalUsuario.close();
      this.altera = false;
    },
    label: "Cancelar"
  };

  confirmaExportacao: PoModalAction = {
    action: () => {
      this.exportacao
        .exportData(this.tipoExport, this.listaUsuarios, this.colunas
        );
    },
    label: "Confirma"
  };

}
