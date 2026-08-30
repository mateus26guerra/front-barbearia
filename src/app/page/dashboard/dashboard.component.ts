
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import {
  Chart,
  ChartData,
  ChartOptions,
  registerables
} from 'chart.js';

import {
  AtendimentoService,
  Atendimento
} from '../../services/atendimento-api.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  constructor(
    private atendimentoService: AtendimentoService,

    @Inject(PLATFORM_ID)
    private platformId: Object
  ) {
    Chart.register(...registerables);
  }

  // IMPORTANTE PARA SSR
  isBrowser = false;

  atendimentos: Atendimento[] = [];

  // ==============================
  // INDICADORES
  // ==============================

  atendimentosHoje = 0;
  clientesTotal = 0;
  clientesNovosHoje = 0;
  receitaTotal = 0;
  pagamentosPendentes = 0;
  pagamentosRealizados = 0;

  // ==============================
  // PRÓXIMOS ATENDIMENTOS
  // ==============================

  proximosAtendimentos: Atendimento[] = [];

  // ==============================
  // GRÁFICO DE ATENDIMENTOS
  // ==============================

  graficoAtendimentosType: 'line' = 'line';

  graficoAtendimentosData: ChartData<'line'> = {
    labels: [],
    datasets: [
      {
        label: 'Atendimentos',
        data: [],
        tension: 0.4,
        fill: true
      }
    ]
  };

  graficoAtendimentosOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: true
      }
    },

    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    }
  };

  // ==============================
  // GRÁFICO DE SERVIÇOS
  // ==============================

  graficoServicosType: 'doughnut' = 'doughnut';

  graficoServicosData: ChartData<'doughnut'> = {
    labels: [],
    datasets: [
      {
        data: []
      }
    ]
  };

  graficoServicosOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  // ==============================
  // GRÁFICO DE PAGAMENTOS
  // ==============================

  graficoPagamentosType: 'bar' = 'bar';

  graficoPagamentosData: ChartData<'bar'> = {
    labels: [
      'Pagamentos realizados',
      'Pagamentos pendentes'
    ],

    datasets: [
      {
        label: 'Quantidade',
        data: [0, 0]
      }
    ]
  };

  graficoPagamentosOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: false
      }
    },

    scales: {
      y: {
        beginAtZero: true,

        ticks: {
          precision: 0
        }
      }
    }
  };

  carregando = true;

  ngOnInit(): void {

    // Verifica se estamos no navegador
    this.isBrowser = isPlatformBrowser(this.platformId);

    if (this.isBrowser) {
      this.carregarDashboard();
      return;
    }

    this.carregando = false;
  }


  // ==============================
  // CARREGAR DASHBOARD
  // ==============================

  carregarDashboard(): void {

    this.carregando = true;

    this.atendimentoService.listar().subscribe({

      next: (dados: Atendimento[]) => {

        this.atendimentos = dados || [];

        this.calcularIndicadores();

        this.carregarProximosAtendimentos();

        /*
         * IMPORTANTE:
         * Chart.js só deve ser preparado/renderizado
         * no navegador.
         */
        if (this.isBrowser) {

          this.montarGraficoAtendimentos();

          this.montarGraficoServicos();

          this.montarGraficoPagamentos();

        }

        this.carregando = false;
      },

      error: (erro) => {

        console.error(
          'Erro ao carregar dashboard:',
          erro
        );

        this.carregando = false;
      }

    });
  }


  // ==============================
  // INDICADORES
  // ==============================

  calcularIndicadores(): void {

    const hoje = new Date();

    const diaHoje = hoje.getDate();
    const mesHoje = hoje.getMonth();
    const anoHoje = hoje.getFullYear();


    // ATENDIMENTOS HOJE

    this.atendimentosHoje = this.atendimentos.filter(
      atendimento => {

        const data = new Date(atendimento.data);

        return (
          data.getDate() === diaHoje &&
          data.getMonth() === mesHoje &&
          data.getFullYear() === anoHoje
        );

      }
    ).length;


    // CLIENTES ÚNICOS

    const clientes = new Set<string>();

    this.atendimentos.forEach(atendimento => {

      if (atendimento.cliente?.id) {

        clientes.add(
          atendimento.cliente.id.toString()
        );

      }

    });

    this.clientesTotal = clientes.size;


    // CLIENTES HOJE

    const clientesHoje = new Set<string>();

    this.atendimentos
      .filter(atendimento => {

        const data = new Date(atendimento.data);

        return (
          data.getDate() === diaHoje &&
          data.getMonth() === mesHoje &&
          data.getFullYear() === anoHoje
        );

      })
      .forEach(atendimento => {

        if (atendimento.cliente?.id) {

          clientesHoje.add(
            atendimento.cliente.id.toString()
          );

        }

      });

    this.clientesNovosHoje = clientesHoje.size;


    // RECEITA

    this.receitaTotal = this.atendimentos
      .filter(
        atendimento =>
          atendimento.statusPagamento === 'PAGO'
      )
      .reduce(
        (total, atendimento) =>
          total + Number(
            atendimento.valorTotal || 0
          ),
        0
      );


    // PAGAMENTOS REALIZADOS

    this.pagamentosRealizados =
      this.atendimentos.filter(
        atendimento =>
          atendimento.statusPagamento === 'PAGO'
      ).length;


    // PAGAMENTOS PENDENTES

    this.pagamentosPendentes =
      this.atendimentos.filter(
        atendimento =>
          atendimento.statusPagamento === 'NAO_PAGO'
      ).length;
  }


  // ==============================
  // PRÓXIMOS ATENDIMENTOS
  // ==============================

  carregarProximosAtendimentos(): void {

    const agora = new Date();

    this.proximosAtendimentos =
      this.atendimentos

        .filter(atendimento => {

          const data =
            new Date(atendimento.data);

          return data >= agora;

        })

        .sort((a, b) => {

          const dataA =
            new Date(a.data).getTime();

          const dataB =
            new Date(b.data).getTime();

          return dataA - dataB;

        })

        .slice(0, 5);
  }


  // ==============================
  // GRÁFICO ATENDIMENTOS
  // ==============================

  montarGraficoAtendimentos(): void {

    const hoje = new Date();

    const dias: string[] = [];

    const valores: number[] = [];


    for (let i = 6; i >= 0; i--) {

      const data = new Date();

      data.setDate(
        hoje.getDate() - i
      );


      const dia = data.getDate();

      const mes = data.getMonth();

      const ano = data.getFullYear();


      const quantidade =
        this.atendimentos.filter(
          atendimento => {

            const dataAtendimento =
              new Date(atendimento.data);

            return (
              dataAtendimento.getDate() === dia &&
              dataAtendimento.getMonth() === mes &&
              dataAtendimento.getFullYear() === ano
            );

          }
        ).length;


      dias.push(
        `${String(dia).padStart(2, '0')}/${String(
          mes + 1
        ).padStart(2, '0')}`
      );


      valores.push(quantidade);
    }


    this.graficoAtendimentosData = {

      labels: dias,

      datasets: [
        {
          label: 'Atendimentos',

          data: valores,

          tension: 0.4,

          fill: true
        }
      ]

    };
  }


  // ==============================
  // GRÁFICO SERVIÇOS
  // ==============================

  montarGraficoServicos(): void {

    const quantidadeServicos: {
      [key: string]: number
    } = {};


    this.atendimentos.forEach(atendimento => {

      atendimento.servicos?.forEach(servico => {

        const nome =
          servico.nome || 'Outro';


        if (!quantidadeServicos[nome]) {

          quantidadeServicos[nome] = 0;

        }


        quantidadeServicos[nome]++;

      });

    });


    const nomes =
      Object.keys(quantidadeServicos);

    const valores =
      Object.values(quantidadeServicos);


    this.graficoServicosData = {

      labels: nomes,

      datasets: [
        {
          data: valores
        }
      ]

    };
  }


  // ==============================
  // GRÁFICO PAGAMENTOS
  // ==============================

  montarGraficoPagamentos(): void {

    this.graficoPagamentosData = {

      labels: [
        'Pagamentos realizados',
        'Pagamentos pendentes'
      ],

      datasets: [
        {
          label: 'Quantidade',

          data: [
            this.pagamentosRealizados,
            this.pagamentosPendentes
          ]
        }
      ]

    };
  }


  // ==============================
  // FORMATAR DATA
  // ==============================

  formatarData(data: any): string {

    if (!data) {
      return '--';
    }


    return new Date(data).toLocaleString(
      'pt-BR',
      {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }
    );
  }


  // ==============================
  // FORMATAR VALOR
  // ==============================

  formatarValor(valor: number): string {

    return Number(valor || 0).toLocaleString(
      'pt-BR',
      {
        style: 'currency',
        currency: 'BRL'
      }
    );
  }


  // ==============================
  // RECARREGAR
  // ==============================

  recarregar(): void {

    this.carregarDashboard();

  }

}

