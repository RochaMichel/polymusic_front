import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PoModalAction, PoModalComponent, PoNotificationService, PoTableColumn } from '@po-ui/ng-components';
import { ListaDeNomesService } from './nomes.service';
import { Exportacao } from '../exportacao/exportacao.service';
import { ListaDeLogService } from '../log/log.service';
import { ListaDeTapesService } from '../tapes/tapes.service';
import { ListaDeGravadorasService } from '../gravadoras/gravadoras.service';
import { ListaDeEtiquetasService } from '../etiquetas/etiquetas.service';
import { ListaDeMusicaService } from '../musicas/musicas.service';
import { ListaDeTiposDeTapesService } from '../tipos-de-tapes/tipos-de-tapes.service';

@Component({
  selector: 'app-nomes',
  templateUrl: './nomes.component.html',
  styleUrls: ['./nomes.component.css']
})
export class NomesComponent {
  novoNumero: any;

  constructor(
    private poNotification: PoNotificationService,
    private listaNomesService: ListaDeNomesService,
    private listaTapesService: ListaDeTapesService,
    private listaGravadorasService: ListaDeGravadorasService,
    private listaEtiquetasService: ListaDeEtiquetasService,
    private listaMusicaService: ListaDeMusicaService,
    private ListaLogService: ListaDeLogService,
    private exportacao: Exportacao,
    private router: Router
  ) { }

  titulo: string = '';
  subiu: string = '';
  midia: string = '';
  artista: string = '';
  gravadoraName: string = '';
  etiquetaName: string = '';
  produtorMusical: string = '';
  listaMusicas: Array<any> = new Array();
  tipoExport: string = '';
  tipoCliente!: string;
  usuarios: Array<any> = new Array();
  acoes: Array<any> = new Array();
  acoesTape: Array<any> = new Array();
  Nomes: Array<any> = new Array();
  criar = sessionStorage.getItem('lcria_nomes');
  nomesObj: object | undefined;
  listaNomes: Array<any> = new Array();
  Nome: string = '';
  nomesId!: number;
  altera: boolean = false;
  nome!: string;
  funcao!: string;
  listaTapes: Array<any> = new Array();

  @ViewChild("modalNomes", { static: true }) modalNomes!: PoModalComponent;
  @ViewChild("modalNomesView", { static: true }) modalNomesView!: PoModalComponent;
  @ViewChild("modalNomeTape", { static: true }) modalNomeTape!: PoModalComponent;
  @ViewChild('modalExport', { static: true }) modalExport!: PoModalComponent;
  @ViewChild('modalExibeTape', { static: true }) modalExibeTape!: PoModalComponent;
  ngOnInit(): void {
    this.carregarLista();
  }
  public readonly auditOptions: Array<any> = [
    { value: '1', label: 'Tape 1/4' },
    { value: '2', label: 'Tape 1' },
    { value: '3', label: 'Tape 1/2' },
    { value: '4', label: 'Tape 2' },
    { value: '5', label: 'DAT' },
    { value: '6', label: 'Vinil' },
    { value: '7', label: 'CD' },
    { value: '8', label: 'DVD' },
    { value: '9', label: 'Outros' },
  ];
  public readonly colunasTape: Array<PoTableColumn> = [
    { property: "id", label: "ID", width: "10%" },
    { property: "titulo", label: "Titulo", width: "45%" },
    { property: "novoNumero", label: "Numero tape", width: "20%" },
    {
      property: "acoes",
      label: "Ações",
      type: "icon",
      width: "5%",
      icons: this.iconsTape(),
    },
  ];
  iconsTape(): Array<any> {
    this.acoesTape.push({
      action: this.ImprimirTape.bind(this),
      icon: "po-icon po-icon-upload",
      value: "1",
      tooltip: "imprimir",
    });
    return this.acoesTape
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
      action: this.Imprimir.bind(this),
      icon: "po-icon po-icon-upload",
      value: "4",
      tooltip: "imprimir",
    });
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
  Imprimir(nomes: any) {
    this.nomesId = nomes.id;
    this.listaNomesService
      .carregarNomes(nomes.id)
      .subscribe((resposta) => {
        this.listaTapesService
          .buscarTapeNome(nomes.id)
          .subscribe((resposta) => {
            for (let index = 0; index < resposta.length; index++) {
              if (resposta[index].bloqueado === 'N') {
                this.listaTapes.push(
                  {
                    id: resposta[index].id,
                    titulo: resposta[index].titulo,
                    novoNumero: resposta[index].numero_tape,
                    acoes: ["1"]
                  }
                )
              }
            }
          })
        this.nome = resposta.nome
        this.funcao = resposta.funcao
        this.modalNomeTape.open();
      });
  }
  async ImprimirTape(tape: any) {
    await this.listaTapesService
      .carregarTape(tape.id)
      .subscribe((resposta) => {
        this.listaNomesService
          .buscarNomesExato(resposta.artista)
          .subscribe((res) => { this.artista = res[0].nome })
        this.listaEtiquetasService
          .buscarEtiqueta(resposta.etiqueta)
          .subscribe((res) => { this.etiquetaName = res[0].nome_etiqueta })
        this.listaGravadorasService
          .buscarGravadora(resposta.gravadora)
          .subscribe((res) => { this.gravadoraName = res[0].nome_gravadora })
        this.novoNumero = resposta.numero_tape
        this.titulo = resposta.titulo
        this.produtorMusical = resposta.produtor_musical
        const valoresSeparados = resposta.tipos_midia.split('/').filter(Boolean);
        const dadosSelecionados = valoresSeparados.map((valor: any) => {
          const opcaoEncontrada = this.auditOptions.find((opcao) => opcao.value === valor);
          return opcaoEncontrada ? opcaoEncontrada : null;
        });
  
        this.titulo = resposta.titulo
        if(resposta.stream){
          this.subiu = 'Sim';
        }else{
          this.subiu = 'Não';
        }
        this.listaMusicaService.buscarMusicaExata(resposta.numero_tape).subscribe((res) => {
          for (let index = 0; index < res.length; index++) {
            this.listaMusicas.push(
              {
                id: res[index].id,
                musica: res[index].musica,
                faixa: res[index].faixa,
                lado: res[index].lado,
                autor: res[index].autor,
                acoes: ["1"]
              });
          }
          for( let i = 1; i < dadosSelecionados.length; i++){
            this.midia += dadosSelecionados[i].label+' - '
         }
        });

        this.modalExibeTape.open();
      })

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
                acoes: ["1", "2", "3", "4"]
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
                  acoes: ["1", "2", "3", "4"]
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
          nome: this.nome.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase(),
          funcao: this.funcao.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase(),
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
  cancelarNomeTape: PoModalAction = {
    action: () => {
      this.nome = '';
      this.funcao = '';
      this.modalNomeTape.close();
      this.altera = false;
    },
    label: "Cancelar"
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
