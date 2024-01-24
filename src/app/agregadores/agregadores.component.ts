import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PoModalAction, PoModalComponent, PoNotificationService, PoTableColumn } from '@po-ui/ng-components';
import { ListaDeAgregadoresService } from '../agregadores/agregadores.service';
import { Exportacao } from '../exportacao/exportacao.service';
import { ListaDeLogService } from '../log/log.service';
import { ListaDeTapesService } from '../tapes/tapes.service';
import { ListaDeNomesService } from '../nomes/nomes.service';
import { ListaDeMusicaService } from '../musicas/musicas.service';
import { ListaDeGravadorasService } from '../gravadoras/gravadoras.service';

@Component({
  selector: 'app-agregadores',
  templateUrl: './agregadores.component.html',
  styleUrls: ['./agregadores.component.css']
})
export class AgregadoresComponent {
  constructor(
    private poNotification: PoNotificationService,
    private listaNomesService: ListaDeNomesService,
    private listaTapesService: ListaDeTapesService,
    private listaMusicaService: ListaDeMusicaService,
    private listaGravadorasService: ListaDeGravadorasService,
    private listaAgregadoresService: ListaDeAgregadoresService,
    private ListaLogService: ListaDeLogService,
    private exportacao: Exportacao,
    private router: Router
  ) { }
  titulo: string = '';
  artista: string = '';
  subiu: string = '';
  midia: string = '';
  gravadoraName: string = '';
  etiquetaName: string = '';
  produtorMusical: string = '';
  novoNumero: string = '';
  listaMusicas: Array<any> = new Array();
  listaTapes: Array<any> = new Array();
  acoesTape: Array<any> = new Array();
  tipoExport: string = '';
  tipoCliente!: string;
  usuarios: Array<any> = new Array();
  Agregadoress: Array<any> = new Array();
  acoes: Array<any> = new Array();
  criar = sessionStorage.getItem('lcria_etiquetas');
  agregador: object | undefined;
  listarAgregadores: Array<any> = new Array();
  Agregadores: any;
  agregadorId!: number;
  altera: boolean = false;
  Carregando: boolean = false;
  nomeAgregador!: string;
  
