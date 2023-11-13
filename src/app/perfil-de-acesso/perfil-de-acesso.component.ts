import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PoModalAction, PoModalComponent, PoNotificationService, PoTableColumn } from '@po-ui/ng-components';
import { ListaDeperfildeacessoService } from './perfil-de-acesso.service';
import { Exportacao } from '../exportacao/exportacao.service';
import { ListaDeLogService } from '../log/log.service';
@Component({
  selector: 'app-perfil-de-acesso',
  templateUrl: './perfil-de-acesso.component.html',
  styleUrls: ['./perfil-de-acesso.component.css']
})
export class perfildeacessoComponent {
  constructor(
    private poNotification: PoNotificationService,
    private listaperfildeacessoService: ListaDeperfildeacessoService,
    private ListaLogService: ListaDeLogService,
    private exportacao: Exportacao,
    private router: Router
  ) { }

  tipoExport: string = '';
  usuarios: Array<any> = new Array();
  perfils: Array<any> = new Array();
  acoes: Array<any> = new Array();
  criar = sessionStorage.getItem('lcria_perfil_acesso');
  perfilDeAcesso: object | undefined;
  listaPerfilDeAcesso: Array<any> = new Array();
  PerfilDeAcesso: any;
  perfilDeAcessoId!: number;
  altera: boolean = false;
  nome_perfil!: string;
  altArtista!: boolean;
  criArtista!: boolean;
  excArtista!: boolean;
  visArtista!: boolean;
  altEditoras!: boolean;
  criEditoras!: boolean;
  excEditoras!: boolean;
  visEditoras!: boolean;
  altEtiqueta!: boolean;
  criEtiqueta!: boolean;
  excEtiqueta!: boolean;
  visEtiqueta!: boolean;
  altGravadora!: boolean;
  criGravadora!: boolean;
  excGravadora!: boolean;
  visGravadora!: boolean;
  altNomes!: boolean;
  criNomes!: boolean;
  excNomes!: boolean;
  visNomes!: boolean;
  altTapes!: boolean;
  criTapes!: boolean;
  excTapes!: boolean;
  visTapes!: boolean;
  altTipoTapes!: boolean;
  criTipoTapes!: boolean;
  excTipoTapes!: boolean;
  visTipoTapes!: boolean;
  altUsuarios!: boolean;
  criUsuarios!: boolean;
  excUsuarios!: boolean;
  visUsuarios!: boolean;
  altMusicas!: boolean;
  criMusicas!: boolean;
  excMusicas!: boolean;
  visMusicas!: boolean;
  altPerfilAcesso!: boolean;
  criPerfilAcesso!: boolean;
  excPerfilAcesso!: boolean;
  visPerfilAcesso!: boolean;

  @ViewChild("modalPerfilDeAcesso", { static: true }) modalPerfilDeAcesso!: PoModalComponent;
  @ViewChild("modalPerfilDeAcessoView", { static: true }) modalPerfilDeAcessoView!: PoModalComponent;
  @ViewChild('modalExport', { static: true }) modalExport!: PoModalComponent;
  ngOnInit(): void {
    this.carregaLista();
  }

  public readonly colunas: Array<PoTableColumn> = [
    { property: "id", label: "ID", width: "5%" },
    { property: "nome_perfil", label: "Nome do perfil", width: "42%" },
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
    if (sessionStorage.getItem('laltera_perfil_acesso') === 'true') {
      this.acoes.push({
        action: this.Alterar.bind(this),
        icon: "po-icon po-icon-edit",
        value: "1",
      });
    }
    if (sessionStorage.getItem('lexclui_perfil_acesso') === 'true') {
      this.acoes.push({
        action: this.excluir.bind(this),
        icon: "po-icon po-icon-delete",
        value: "3"
      });
    }
    return this.acoes;
  }

