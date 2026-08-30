import { Component, OnInit } from '@angular/core';
import { ServicoService, Servico } from '../../services/servico.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-criar-servico',
  templateUrl: './criar-servico.component.html',
  styleUrls: ['./criar-servico.component.css'],
  standalone: false
})
export class CriarServicoComponent implements OnInit {
  servico: Servico = {
    nome: '',
    valorDoServico: 0
  };

  servicos: Servico[] = [];
  serviceSelecionadoId: string | null = null;

  constructor(private servicoService: ServicoService) {}

  ngOnInit(): void {
    this.listarServicos();
  }

  listarServicos(): void {
    this.servicoService.listarTodos().subscribe({
      next: (dados) => this.servicos = dados,
      error: (erro) => console.error(erro)
    });
  }

  salvarServico(): void {
    if (!this.servico.nome?.trim()) {
      Swal.fire('Atenção', 'Informe o nome do serviço.', 'warning');
      return;
    }

    if (this.servico.valorDoServico <= 0) {
      Swal.fire('Atenção', 'Informe um valor válido para o serviço.', 'warning');
      return;
    }

    if (this.serviceSelecionadoId) {
      this.servicoService.atualizar(this.serviceSelecionadoId, this.servico).subscribe({
        next: (servico) => {
          Swal.fire('Sucesso!', 'Serviço atualizado com sucesso.', 'success');
          this.resetForm();
          this.listarServicos();
        },
        error: (erro) => {
          console.error(erro);
          Swal.fire('Erro', 'Não foi possível atualizar o serviço.', 'error');
        }
      });
      return;
    }

    this.servicoService.criar(this.servico).subscribe({
      next: (servico) => {
        Swal.fire('Sucesso!', 'Serviço criado com sucesso.', 'success');
        this.resetForm();
        this.listarServicos();
      },
      error: (erro) => {
        console.error(erro);
        Swal.fire('Erro', 'Não foi possível criar o serviço.', 'error');
      }
    });
  }

  editarServico(servico: Servico): void {
    this.servico = {
      id: servico.id,
      nome: servico.nome,
      valorDoServico: servico.valorDoServico
    };
    this.serviceSelecionadoId = servico.id ?? null;
  }

  excluirServico(id?: string): void {
    if (!id) {
      return;
    }

    Swal.fire({
      title: 'Excluir serviço?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.servicoService.deletar(id).subscribe({
          next: () => {
            Swal.fire('Sucesso!', 'Serviço excluído.', 'success');
            this.listarServicos();
            if (this.serviceSelecionadoId === id) {
              this.resetForm();
            }
          },
          error: (erro) => {
            console.error(erro);
            Swal.fire('Erro', 'Não foi possível excluir o serviço.', 'error');
          }
        });
      }
    });
  }

  cancelarEdicao(): void {
    this.resetForm();
  }

  private resetForm(): void {
    this.servico = {
      nome: '',
      valorDoServico: 0
    };
    this.serviceSelecionadoId = null;
  }
}
