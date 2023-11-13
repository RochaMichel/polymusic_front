import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PoModalAction, PoModalComponent, PoNotificationService, PoTableColumn } from '@po-ui/ng-components';
import { ListaDeEtiquetasService } from './etiquetas.service';
import { Exportacao } from '../exportacao/exportacao.service';
import { ListaDeLogService } from '../log/log.service';

@Component({
  selector: 'app-etiquetas',
  templateUrl: './etiquetas.component.html',
  styleUrls: ['./etiquetas.component.css']
})
export class EtiquetasComponent {
  constructor(
    private poNotification: PoNotificationService,
    private listaEtiquetasService: ListaDeEtiquetasService,
    private ListaLogService: ListaDeLogService,
    private exportacao: Exportacao,
    private router: Router
  ) { }

  tipoExport: string = '';
  tipoCliente!: string;
  usuarios: Array<any> = new Array();
  Etiquetas: Array<any> = new Array();
  acoes: Array<any> = new Array();
  criar = sessionStorage.getItem('lcria_etiquetas');
  etiqueta: object | undefined;
  listarEtiqueta: Array<any> = new Array();
  Etiqueta: any;
  etiquetaId!: number;
  altera: boolean = false;
  nome_etiqueta!: string;
  @ViewChild("modalEtiqueta", { static: true }) modalEtiqueta!: PoModalComponent;
  @ViewChild("modalEtiquetaView", { static: true }) modalEtiquetaView!: PoModalComponent;
  @ViewChild('modalExport', { static: true }) modalExport!: PoModalComponent;
  ngOnInit(): void {
    // this.opcoesUsuarios();
    this.carregaLista();
  }

  public readonly colunas: Array<PoTableColumn> = [
    { property: "id", label: "ID", width: "10%" },
    { property: "nome_etiqueta", label: "Nome da Etiqueta", width: "80%" },
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
    if (sessionStorage.getItem('laltera_etiquetas') === 'true') {
      this.acoes.push({
        action: this.Alterar.bind(this),
        icon: "po-icon po-icon-edit",
        value: "1",
      });
    }
    if (sessionStorage.getItem('lexclui_etiquetas') === 'true') {
      this.acoes.push({
        action: this.excluir.bind(this),
        icon: "po-icon po-icon-delete",
        value: "3"
      });
    }
    return this.acoes;
  }
  criarEtiqueta() {
    this.nome_etiqueta = '';
    this.modalEtiqueta.open();
  }

  excluir(etiqueta: any) {
    if (confirm("Deseja excluir a etiqueta?")) {
      let Log = {
        descricao_log: 'Etiqueta com ID: ' + etiqueta.id + ' excluida pelo usuario: ' + sessionStorage.getItem('usuario') + ', com ID: ' + sessionStorage.getItem('id'),
        data_log: this.getDataEHoraAtual(),
      }
      this.listaEtiquetasService
        .excluirEtiqueta(etiqueta.id)
        .subscribe((res) => {
          this.ListaLogService
            .criarLog(Log)
            .subscribe((res) => {
              this.ngOnInit();
            });
          this.poNotification.success(res.retorno);

        },
          (err) => {
            console.log(err);
            this.poNotification.error(err.error.retorno);
            this.ngOnInit();
          })
    }
  }

  getDataEHoraAtual(): string {
    const dataEHora = new Date();
    const dia = String(dataEHora.getDate()).padStart(2, '0');
    const mes = String(dataEHora.getMonth() + 1).padStart(2, '0'); // O mês é contado a partir do zero
    const ano = dataEHora.getFullYear();
    const hora = String(dataEHora.getHours()).padStart(2, '0');
    const minutos = String(dataEHora.getMinutes()).padStart(2, '0');
    const segundos = String(dataEHora.getSeconds()).padStart(2, '0');
    return `${dia}/${mes}/${ano} ${hora}:${minutos}:${segundos}`;

  }
  Alterar(etiqueta: any) {
    this.etiquetaId = etiqueta.id;
    this.listaEtiquetasService
      .carregarEtiqueta(etiqueta.id)
      .subscribe((resposta) => {
        this.nome_etiqueta = resposta.nome_etiqueta
        this.altera = true;
        this.modalEtiqueta.open();
      })
  }
  visualizar(etiqueta: any) {
    this.etiquetaId = etiqueta.id;
    this.listaEtiquetasService
      .carregarEtiqueta(etiqueta.id)
      .subscribe((resposta) => {
        this.nome_etiqueta = resposta.nome_etiqueta
        this.modalEtiquetaView.open();
      })
  }

