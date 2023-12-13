import { Component } from '@angular/core';
import { PoChartType, PoChartOptions, PoChartSerie, PoDialogService } from '@po-ui/ng-components';
import { ListaDeTapesService } from '../tapes/tapes.service';

@Component({
  selector: 'app-grafico',
  templateUrl: './grafico.component.html',
  styleUrls: ['./grafico.component.css']
})

export class GraficoComponent {
  constructor(
    private listaTapesService: ListaDeTapesService
    ){}
  quantidadeTotal: number = 0;
  quantidadeS: number = 0;
  quantidadeN: number = 0;
  categoriesColumn: Array<string> = ['Stream' , 'Não stream'];
  valoresGrafico: Array<PoChartSerie> = [];
  ngOnInit(): void {
    this.consultaTapes();
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

  options: PoChartOptions = {
    axis: {
      minRange: 100,
      maxRange: 40,
      gridLines: 5
    }
  };

  optionsColumn: PoChartOptions = {
    axis: {
      minRange:   0,
      maxRange: 100,
      gridLines: 7
    }
  };

  consultaTapes(){
    this.listaTapesService
    .listaTapesSteam()
    .subscribe((resposta) => {
      this.quantidadeN = resposta.quantN
      this.quantidadeS = resposta.quantS
      this.quantidadeTotal = resposta.quantN+resposta.quantS
      this.valoresGrafico =[{ label: 'No stream', data: resposta.quantN, tooltip: 'Quantidade => '+resposta.quantN.toString()+' Tapes', color: 'color-09' },
      { label: 'On stream', data: resposta.quantS, tooltip: 'Quantidade => '+resposta.quantS.toString()+' Tapes', color: 'color-02' }]
    });
  }

}
