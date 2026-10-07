import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <section class="flex flex-col items-start gap-4 pt-16">
      <p class="select-none font-display text-[8rem] leading-none text-tinta/80 blur-[6px] sm:text-[12rem]" aria-hidden="true">404</p>
      <h1 class="text-4xl leading-tight">Esta sala não existe.</h1>
      <p class="max-w-lg text-lg text-tinta/75">O endereço que você abriu não leva a nenhuma obra do acervo. Talvez ela nunca tenha estado aqui.</p>
      <a routerLink="/" class="mt-2 bg-asa px-5 py-2.5 text-white hover:bg-tinta">Voltar à galeria</a>
    </section>
  `,
})
export class NotFound {}
