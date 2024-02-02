import { Component, ViewChild } from '@angular/core';
import { PoChartType, PoChartOptions, PoChartSerie, PoDialogService, PoTableColumn, PoNotificationService, PoModalComponent, PoRadioGroupOption, PoModalAction } from '@po-ui/ng-components';
import { ListaDeTapesService } from '../tapes/tapes.service';
import { ListaDeGravadorasService } from '../gravadoras/gravadoras.service';
import { ListaDeTiposDeTapesService } from '../tipos-de-tapes/tipos-de-tapes.service';
import { ListaDeNomesService } from '../nomes/nomes.service';
import { ListaDeEtiquetasService } from '../etiquetas/etiquetas.service';
import { ListaDeMusicaService } from '../musicas/musicas.service';
import { Exportacao } from '../exportacao/exportacao.service';

@Component({
  selector: 'app-grafico',
  templateUrl: './grafico.component.html',
  styleUrls: ['./grafico.component.css']
})

export class GraficoComponent {
  constructor(
    private listaTapesService: ListaDeTapesService,
    private poNotification: PoNotificationService,
    private listaNomesService: ListaDeNomesService,
    private exportacao: Exportacao,
    private listaGravadorasService: ListaDeGravadorasService,
    private listaEtiquetasService: ListaDeEtiquetasService,
    private listaTiposDeTapesService: ListaDeTiposDeTapesService,
    private listaMusicaService: ListaDeMusicaService,
  ) { }


  quantidadeTotal: number = 0;
  quantidadeS: number = 0;
  quantidadeN: number = 0;
  quantidadeO: number = 0;
  quantidadeD: number = 0;
  listaFiltro: string = '';
  tipoExport: string = '';
  etiquetaName: string = '';
  gravadoraName: string = '';
  subiu: string = '';
  midia: string = '';
  nome_artista!: string;
  nome_etiqueta!: string;
  nome_gravadora!: string;
  nome_tpTape!: string;
  nome_musica!: string;
  tiposMidia: Array<any> = new Array();
  faixa!: string;
  lado!: string;
  autor!: string;
  ids: Array<any> = new Array();
  tipoTape!: string;
  usuarios: Array<any> = new Array();
  Tapes: Array<any> = new Array();
  TapesN: Array<any> = new Array();
  tape: Array<any> = new Array();
  listaTapesS: Array<any> = new Array();
  listaTapesN: Array<any> = new Array();
  listaMusicas: Array<any> = new Array();
  acervo_musical: object | undefined;
  Tape: any;
  tapeId!: number;
  acervoId!: number;
  artista!: any;
  altera: boolean = false;
  resultado: boolean = false;
  subirTape: boolean = false;
  isHideLoading: boolean = false;
  stream: boolean | undefined;
  percentualArtistico!: number;
  novoNumero!: string;
  titulo!: string;
  Artista = 0;
  Gravadora: Array<any> = new Array();
  Musica: Array<any> = new Array();
  music: Array<any> = new Array();
  Music: Array<any> = new Array();
  Etiqueta: Array<any> = new Array();
  Tipo_tape: Array<any> = new Array();
  acoes: Array<any> = new Array();
  acoesMusica: Array<any> = new Array();
  criar = sessionStorage.getItem('lcria_tapes');
  gravadora!: number;
  musica: number = 0;
  quantidadeTape: number = 0;
  etiqueta!: number;
  produtorMusical!: string;
  tipo_tape!: number;
  dataDeLancamento!: Date | undefined;
  observacao!: string;
  columns: string = '';
  filtro: string = 'OFF';
  conteudoDigitado: string = '';
  conteudoSuperDigitado: string = '';
  smi!: string;
  prateleira!: string;
  descricao!: string;
  categoriesColumn: Array<string> = ['Stream', 'Não stream'];
  valoresGrafico: Array<PoChartSerie> = [];

  @ViewChild('modalExibeTape', { static: true }) modalExibeTape!: PoModalComponent;
  @ViewChild('exibeLista', { static: true }) exibeLista!: PoModalComponent;
  @ViewChild('modalSuper', { static: true }) modalSuper!: PoModalComponent;
  
  ngOnInit(): void {
    this.consultaTapes();
  }
  public readonly opcoesFiltro = [
    { label: "Titulo do Tape", value: "titulo" },
    { label: "Musica", value: "musica" },
    { label: "Genero", value: "genero" },
    { label: "Etiqueta", value: "etiqueta" },
    { label: "Gravadora", value: "gravadora" },
    { label: "Artista", value: "artista" },
  ];
  public readonly colunasSuper: Array<PoTableColumn> = [
    { property: "funcao", label: "Funcao", width: "45%" },
    { property: "novoNumero", label: "Numero tape", width: "20%" },
    { property: "titulo", label: "Titulo", width: "40%" },
    { property: "artista", label: "Artista", width: "40%" },
  ];


  public readonly colunas: Array<PoTableColumn> = [
    { property: "titulo", label: "Titulo", width: "45%" },
    { property: "novoNumero", label: "Numero tape", width: "20%" },
    { property: "artista", label: "Artista", width: "40%" },
    {
      property: "acoes",
      label: "Ações",
      type: "icon",
      width: "5%",
      icons: this.icons(),
    },
  ];

  public readonly columnOptions: Array<PoRadioGroupOption> = [
    { label: 'Subiu para algum stream', value: 'ON' },
    { label: 'Que não pode subir para algum stream', value: 'NOT' },
    { label: 'Midia digitalizada', value: 'DIGT' },
    { label: 'Ainda não subiu para algum stream', value: 'OFF' }
  ];

