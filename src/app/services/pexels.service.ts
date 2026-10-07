import { Injectable } from '@angular/core';
import { HttpErrorResponse, httpResource } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { PexelsSearch, Photo } from '../models/photo';

@Injectable({ providedIn: 'root' })
export class PexelsService {
  private readonly base = 'https://api.pexels.com/v1';
  private readonly headers = { Authorization: environment.pexelsKey };

  /** Busca reativa: refaz a requisição sempre que o termo ou a página mudam. */
  searchResource(term: () => string, page: () => number) {
    return httpResource<PexelsSearch>(() => ({
      url: `${this.base}/search`,
      params: { query: term(), per_page: 24, page: page(), orientation: 'portrait' },
      headers: this.headers,
    }));
  }

  /** Uma foto pelo id (rota /obra/:id). */
  photoResource(id: () => string) {
    return httpResource<Photo>(() => ({
      url: `${this.base}/photos/${id()}`,
      headers: this.headers,
    }));
  }

  /** Traduz o erro HTTP em instrução para quem está na tela. */
  describeError(error: unknown): string {
    const status = error instanceof HttpErrorResponse ? error.status : 0;
    if (status === 401 || !environment.pexelsKey)
      return 'A chave do Pexels está ausente ou inválida. Cole a sua em src/environments/environment.ts.';
    if (status === 404) return 'Esta obra não está mais no acervo.';
    if (status === 429) return 'O Pexels limitou as consultas por agora. Aguarde alguns minutos e tente de novo.';
    return 'Não foi possível carregar o acervo. Verifique a conexão e tente de novo.';
  }
}
