import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Unidate } from './product.model';

interface Fluido {
  value: string;
  viewValue: string;
}
interface MetododeCobranca {
  value: number;
  viewValue: string;
}
interface Fornecedor {
  value: number;
  viewValue: string;
}
interface TabelaEscalonada {
  faixa: number;
  fatormultiplicador: number;
}
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  selectedValue: number;
  selectedMetodo: number = 1;
  fornecedorValue: number = 30.64;
  fluidoValue: string = 'Água';
  numerounidade: number;
  consumoValue: number;
  valoConta: number;
  valortotalUnidades: number = 0;
  ConsumoTotalUnidades: number = 0;
  displayedColumns: string[] = ['unidade', 'consumo', 'ValorUnitario', 'taxaFixa', 'ValorFluido', 'valorRateio', 'valorTotal'];
  numeroUnidades: number = 5;
  consumoConta: number = 100;
  valorConta: number = 500;
  unidades: Unidate[] = [];
  valorM3: Number = 0;
  dataSource = new MatTableDataSource<Unidate>(this.unidades);
  metodo: MetododeCobranca[] = [
    { value: 1, viewValue: 'Tarifa Única' },   // total da conta copasa/consumofaturado da copasa/unidades
    { value: 2, viewValue: 'Tarifa Única + Taxa Fixa' }, // (total da conta copasa-total da taxa fixa)/consumofaturado da copasa/unidades
    { value: 3, viewValue: 'Tarifa Escalonada + Taxa Fixa' },// tabela de es
    { value: 4, viewValue: 'Tarifa Única + Rateio Condomínio' },
    { value: 5, viewValue: 'Tarifa Única + Taxa Fixa + Rateio Condomínio' },
    { value: 6, viewValue: 'Tarifa Escalonada + Taxa Fixa + Rateio do Condomínio' },
    { value: 7, viewValue: 'Tarifa Única Proporcional' },
    { value: 8, viewValue: 'Tarifa Única Proporcional + Taxa Fixa' },
    { value: 9, viewValue: 'Tarifa Única do Custo Efetivo' },
  //  { value: 11, viewValue: 'Tarifa Única + Rateio Bloco' },
  //  { value: 12, viewValue: 'Tarifa Única + Taxa Fixa + Rateio Bloco' },
  ];
  fluido: Fluido[] = [
    { value: 'Água', viewValue: 'Água' },
    { value: 'GAS', viewValue: 'GAS' },
    { value: 'Energia', viewValue: 'Energia' },
  ];
  fornecedor: Fornecedor[] = [
    { value: 30.64, viewValue: 'COPASA' },
    // { value: 5.00, viewValue: 'GASMIG' },
    // { value: 25.00, viewValue: 'CORSAN' },
    // { value: 80.00, viewValue: 'CEMIG' },
  ];

  tabelaEscalonada: TabelaEscalonada[] = [
    { faixa: 5, fatormultiplicador: 3.170 },
    { faixa: 10, fatormultiplicador: 6.762 },
    { faixa: 15, fatormultiplicador: 10.480 },
    { faixa: 20, fatormultiplicador: 14.306 },
    { faixa: 40, fatormultiplicador: 18.197 },
    { faixa: 40, fatormultiplicador: 22.200 }
  ]

  ngOnInit(): void {
    this.construirCalcularUnidades();
  }

  compartilhar(): void {
    //this.router.navigate(['/products'])
  }
 
  construirUnidades(): void 
  {
    this.unidades = [];
    for (let i = 0; i < this.numeroUnidades; i++) {
      const unidade: Unidate = new Unidate();
      unidade.nome = `APTO ${i + 1}`;
      unidade.consumo = 0;
      unidade.taxaFixa = 0;
      unidade.valorUnitario = 0;
      unidade.valorFluido = 0;
      unidade.valorRateio = 0;
      unidade.valorTotal = 0;
      this.unidades.push(unidade);
    }
    this.calcularConsumodaFaturaUnidades();
    this.dataSource.data = this.unidades;
  }
  calculaCOPASA(consumoDaUnidade):number 
  {
    var valorUnidade:number = 0;
                 
    if (consumoDaUnidade > 5) 
    {
      valorUnidade += 5 * this.tabelaEscalonada[0].fatormultiplicador;
      consumoDaUnidade = consumoDaUnidade -5;
    }
    else
    {
      valorUnidade = consumoDaUnidade * this.tabelaEscalonada[0].fatormultiplicador;
      return valorUnidade;
    }
    if (consumoDaUnidade > 5) 
    {
      valorUnidade +=  5 * this.tabelaEscalonada[1].fatormultiplicador;
      consumoDaUnidade = consumoDaUnidade -5;      
    }
    else
    {
      valorUnidade += consumoDaUnidade * this.tabelaEscalonada[1].fatormultiplicador;
      return valorUnidade;
    }
    if (consumoDaUnidade > 5) 
    {
      valorUnidade += 5 * this.tabelaEscalonada[2].fatormultiplicador;
      consumoDaUnidade = consumoDaUnidade -5;        
    }
    else
    {
      valorUnidade += consumoDaUnidade * this.tabelaEscalonada[2].fatormultiplicador;
      return valorUnidade;
    }
    if (consumoDaUnidade > 5) 
    {
      valorUnidade += 5 * this.tabelaEscalonada[3].fatormultiplicador;
      consumoDaUnidade = consumoDaUnidade -5;        
    }
    else
    {
      valorUnidade += consumoDaUnidade * this.tabelaEscalonada[3].fatormultiplicador;
      return valorUnidade;
    }

    if (consumoDaUnidade > 20) 
    {
      valorUnidade += 20 * this.tabelaEscalonada[4].fatormultiplicador;
      consumoDaUnidade = consumoDaUnidade -20;        
    }
    else
    {
      valorUnidade += consumoDaUnidade * this.tabelaEscalonada[4].fatormultiplicador;
      return valorUnidade;
    }
      
    valorUnidade += consumoDaUnidade * this.tabelaEscalonada[5].fatormultiplicador;                
       
    return valorUnidade;  
  }

  calcularConsumodaFaturaUnidades(): void 
  {
    for (let i = 0; i < this.numeroUnidades; i++) 
    {
      const unidade: Unidate = this.unidades[i];
      unidade.consumo = this.consumoConta / this.numeroUnidades;
      unidade.consumo = parseFloat(unidade.consumo.toFixed(3));
    }
    this.calcularUnidades();
    this.dataSource.data = this.unidades;
  }
  calcularUnidadeseConsumoFaturaUnidades(): void 
  {
    this.calcularConsumodaFaturaUnidades();
    this.calcularUnidades();
  }
  calcularUnidades(): void {
    this.valortotalUnidades = 0;
    this.ConsumoTotalUnidades = 0;

    if (this.fluidoValue == 'Água' && this.selectedMetodo == 1) { //Tarifa Única
      for (let i = 0; i < this.unidades.length; i++) {
        const unidade: Unidate = this.unidades[i];
        unidade.taxaFixa = 0;
        unidade.valorUnitario = this.valorConta / this.consumoConta;
        unidade.valorFluido = unidade.consumo * unidade.valorUnitario;
        unidade.valorRateio = 0;
        unidade.valorTotal = unidade.valorFluido + unidade.taxaFixa + unidade.valorRateio;
      }
      this.dataSource.data = this.unidades;
    }
    if (this.fluidoValue == 'Água' && this.selectedMetodo == 2) { //Tarifa Única + Taxa Fixa
      for (let i = 0; i < this.numeroUnidades; i++) {
        const unidade: Unidate = this.unidades[i];
        unidade.taxaFixa = 30.64;
        unidade.valorUnitario = (this.valorConta - (unidade.taxaFixa * this.numeroUnidades)) / this.consumoConta;
        unidade.valorFluido = unidade.consumo * unidade.valorUnitario;
        unidade.valorRateio = 0;
        unidade.valorTotal = unidade.valorFluido + unidade.taxaFixa + unidade.valorRateio ;
      }
      this.dataSource.data = this.unidades;
    }

    if (this.fluidoValue == 'Água' && this.selectedMetodo == 3) // Tarifa Escalonada + Taxa Fixa
    { 
      for (let i = 0; i < this.numeroUnidades; i++) 
      {
        const unidade: Unidate = this.unidades[i];
        unidade.taxaFixa = 30.64;
        unidade.valorUnitario = this.calculaCOPASA(unidade.consumo)/unidade.consumo;
        unidade.valorFluido = this.calculaCOPASA(unidade.consumo);
        unidade.valorRateio = 0;   
        unidade.valorTotal = unidade.valorFluido + unidade.taxaFixa + unidade.valorRateio;
      }
      this.dataSource.data = this.unidades;
    }

    if (this.fluidoValue == 'Água' && this.selectedMetodo == 4) { //Tarifa Única + Rateio Condomínio

      for (let i = 0; i < this.numeroUnidades; i++) {
        const unidade: Unidate = this.unidades[i];
        unidade.taxaFixa = 0;
        unidade.valorUnitario = this.valorConta / this.consumoConta;
        unidade.valorFluido = unidade.consumo * unidade.valorUnitario;
        unidade.valorRateio = 0;
        unidade.valorTotal = unidade.valorFluido + unidade.taxaFixa + unidade.valorRateio;
      }
      this.dataSource.data = this.unidades;
    }

    if (this.fluidoValue == 'Água' && this.selectedMetodo == 5) { //Tarifa Única + Taxa Fixa + Rateio Condomínio
      for (let i = 0; i < this.numeroUnidades; i++) {
        const unidade: Unidate = this.unidades[i];
        unidade.taxaFixa = 30.64;
        unidade.valorUnitario = (this.valorConta - (unidade.taxaFixa * this.numeroUnidades)) / this.consumoConta;
        unidade.valorFluido = unidade.consumo * unidade.valorUnitario;
        unidade.valorRateio = 0;
        unidade.valorTotal = unidade.valorFluido + unidade.taxaFixa + unidade.valorRateio;
        //
      }
      this.dataSource.data = this.unidades;
    }

    if (this.fluidoValue == 'Água' && this.selectedMetodo == 6) { //Tarifa Escalonada + Taxa Fixa + Rateio do Condomínio
      for (let i = 0; i < this.numeroUnidades; i++) {
        const unidade: Unidate = this.unidades[i];
        unidade.taxaFixa = 30.64;
        unidade.valorUnitario = this.calculaCOPASA(unidade.consumo)/unidade.consumo;
        unidade.valorFluido = this.calculaCOPASA(unidade.consumo);
        unidade.valorRateio = 0; 
        unidade.valorTotal = unidade.valorFluido + unidade.taxaFixa + unidade.valorRateio ;
      }
      this.dataSource.data = this.unidades;
    }

    if (this.fluidoValue == 'Água' && this.selectedMetodo == 7) //Tarifa Única Proporcional
    { 
      for (let i = 0; i < this.numeroUnidades; i++) 
      {
        const unidade: Unidate = this.unidades[i];
        unidade.taxaFixa = 0;
        unidade.valorUnitario = this.valorConta / this.consumoConta;
        unidade.valorFluido = unidade.consumo * unidade.valorUnitario;
        unidade.valorRateio = 0;
        unidade.valorTotal = unidade.valorFluido + unidade.taxaFixa + unidade.valorRateio; 
      
      }
      this.dataSource.data = this.unidades;
    }  
    if (this.fluidoValue == 'Água' && this.selectedMetodo == 8){ //Tarifa Única Proporcional + Taxa Fixa
     
      for (let i = 0; i < this.numeroUnidades; i++) {
        const unidade: Unidate = this.unidades[i];
        unidade.taxaFixa = 30.64;
        unidade.valorUnitario =  (this.valorConta - (unidade.taxaFixa * this.numeroUnidades)) / this.consumoConta;
        unidade.valorFluido = unidade.consumo * unidade.valorUnitario;
        unidade.valorRateio = 0;
        unidade.valorTotal = unidade.valorFluido + unidade.taxaFixa + unidade.valorRateio; 
      }
      this.dataSource.data = this.unidades;
    }

    if (this.fluidoValue == 'Água' && this.selectedMetodo == 9){ //Tarifa Única Custo Efetiivo
    
      for (let i = 0; i < this.numeroUnidades; i++) {
        const unidade: Unidate = this.unidades[i];
        unidade.taxaFixa = 30.64;
        unidade.valorUnitario =  (this.valorConta - (unidade.taxaFixa * this.numeroUnidades)) / this.consumoConta;
        unidade.valorFluido = unidade.consumo * unidade.valorUnitario;
        unidade.valorRateio = 0;
        unidade.valorTotal = unidade.valorFluido + unidade.taxaFixa + unidade.valorRateio; 
      }
      this.dataSource.data = this.unidades;
    }
   
   
    this.unidades.forEach((u:Unidate) => this.valortotalUnidades += u.valorTotal);
    this.unidades.forEach((u:Unidate) => this.ConsumoTotalUnidades += u.consumo);
    

    if (this.fluidoValue == 'Água' && this.selectedMetodo == 4) { //Tarifa Única + Rateio Condomínio
      this.unidades.forEach((u: Unidate) => u.valorRateio = (this.valorConta - this.valortotalUnidades) / this.numeroUnidades);
      this.unidades.forEach((u: Unidate) => u.valorTotal += u.valorRateio);
    }
    if (this.fluidoValue == 'Água' && this.selectedMetodo == 5) { //Tarifa Única + Taxa Fixa + Rateio Condomínio
      this.unidades.forEach((u: Unidate) => u.valorRateio = (this.valorConta - this.valortotalUnidades) / this.numeroUnidades);
      this.unidades.forEach((u: Unidate) => u.valorTotal += u.valorRateio);
    }

    if (this.fluidoValue == 'Água' && this.selectedMetodo == 6) { //Tarifa Escalonada + Taxa Fixa + Rateio Condomínio
      this.unidades.forEach((u: Unidate) => u.valorRateio = (this.valorConta - this.valortotalUnidades) / this.numeroUnidades);
      this.unidades.forEach((u: Unidate) => u.valorTotal += u.valorRateio);
      this.valortotalUnidades = 0;
      this.unidades.forEach((u:Unidate) => this.valortotalUnidades += u.valorTotal);
    }

    if (this.fluidoValue == 'Água' && this.selectedMetodo == 7) { //Tarifa Única Proporcional
      this.unidades.forEach((u: Unidate) => u.valorUnitario = this.valorConta / this.ConsumoTotalUnidades);
      this.unidades.forEach((u: Unidate) => u.valorTotal =  u.valorUnitario * u.consumo);
      this.valortotalUnidades = 0;
      this.unidades.forEach((u:Unidate) => this.valortotalUnidades += u.valorTotal);
    }
    if (this.fluidoValue == 'Água' && this.selectedMetodo == 8) { //Tarifa Única Proporcional + Taxa Fixa
      this.unidades.forEach((u: Unidate) => u.valorUnitario = (this.valorConta-(u.taxaFixa * this.numeroUnidades)) / this.ConsumoTotalUnidades);
      this.unidades.forEach((u: Unidate) => u.valorTotal =  (u.valorUnitario * u.consumo)+u.taxaFixa);
      this.valortotalUnidades = 0;
      this.unidades.forEach((u:Unidate) => this.valortotalUnidades += u.valorTotal);
    }
   if (this.fluidoValue == 'Água' && this.selectedMetodo == 9) { //Tarifa Única Proporcional + Taxa Fixa
      this.unidades.forEach((u: Unidate) => u.valorUnitario = (this.valorConta - (u.taxaFixa * this.numeroUnidades)) / this.consumoConta);
      this.unidades.forEach((u: Unidate) => u.valorTotal =  u.valorUnitario * u.consumo);
      this.valortotalUnidades = 0;
      this.unidades.forEach((u:Unidate) => this.valortotalUnidades += u.valorTotal);
    }
  }

  construirCalcularUnidades(): void {
    this.construirUnidades();
    this.calcularUnidades();
  }
}
//


/*
        Tabela escalonada residencial
Faixa	    mil litros água	  mil litros esgoto	  Total: R$/m³
0 a 5	    1,82	            1,35	              R$ 3,17 
5 a 10	  3,886	            2,876	              R$ 6,76 
10 a 15	  6,023	            4,457	              R$ 10,48 
15 a 20	  8,222	            6,084	              R$ 14,31 
20 a 40	  10,458	          7,739	              R$ 18,20 
acima 40	12,759	          9,441	              R$ 22,20 
*/