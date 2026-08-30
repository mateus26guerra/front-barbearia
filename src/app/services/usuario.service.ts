import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private readonly apiUrl = 'https://back-end-barbearia-1.onrender.com/barbearias';

  constructor(private http: HttpClient) { }

  adicionarUsuario(usuario: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/adicionar`, usuario);
  }

  listarUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/listar`);
  }

  CortedoDia(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/cortes-hoje`);
  }

  excluirUsuario(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deletar/${id}`);
  }

  atualizarUsuario(id: string, usuario: any): Observable<any> {
  return this.http.put<any>(`${this.apiUrl}/atualizar/${id}`, usuario);
}



listarPorStatusPagamento(status: string) {
  return this.http.get<any[]>(`${this.apiUrl}/filtrar`, {
    params: { statusPagamento: status }
  });
}


gerarNotaFiscal(id: number): Observable<Blob> {
  return this.http.get(`${this.apiUrl}/nota-fiscal/${id}`, {
    responseType: 'blob'
  });
}

gerarTodasNotaFiscal(): Observable<Blob> {
  return this.http.get(`${this.apiUrl}/Todas-nota-fiscal`, {
    responseType: 'blob'
  });
}

corteshojepdf(): Observable<Blob> {
  return this.http.get(`${this.apiUrl}/cortes-hojepdf`, {
    responseType: 'blob'
  });
}

}
