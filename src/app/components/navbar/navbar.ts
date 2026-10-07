import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FavoritesService } from '../../services/favorites.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="border-b border-quadro/30">
      <nav class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4" aria-label="Principal">
        <a routerLink="/" class="font-display text-xl uppercase leading-none tracking-wide sm:text-2xl">Museu da Perfeição Alheia</a>

        <button type="button" class="cursor-pointer border border-tinta/30 px-3 py-1 text-sm sm:hidden"
                [attr.aria-expanded]="open()" (click)="open.set(!open())">
          {{ open() ? 'Fechar' : 'Menu' }}
        </button>

        <ul class="hidden items-center gap-6 sm:flex">
          @for (l of links; track l.path) {
            <li>
              <a [routerLink]="l.path" routerLinkActive="text-asa border-asa" [routerLinkActiveOptions]="{ exact: true }"
                 class="border-b border-transparent pb-0.5 hover:text-asa">
                {{ l.label }}@if (l.path === '/desejadas' && count() > 0) { <span class="ml-1 text-sm">({{ count() }})</span> }
              </a>
            </li>
          }
        </ul>
      </nav>

      @if (open()) {
        <ul class="flex flex-col gap-1 border-t border-quadro/30 px-4 py-3 sm:hidden">
          @for (l of links; track l.path) {
            <li>
              <a [routerLink]="l.path" routerLinkActive="text-asa" [routerLinkActiveOptions]="{ exact: true }"
                 class="block py-2" (click)="open.set(false)">{{ l.label }}</a>
            </li>
          }
        </ul>
      }
    </header>
  `,
})
export class Navbar {
  protected readonly count = inject(FavoritesService).count;
  protected readonly open = signal(false);
  protected readonly links = [
    { path: '/', label: 'Galeria' },
    { path: '/desejadas', label: 'Desejadas' },
    { path: '/indicar', label: 'Indicar' },
    { path: '/sobre', label: 'Sobre' },
  ];
}
