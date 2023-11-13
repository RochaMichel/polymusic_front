import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PoModalAction, PoModalComponent, PoNotificationService, PoTableColumn } from '@po-ui/ng-components';
import { ListaDeTiposDeTapesService } from './tipos-de-tapes.service';
import { Exportacao } from '../exportacao/exportacao.service';
import { ListaDeLogService } from '../log/log.service';
@Component({
  selector: 'app-tipos-de-tapes',
  templateUrl: './tipos-de-tapes.component.html',
  styleUrls: ['./tipos-de-tapes.component.css']
})
export class TiposDeTapesComponent {
  constructor(
    private poNotification: PoNotificationService,
    private listaTiposDeTapesService: ListaDeTiposDeTapesService,
    private ListaLogService: ListaDeLogService,
    private exportacao: Exportacao,
    private router: Router
  ) { }

  tipoExport: string = '';
  tipoCliente!: string;
  usuarios: Array<any> = new Array();
  Tipo_de_tapes: Array<any> = new Array();
  acoes: Array<any> = new Array();
  criar = sessionStorage.getItem('lcria_tipo_tapes');
  tipo_de_tapes: object | undefined;
  listaTiposDeTapes: Array<any> = new Array();
  TipoDeTapes: any;
  tipos_de_tapesId!: number;
  altera: boolean = false;
  codigo!: string;
  descricao!: string;


  @ViewChild("modalTipoDeTapes", { static: true }) modalTipoDeTapes!: PoModalComponent;
  @ViewChild("modalTipoDeTapesView", { static: true }) modalTipoDeTapesView!: PoModalComponent;
  @ViewChild('modalExport', { static: true }) modalExport!: PoModalComponent;

  ngOnInit(): void {
    this.carregaLista();
  }

  public readonly colunas: Array<PoTableColumn> = [
    { property: "id", label: "ID", width: "10%" },
    { property: "codigo", label: "Codigo", width: "10%" },
    { property: "descricao", label: "Descrição", width: "80%" },
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
    if (sessionStorage.getItem('laltera_tipo_tapes') === 'true') {
      this.acoes.push({
        action: this.Alterar.bind(this),
        icon: "po-icon po-icon-edit",
        value: "1",
      });
    }
    if (sessionStorage.getItem('lexclui_tipo_tapes') === 'true') {
      this.acoes.push({
        action: this.excluir.bind(this),
        icon: "po-icon po-icon-delete",
        value: "3"
      });
    }
    return this.acoes;
  }

  criarTipoDeTapes() {
    this.descricao = '';
    this.codigo = '';
    this.modalTipoDeTapes.open();
  }

