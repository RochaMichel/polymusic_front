import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PoModalAction, PoModalComponent, PoNotificationService, PoTableColumn } from '@po-ui/ng-components';
import { ListaDeEditorasService } from './editoras.service';
import { Exportacao } from '../exportacao/exportacao.service';
import { ListaDeLogService } from '../log/log.service';
@Component({
  selector: 'app-editoras',
  templateUrl: './editoras.component.html',
  styleUrls: ['./editoras.component.css']
})
export class EditorasComponent {
  constructor(
    private poNotification: PoNotificationService,
    private listaEditorasService: ListaDeEditorasService,
    private ListaLogService: ListaDeLogService,
    private exportacao: Exportacao,
    private router: Router
  ) { }
  criaEditora = sessionStorage.getItem('lcria_editoras');
  tipoExport: string = '';
  tipoCliente!: string;
  usuarios: Array<any> = new Array();
  Editoras: Array<any> = new Array();
  acoes: Array<any> = new Array();
  editora: object | undefined;
  listaEditoras: Array<any> = new Array();
  Editora: any;
  editoraId!: number;
  altera: boolean = false;
  nome_editora!: string;
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

  @ViewChild("modalEditora", { static: true }) modalEditora!: PoModalComponent;
  @ViewChild("modalEditoraView", { static: true }) modalEditoraView!: PoModalComponent;
  @ViewChild('modalExport', { static: true }) modalExport!: PoModalComponent;

  ngOnInit(): void {
    this.carregaLista();
  }

  public readonly colunas: Array<PoTableColumn> = [
    { property: "id", label: "ID", width: "10%" },
    { property: "nome_editora", label: "Nome da Editora", width: "80%" },
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
    if (sessionStorage.getItem('laltera_editoras') === 'true') {
      this.acoes.push({
        action: this.Alterar.bind(this),
        icon: "po-icon po-icon-edit",
        value: "1",
      });
    }
    if (sessionStorage.getItem('lexclui_editoras') === 'true') {
      this.acoes.push({
        action: this.excluir.bind(this),
        icon: "po-icon po-icon-delete",
        value: "3"
      });
    }
    return this.acoes;
  }

  criarEditora() {
    this.nome_editora = '';
    this.modalEditora.open();
  }

  excluir(editoraId: any) {
    if (confirm("Deseja excluir a Editora?")) {
      let Log = {
        descricao_log: 'Editora com ID: ' + editoraId.id + ' excluida pelo usuario: ' + sessionStorage.getItem('usuario') + ', com Id: ' + sessionStorage.getItem('id'),
        data_log: this.getDataEHoraAtual(),
      }
      this.listaEditorasService
        .excluirEditora(editoraId.id)
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
  Alterar(editoraId: any) {
    this.editoraId = editoraId.id;
    this.listaEditorasService
      .carregarEditora(this.editoraId)
      .subscribe((resposta) => {
        this.nome_editora = resposta.nome_editora
        this.modalEditora.open();
      })
  }
  visualizar(editoraId: any) {
    this.editoraId = editoraId.id;
    this.listaEditorasService
      .carregarEditora(this.editoraId)
      .subscribe((resposta) => {
        this.nome_editora = resposta.nome_editora
        this.altera = true;
        this.modalEditoraView.open();
      })
  }

  async carregaLista() {
    this.Editoras = [];
    await this.listaEditorasService
      .listaEditora()
      .subscribe((resposta) => {
        for (let index = 0; index < resposta.length; index++) {
          if (resposta[index].bloqueado === 'N') {
          this.Editoras.push(
            {
              id: resposta[index].id,
              nome_editora: resposta[index].nome_editora,
              acoes: ["1", "2", "3"]
            }
          )
        }
      }
        this.listaEditoras = this.Editoras;
      })
  }

  buscarEditora(): void {
    if (this.Editora) {
      this.listaEditorasService
        .buscarEditora(this.Editora)
        .subscribe((resposta) => {
          this.Editoras = [];
          for (let index = 0; index < resposta.length; index++) {
            if (resposta[index].bloqueado === 'N') {
            this.Editoras.push(
              {
                id: resposta[index].id,
                nome_editora: resposta[index].nome_editora,
                acoes: ["1", "2", "3"]
              }
            )
            }
          }
          this.listaEditoras = this.Editoras;
        })
    }
    this.carregaLista();
  }

  confirmaEditora: PoModalAction = {
    action: () => {
      if (this.altera) {
        let Log = {
          descricao_log: 'Editora com ID: ' + this.editoraId + ' alterar pelo usuario: ' + sessionStorage.getItem('usuario') + ', com ID: ' + sessionStorage.getItem('id'),
          data_log: this.getDataEHoraAtual(),
        }
        this.editora = {
          id: this.editoraId,
          nome_editora: this.nome_editora,
        }
        this.listaEditorasService
          .alteraEditora(this.editora)
          .subscribe((res) => {
            this.ListaLogService
              .criarLog(Log)
              .subscribe((res) => {
                this.ngOnInit();
                this.modalEditora.close();
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
          descricao_log: 'Editora: ' + this.nome_editora + ' criado pelo usuario: ' + sessionStorage.getItem('usuario') + ', com ID: ' + sessionStorage.getItem('id'),
          data_log: this.getDataEHoraAtual(),
        }
        this.editora = {
          nome_editora: this.nome_editora
        }
        if (this.nome_editora != '') {
          this.listaEditorasService
            .criarEditora(this.editora)
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
        } else {
          this.poNotification.error('Insira o nome da editora');
        }
      }
    },
    label: "Confirmar"
  };

  cancelarEditora: PoModalAction = {
    action: () => {
      this.nome_editora = '';
      this.modalEditora.close();
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
        .exportData(this.tipoExport, this.listaEditoras, this.colunas
        );
    },
    label: "Confirma"
  };

}
