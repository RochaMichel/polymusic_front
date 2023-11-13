import { Injectable, Inject, Renderer2 } from "@angular/core";
import * as FileSaver from 'file-saver';
import * as Papa from 'papaparse';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { FileSaverService } from 'ngx-filesaver';
import * as PizZip from 'pizzip';
import * as Docxtemplater from 'docxtemplater';

(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: "root",
})
export class Exportacao {

  dataToExport: any[] = [];

  exportData(formato: string, dados: Array<any> = new Array(), colunas: Array<any> = new Array()) {
    if (formato === 'csv') {
      const csvData = this.generateCSV(dados);
      this.downloadFile(csvData, 'export.csv', 'text/csv');
    } else if (formato === 'pdf') {
      this.generatePDF(dados, colunas).then((pdfData) => {
        this.openPDF(pdfData); // Abra o PDF diretamente no navegador
      }).catch((error) => {
        console.error('Erro ao gerar PDF:', error);
      });
    }
  }

  generateCSV(data: any[]): string {
    const csv = Papa.unparse(data, { delimiter: ';' }); // Converte dados em CSV usando papaparse
    return csv;
  }

  generatePDF(data: any[], colunas: any[]): Promise<string> {
    return new Promise((resolve, reject) => {
      let columns: any[] = [];
      let rows = [];
      let items = [];
      for (let i = 0; i < colunas.length; i++) {
        if (colunas[i].property !== 'acoes') {
          columns.push(colunas[i].property)
        }
      }
      rows = data.map(objeto => {
        const linhas: any[] = [];
        columns.forEach(propriedade => {
          linhas.push(objeto[propriedade].toString())
        })
        return linhas;
      })
      const pdfDefinition = {
        pageOrientation: 'landscape' as any,
        content: [
          {
            format: 'A4',
            orientation: 'landscape',
            table: {
              headerRows: 1,
              body: [
                columns,
                ...rows
              ],
            },
          },
        ],

      };

      const pdfDocGenerator = pdfMake.createPdf(pdfDefinition);
      pdfDocGenerator.getDataUrl((dataUrl: any) => {
        resolve(dataUrl); // Resolva a promessa com a URL do PDF
      });
    });
  }

  openPDF(dataUrl: string) {
    const blob = this.dataURItoBlob(dataUrl);
    const blobUrl = URL.createObjectURL(blob);

    // Abra o PDF em uma nova janela ou guia
    const newWindow = window.open(blobUrl, '_blank');
    if (newWindow) {
      newWindow.focus();
    } else {
      // Se a abertura de uma nova janela for bloqueada, exiba um link para download
      this.downloadFile(dataUrl, 'export.pdf', 'application/pdf');
    }
  }

  downloadFile(data: string, filename: string, type: string) {
    const blob = new Blob([data], { type: type });
    FileSaver.saveAs(blob, filename);
  }

  private dataURItoBlob(dataURI: string): Blob {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const intArray = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      intArray[i] = byteString.charCodeAt(i);
    }

    return new Blob([arrayBuffer], { type: mimeString });
  }

}