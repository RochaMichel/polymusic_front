import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PoModalAction, PoModalComponent, PoNotificationService, PoTableColumn } from '@po-ui/ng-components';
import { ListaDeNomesService } from './nomes.service';
import { Exportacao } from '../exportacao/exportacao.service';
import { ListaDeLogService } from '../log/log.service';

@Component({
  selector: 'app-nomes',
  templateUrl: './nomes.component.html',
  styleUrls: ['./nomes.component.css']
})
export class NomesComponent {
  constructor(
    private poNotification: PoNotificationService,
    private listaNomesService: ListaDeNomesService,
    private ListaLogService: ListaDeLogService,
    private exportacao: Exportacao,
    private router: Router
  ) { }

  tipoExport: string = '';
  tipoCliente!: string;
  usuarios: Array<any> = new Array();
  acoes: Array<any> = new Array();
  Nomes: Array<any> = new Array();
  criar = sessionStorage.getItem('lcria_nomes');
  nomesObj: object | undefined;
  listaNomes: Array<any> = new Array();
  Nome: string = '';
  nomesId!: number;
  altera: boolean = false;
  nome!: string;
  funcao!: string;

  @ViewChild("modalNomes", { static: true }) modalNomes!: PoModalComponent;
  @ViewChild("modalNomesView", { static: true }) modalNomesView!: PoModalComponent;
  @ViewChild('modalExport', { static: true }) modalExport!: PoModalComponent;
  ngOnInit(): void {
    this.carregarLista();
  }

  public readonly colunas: Array<PoTableColumn> = [
    { property: "id", label: "ID", width: "10%" },
    { property: "funcao", label: "Função", width: "10%" },
    { property: "nome", label: "Nome", width: "80%" },
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
    if (sessionStorage.getItem('laltera_nomes') === 'true') {
      this.acoes.push({
        action: this.Alterar.bind(this),
        icon: "po-icon po-icon-edit",
        value: "1",
      });
    }
    if (sessionStorage.getItem('lexclui_nomes') === 'true') {
      this.acoes.push({
        action: this.excluir.bind(this),
        icon: "po-icon po-icon-delete",
        value: "3"
      });
    }
    return this.acoes;
  }

  criarNomes() {
    this.nome = '';
    this.modalNomes.open();
  }

  excluir(nomes: any) {
    if (confirm("Deseja excluir o nomes?")) {
      let Log = {
        descricao_log: 'Nome com ID: ' + nomes.id + ' excluido pelo usuario: ' + sessionStorage.getItem('usuario') + ', com ID: ' + sessionStorage.getItem('id'),
        data_log: this.getDataEHoraAtual(),
      }
      this.listaNomesService
        .excluirNomes(nomes.id)
        .subscribe((res) => {
          this.ListaLogService
            .criarLog(Log)
            .subscribe((res) => {
              this.ngOnInit();
            })
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
    const mes = String(dataEHora.getMonth() + 1).padStart(2, '0');
    const ano = dataEHora.getFullYear();
    const hora = String(dataEHora.getHours()).padStart(2, '0');
    const minutos = String(dataEHora.getMinutes()).padStart(2, '0');
    const segundos = String(dataEHora.getSeconds()).padStart(2, '0');
    return `${dia}/${mes}/${ano} ${hora}:${minutos}:${segundos}`;

  }
  Alterar(nomes: any) {
    this.nomesId = nomes.id;
    this.listaNomesService
      .carregarNomes(nomes.id)
      .subscribe((resposta) => {
        this.nome = resposta.nome
        this.funcao = resposta.funcao
        this.altera = true;
        this.modalNomes.open();
      })
  }
  visualizar(nomes: any) {
    this.nomesId = nomes.id;
    this.listaNomesService
      .carregarNomes(nomes.id)
      .subscribe((resposta) => {
        this.nome = resposta.nome
        this.funcao = resposta.funcao
        this.modalNomesView.open();
      })
  }

  async carregarLista() {
    this.Nomes = [];
    await this.listaNomesService
      .listaNomes()
      .subscribe((resposta) => {
        for (let index = 0; index < resposta.length; index++) {
          if (resposta[index].bloqueado === 'N') {
            this.Nomes.push(
              {
                id: resposta[index].id,
                nome: resposta[index].nome,
                funcao: resposta[index].funcao,
                acoes: ["1", "2", "3"]
              }
            )
          }
        }
        this.listaNomes = this.Nomes;
      })
  }

  buscarNomes(): void {
    if (this.Nome) {
      this.listaNomesService
        .buscarNomes(this.Nome)
        .subscribe((resposta) => {
          this.Nomes = [];
          for (let index = 0; index < resposta.length; index++) {
            if (resposta[index].bloqueado === 'N') {
              this.Nomes.push(
                {
                  id: resposta[index].id,
                  nome: resposta[index].nome,
                  funcao: resposta[index].funcao,
                  acoes: ["1", "2", "3"]
                }
              )
            }
          }
          this.listaNomes = this.Nomes;
        })
    }
    this.carregarLista();
  }

  confirmaNomes: PoModalAction = {
    action: () => {
      if (this.altera) {
        let Log = {
          descricao_log: 'Nome com ID: ' + this.nomesId + ' alterado pelo usuario: ' + sessionStorage.getItem('usuario') + ', com ID: ' + sessionStorage.getItem('id'),
          data_log: this.getDataEHoraAtual(),
        }
        this.nomesObj = {
          id: this.nomesId,
          nome: this.nome,
          funcao: this.funcao,
        }
        this.listaNomesService
          .alterarNomes(this.nomesObj)
          .subscribe((res) => {
            this.ListaLogService
              .criarLog(Log)
              .subscribe((res) => {
                this.ngOnInit();
                this.modalNomes.close();
              })
            this.altera = false;
            this.poNotification.success(res.retorno);
            this.nome = '';
          },
            (err) => {
              this.poNotification.error(err.error.retorno);
              this.altera = false;
              this.ngOnInit();

            })

      } else {
        let Log = {
          descricao_log: 'Nome: ' + this.nome + ' criado pelo usuario: ' + sessionStorage.getItem('usuario') + ', com ID: ' + sessionStorage.getItem('id'),
          data_log: this.getDataEHoraAtual(),
        }
        this.nomesObj = {
          funcao: this.funcao,
          nome: this.nome,
        }
        this.listaNomesService
          .criarNomes(this.nomesObj)
          .subscribe((res) => {
            this.ListaLogService
              .criarLog(Log)
              .subscribe((res) => {
                this.ngOnInit();
                this.modalNomes.close();
              })
            this.poNotification.success(res.retorno);
            this.nome = '';
          },
            (err) => {
              this.poNotification.error(err.error.retorno);
              this.ngOnInit();
            })
      }
    },
    label: "Confirmar"
  };

  cancelarNomes: PoModalAction = {
    action: () => {
      this.nome = '';
      this.funcao = '';
      this.modalNomes.close();
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
        .exportData(this.tipoExport, this.listaNomes, this.colunas
        );
    },
    label: "Confirma"
  };

}
