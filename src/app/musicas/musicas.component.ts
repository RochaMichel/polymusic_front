import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PoModalAction, PoModalComponent, PoNotificationService, PoTableColumn } from '@po-ui/ng-components';
import { ListaDeMusicaService } from './musicas.service';
import { Exportacao } from '../exportacao/exportacao.service';
import { ListaDeEditorasService } from '../editoras/editoras.service';
import { ListaDeLogService } from '../log/log.service';
@Component({
  selector: 'app-musicas',
  templateUrl: './musicas.component.html',
  styleUrls: ['./musicas.component.css']
})
export class MusicaComponent {
  constructor(
    private poNotification: PoNotificationService,
    private listaMusicasService: ListaDeMusicaService,
    private listaEditorasService: ListaDeEditorasService,
    private listaLogService: ListaDeLogService,
    private exportacao: Exportacao,
    private router: Router
  ) { }

  tipoExport: string = '';
  tipoCliente!: string;
  usuarios: Array<any> = new Array();
  Editora: Array<any> = new Array();
  Musicas: Array<any> = new Array();
  acoes: Array<any> = new Array();
  criar = sessionStorage.getItem('lcria_musica');
  musica: object | undefined;
  listaMusicas: Array<any> = new Array();
  Musica: any;
  musicaId!: number;
  visuMusica!: number;
  altera: boolean = false;
  nome!: string;
  responsavel!: string;
  cpfCnpj!: string;
  rg!: string;
  nomeMusica!: string;
  album!: string;
  ano!: Date | undefined;
  categoria!: string;
  editora!: Number;



  @ViewChild("modalMusica", { static: true }) modalMusica!: PoModalComponent;
  @ViewChild("modalMusicaView", { static: true }) modalMusicaView!: PoModalComponent;
  @ViewChild('modalExport', { static: true }) modalExport!: PoModalComponent;

  ngOnInit(): void {
    this.carregaEditora();
    this.carregaLista();
  }

  public readonly colunas: Array<PoTableColumn> = [
    { property: "id", label: "ID", width: "10%" },
    { property: "musica", label: "Musica", width: "45%" },
    { property: "album", label: "Album", width: "15%" },
    { property: "ano", label: "Ano", width: "10%" },
    { property: "editora", label: "Editora", width: "10%" },
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
    if (sessionStorage.getItem('laltera_musica') === 'true') {
      this.acoes.push({
        action: this.Alterar.bind(this),
        icon: "po-icon po-icon-edit",
        value: "1",
      });
    }
    if (sessionStorage.getItem('lexclui_musica') === 'true') {
      this.acoes.push({
        action: this.excluir.bind(this),
        icon: "po-icon po-icon-delete",
        value: "3"
      });
    }
    return this.acoes;
  }

  criarMusica() {
    this.nomeMusica = '';
    this.album = '';
    this.ano = undefined;
    this.categoria = '';
    this.editora = 0;
    this.modalMusica.open();
  }

  carregaEditora() {
    this.Editora = [];
    this.listaEditorasService
      .listaEditora()
      .subscribe((resposta) => {
        for (let index = 0; index < resposta.length; index++) {
          this.Editora.push(
            {
              label: resposta[index].nome_editora,
              value: resposta[index].id,
            }
          )
        }
      })
  }

