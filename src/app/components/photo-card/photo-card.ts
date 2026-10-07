import { Component, computed, input, output } from '@angular/core';
import { Photo } from '../../models/photo';

@Component({
  selector: 'app-photo-card',
  template: `
    <article class="group moldura flex h-full flex-col">
      <button type="button" class="block w-full cursor-pointer text-left" (click)="opened.emit(photo())"
              [attr.aria-label]="'Ver de longe: ' + title()">
        <div class="aspect-[4/5] overflow-hidden" [style.background-color]="photo().avg_color">
          <img [src]="photo().src.large" [alt]="title()" loading="lazy" draggable="false"
               class="vitrine-img h-full w-full object-cover" [class.distante]="distant()" />
        </div>
      </button>
      <div class="mt-3 flex items-start justify-between gap-3">
        <div class="min-w-0">
          <h3 class="font-sans text-base font-bold normal-case leading-snug tracking-normal">{{ title() }}</h3>
          <p class="truncate text-sm text-tinta/65">{{ photo().photographer }}</p>
        </div>
        <button type="button" (click)="toggled.emit(photo())" [attr.aria-pressed]="favorite()"
                class="shrink-0 cursor-pointer border px-2 py-1 text-sm transition-colors"
                [class]="favorite() ? 'border-asa bg-asa text-white' : 'border-tinta/30 hover:border-asa hover:text-asa'">
          {{ favorite() ? 'Desejada' : 'Desejar' }}
        </button>
      </div>
    </article>
  `,
})
export class PhotoCard {
  readonly photo = input.required<Photo>();
  readonly favorite = input(false);
  readonly distant = input(false);
  readonly opened = output<Photo>();
  readonly toggled = output<Photo>();

  protected readonly title = computed(() => {
    const alt = this.photo().alt.trim();
    if (!alt) return 'Sem título';
    return alt.length > 60 ? alt.slice(0, 57) + '…' : alt;
  });
}
