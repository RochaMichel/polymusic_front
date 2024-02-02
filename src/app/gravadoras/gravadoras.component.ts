import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PoModalAction, PoModalComponent, PoNotificationService, PoTableColumn } from '@po-ui/ng-components';
import { ListaDeGravadorasService } from './gravadoras.service';
import { Exportacao } from '../exportacao/exportacao.service';
import { ListaDeLogService } from '../log/log.service';
import { ListaDeNomesService } from '../nomes/nomes.service';
import { ListaDeEtiquetasService } from '../etiquetas/etiquetas.service';
import { ListaDeMusicaService } from '../musicas/musicas.service';
import { ListaDeTapesService } from '../tapes/tapes.service';

@Component({
  selector: 'app-gravadoras',
  templateUrl: './gravadoras.component.html',
  styleUrls: ['./gravadoras.component.css']
})
export class GravadorasComponent {
  novoNumero: any;
  constructor(
    private poNotification: PoNotificationService,
    private listaNomesService: ListaDeNomesService,
    private listaTapesService: ListaDeTapesService,
    private listaEtiquetasService: ListaDeEtiquetasService,
    private listaMusicaService: ListaDeMusicaService,
    private listaGravadorasService: ListaDeGravadorasService,
    private ListaLogService: ListaDeLogService,
    private exportacao: Exportacao,
    private router: Router
  ) { }
  
  
  titulo: string = '';
  artista: string = '';
  midia: string = '';
  subiu: string = '';
  gravadoraName: string = '';
  etiquetaName: string = '';
  produtorMusical: string = '';
  listaMusicas: Array<any> = new Array();
  listaTapes: Array<any> = new Array();
  acoesTape: Array<any> = new Array();
  tipoExport: string = '';
  tipoCliente!: string;
  acoes: Array<any> = new Array();
  Gravadoras: Array<any> = new Array();
  gravadora: object | undefined;
  listaGravadoras: Array<any> = new Array();
  criar = sessionStorage.getItem('lcria_gravadoras');
  Gravadora: any;
  gravadoraId!: number;
  altera: boolean = false;
  nome_gravadora!: string;
  responsavel!: string;
  cpfCnpj!: string;
  rg!: string;
  inscricaoEstadual!: string;
  inscricaoMunicipal!: string;
  razaoSocial!: string;
  email!: string;
  telefoneComercial!: string;
  telefoneCelular!: string;
  site!: string;
  cep!: string;
  logradouro!: string;
  numero!: string;
  complemento!: string;
  bairro!: string;
  uf!: string;
  cidade!: string;

  @ViewChild("modalGravadora", { static: true }) modalGravadora!: PoModalComponent;
  @ViewChild("modalGravadoraView", { static: true }) modalGravadoraView!: PoModalComponent;
  @ViewChild("modalNomeTape", { static: true }) modalNomeTape!: PoModalComponent;
  @ViewChild('modalExport', { static: true }) modalExport!: PoModalComponent;
  @ViewChild('modalExibeTape', { static: true }) modalExibeTape!: PoModalComponent;
  ngOnInit(): void {
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
    { property: "nome_gravadora", label: "Nome da Gravadora", width: "80%" },
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
    if (sessionStorage.getItem('laltera_gravadoras') === 'true') {
      this.acoes.push({
        action: this.Alterar.bind(this),
        icon: "po-icon po-icon-edit",
        value: "1",
      });
    }
    if (sessionStorage.getItem('lexclui_gravadoras') === 'true') {
      this.acoes.push({
        action: this.excluir.bind(this),
        icon: "po-icon po-icon-delete",
        value: "3"
      });
    }
    return this.acoes;
  }

  criarGravadora() {
    this.nome_gravadora = '';
    this.modalGravadora.open();
  }

