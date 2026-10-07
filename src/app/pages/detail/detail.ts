import { Component, computed, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PexelsService } from '../../services/pexels.service';
import { FavoritesService } from '../../services/favorites.service';

interface Pointer { x: number; y: number }

const MESSAGES = [
  'Você está a uma distância respeitosa. A obra está nítida.',
  'Ela percebeu que você chegou perto.',
  'A obra deu um passo para trás.',
  'Os detalhes começam a se perder.',
  'Quanto mais perto, menos você vê.',
  'Você já está longe demais para continuar a visita. A obra segue perfeita sem você.',
];
const MAX_ATTEMPTS = MESSAGES.length - 1;

@Component({
  selector: 'app-detail',
  imports: [RouterLink],
  template: `
    <section class="pt-8">
      <a routerLink="/" class="text-sm hover:text-asa">← Voltar à galeria</a>

      @if (photo.isLoading()) {
        <p class="mt-10 text-lg" aria-busy="true">A obra está sendo trazida…</p>
      } @else if (photo.error()) {
        <div class="mt-8 max-w-xl border border-erro/60 bg-moldura p-5" role="alert">
          <p class="font-display text-2xl text-erro">Esta obra não está acessível.</p>
          <p class="mt-2">{{ errorMessage() }}</p>
          <button type="button" (click)="photo.reload()" class="mt-4 cursor-pointer bg-asa px-4 py-2 text-white hover:bg-tinta">Tentar de novo</button>
        </div>
      } @else if (photo.value(); as p) {
        <div class="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div>
            <div class="moldura relative flex aspect-[4/5] max-h-[75vh] w-full cursor-pointer items-center justify-center overflow-hidden touch-none sm:aspect-[5/4]"
                 [style.background-color]="p.avg_color + '33'"
                 (pointermove)="track($event)" (pointerleave)="pointer.set(null)" (click)="approach()">
              <img [src]="p.src.large" [alt]="p.alt || 'Obra do acervo'" draggable="false"
                   class="palco-img h-full w-full object-cover" [style]="imageStyle()" />
            </div>
            <p class="mt-3 text-sm text-tinta/70" aria-live="polite">{{ message() }}</p>
          </div>

          <aside class="flex flex-col gap-5">
            <div>
              <h1 class="font-sans text-2xl font-bold normal-case leading-tight tracking-normal">{{ p.alt || 'Sem título' }}</h1>
              <p class="mt-2 text-tinta/75">
                Fotografia de
                <a [href]="p.photographer_url" target="_blank" rel="noopener" class="underline hover:text-asa">{{ p.photographer }}</a>
              </p>
            </div>

            <div class="flex flex-wrap gap-2">
              <button type="button" (click)="approach()" [disabled]="attempts() >= maxAttempts"
                      class="cursor-pointer bg-asa px-4 py-2 text-white enabled:hover:bg-tinta disabled:cursor-not-allowed disabled:opacity-50">Chegar mais perto</button>
              <button type="button" (click)="stepBack()" [disabled]="attempts() === 0"
                      class="cursor-pointer border border-tinta/30 px-4 py-2 enabled:hover:border-asa enabled:hover:text-asa disabled:cursor-not-allowed disabled:opacity-40">Afastar-se</button>
            </div>

            <button type="button" (click)="favorites.toggle(p)" [attr.aria-pressed]="isFavorite()"
                    class="w-fit cursor-pointer border px-4 py-2 transition-colors"
                    [class]="isFavorite() ? 'border-asa bg-asa text-white' : 'border-tinta/30 hover:border-asa hover:text-asa'">
              {{ isFavorite() ? 'Desejada. Continua fora de alcance.' : 'Desejar' }}
            </button>

            <dl class="border-t border-nevoa/40 pt-4 text-sm">
              <div class="flex justify-between py-1"><dt class="text-tinta/70">Distância</dt><dd>{{ distanceLabel() }}</dd></div>
              <div class="flex justify-between py-1"><dt class="text-tinta/70">Nitidez</dt><dd>{{ sharpness() }}%</dd></div>
              <div class="flex items-center justify-between py-1"><dt class="text-tinta/70">Cor média</dt>
                <dd class="flex items-center gap-2"><span class="inline-block size-4 border border-tinta/30" [style.background-color]="p.avg_color"></span>{{ p.avg_color }}</dd></div>
            </dl>
          </aside>
        </div>
      }
    </section>
  `,
})
export class Detail {
  /** Vem da rota /obra/:id (withComponentInputBinding). */
  readonly id = input.required<string>();

  private readonly pexels = inject(PexelsService);
  protected readonly favorites = inject(FavoritesService);

  protected readonly photo = this.pexels.photoResource(this.id);
  protected readonly maxAttempts = MAX_ATTEMPTS;

  // Estado: só o que muda por ação de quem visita
  protected readonly attempts = signal(0);
  protected readonly pointer = signal<Pointer | null>(null); // -1..1 a partir do centro da moldura

  // Todo o resto é derivado
  protected readonly proximity = computed(() => {
    const p = this.pointer();
    return p ? Math.max(0, 1 - Math.hypot(p.x, p.y)) : 0; // 1 = cursor no centro
  });
  protected readonly scale = computed(() => Math.max(0.45, 0.94 - this.attempts() * 0.1));
  protected readonly blur = computed(() => 1 + this.attempts() * 2.4 + this.proximity() * 5);
  protected readonly offset = computed(() => {
    const p = this.pointer();
    if (!p) return { x: 0, y: 0 };
    const reach = 28 + this.attempts() * 10; // foge para o lado oposto ao cursor
    return { x: -p.x * reach, y: -p.y * reach };
  });
  protected readonly imageStyle = computed(() => {
    const { x, y } = this.offset();
    return `transform: translate(${x}px, ${y}px) scale(${this.scale()}); filter: blur(${this.blur().toFixed(1)}px);`;
  });
  protected readonly sharpness = computed(() => Math.max(0, Math.round(100 - this.blur() * 7)));
  protected readonly distanceLabel = computed(() => `${(1.5 + this.attempts() * 2.5).toFixed(1)} m`);
  protected readonly message = computed(() => MESSAGES[Math.min(this.attempts(), MAX_ATTEMPTS)]);
  protected readonly isFavorite = computed(() => {
    const p = this.photo.value();
    return p ? this.favorites.has(p.id) : false;
  });
  protected readonly errorMessage = computed(() => this.pexels.describeError(this.photo.error()));

  protected track(event: PointerEvent): void {
    const box = (event.currentTarget as HTMLElement).getBoundingClientRect();
    this.pointer.set({
      x: ((event.clientX - box.left) / box.width) * 2 - 1,
      y: ((event.clientY - box.top) / box.height) * 2 - 1,
    });
  }

  protected approach(): void {
    this.attempts.update((n) => Math.min(n + 1, MAX_ATTEMPTS));
  }

  protected stepBack(): void {
    this.attempts.update((n) => Math.max(n - 1, 0));
  }
}
