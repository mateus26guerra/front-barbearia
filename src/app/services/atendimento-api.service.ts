import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Cliente {
  id: string;
  nome?: string;
  numero?: string | null;
}

export interface Servico {
  id: string;
  nome?: string;
  valorDoServico?: number;
}

export interface Atendimento {
  id?: string;

  cliente: Cliente;

  servicos: Servico[];

  data: string;

  statusServico: 'ESPERADO' | 'FINALIZADO';

  statusPagamento: 'PAGO' | 'NAO_PAGO';

  valorTotal?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AtendimentoService {

  private readonly apiUrl = 'http://localhost:8080/atendimentos';

  constructor(private http: HttpClient) { }

  listar(): Observable<Atendimento[]> {
    return this.http.get<Atendimento[]>(this.apiUrl);
  }

  buscar(id: string): Observable<Atendimento> {
    return this.http.get<Atendimento>(`${this.apiUrl}/${id}`);
  }

  criar(atendimento: Atendimento): Observable<Atendimento> {
    return this.http.post<Atendimento>(this.apiUrl, atendimento);
  }

  editar(id: string, atendimento: Atendimento): Observable<Atendimento> {
    return this.http.put<Atendimento>(
      `${this.apiUrl}/${id}`,
      atendimento
    );
  }

  deletar(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  gerarRelatorio(): Observable<Blob> {
    return this.http.get('http://localhost:8080/pdf/relatorio', { responseType: 'blob' });
  }

  gerarNotaFiscal(id: string): Observable<Blob> {
    return this.http.get(`http://localhost:8080/pdf/nota/${id}`, { responseType: 'blob' });
  }
}