  @ViewChild("modalAgregadores", { static: true }) modalAgregadores!: PoModalComponent;
  @ViewChild("modalAgregadoresView", { static: true }) modalAgregadoresView!: PoModalComponent;
  @ViewChild("modalNomeTape", { static: true }) modalNomeTape!: PoModalComponent;
  @ViewChild('modalExport', { static: true }) modalExport!: PoModalComponent;
  @ViewChild('modalExibeTape', { static: true }) modalExibeTape!: PoModalComponent;
  ngOnInit(): void {
    // this.opcoesUsuarios();
    this.carregaLista();
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
    { property: "nomeAgregador", label: "Agregador", width: "80%" },
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
  criarAgregadores() {
    this.nomeAgregador = '';
    this.modalAgregadores.open();
  }

  excluir(agregador: any) {
    if (confirm("Deseja excluir a agregador?")) {
      let Log = {
        descricao_log: 'Agregadores com ID: ' + agregador.id + ' excluida pelo usuario: ' + sessionStorage.getItem('usuario') + ', com ID: ' + sessionStorage.getItem('id'),
        data_log: this.getDataEHoraAtual(),
      }
      this.listaAgregadoresService
        .excluirAgregadores(agregador.id)
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
  Imprimir(agregador: any) {
    this.Carregando = true;
    this.agregadorId = agregador.id;
    this.listaAgregadoresService
      .carregarAgregadores(agregador.id)
      .subscribe((resposta) => {
        this.nomeAgregador = resposta.nomeAgregador
        this.listaTapesService
          .buscarTapeEtique(agregador.id)
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
          this.Carregando = false;
          this.modalNomeTape.open();
      },
      (err) =>{
          this.poNotification.error(err.error.retorno)
      });
  }
  async ImprimirTape(tape: any) {
    await this.listaTapesService
      .carregarTape(tape.id)
      .subscribe((resposta) => {
        this.listaNomesService
          .buscarNomesExato(resposta.artista)
          .subscribe((res) => { this.artista = res[0].nome })
        this.listaAgregadoresService
          .buscarAgregadores(resposta.agregador)
          .subscribe((res) => { this.etiquetaName = res[0].nomeAgregador })
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
  loadMoreData(){

  }
  Alterar(agregador: any) {
    this.agregadorId = agregador.id;
    this.listaAgregadoresService
      .carregarAgregadores(agregador.id)
      .subscribe((resposta) => {
        this.nomeAgregador = resposta.nomeAgregadores
        this.altera = true;
        this.modalAgregadores.open();
      })
  }
  visualizar(agregador: any) {
    this.agregadorId = agregador.id;
    this.listaAgregadoresService
      .carregarAgregadores(agregador.id)
      .subscribe((resposta) => {
        this.nomeAgregador = resposta.nomeAgregadores
        this.modalAgregadoresView.open();
      })
  }

  async carregaLista() {
    this.Agregadoress = [];
    await this.listaAgregadoresService
      .listaAgregadores()
      .subscribe((resposta) => {
        for (let index = 0; index < resposta.length; index++) {
          if (resposta[index].bloqueado === 'N') {
            this.Agregadoress.push(
              {
                id: resposta[index].id,
                nomeAgregador: resposta[index].nomeAgregadores,
                acoes: ["1", "2", "3","4"]
              }
            )
          }
        }
        this.listarAgregadores = this.Agregadoress;
      })
  }

  buscaAgregadores(): void {
    if (this.Agregadores) {
      this.listaAgregadoresService
        .buscarAgregadores(this.Agregadores)
        .subscribe((resposta) => {
          this.Agregadoress = [];
          for (let index = 0; index < resposta.length; index++) {
            if (resposta[index].bloqueado === 'N') {
            this.Agregadoress.push(
              {
                id: resposta[index].id,
                nomeAgregador: resposta[index].nomeAgregadores,
                acoes: ["1", "2", "3","4"]
              }
            )
          }
        }
          this.listarAgregadores = this.Agregadoress;
        })
    }
    this.carregaLista();
  }

  confirmaAgregadores: PoModalAction = {
    action: () => {
      if (this.altera) {
        let Log = {
          descricao_log: 'Agregador com ID: ' + this.agregadorId + ' alterar pelo usuario: ' + sessionStorage.getItem('usuario') + ', com ID: ' + sessionStorage.getItem('id'),
          data_log: this.getDataEHoraAtual(),
        }
        this.agregador = {
          id: this.agregadorId,
          nomeAgregadores: this.nomeAgregador,
        }
        this.listaAgregadoresService
          .alteraAgregadores(this.agregador)
          .subscribe((res) => {
            this.ListaLogService
              .criarLog(Log)
              .subscribe((res) => {
                this.ngOnInit();
                this.modalAgregadores.close();
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
          descricao_log: 'Agregador com ID: ' + this.agregadorId + ' criado pelo usuario: ' + sessionStorage.getItem('usuario') + ', com ID: ' + sessionStorage.getItem('id'),
          data_log: this.getDataEHoraAtual(),
        }
        this.agregador = {
          nomeAgregadores: this.nomeAgregador,
        }
        if (this.nomeAgregador != '') {
          this.listaAgregadoresService
            .criarAgregador(this.agregador)
            .subscribe((res) => {
              this.ListaLogService
                .criarLog(Log)
                .subscribe((res) => {
                  this.ngOnInit();
                  this.modalAgregadores.close();
                });
              this.poNotification.success(res.retorno);

            },
              (err) => {
                console.log(err);
                this.poNotification.error(err.error.retorno);
                this.ngOnInit();
              })
        } else {
          this.poNotification.error('Insira o nome da agregador');
        }
      }
    },
    label: "Confirmar"
  };

  cancelarAgregadores: PoModalAction = {
    action: () => {
      this.nomeAgregador = '';
      this.modalAgregadores.close();
      this.altera = false;
    },
    label: "Cancelar"
  };
  cancelarNomeTape: PoModalAction = {
    action: () => {
      this.nomeAgregador = '';
      this.modalNomeTape.close();
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
        .exportData(this.tipoExport, this.listarAgregadores, this.colunas
        );
    },
    label: "Confirma"
  };

}