  criarPerfilDeAcesso() {
    this.nome_perfil = '';
    this.altArtista = false;
    this.criArtista = false;
    this.excArtista = false;
    this.visArtista = false;
    this.altEditoras = false;
    this.criEditoras = false;
    this.excEditoras = false;
    this.visEditoras = false;
    this.altEtiqueta = false;
    this.criEtiqueta = false;
    this.excEtiqueta = false;
    this.visEtiqueta = false;
    this.altGravadora = false;
    this.criGravadora = false;
    this.excGravadora = false;
    this.visGravadora = false;
    this.altNomes = false;
    this.criNomes = false;
    this.excNomes = false;
    this.visNomes = false;
    this.altTapes = false;
    this.criTapes = false;
    this.excTapes = false;
    this.visTapes = false;
    this.altTipoTapes = false;
    this.criTipoTapes = false;
    this.excTipoTapes = false;
    this.visTipoTapes = false;
    this.altUsuarios = false;
    this.criUsuarios = false;
    this.excUsuarios = false;
    this.visUsuarios = false;
    this.altMusicas = false;
    this.criMusicas = false;
    this.excMusicas = false;
    this.visMusicas = false;
    this.altPerfilAcesso = false;
    this.criPerfilAcesso = false;
    this.excPerfilAcesso = false;
    this.visPerfilAcesso = false;
    this.modalPerfilDeAcesso.open();
  }

  excluir(perfilDeAcessoId: any) {
    if (confirm("Deseja excluir o perfil de acesso?")) {
      let Log = {
        descricao_log: 'Perfil de acesso com ID: ' + perfilDeAcessoId.id + ' excluido pelo usuario: ' + sessionStorage.getItem('usuario') + ', com ID: ' + sessionStorage.getItem('id'),
        data_log: this.getDataEHoraAtual(),
      }
      this.listaperfildeacessoService
        .excluirPerfilDeAcesso(perfilDeAcessoId.id)
        .subscribe((res) => {
          this.poNotification.success(res.retorno);
          this.ListaLogService
            .criarLog(Log)
            .subscribe((res) => {
              this.ngOnInit();
            })
        },
          (err) => {
            this.poNotification.error(err.error.retorno);
            this.ngOnInit();
          })
    }
  }


  Alterar(AcessoId: any) {
    this.perfilDeAcessoId = AcessoId.id;
    this.listaperfildeacessoService
      .carregarPerfilDeAcesso(AcessoId.id)
      .subscribe((resposta) => {
        this.nome_perfil = resposta.nome_perfil,
          this.altArtista = resposta.laltera_artistas,
          this.criArtista = resposta.lcria_artistas,
          this.excArtista = resposta.lexclui_artistas,
          this.visArtista = resposta.lvisualiza_artistas,
          this.altEditoras = resposta.laltera_etiquetas,
          this.criEditoras = resposta.lcria_etiquetas,
          this.excEditoras = resposta.lexclui_etiquetas,
          this.visEditoras = resposta.lvisualiza_etiquetas,
          this.altEtiqueta = resposta.laltera_editoras,
          this.criEtiqueta = resposta.lcria_editoras,
          this.excEtiqueta = resposta.lexclui_editoras,
          this.visEtiqueta = resposta.lvisualiza_editoras,
          this.altGravadora = resposta.laltera_gravadoras,
          this.criGravadora = resposta.lcria_gravadoras,
          this.excGravadora = resposta.lexclui_gravadoras,
          this.visGravadora = resposta.lvisualiza_gravadoras,
          this.altNomes = resposta.laltera_nomes,
          this.criNomes = resposta.lcria_nomes,
          this.excNomes = resposta.lexclui_nomes,
          this.visNomes = resposta.lvisualiza_nomes,
          this.altTapes = resposta.laltera_tapes,
          this.criTapes = resposta.lcria_tapes,
          this.excTapes = resposta.lexclui_tapes,
          this.visTapes = resposta.lvisualiza_tapes,
          this.altTipoTapes = resposta.laltera_tipo_tapes,
          this.criTipoTapes = resposta.lcria_tipo_tapes,
          this.excTipoTapes = resposta.lexclui_tipo_tapes,
          this.visTipoTapes = resposta.lvisualiza_tipo_tapes,
          this.altMusicas = resposta.laltera_musica,
          this.criMusicas = resposta.lcria_musica,
          this.excMusicas = resposta.lexclui_musica,
          this.visMusicas = resposta.lvisualiza_musica,
          this.altUsuarios = resposta.laltera_usuario,
          this.criUsuarios = resposta.lcria_usuario,
          this.excUsuarios = resposta.lexclui_usuario,
          this.visUsuarios = resposta.lvisualiza_usuario,
          this.altPerfilAcesso = resposta.laltera_perfil_acesso,
          this.criPerfilAcesso = resposta.lcria_perfil_acesso,
          this.excPerfilAcesso = resposta.lexclui_perfil_acesso,
          this.visPerfilAcesso = resposta.lvisualiza_perfil_acesso,
          this.altera = true;
        this.modalPerfilDeAcesso.open();
      })
  }

