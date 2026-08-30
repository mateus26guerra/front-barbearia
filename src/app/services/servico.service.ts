import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Servico {
  id?: string;
  nome: string;
  valorDoServico: number;
}

@Injectable({
  providedIn: 'root'
})
export class ServicoService {

  private readonly apiUrl = 'http://localhost:8080/servicos';

  constructor(private http: HttpClient) {}

  criar(servico: Servico): Observable<Servico> {
    return this.http.post<Servico>(this.apiUrl, servico);
  }

  listarTodos(): Observable<Servico[]> {
    return this.http.get<Servico[]>(this.apiUrl);
  }

  buscarPorId(id: string): Observable<Servico> {
    return this.http.get<Servico>(`${this.apiUrl}/${id}`);
  }

  atualizar(id: string, servico: Servico): Observable<Servico> {
    return this.http.put<Servico>(`${this.apiUrl}/${id}`, servico);
  }

  deletar(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}