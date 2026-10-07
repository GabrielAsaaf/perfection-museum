# Museu da Perfeição Alheia

SPA em Angular 22 criada a partir da capa de **Ángel** (Grupo Frontera x Romeo Santos), para o trabalho "Da capa para a tela".

> Escolhi esta capa porque ela fala de **idealização**, e por isso meu site é um museu onde cada obra perfeita se afasta quando você tenta chegar perto.

## O que o site faz

- **Galeria**: fotos de lugares e objetos impecáveis, vindas da API do [Pexels](https://www.pexels.com/api/), por sala (praias, montanhas, lagos…), com filtro de texto e paginação.
- **Obra** (`/obra/:id`): a foto foge do cursor, fica menor e mais borrada a cada tentativa de aproximação. Afastar-se devolve a nitidez.
- **Desejadas**: obras guardadas (persistem no navegador), sempre desfocadas.
- **Indicar**: formulário reativo com validação.
- **Sobre** e página 404 no tema.

## Como rodar

```bash
npm install
# 1. Pegue uma chave gratuita em https://www.pexels.com/api/
# 2. Cole em src/environments/environment.ts  (pexelsKey)
npm start        # http://localhost:4200
```

## Estrutura

```
src/app/
  models/        tipos e salas (categorias)
  services/      PexelsService (httpResource), FavoritesService (signals)
  components/    navbar, photo-card, category-chips (reutilizáveis)
  pages/         gallery, detail, collection, suggest, about, not-found
src/styles.css   identidade visual (@theme do Tailwind) + CSS próprio
docs/            identidade visual (HTML), guia do moodboard
CONCEITO.md      conceito e ligação funcional
```

## Requisitos do trabalho, onde estão

| Requisito | Onde |
|---|---|
| 3+ rotas com menu e destaque | `app.routes.ts`, `navbar.ts` (`routerLinkActive`) |
| Rota com parâmetro | `obra/:id` → `detail.ts` |
| Rota `**` no tema | `not-found.ts` |
| 2+ componentes com `input()` | `photo-card.ts`, `category-chips.ts` |
| `output()` | `opened`/`toggled` no card, `selected` nos chips |
| `@if`, `@for` com `track` e `@empty` | `gallery.ts`, `collection.ts` |
| `computed` com trabalho real | `visible`, `summary` (galeria); `blur`, `scale`, `offset` (obra); `topPhotographer`, `sorted` (desejadas) |
| Serviço com `inject()` + API pública | `pexels.service.ts` (`httpResource`) |
| Carregando e erro na tela | `gallery.ts`, `detail.ts` |
| Formulário com validação | `suggest.ts` (botão desabilitado enquanto inválido) |
| Tailwind + CSS próprio | `styles.css`, classes nos templates |

## Créditos

Fotografias: [Pexels](https://www.pexels.com), com crédito ao fotógrafo em cada obra.