  async carregaLista() {
    this.perfils = [];
    await this.listaperfildeacessoService
      .listaPerfilDeAcesso()
      .subscribe((resposta) => {
        for (let index = 0; index < resposta.length; index++) {
          if (resposta[index].bloqueado === 'N') {
            this.perfils.push(
              {
                id: resposta[index].id,
                nome_perfil: resposta[index].nome_perfil,
                acoes: ["1", "2", "3"]
              }
            )
          }
        }
        this.listaPerfilDeAcesso = this.perfils;
      })
  }
  visualizar(AcessoId: any) {
    this.perfilDeAcessoId = AcessoId.id;
    this.listaperfildeacessoService
      .carregarPerfilDeAcesso(AcessoId.id)
      .subscribe((resposta) => {
        this.nome_perfil = resposta.nome_perfil,
          this.altArtista = resposta.laltera_artistas,
          this.criArtista = resposta.lcria_artistas,
          this.excArtista = resposta.lexclui_artistas,
          this.visArtista = resposta.lvisualiza_artistas,
          this.altEditoras = resposta.laltera_etiquetas,
          this.criEditoras = resposta.lcria_etiquetas,
          this.excEditoras = resposta.lexclui_etiquetas,
          this.visEditoras = resposta.lvisualiza_etiquetas,
          this.altEtiqueta = resposta.laltera_editoras,
          this.criEtiqueta = resposta.lcria_editoras,
          this.excEtiqueta = resposta.lexclui_editoras,
          this.visEtiqueta = resposta.lvisualiza_editoras,
          this.altGravadora = resposta.laltera_gravadoras,
          this.criGravadora = resposta.lcria_gravadoras,
          this.excGravadora = resposta.lexclui_gravadoras,
          this.visGravadora = resposta.lvisualiza_gravadoras,
          this.altNomes = resposta.laltera_nomes,
          this.criNomes = resposta.lcria_nomes,
          this.excNomes = resposta.lexclui_nomes,
          this.visNomes = resposta.lvisualiza_nomes,
          this.altTapes = resposta.laltera_tapes,
          this.criTapes = resposta.lcria_tapes,
          this.excTapes = resposta.lexclui_tapes,
          this.visTapes = resposta.lvisualiza_tapes,
          this.altTipoTapes = resposta.laltera_tipo_tapes,
          this.criTipoTapes = resposta.lcria_tipo_tapes,
          this.excTipoTapes = resposta.lexclui_tipo_tapes,
          this.visTipoTapes = resposta.lvisualiza_tipo_tapes,
          this.altMusicas = resposta.laltera_musica,
          this.criMusicas = resposta.lcria_musica,
          this.excMusicas = resposta.lexclui_musica,
          this.visMusicas = resposta.lvisualiza_musica,
          this.altUsuarios = resposta.laltera_usuario,
          this.criUsuarios = resposta.lcria_usuario,
          this.excUsuarios = resposta.lexclui_usuario,
          this.visUsuarios = resposta.lvisualiza_usuario,
          this.altPerfilAcesso = resposta.laltera_perfil_acesso,
          this.criPerfilAcesso = resposta.lcria_perfil_acesso,
          this.excPerfilAcesso = resposta.lexclui_perfil_acesso,
          this.visPerfilAcesso = resposta.lvisualiza_perfil_acesso
        this.modalPerfilDeAcessoView.open();
      })
  }

