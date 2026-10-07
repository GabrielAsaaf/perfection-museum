import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar],
  template: `
    <app-navbar />
    <main class="mx-auto w-full max-w-6xl px-4 pb-16"><router-outlet /></main>
    <footer class="border-t border-quadro/30 py-6 text-center text-sm text-tinta/60">
      Fotografias de <a class="underline hover:text-asa" href="https://www.pexels.com" target="_blank" rel="noopener">Pexels</a>.
      Nenhuma delas pode ser tocada.
    </footer>
  `,
})
export class App {}