  async carregaLista() {
    this.Etiquetas = [];
    await this.listaEtiquetasService
      .listaEtiqueta()
      .subscribe((resposta) => {
        for (let index = 0; index < resposta.length; index++) {
          if (resposta[index].bloqueado === 'N') {
            this.Etiquetas.push(
              {
                id: resposta[index].id,
                nome_etiqueta: resposta[index].nome_etiqueta,
                acoes: ["1", "2", "3"]
              }
            )
          }
        }
        this.listarEtiqueta = this.Etiquetas;
      })
  }

  buscaEtiqueta(): void {
    if (this.Etiqueta) {
      this.listaEtiquetasService
        .buscarEtiqueta(this.Etiqueta)
        .subscribe((resposta) => {
          this.Etiquetas = [];
          for (let index = 0; index < resposta.length; index++) {
            if (resposta[index].bloqueado === 'N') {
            this.Etiquetas.push(
              {
                id: resposta[index].id,
                nome_etiqueta: resposta[index].nome_etiqueta,
                acoes: ["1", "2", "3"]
              }
            )
          }
        }
          this.listarEtiqueta = this.Etiquetas;
        })
    }
    this.carregaLista();
  }

  confirmaEtiqueta: PoModalAction = {
    action: () => {
      if (this.altera) {
        let Log = {
          descricao_log: 'Editora com ID: ' + this.etiquetaId + ' alterar pelo usuario: ' + sessionStorage.getItem('usuario') + ', com ID: ' + sessionStorage.getItem('id'),
          data_log: this.getDataEHoraAtual(),
        }
        this.etiqueta = {
          id: this.etiquetaId,
          nome_etiqueta: this.nome_etiqueta,
        }
        this.listaEtiquetasService
          .alteraEtiqueta(this.etiqueta)
          .subscribe((res) => {
            this.ListaLogService
              .criarLog(Log)
              .subscribe((res) => {
                this.ngOnInit();
                this.modalEtiqueta.close();
              });
            this.altera = false;
            this.poNotification.success(res.retorno);

          },
            (err) => {
              console.log(err);
              this.poNotification.error(err.error.retorno);
              this.ngOnInit();
            })
      } else {
        let Log = {
          descricao_log: 'Editora com ID: ' + this.etiquetaId + ' criado pelo usuario: ' + sessionStorage.getItem('usuario') + ', com ID: ' + sessionStorage.getItem('id'),
          data_log: this.getDataEHoraAtual(),
        }
        this.etiqueta = {
          nome_etiqueta: this.nome_etiqueta,
        }
        if (this.nome_etiqueta != '') {
          this.listaEtiquetasService
            .criarEditora(this.etiqueta)
            .subscribe((res) => {
              this.ListaLogService
                .criarLog(Log)
                .subscribe((res) => {
                  this.ngOnInit();
                  this.modalEtiqueta.close();
                });
              this.poNotification.success(res.retorno);

            },
              (err) => {
                console.log(err);
                this.poNotification.error(err.error.retorno);
                this.ngOnInit();
              })
        } else {
          this.poNotification.error('Insira o nome da etiqueta');
        }
      }
    },
    label: "Confirmar"
  };

  cancelarEtiqueta: PoModalAction = {
    action: () => {
      this.nome_etiqueta = '';
      this.modalEtiqueta.close();
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
        .exportData(this.tipoExport, this.listarEtiqueta, this.colunas
        );
    },
    label: "Confirma"
  };

}
