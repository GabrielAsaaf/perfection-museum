import { Component, input, output } from '@angular/core';
import { Category } from '../../models/photo';

@Component({
  selector: 'app-category-chips',
  template: `
    <div class="flex flex-wrap gap-2" role="group" aria-label="Salas do museu">
      @for (c of categories(); track c.term) {
        <button type="button" (click)="selected.emit(c.term)" [attr.aria-pressed]="c.term === active()"
                class="cursor-pointer border px-3 py-1.5 text-sm transition-colors"
                [class]="c.term === active() ? 'border-tinta bg-tinta text-parede' : 'border-tinta/30 hover:border-asa hover:text-asa'">
          {{ c.label }}
        </button>
      }
    </div>
  `,
})
export class CategoryChips {
  readonly categories = input.required<Category[]>();
  readonly active = input.required<string>();
  readonly selected = output<string>();
}
