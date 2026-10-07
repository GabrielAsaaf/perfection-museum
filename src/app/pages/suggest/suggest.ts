import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

interface Indication { name: string; place: string }
const MAX_REASON = 200;

@Component({
  selector: 'app-suggest',
  imports: [ReactiveFormsModule],
  template: `
    <section class="grid gap-10 pt-10 lg:grid-cols-[minmax(0,32rem)_1fr]">
      <div>
        <h1 class="text-5xl leading-[1.05]">Indique uma perfeição</h1>
        <p class="mt-4 text-lg text-tinta/75">Conhece um lugar ou objeto sem defeito? A curadoria vai olhar de longe.</p>

        <form [formGroup]="form" (ngSubmit)="send()" class="mt-8 flex flex-col gap-5" novalidate>
          <div>
            <label for="name" class="mb-1 block text-sm">Seu nome</label>
            <input id="name" formControlName="name" autocomplete="name" class="w-full border border-tinta/30 bg-moldura px-3 py-2 focus:border-asa" />
            @if (invalid('name')) { <p class="mt-1 text-sm text-erro">Informe seu nome, com pelo menos 3 letras.</p> }
          </div>
          <div>
            <label for="email" class="mb-1 block text-sm">E-mail</label>
            <input id="email" type="email" formControlName="email" autocomplete="email" class="w-full border border-tinta/30 bg-moldura px-3 py-2 focus:border-asa" />
            @if (invalid('email')) { <p class="mt-1 text-sm text-erro">Use um e-mail válido, como nome@dominio.com.</p> }
          </div>
          <div>
            <label for="place" class="mb-1 block text-sm">Lugar ou objeto</label>
            <input id="place" formControlName="place" class="w-full border border-tinta/30 bg-moldura px-3 py-2 focus:border-asa" />
            @if (invalid('place')) { <p class="mt-1 text-sm text-erro">Diga o que você indica, com pelo menos 3 letras.</p> }
          </div>
          <div>
            <label for="reason" class="mb-1 block text-sm">Por que ele é perfeito?</label>
            <textarea id="reason" rows="4" formControlName="reason" class="w-full border border-tinta/30 bg-moldura px-3 py-2 focus:border-asa"></textarea>
            <div class="mt-1 flex justify-between text-sm">
              <span class="text-erro">@if (invalid('reason')) { Escreva entre 20 e {{ maxReason }} caracteres. }</span>
              <span [class]="remaining() < 0 ? 'text-erro' : 'text-tinta/60'">{{ remaining() }} restantes</span>
            </div>
          </div>

          <button type="submit" [disabled]="form.invalid"
                  class="w-fit cursor-pointer bg-asa px-5 py-2.5 text-white enabled:hover:bg-tinta disabled:cursor-not-allowed disabled:opacity-40">Enviar indicação</button>
        </form>
      </div>

      <aside class="lg:pt-24">
        @if (lastSent(); as last) {
          <div class="border border-sucesso/60 bg-moldura p-5" role="status">
            <p class="font-display text-2xl text-sucesso">Indicação enviada.</p>
            <p class="mt-2">“{{ last.place }}” entra na fila de curadoria, {{ last.name }}. Você será avisado se ele for aprovado, de longe.</p>
          </div>
        }
        <p class="mt-4 text-sm text-tinta/70">{{ sentLabel() }}</p>
      </aside>
    </section>
  `,
})
export class Suggest {
  protected readonly maxReason = MAX_REASON;
  protected readonly form = inject(NonNullableFormBuilder).group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    place: ['', [Validators.required, Validators.minLength(3)]],
    reason: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(MAX_REASON)]],
  });

  private readonly reasonText = toSignal(this.form.controls.reason.valueChanges, { initialValue: '' });
  protected readonly remaining = computed(() => MAX_REASON - this.reasonText().length);

  private readonly sent = signal<Indication[]>([]);
  protected readonly lastSent = computed(() => this.sent().at(-1));
  protected readonly sentLabel = computed(() =>
    this.sent().length === 0 ? 'Nenhuma indicação enviada nesta visita.' : `${this.sent().length} indicação(ões) enviada(s) nesta visita.`,
  );

  protected invalid(name: 'name' | 'email' | 'place' | 'reason'): boolean {
    const c = this.form.controls[name];
    return c.invalid && (c.touched || c.dirty);
  }

  protected send(): void {
    if (this.form.invalid) return;
    const { name, place } = this.form.getRawValue();
    this.sent.update((list) => [...list, { name, place }]);
    this.form.reset();
  }
}
