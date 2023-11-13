import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PoModalAction, PoModalComponent, PoNotificationService, PoTableColumn } from '@po-ui/ng-components';
import { ListaDeArtistasService } from './artistas.service';
import { Exportacao } from '../exportacao/exportacao.service';
import { ListaDeLogService } from '../log/log.service';

@Component({
  selector: 'app-artistas',
  templateUrl: './artistas.component.html',
  styleUrls: ['./artistas.component.css']
})
export class ArtistasComponent {
  sessionStorage = sessionStorage.getItem('lcria_artistas');
  constructor(
    private poNotification: PoNotificationService,
    private listaArtistasService: ListaDeArtistasService,
    private ListaLogService: ListaDeLogService,
    private exportacao: Exportacao,
    private router: Router
  ) { }

  tipoExport: string = '';
  tipoCliente!: string;
  usuarios: Array<any> = new Array();
  Clientes: Array<any> = new Array();
  Artistas: Array<any> = new Array();
  cliente: Array<any> = new Array();
  acoes: Array<any> = new Array();
  artista: object | undefined;
  listaArtistas: Array<any> = new Array();
  Artista: any;
  artistaId!: number;
  visuArtista!: number;
  altera: boolean = false;
  nome!: string;
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
  nome_civil!: string;
  pseudonimo!: string;
  endereco!: string;
  telefone!: string;
  cpf!: string;
  conta_corrente!: string;

  @ViewChild("modalArtista", { static: true }) modalArtista!: PoModalComponent;
  @ViewChild("modalArtistaView", { static: true }) modalArtistaView!: PoModalComponent;
  @ViewChild('modalExport', { static: true }) modalExport!: PoModalComponent;

  ngOnInit(): void {
    //this.opcoesUsuarios();
    this.carregaLista();
  }

  public readonly colunas: Array<PoTableColumn> = [
    { property: "id", label: "ID", width: "10%" },
    { property: "nome_civil", label: "Nome civil", width: "45%" },
    { property: "pseudonimo", label: "Pseudonimo", width: "15%" },
    { property: "endereco", label: "endereco", width: "10%" },
    { property: "bairro", label: "bairro", width: "10%" },
    { property: "complemento", label: "complemento", width: "10%" },
    { property: "cidade", label: "cidade", width: "10%" },
    { property: "uf", label: "uf", width: "10%" },
    { property: "cep", label: "cep", width: "10%" },
    { property: "cpf", label: "CPF", width: "10%" },
    { property: "conta_corrente", label: "Conta corrente", width: "10%" },
    { property: "telefone", label: "Telefone", width: "10%" },
    {
      property: "acoes",
      label: "Ações",
      type: "icon",
      width: "5%",
      icons: this.icons(),
    },
  ];

  icons(): Array<any> {
    if (sessionStorage.getItem('laltera_artistas') === 'true') {
      this.acoes.push(
        {
          action: this.Alterar.bind(this),
          icon: "po-icon po-icon-edit",
          value: "1",
        });
    }
    this.acoes.push({
      action: this.visualizar.bind(this),
      icon: "po-icon po-icon-eye",
      value: "2",
    });
    if (sessionStorage.getItem('lexclui_artistas') === 'true') {
      this.acoes.push(
        {
          action: this.excluir.bind(this),
          icon: "po-icon po-icon-delete",
          value: "3"
        });
    }
    return this.acoes;
  }
  criarArtista() {
    this.nome_civil = '';
    this.pseudonimo = '';
    this.endereco = '';
    this.bairro = '';
    this.complemento = '';
    this.cidade = '';
    this.uf = '';
    this.cep = '';
    this.telefone = '';
    this.cpf = '';
    this.conta_corrente = '';
    this.modalArtista.open();
  }

