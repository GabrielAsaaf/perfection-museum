import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CATEGORIES, Photo } from '../../models/photo';
import { PexelsService } from '../../services/pexels.service';
import { FavoritesService } from '../../services/favorites.service';
import { PhotoCard } from '../../components/photo-card/photo-card';
import { CategoryChips } from '../../components/category-chips/category-chips';

@Component({
  selector: 'app-gallery',
  imports: [PhotoCard, CategoryChips],
  template: `
    <section class="pt-10">
      <header class="mb-8 max-w-2xl">
        <h1 class="text-5xl leading-[1.05] md:text-6xl">Aprecie de longe.</h1>
        <p class="mt-4 text-lg text-tinta/75">
          Lugares e objetos sem uma falha. Chegue perto para ver os detalhes, se conseguir.
        </p>
      </header>

      <app-category-chips [categories]="categories" [active]="activeTerm()" (selected)="selectCategory($event)" />

      <div class="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div class="w-full sm:w-72">
          <label for="filtro" class="mb-1 block text-sm text-tinta/70">Filtrar nesta sala</label>
          <input id="filtro" type="search" placeholder="fotógrafo ou descrição" [value]="filterText()"
                 (input)="filterText.set($any($event.target).value)"
                 class="w-full border border-tinta/30 bg-moldura px-3 py-2 focus:border-asa" />
        </div>
        <p class="text-sm text-tinta/70" aria-live="polite">{{ summary() }}</p>
      </div>

      <div class="mt-8">
        @if (results.isLoading()) {
          <div class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4" aria-busy="true" aria-label="Carregando acervo">
            @for (n of skeletons; track n) {
              <div class="moldura"><div class="aspect-[4/5] animate-pulse bg-nevoa/25"></div><div class="mt-3 h-5 w-2/3 animate-pulse bg-nevoa/25"></div></div>
            }
          </div>
        } @else if (results.error()) {
          <div class="max-w-xl border border-erro/60 bg-moldura p-5" role="alert">
            <p class="font-display text-2xl text-erro">A sala não abriu.</p>
            <p class="mt-2">{{ errorMessage() }}</p>
            <button type="button" (click)="results.reload()"
                    class="mt-4 cursor-pointer bg-asa px-4 py-2 text-white hover:bg-tinta">Tentar de novo</button>
          </div>
        } @else {
          <div class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            @for (p of visible(); track p.id) {
              <app-photo-card [photo]="p" [favorite]="favorites.has(p.id)" (opened)="open($event)" (toggled)="favorites.toggle($event)" />
            } @empty {
              <p class="col-span-full py-10 text-lg">Nenhuma obra combina com “{{ filterText() }}”. Limpe o filtro para ver a sala inteira.</p>
            }
          </div>

          <div class="mt-10 flex items-center justify-between">
            <button type="button" (click)="page.set(page() - 1)" [disabled]="page() === 1"
                    class="cursor-pointer border border-tinta/30 px-4 py-2 enabled:hover:border-asa enabled:hover:text-asa disabled:cursor-not-allowed disabled:opacity-40">Sala anterior</button>
            <span class="text-sm text-tinta/70">Página {{ page() }}</span>
            <button type="button" (click)="page.set(page() + 1)" [disabled]="!hasNext()"
                    class="cursor-pointer border border-tinta/30 px-4 py-2 enabled:hover:border-asa enabled:hover:text-asa disabled:cursor-not-allowed disabled:opacity-40">Próxima sala</button>
          </div>
        }
      </div>
    </section>
  `,
})
export class Gallery {
  private readonly pexels = inject(PexelsService);
  private readonly router = inject(Router);
  protected readonly favorites = inject(FavoritesService);

  protected readonly categories = CATEGORIES;
  protected readonly skeletons = [1, 2, 3, 4, 5, 6, 7, 8];

  protected readonly activeTerm = signal(CATEGORIES[0].term);
  protected readonly page = signal(1);
  protected readonly filterText = signal('');

  protected readonly results = this.pexels.searchResource(this.activeTerm, this.page);

  protected readonly photos = computed(() => this.results.value()?.photos ?? []);
  protected readonly visible = computed(() => {
    const term = this.filterText().trim().toLowerCase();
    if (!term) return this.photos();
    return this.photos().filter((p) => `${p.alt} ${p.photographer}`.toLowerCase().includes(term));
  });
  protected readonly hasNext = computed(() => !!this.results.value()?.next_page);
  protected readonly summary = computed(() =>
    this.results.isLoading() ? 'Abrindo a sala…' : `${this.visible().length} de ${this.photos().length} obras em exibição`,
  );
  protected readonly errorMessage = computed(() => this.pexels.describeError(this.results.error()));

  protected selectCategory(term: string): void {
    this.activeTerm.set(term);
    this.page.set(1);
    this.filterText.set('');
  }

  protected open(photo: Photo): void {
    this.router.navigate(['/obra', photo.id]);
  }
}
