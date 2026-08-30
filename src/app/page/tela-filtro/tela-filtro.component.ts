import { Component, OnInit } from '@angular/core';
import { AtendimentoService, Atendimento } from '../../services/atendimento-api.service';

@Component({
  selector: 'app-tela-filtro',
  templateUrl: './tela-filtro.component.html',
  styleUrls: ['./tela-filtro.component.css'],
  standalone: false
})
export class TelaFiltroComponent implements OnInit {

  campoFiltroSelecionado: string = '';
  filtroValor: string = '';

  atendimentos: Atendimento[] = [];
  atendimentosFiltrados: Atendimento[] = [];

  constructor(private atendimentoService: AtendimentoService) {}

  ngOnInit(): void {
    this.listarAtendimentos();
  }

  listarAtendimentos(): void {
    this.atendimentoService.listar().subscribe(data => {
      this.atendimentos = data;
      this.atendimentosFiltrados = [...this.atendimentos];
    });
  }

  aplicarFiltroGenerico(): void {
    const termo = this.filtroValor.trim().toLowerCase();

    if (!termo) {
      this.atendimentosFiltrados = [...this.atendimentos];
      return;
    }

    this.atendimentosFiltrados = this.atendimentos.filter(atendimento => {

      const clienteNome =
        atendimento.cliente.nome?.toString().toLowerCase() || '';

      const clienteNumero =
        atendimento.cliente.numero?.toString().toLowerCase() || '';

      const data =
        atendimento.data?.toString().toLowerCase() || '';

      const servicos =
        atendimento.servicos
          ?.map(s => s.nome)
          .join(', ')
          .toLowerCase() || '';

      const statusServico =
        atendimento.statusServico?.toString().toLowerCase() || '';

      const statusPagamento =
        atendimento.statusPagamento?.toString().toLowerCase() || '';

      const valorTotal =
        atendimento.valorTotal?.toString().toLowerCase() || '';

      if (this.campoFiltroSelecionado === 'clienteNome') {
        return clienteNome.includes(termo);
      }

      if (this.campoFiltroSelecionado === 'clienteNumero') {
        return clienteNumero.includes(termo);
      }

      if (this.campoFiltroSelecionado === 'data') {
        return data.includes(termo);
      }

      if (this.campoFiltroSelecionado === 'servicos') {
        return servicos.includes(termo);
      }

      if (this.campoFiltroSelecionado === 'statusServico') {
        return statusServico.includes(termo);
      }

      if (this.campoFiltroSelecionado === 'statusPagamento') {
        return statusPagamento.includes(termo);
      }

      return [
        clienteNome,
        clienteNumero,
        data,
        servicos,
        statusServico,
        statusPagamento,
        valorTotal
      ].some(campo => campo.includes(termo));
    });
  }

  resetarFiltro(): void {
    this.campoFiltroSelecionado = '';
    this.filtroValor = '';
    this.atendimentosFiltrados = [...this.atendimentos];
  }

  gerarNota(id: string): void {
    this.atendimentoService.gerarNotaFiscal(id).subscribe(pdfBlob => {

      const url = window.URL.createObjectURL(pdfBlob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `nota_fiscal_${id}.pdf`;

      link.click();

      window.URL.revokeObjectURL(url);
    });
  }
}