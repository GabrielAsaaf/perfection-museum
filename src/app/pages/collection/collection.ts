import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FavoritesService } from '../../services/favorites.service';
import { PhotoCard } from '../../components/photo-card/photo-card';
import { Photo } from '../../models/photo';

type Order = 'recentes' | 'fotografo';

@Component({
  selector: 'app-collection',
  imports: [PhotoCard, RouterLink],
  template: `
    <section class="pt-10">
      <h1 class="text-5xl leading-[1.05]">Desejadas</h1>
      <p class="mt-4 max-w-2xl text-lg text-tinta/75">{{ summary() }}</p>

      @if (total() > 0) {
        <div class="mt-6 flex flex-wrap items-center gap-6">
          <div class="flex gap-2" role="group" aria-label="Ordenar">
            @for (o of orders; track o.value) {
              <button type="button" (click)="order.set(o.value)" [attr.aria-pressed]="order() === o.value"
                      class="cursor-pointer border px-3 py-1.5 text-sm"
                      [class]="order() === o.value ? 'border-tinta bg-tinta text-parede' : 'border-tinta/30 hover:border-asa hover:text-asa'">{{ o.label }}</button>
            }
          </div>
          <p class="text-sm text-tinta/70">Mais presente: {{ topPhotographer() }}</p>
        </div>
      }

      <div class="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        @for (p of sorted(); track p.id) {
          <app-photo-card [photo]="p" [favorite]="true" [distant]="true" (opened)="open($event)" (toggled)="favorites.toggle($event)" />
        } @empty {
          <div class="col-span-full max-w-xl border border-quadro/40 bg-moldura p-6">
            <p class="font-display text-2xl">Nada desejado ainda.</p>
            <p class="mt-2">Escolha uma obra na galeria e toque em “Desejar”. Elas ficam aqui, desfocadas, como o desejo costuma ficar.</p>
            <a routerLink="/" class="mt-4 inline-block bg-asa px-4 py-2 text-white hover:bg-tinta">Ir à galeria</a>
          </div>
        }
      </div>
    </section>
  `,
})
export class Collection {
  protected readonly favorites = inject(FavoritesService);
  private readonly router = inject(Router);

  protected readonly orders: { value: Order; label: string }[] = [
    { value: 'recentes', label: 'Mais recentes' },
    { value: 'fotografo', label: 'Por fotógrafo' },
  ];
  protected readonly order = signal<Order>('recentes');

  protected readonly total = this.favorites.count;
  protected readonly sorted = computed(() => {
    const list = this.favorites.items();
    return this.order() === 'recentes'
      ? [...list].reverse()
      : [...list].sort((a, b) => a.photographer.localeCompare(b.photographer));
  });
  protected readonly photographerCount = computed(() => new Set(this.favorites.items().map((p) => p.photographer)).size);
  protected readonly topPhotographer = computed(() => {
    const counts = new Map<string, number>();
    for (const p of this.favorites.items()) counts.set(p.photographer, (counts.get(p.photographer) ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';
  });
  protected readonly summary = computed(() =>
    this.total() === 0
      ? 'Aqui ficam as obras que você deseja e nunca vai alcançar.'
      : `${this.total()} ${this.total() === 1 ? 'obra desejada' : 'obras desejadas'}, de ${this.photographerCount()} ${this.photographerCount() === 1 ? 'fotógrafo' : 'fotógrafos'}. Nenhuma foi tocada.`,
  );

  protected open(photo: Photo): void {
    this.router.navigate(['/obra', photo.id]);
  }
}
