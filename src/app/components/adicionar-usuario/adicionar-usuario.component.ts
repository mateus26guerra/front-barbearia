import { Component, OnInit } from '@angular/core';
import { AtendimentoService, Atendimento } from '../../services/atendimento-api.service';
import { ClienteService, Cliente } from '../../services/cliente.service';
import { ServicoService } from '../../services/servico.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-adicionar-usuario',
  templateUrl: './adicionar-usuario.component.html',
  styleUrls: ['./adicionar-usuario.component.css'],
  standalone: false
})
export class AdicionarUsuarioComponent implements OnInit {

  atendimento: Atendimento = {
    cliente: {
      id: ''
    },
    servicos: [],
    data: '',
    statusServico: 'ESPERADO',
    statusPagamento: 'NAO_PAGO'
  };

  atendimentos: Atendimento[] = [];
  clientes: Cliente[] = [];
  servicos: any[] = [];

  mostrarCadastroCliente = false;
  novoCliente: Cliente = {
    nome: '',
    numero: ''
  };

  atendimentoSelecionadoId: string | null = null;

  constructor(
    private atendimentoService: AtendimentoService,
    private clienteService: ClienteService,
    private servicoService: ServicoService
  ) {}

  gerarRelatorioPDF(): void {
    this.atendimentoService.gerarRelatorio().subscribe(pdfBlob => {
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'relatorio_atendimentos.pdf';
      link.click();
      window.URL.revokeObjectURL(url);
    });
  }

  gerarNotaFiscal(id: string | undefined): void {
    if (!id) {
      return;
    }

    this.atendimentoService.gerarNotaFiscal(id).subscribe(pdfBlob => {
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `nota_fiscal_${id}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    });
  }

  ngOnInit(): void {
    this.listarAtendimentos();
    this.listarClientes();
    this.listarServicos();
  }

  listarAtendimentos(): void {
    this.atendimentoService.listar().subscribe({
      next: (dados) => this.atendimentos = dados,
      error: (erro) => console.error(erro)
    });
  }

  listarClientes(): void {
    this.clienteService.listarTodos().subscribe({
      next: (dados) => this.clientes = dados,
      error: (erro) => console.error(erro)
    });
  }

  listarServicos(): void {
    this.servicoService.listarTodos().subscribe({
      next: (dados) => this.servicos = dados,
      error: (erro) => console.error(erro)
    });
  }

  abrirCadastroCliente(): void {
    this.mostrarCadastroCliente = true;
  }

  cancelarCadastroCliente(): void {
    this.mostrarCadastroCliente = false;
    this.novoCliente = {
      nome: '',
      numero: ''
    };
  }

  criarCliente(): void {
    if (!this.novoCliente.nome?.trim() || !this.novoCliente.numero?.trim()) {
      Swal.fire('Atenção', 'Informe nome e número do cliente.', 'warning');
      return;
    }

    this.clienteService.criar(this.novoCliente).subscribe({
      next: (cliente) => {
        this.clientes.push(cliente);

        if (cliente.id) {
          this.atendimento.cliente.id = cliente.id;
        }

        this.mostrarCadastroCliente = false;
        this.novoCliente = {
          nome: '',
          numero: ''
        };

        Swal.fire('Sucesso!', 'Cliente cadastrado.', 'success');
      },
      error: (erro) => {
        console.error(erro);
        Swal.fire('Erro', 'Não foi possível cadastrar o cliente.', 'error');
      }
    });
  }

  salvar(): void {

    if (this.atendimentoSelecionadoId) {

      this.atendimentoService.editar(
        this.atendimentoSelecionadoId,
        this.atendimento
      ).subscribe(() => {

        Swal.fire(
          'Sucesso!',
          'Atendimento atualizado.',
          'success'
        );

        this.limparFormulario();
        this.listarAtendimentos();

      });

    } else {

      this.atendimentoService.criar(this.atendimento)
        .subscribe(() => {

          Swal.fire(
            'Sucesso!',
            'Atendimento cadastrado.',
            'success'
          );

          this.limparFormulario();
          this.listarAtendimentos();

        });

    }

  }

  editar(atendimento: Atendimento): void {

    this.atendimento = {
      cliente: {
        id: atendimento.cliente.id
      },
      servicos: atendimento.servicos,
      data: atendimento.data.substring(0, 16),
      statusServico: atendimento.statusServico,
      statusPagamento: atendimento.statusPagamento
    };

    this.atendimentoSelecionadoId = atendimento.id ?? null;

  }

  excluir(id?: string): void {

    if (!id) {
      console.warn('Tentativa de excluir atendimento sem ID.');
      return;
    }

    Swal.fire({
      title: 'Excluir atendimento?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Cancelar'
    }).then(result => {

      if (result.isConfirmed) {

        this.atendimentoService.deletar(id).subscribe(() => {

          Swal.fire(
            'Sucesso!',
            'Atendimento excluído.',
            'success'
          );

          this.listarAtendimentos();

          if (this.atendimentoSelecionadoId === id) {
            this.limparFormulario();
          }

        });

      }

    });

  }

  limparFormulario(): void {

    this.atendimento = {
      cliente: {
        id: ''
      },
      servicos: [],
      data: '',
      statusServico: 'ESPERADO',
      statusPagamento: 'NAO_PAGO'
    };

    this.atendimentoSelecionadoId = null;

  }



  
}