  excluir(gravadora: any) {
    if (confirm("Deseja excluir a gravadora?")) {
      let Log = {
        descricao_log: 'Gravadora com ID: ' + gravadora.id + ' excluido pelo usuario: ' + sessionStorage.getItem('usuario') + ', com ID: ' + sessionStorage.getItem('id'),
        data_log: this.getDataEHoraAtual(),
      }
      this.listaGravadorasService
        .excluirGravadora(gravadora.id)
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
          });
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
  Imprimir(gravadora: any) {
    this.listaMusicas = [];
    this.listaTapes = [];
    this.listaGravadorasService
      .carregarGravadora(gravadora.id)
      .subscribe((resposta) => {
        this.listaTapesService
          .buscarTapeGrava(gravadora.id)
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
          this.nome_gravadora = resposta.nome_gravadora
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
  Alterar(gravadora: any) {
    this.gravadoraId = gravadora.id;
    this.listaGravadorasService
      .carregarGravadora(gravadora.id)
      .subscribe((resposta) => {
        this.nome_gravadora = resposta.nome_gravadora
        this.altera = true;
        this.modalGravadora.open();
      })
  }
  visualizar(gravadora: any) {
    this.gravadoraId = gravadora.id;
    this.listaGravadorasService
      .carregarGravadora(gravadora.id)
      .subscribe((resposta) => {
        this.nome_gravadora = resposta.nome_gravadora
        this.modalGravadoraView.open();
      })
  }
  async carregaLista() {
    this.Gravadoras = [];
    await this.listaGravadorasService
      .listaGravadoras()
      .subscribe((resposta) => {
        for (let index = 0; index < resposta.length; index++) {
          if (resposta[index].bloqueado === 'N') {
            this.Gravadoras.push(
              {
                id: resposta[index].id,
                nome_gravadora: resposta[index].nome_gravadora,
                acoes: ["1", "2", "3","4"]
              }
            )
          }
        }
        this.listaGravadoras = this.Gravadoras;
      })
  }

  buscarGravadora(): void {
    if (this.Gravadora) {
      this.listaGravadorasService
        .buscarGravadora(this.Gravadora)
        .subscribe((resposta) => {
          this.Gravadoras = [];
          for (let index = 0; index < resposta.length; index++) {
            if (resposta[index].bloqueado === 'N') {
              this.Gravadoras.push(
                {
                  id: resposta[index].id,
                  nome_gravadora: resposta[index].nome_gravadora,
                  acoes: ["1", "2", "3","4"]
                }
              )
            }
          }
          this.listaGravadoras = this.Gravadoras;
        })
    }
    this.carregaLista();
  }

  confirmaGravadora: PoModalAction = {
    action: () => {
      if (this.altera) {
        let Log = {
          descricao_log: 'Gravadora com ID: ' + this.gravadoraId + ' alterar pelo usuario: ' + sessionStorage.getItem('usuario') + ', com ID: ' + sessionStorage.getItem('id'),
          data_log: this.getDataEHoraAtual(),
        }
        this.gravadora = {
          id: this.gravadoraId,
          nome_gravadora: this.nome_gravadora.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase(),
        }
        this.listaGravadorasService
          .alteraGravadora(this.gravadora)
          .subscribe((res) => {
            this.ListaLogService
              .criarLog(Log)
              .subscribe((res) => {
                this.ngOnInit();
                this.modalGravadora.close();
              });
            this.poNotification.success(res.retorno);
            this.nome_gravadora = '';
            this.altera = false;
          },
            (err) => {
              console.log(err);
              this.poNotification.error(err.error.retorno);
              this.ngOnInit();
            })

      } else {
        let Log = {
          descricao_log: 'Gravadora: ' + this.nome_gravadora + ' criada pelo usuario: ' + sessionStorage.getItem('usuario') + ', com ID: ' + sessionStorage.getItem('id'),
          data_log: this.getDataEHoraAtual(),
        }
        this.gravadora = {
          nome_gravadora: this.nome_gravadora,
        }
        if (this.nome_gravadora != '') {
          this.listaGravadorasService
            .criarGravadora(this.gravadora)
            .subscribe((res) => {
              this.ListaLogService
                .criarLog(Log)
                .subscribe((res) => {
                  this.ngOnInit();
                  this.modalGravadora.close();
                });
              this.poNotification.success(res.retorno);

            },
              (err) => {
                console.log(err);
                this.poNotification.error(err.error.retorno);
                this.ngOnInit();
              })

        } else {
          this.poNotification.error('Insira o nome da Gravadora');
        }
      }
    },
    label: "Confirmar"
  };
  cancelarNomeTape: PoModalAction = {
    action: () => {
      this.nome_gravadora = '';
      this.modalNomeTape.close();
      this.altera = false;
    },
    label: "Cancelar"
  };

  cancelarGravadora: PoModalAction = {
    action: () => {
      this.nome_gravadora = '';
      this.modalGravadora.close();
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
        .exportData(this.tipoExport, this.listaGravadoras, this.colunas
        );
    },
    label: "Confirma"
  };

}