  excluir(tpDeTapes: any) {
    if (confirm("Deseja excluir o tipo de tape?")) {
      let Log = {
        descricao_log: 'Tipo de tape com ID: ' + tpDeTapes.id + ' excluido pelo usuario: ' + sessionStorage.getItem('usuario') + ', com ID: ' + sessionStorage.getItem('id'),
        data_log: this.getDataEHoraAtual(),
      }
      this.listaTiposDeTapesService
        .excluirTiposDeTapes(tpDeTapes.id)
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
  Alterar(tipo_de_tapes: any) {
    this.tipos_de_tapesId = tipo_de_tapes.id;
    this.listaTiposDeTapesService
      .carregarTiposDeTapes(tipo_de_tapes.id)
      .subscribe((resposta) => {
        this.codigo = resposta.codigo
        this.descricao = resposta.descricao
        this.altera = true;
        this.modalTipoDeTapes.open();
      })
  }
  visualizar(tipo_de_tapes: any) {
    this.tipos_de_tapesId = tipo_de_tapes.id;
    this.listaTiposDeTapesService
      .carregarTiposDeTapes(tipo_de_tapes.id)
      .subscribe((resposta) => {
        this.codigo = resposta.codigo
        this.descricao = resposta.descricao
        this.modalTipoDeTapesView.open();
      })
  }

  async carregaLista() {
    this.Tipo_de_tapes = [];
    await this.listaTiposDeTapesService
      .listaTiposDeTapes()
      .subscribe((resposta) => {
        for (let index = 0; index < resposta.length; index++) {
          if (resposta[index].bloqueado === 'N') {
            this.Tipo_de_tapes.push(
              {
                id: resposta[index].id,
                codigo: resposta[index].codigo,
                descricao: resposta[index].descricao,
                acoes: ["1", "2", "3"]
              }
            )
          }
        }
        this.listaTiposDeTapes = this.Tipo_de_tapes;
      })
  }

  buscarTiposDeTapes(): void {
    if (this.TipoDeTapes) {
      this.listaTiposDeTapesService
        .buscarTiposDeTapes(this.TipoDeTapes)
        .subscribe((resposta) => {
          this.Tipo_de_tapes = [];
          for (let index = 0; index < resposta.length; index++) {
            if (resposta[index].bloqueado === 'N') {
              this.Tipo_de_tapes.push(
                {
                  id: resposta[index].id,
                  codigo: resposta[index].codigo,
                  descricao: resposta[index].descricao,
                  acoes: ["1", "2", "3"]
                }
              )
            }
          }
          this.listaTiposDeTapes = this.Tipo_de_tapes;
        })
    }
    this.carregaLista();
  }

  confirmaTipoDeTapes: PoModalAction = {
    action: () => {
      if (this.altera) {
        let Log = {
          descricao_log: 'Tipo de tape com ID: ' + this.tipos_de_tapesId + ' alterado pelo usuario: ' + sessionStorage.getItem('usuario') + ', com ID: ' + sessionStorage.getItem('id'),
          data_log: this.getDataEHoraAtual(),
        }
        this.tipo_de_tapes = {
          id: this.tipos_de_tapesId,
          codigo: this.codigo,
          descricao: this.descricao,
        }
        this.listaTiposDeTapesService
          .alteraTiposDeTapes(this.tipo_de_tapes)
          .subscribe((res) => {
            this.poNotification.success(res.retorno);
            this.ListaLogService
              .criarLog(Log)
              .subscribe((res) => {
                this.ngOnInit();
                this.altera = false;
                this.modalTipoDeTapes.close();
              })
          },
            (err) => {
              this.poNotification.error(err.error.retorno);
              this.altera = false;
              this.ngOnInit();
              this.modalTipoDeTapes.close();
            })
      } else {
        let Log = {
          descricao_log: 'Tipo de tape: ' + this.codigo + ' criado pelo usuario: ' + sessionStorage.getItem('usuario') + ', com ID: ' + sessionStorage.getItem('id'),
          data_log: this.getDataEHoraAtual(),
        }
        this.tipo_de_tapes = {
          codigo: this.codigo,
          descricao: this.descricao,
        }
        if (this.codigo != '' && this.descricao != '') {
          this.listaTiposDeTapesService
            .criarTiposDeTapes(this.tipo_de_tapes)
            .subscribe((res) => {
              this.poNotification.success(res.retorno);
              this.ListaLogService
                .criarLog(Log)
                .subscribe((res) => {
                  this.ngOnInit();
                  this.modalTipoDeTapes.close();
                })
            },
              (err) => {
                this.poNotification.error(err.error.retorno);
                this.altera = false;
                this.modalTipoDeTapes.close();
              })
        } else {
          this.poNotification.error('Preencha todos os campos');
        }
      }
    },
    label: "Confirmar"
  };

  cancelarTipoDeTapes: PoModalAction = {
    action: () => {
      this.codigo = '';
      this.descricao = '';
      this.modalTipoDeTapes.close();
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
        .exportData(this.tipoExport, this.listaTiposDeTapes, this.colunas
        );
    },
    label: "Confirma"
  };

}
