import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  imports: [RouterLink],
  template: `
    <section class="max-w-2xl pt-10">
      <h1 class="text-5xl leading-[1.05]">Sobre o museu</h1>
      <p class="mt-6 text-lg">
        A palavra-conceito deste projeto é <strong class="font-medium">idealização</strong>: a imagem de alguém, de um lugar ou de uma meta
        que parece perfeita justamente porque nunca chegamos perto o bastante para ver a falha.
      </p>
      <p class="mt-4">
        Por isso este museu só exibe fotografias impecáveis, e todas elas se afastam quando você tenta examiná-las.
        A distância é o que mantém a perfeição. Na página de uma obra, cada tentativa de aproximação deixa a imagem
        menor, mais borrada e mais longe. Afastar-se devolve a nitidez.
      </p>
      <p class="mt-4">
        As fotos vêm da API pública do Pexels. Cada uma tem crédito para quem a fotografou.
      </p>
      <a routerLink="/" class="mt-8 inline-block bg-asa px-5 py-2.5 text-white hover:bg-tinta">Visitar a galeria</a>
    </section>
  `,
})
export class About {}