  icons(): Array<any> {
    this.acoes.push({
      action: this.Imprimir.bind(this),
      icon: "po-icon po-icon-upload",
      value: "1",
      tooltip: "imprimir",
    });
    return this.acoes;
  }
  consumptionPerCapitaOptions: PoChartOptions = {
    axis: {
      maxRange: 200,
      gridLines: 2
    }
  };

  chartAreaOptions: PoChartOptions = {
    axis: {
      maxRange: 5000,
      gridLines: 10
    }
  };
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

  options: PoChartOptions = {
    axis: {
      minRange: 100,
      maxRange: 40,
      gridLines: 5
    }
  };

  optionsColumn: PoChartOptions = {
    axis: {
      minRange: 0,
      maxRange: 100,
      gridLines: 7
    }
  };
  async SubirStream() {
    var tapes = [];
    
    if (confirm("Deseja subir todos os tapes?")) {
      for (let index = 0; index < this.listaTapesN.length; index++) {
       if(this.listaTapesN[index].$selected){
        tapes.push({tapes: this.listaTapesN[index]});
       } 
      }
      this.listaTapesService.stream(tapes).subscribe((res) =>{
        this.resultado = false;
        this.filtro = 'OFF'
        this.listaFiltro = '' 
        this.conteudoDigitado = ''
        this.poNotification.success(res.retorno);
        this.consultaTapes();
    
      },(err)=>{
        this.poNotification.error(err.error.retorno);
      })
    }
  }
  async abrirSuper() {
    this.conteudoSuperDigitado = '';
    this.modalSuper.open();
  }
  async Pesquisar() {
    if(this.filtro === 'OFF'){
      this.subirTape = true;
    }else{
      this.subirTape = false;
    }
    this.Tapes = [];
    this.listaTapesN = [];
    if (this.filtro) {
      this.isHideLoading = false;
      await this.listaTapesService
        .consultaDeTapes(this.filtro, this.listaFiltro, this.conteudoDigitado)
        .subscribe((res) => {
          for (let index = 0; index < res.length; index++) {
            this.Tapes.push(
              {
                id: res[index].id,
                titulo: res[index].titulo,
                novoNumero: res[index].numero_tape,
                artista: res[index].Nome.nome,
                acoes: ["1"]
              });
           }
          this.listaTapesN = this.Tapes
          this.resultado = true
          this.isHideLoading = true
        },
          (err) => {
            this.poNotification.error(err.error.retorno);
            this.resultado = true
            this.isHideLoading = true

          });
    } else {
      this.poNotification.warning('informe o filtro para pesquisar');
    }
  }
  async Imprimir(tape: any) {
    this.tapeId = tape.id;
    this.listaMusicas = [];
    this.Music = [];
    this.Musica = [];
    this.midia = '';
    this.produtorMusical = '';
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
        this.percentualArtistico = resposta.percentual_artistico
        this.novoNumero = resposta.numero_tape
        const valoresSeparados = resposta.tipos_midia.split('/').filter(Boolean);
        const dadosSelecionados = valoresSeparados.map((valor: any) => {
          const opcaoEncontrada = this.auditOptions.find((opcao) => opcao.value === valor);
          return opcaoEncontrada ? opcaoEncontrada : null;
        });

        this.titulo = resposta.titulo
        if (resposta.stream) {
          this.subiu = 'Sim';
        } else {
          this.subiu = 'Não';
        }
        this.gravadora = resposta.gravadora
        this.etiqueta = resposta.etiqueta
        this.produtorMusical = resposta.produtor_musical
        this.tipo_tape = resposta.tipo_tape
        this.listaMusicaService.buscarMusicaExata(resposta.numero_tape).subscribe((res) => {
          for (let index = 0; index < res.length; index++) {
            this.Music.push(
              {
                id: res[index].id,
                musica: res[index].musica,
                faixa: res[index].faixa,
                lado: res[index].lado,
                autor: res[index].autor,
                acoes: ["1"]
              });
          }
          this.listaMusicas = this.Music;
          for (let i = 1; i < dadosSelecionados.length; i++) {
            this.midia += dadosSelecionados[i].label + ' - '
          }
        });

        this.modalExibeTape.open();
      })
  }
  confirmaSuper: PoModalAction = {
    action: () => {
      if(this.conteudoDigitado){
        this.listaTapesService
        .buscaSuper(this.conteudoDigitado)
        .subscribe( (resposta) =>{
          this.exportacao
          .exportData('pdf', resposta, this.colunasSuper
          );
      })
      }else{
        this.poNotification.information('informe o nome para pesquisa')
      }
    },
    label: 'Pesquisar'
  }
  cancelaSuper: PoModalAction = {
    action: () => {
      this.conteudoSuperDigitado = '';
      this.modalSuper.close();

    },
    label: "Cancelar"
  };
  
  async consultaTapes() {
    this.listaTapesService
      .listaTapesSteam()
      .subscribe((resposta) => {
        this.quantidadeO = resposta.quantO
        this.quantidadeS = resposta.quantS
        this.quantidadeN = resposta.quantN
        this.quantidadeD = resposta.quantD
        this.quantidadeTotal = resposta.quantT
        this.valoresGrafico = [{ label: 'On stream', data: resposta.quantS, tooltip: 'Quantidade => ' + resposta.quantS.toString() + ' Tapes', color: 'color-09' },
        { label: 'Off stream', data: resposta.quantO, tooltip: 'Quantidade => ' + resposta.quantO.toString() + ' Tapes', color: 'color-02' },
        { label: 'Not stream', data: resposta.quantN, tooltip: 'Quantidade => ' + resposta.quantN.toString() + ' Tapes', color: 'color-07' },
        { label: 'Digitalizado', data: resposta.quantD, tooltip: 'Quantidade => ' + resposta.quantD.toString() + ' Tapes', color: 'color-08' }]
        this.isHideLoading = true
      });
  }

}