  excluir(Musica: any) {
    if (confirm("Deseja excluir o musica?")) {
      let Log = {
        descricao_log: 'Gravadora: ' + Musica.id + ' alterar pelo usuario: ' + sessionStorage.getItem('usuario') + ', com ID: ' + sessionStorage.getItem('id'),
        data_log: this.getDataEHoraAtual(),
      }
      this.listaMusicasService
        .excluirMusica(Musica.id)
        .subscribe((res) => {
          this.listaLogService
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
  Alterar(visuMusica: any) {
    this.musicaId = visuMusica.id;
    this.listaMusicasService
      .carregarMusica(visuMusica.id)
      .subscribe((resposta) => {
        let data = new Date(resposta.ano.toString())
        this.nomeMusica = resposta.musica
        this.album = resposta.album
        this.ano = new Date(data.setDate(data.getDate() + 1));
        this.editora = resposta.editora
        this.categoria = resposta.categoria
        this.altera = true;
        this.modalMusica.open();
      })
  }

  visualizar(visuMusica: any) {
    this.musicaId = visuMusica.id;
    this.listaMusicasService
      .carregarMusica(visuMusica.id)
      .subscribe((resposta) => {
        let data = new Date(resposta.ano.toString())
        this.nomeMusica = resposta.musica
        this.album = resposta.album
        this.ano = new Date(data.setDate(data.getDate() + 1));
        this.editora = resposta.editora
        this.categoria = resposta.categoria
        this.modalMusicaView.open();
      })
  }
  async carregaLista() {
    this.Musicas = [];
    await this.listaMusicasService
      .listarMusica()
      .subscribe((resposta) => {
        for (let index = 0; index < resposta.length; index++) {
          if (resposta[index].bloqueado === 'N') {
            let data = new Date(resposta[index].ano.toString())
            this.Musicas.push(
              {
                id: resposta[index].id,
                musica: resposta[index].musica,
                album: resposta[index].album,
                ano: new Date(data.setDate(data.getDate() + 1)),
                editora: resposta[index].Editora.nome_editora,
                acoes: ["1", "2", "3"]
              }
            )
          }
        }
        this.listaMusicas = this.Musicas;
      })
  }

  buscaMusica(): void {
    if (this.Musica) {
      this.listaMusicasService
        .buscarMusica(this.Musica)
        .subscribe((resposta) => {
          this.Musicas = [];
          this.listaMusicas = [];
          for (let index = 0; index < resposta.length; index++) {
            if (resposta[index].bloqueado === 'N') {
              let data = new Date(resposta[index].ano.toString())
              this.Musicas.push(
                {
                  id: resposta[index].id,
                  musica: resposta[index].musica,
                  album: resposta[index].album,
                  ano: new Date(data.setDate(data.getDate() + 1)),
                  editora: resposta[index].Editora.nome_editora,
                  acoes: ["1", "2", "3"]
                }
              )
            }
          }
          this.listaMusicas = this.Musicas;
        })
    }
    this.carregaLista();
  }

  confirmaMusica: PoModalAction = {
    action: () => {
      if (this.altera) {
        let Log = {
          descricao_log: 'Musica com ID: ' + this.musicaId + ' alterar pelo usuario: ' + sessionStorage.getItem('usuario') + ', com ID: ' + sessionStorage.getItem('id'),
          data_log: this.getDataEHoraAtual(),
        }
        this.musica = {
          id: this.musicaId,
          musica: this.nomeMusica,
          album: this.album,
          ano: this.ano,
          categoria: this.categoria,
          editora: this.editora
        }
        this.listaMusicasService
          .alteraMusica(this.musica)
          .subscribe(
            (res) => {
              this.listaLogService
                .criarLog(Log)
                .subscribe((res) => {
                  this.ngOnInit();
                  this.altera = false;
                  this.modalMusica.close();
                })
              this.poNotification.success(res.retorno);
            },
            (err) => {
              this.poNotification.error(err.error.retorno);
              this.altera = false;
              this.ngOnInit();
              this.modalMusica.close();
            })
      } else {
        let Log = {
          descricao_log: 'Musica: ' + this.nomeMusica + ' criada pelo usuario: ' + sessionStorage.getItem('usuario') + ', com ID: ' + sessionStorage.getItem('id'),
          data_log: this.getDataEHoraAtual(),
        }
        this.musica = {
          musica: this.nomeMusica,
          album: this.album,
          ano: this.ano,
          categoria: this.categoria,
          editora: this.editora
        }
        if (this.nomeMusica != '') {
          this.listaMusicasService
            .criarMusica(this.musica)
            .subscribe(
              (res) => {
                this.listaLogService
                  .criarLog(Log)
                  .subscribe((res) => {
                    this.ngOnInit();
                    this.modalMusica.close();
                  })
                this.poNotification.success(res.retorno);
              },
              (err) => {
                this.poNotification.error(err.error.retorno);
                this.ngOnInit();
                this.modalMusica.close();
              })

        } else {
          this.poNotification.error('Insira o nome do musica');
        }
      }
    },
    label: "Confirmar"
  };
  cancelarMusica: PoModalAction = {
    action: () => {
      this.nomeMusica = '';
      this.album = '';
      this.ano = undefined;
      this.categoria = '';
      this.editora = 0;
      this.modalMusica.close();
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
        .exportData(this.tipoExport, this.listaMusicas, this.colunas
        );
    },
    label: "Confirma"
  };



}