  async excluir(Artista: any) {
    if (confirm("Deseja excluir o artista?")) {
      let Log = {
        descricao_log: 'Artista com ID: ' + Artista.id + ' excluido pelo usuario: ' + sessionStorage.getItem('usuario') + ', com Id: ' + sessionStorage.getItem('id'),
        data_log: this.getDataEHoraAtual(),
      }
      this.listaArtistasService
        .excluirArtista(Artista.id)
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
  Alterar(visuArtista: any) {
    this.artistaId = visuArtista.id;
    this.listaArtistasService
      .carregarArtista(visuArtista.id)
      .subscribe((resposta) => {
        this.nome_civil = resposta.nome_civil
        this.pseudonimo = resposta.pseudonimo
        this.endereco = resposta.endereco
        this.bairro = resposta.bairro
        this.complemento = resposta.complemento
        this.cidade = resposta.cidade
        this.uf = resposta.uf
        this.cep = resposta.cep
        this.telefone = resposta.telefone
        this.cpf = resposta.cpf
        this.conta_corrente = resposta.conta_corrente
        this.altera = true;
        this.modalArtista.open();
      })
  }

  visualizar(visuArtista: any) {
    this.artistaId = visuArtista.id;
    this.listaArtistasService
      .carregarArtista(visuArtista.id)
      .subscribe((resposta) => {
        this.nome_civil = resposta.nome_civil
        this.pseudonimo = resposta.pseudonimo
        this.endereco = resposta.endereco
        this.bairro = resposta.bairro
        this.complemento = resposta.complemento
        this.cidade = resposta.cidade
        this.uf = resposta.uf
        this.cep = resposta.cep
        this.telefone = resposta.telefone
        this.cpf = resposta.cpf
        this.conta_corrente = resposta.conta_corrente
        this.modalArtistaView.open();
      })
  }
  async carregaLista() {
    this.Artistas = [];
    await this.listaArtistasService
      .listaArtista()
      .subscribe((resposta) => {
        for (let index = 0; index < resposta.length; index++) {
          if (resposta[index].bloqueado === 'N') {
            this.Artistas.push(
              {
                id: resposta[index].id,
                nome_civil: resposta[index].nome_civil,
                pseudonimo: resposta[index].pseudonimo,
                endereco: resposta[index].endereco,
                bairro: resposta[index].bairro,
                complemento: resposta[index].complemento,
                cidade: resposta[index].cidade,
                uf: resposta[index].uf,
                cep: resposta[index].cep,
                cpf: resposta[index].cpf,
                telefone: resposta[index].telefone,
                conta_corrente: resposta[index].conta_corrente,
                acoes: ["1", "2", "3"]
              }
            )
          }
        }
        this.listaArtistas = this.Artistas;
      })
  }

  buscaArtista(): void {
    if (this.Artista) {
      this.listaArtistasService
        .buscarArtista(this.Artista)
        .subscribe((resposta) => {
          this.Artistas = [];
          for (let index = 0; index < resposta.length; index++) {
            if (resposta[index].bloqueado === 'N') {
            this.Artistas.push(
              {
                id: resposta[index].id,
                nome_civil: resposta[index].nome_civil,
                pseudonimo: resposta[index].pseudonimo,
                endereco: resposta[index].endereco,
                bairro: resposta[index].bairro,
                complemento: resposta[index].complemento,
                cidade: resposta[index].cidade,
                uf: resposta[index].uf,
                cep: resposta[index].cep,
                cpf: resposta[index].cpf,
                email: resposta[index].email,
                telefone: resposta[index].telefone,
                conta_corrente: resposta[index].conta_corrente,
                acoes: ["1", "2", "3"]
              }
            )
            }
          }
          this.listaArtistas = this.Artistas;
        })
    }
    this.carregaLista();
  }

  confirmaArtista: PoModalAction = {
    action: () => {
      if (this.altera) {
        let Log = {
          descricao_log: 'Artista com ID: ' + this.artistaId + ' alterado pelo usuario: ' + sessionStorage.getItem('usuario') + ', com Id: ' + sessionStorage.getItem('id'),
          data_log: this.getDataEHoraAtual(),
        }
        this.artista = {
          id: this.artistaId,
          nome_civil: this.nome_civil,
          pseudonimo: this.pseudonimo,
          endereco: this.endereco,
          bairro: this.bairro,
          complemento: this.complemento,
          cidade: this.cidade,
          uf: this.uf,
          cep: this.cep,
          telefone: this.telefone,
          cpf: this.cpf,
          conta_corrente: this.conta_corrente,
        }
        this.listaArtistasService
          .alteraArtista(this.artista)
          .subscribe((res) => {
            this.poNotification.success(res.retorno);
            this.altera = false;
            this.ListaLogService
              .criarLog(Log)
              .subscribe((res) => {
                console.log(res);
                this.ngOnInit();
                this.modalArtista.close();
              },
                (err) => {
                  console.log(err);
                  this.poNotification.error(err.error.retorno);
                  this.ngOnInit();
                });
          })
      } else {
        let Log = {
          descricao_log: 'Artista com nome: ' + this.nome_civil + ' Incluido pelo usuario: ' + sessionStorage.getItem('usuario') + ', com Id: ' + sessionStorage.getItem('id'),
          data_log: this.getDataEHoraAtual(),
        }
        this.artista = {
          nome_civil: this.nome_civil,
          pseudonimo: this.pseudonimo,
          endereco: this.endereco,
          bairro: this.bairro,
          complemento: this.complemento,
          cidade: this.cidade,
          uf: this.uf,
          cep: this.cep,
          telefone: this.telefone,
          cpf: this.cpf,
          conta_corrente: this.conta_corrente,
        }
        if (this.nome_civil != '') {
          this.listaArtistasService
            .criarArtista(this.artista)
            .subscribe((res) => {
              this.poNotification.success(res.retorno);
              this.ListaLogService
                .criarLog(Log)
                .subscribe((res) => {
                  this.ngOnInit();
                  this.modalArtista.close();
                },
                  (err) => {
                    console.log(err);
                    this.poNotification.error(err.error.retorno);
                    this.ngOnInit();
                  });
            })
        } else {
          this.poNotification.error('Insira o nome do artista');
        }
      }
    },
    label: "Confirmar"
  };
  cancelarArtista: PoModalAction = {
    action: () => {
      this.nome_civil = '';
      this.pseudonimo = '';
      this.endereco = '';
      this.bairro = '';
      this.complemento = '';
      this.cidade = '';
      this.uf = '';
      this.cep = '';
      this.telefone = '';
      this.cpf = '';
      this.conta_corrente = '';
      this.modalArtista.close();
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
        .exportData(this.tipoExport, this.listaArtistas, this.colunas
        );
    },
    label: "Confirma"
  };



}