  buscarPerfilDeAcesso(): void {
    if (this.PerfilDeAcesso) {
      this.listaperfildeacessoService
        .buscarPerfilDeAcesso(this.PerfilDeAcesso)
        .subscribe((resposta) => {
          this.perfils = [];
          for (let index = 0; index < resposta.length; index++) {
            if (resposta[index].bloqueado === 'N') {
              this.perfils.push(
                {
                  id: resposta[index].id,
                  nome_perfil: resposta[index].nome_perfil,
                  acoes: ["1", "2", "3"]
                }
              )
            }
          }
          this.listaPerfilDeAcesso = this.perfils;
        })
    }
    this.carregaLista();
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

  confirmaPerdilDeAcesso: PoModalAction = {
    action: () => {
      if (this.altera) {
        let Log = {
          descricao_log: 'Perfil de acesso: ' + this.nome_perfil + ' alterado pelo usuario: ' + sessionStorage.getItem('usuario') + ', com ID: ' + sessionStorage.getItem('id'),
          data_log: this.getDataEHoraAtual(),
        }
        this.perfilDeAcesso = {
          id: this.perfilDeAcessoId,
          nome_perfil: this.nome_perfil,
          laltera_artistas: this.altArtista,
          lcria_artistas: this.criArtista,
          lexclui_artistas: this.excArtista,
          lvisualiza_artistas: this.visArtista,
          laltera_etiquetas: this.altEditoras,
          lcria_etiquetas: this.criEditoras,
          lexclui_etiquetas: this.excEditoras,
          lvisualiza_etiquetas: this.visEditoras,
          laltera_editoras: this.altEtiqueta,
          lcria_editoras: this.criEtiqueta,
          lexclui_editoras: this.excEtiqueta,
          lvisualiza_editoras: this.visEtiqueta,
          laltera_gravadoras: this.altGravadora,
          lcria_gravadoras: this.criGravadora,
          lexclui_gravadoras: this.excGravadora,
          lvisualiza_gravadoras: this.visGravadora,
          laltera_nomes: this.altNomes,
          lcria_nomes: this.criNomes,
          lexclui_nomes: this.excNomes,
          lvisualiza_nomes: this.visNomes,
          laltera_tapes: this.altTapes,
          lcria_tapes: this.criTapes,
          lexclui_tapes: this.excTapes,
          lvisualiza_tapes: this.visTapes,
          laltera_tipo_tapes: this.altTipoTapes,
          lcria_tipo_tapes: this.criTipoTapes,
          lexclui_tipo_tapes: this.excTipoTapes,
          lvisualiza_tipo_tapes: this.visTipoTapes,
          laltera_musica: this.altMusicas,
          lcria_musica: this.criMusicas,
          lexclui_musica: this.excMusicas,
          lvisualiza_musica: this.visMusicas,
          laltera_usuario: this.altUsuarios,
          lcria_usuario: this.criUsuarios,
          lexclui_usuario: this.excUsuarios,
          lvisualiza_usuario: this.visUsuarios,
          laltera_perfil_acesso: this.altPerfilAcesso,
          lcria_perfil_acesso: this.criPerfilAcesso,
          lexclui_perfil_acesso: this.excPerfilAcesso,
          lvisualiza_perfil_acesso: this.visPerfilAcesso
        }
        this.listaperfildeacessoService
          .alterarPerfilDeAcesso(this.perfilDeAcesso)
          .subscribe((res) => {
            this.poNotification.success(res.retorno);
            this.ListaLogService
              .criarLog(Log)
              .subscribe((res) => {
                this.ngOnInit();
                this.altera = false;
                this.modalPerfilDeAcesso.close();
              })
          },
            (err) => {
              this.poNotification.error(err.error.retorno);
              this.altera = false;
              this.ngOnInit();
              this.modalPerfilDeAcesso.close();
            })
      } else {
        let Log = {
          descricao_log: 'Perfil de acesso: ' + this.nome_perfil + ' criado pelo usuario: ' + sessionStorage.getItem('usuario') + ', com ID: ' + sessionStorage.getItem('id'),
          data_log: this.getDataEHoraAtual(),
        }
        this.perfilDeAcesso = {
          nome_perfil: this.nome_perfil,
          laltera_artistas: this.altArtista,
          lcria_artistas: this.criArtista,
          lexclui_artistas: this.excArtista,
          lvisualiza_artistas: this.visArtista,
          laltera_etiquetas: this.altEditoras,
          lcria_etiquetas: this.criEditoras,
          lexclui_etiquetas: this.excEditoras,
          lvisualiza_etiquetas: this.visEditoras,
          laltera_editoras: this.altEtiqueta,
          lcria_editoras: this.criEtiqueta,
          lexclui_editoras: this.excEtiqueta,
          lvisualiza_editoras: this.visEtiqueta,
          laltera_gravadoras: this.altGravadora,
          lcria_gravadoras: this.criGravadora,
          lexclui_gravadoras: this.excGravadora,
          lvisualiza_gravadoras: this.visGravadora,
          laltera_nomes: this.altNomes,
          lcria_nomes: this.criNomes,
          lexclui_nomes: this.excNomes,
          lvisualiza_nomes: this.visNomes,
          laltera_tapes: this.altTapes,
          lcria_tapes: this.criTapes,
          lexclui_tapes: this.excTapes,
          lvisualiza_tapes: this.visTapes,
          laltera_tipo_tapes: this.altTipoTapes,
          lcria_tipo_tapes: this.criTipoTapes,
          lexclui_tipo_tapes: this.excTipoTapes,
          lvisualiza_tipo_tapes: this.visTipoTapes,
          laltera_musica: this.altMusicas,
          lcria_musica: this.criMusicas,
          lexclui_musica: this.excMusicas,
          lvisualiza_musica: this.visMusicas,
          laltera_usuario: this.altUsuarios,
          lcria_usuario: this.criUsuarios,
          lexclui_usuario: this.excUsuarios,
          lvisualiza_usuario: this.visUsuarios,
          laltera_perfil_acesso: this.altPerfilAcesso,
          lcria_perfil_acesso: this.criPerfilAcesso,
          lexclui_perfil_acesso: this.excPerfilAcesso,
          lvisualiza_perfil_acesso: this.visPerfilAcesso
        }
        if (this.nome_perfil != '') {
          this.listaperfildeacessoService
            .criarPerfilDeAcesso(this.perfilDeAcesso)
            .subscribe((res) => {
              this.poNotification.success(res.retorno);
              this.ListaLogService
                .criarLog(Log)
                .subscribe((res) => {
                  this.ngOnInit();
                  this.modalPerfilDeAcesso.close();
                })
            },
              (err) => {
                this.poNotification.error(err.error.retorno);
                this.ngOnInit();
                this.modalPerfilDeAcesso.close();
              })
        } else {
          this.poNotification.error('Preencha o nome do Perfil de acesso');
        }
      }

    },
    label: "Confirmar"
  };

  cancelarPerdilDeAcesso: PoModalAction = {
    action: () => {
      this.nome_perfil = '';
      this.altArtista = false;
      this.criArtista = false;
      this.excArtista = false;
      this.visArtista = false;
      this.altEditoras = false;
      this.criEditoras = false;
      this.excEditoras = false;
      this.visEditoras = false;
      this.altEtiqueta = false;
      this.criEtiqueta = false;
      this.excEtiqueta = false;
      this.visEtiqueta = false;
      this.altGravadora = false;
      this.criGravadora = false;
      this.excGravadora = false;
      this.visGravadora = false;
      this.altNomes = false;
      this.criNomes = false;
      this.excNomes = false;
      this.visNomes = false;
      this.altTapes = false;
      this.criTapes = false;
      this.excTapes = false;
      this.visTapes = false;
      this.altTipoTapes = false;
      this.criTipoTapes = false;
      this.excTipoTapes = false;
      this.visTipoTapes = false;
      this.altUsuarios = false;
      this.criUsuarios = false;
      this.excUsuarios = false;
      this.visUsuarios = false;
      this.altUsuarios = false;
      this.criUsuarios = false;
      this.excUsuarios = false;
      this.visUsuarios = false;
      this.altMusicas = false;
      this.criMusicas = false;
      this.excMusicas = false;
      this.visMusicas = false;
      this.altPerfilAcesso = false;
      this.criPerfilAcesso = false;
      this.excPerfilAcesso = false;
      this.visPerfilAcesso = false;
      this.modalPerfilDeAcesso.close();
      this.altera = false;
    },
    label: "Cancelar"
  };

  Exportacao() {
    this.modalExport.open();
  }

  confirmaExportacao: PoModalAction = {
    action: () => {
      this.exportacao
        .exportData(this.tipoExport, this.listaPerfilDeAcesso, this.colunas
        );
    },
    label: "Confirma"
  };

}
