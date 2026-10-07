import { Routes } from '@angular/router';
import { Gallery } from './pages/gallery/gallery';
import { Detail } from './pages/detail/detail';
import { Collection } from './pages/collection/collection';
import { Suggest } from './pages/suggest/suggest';
import { About } from './pages/about/about';
import { NotFound } from './pages/not-found/not-found';

export const routes: Routes = [
  { path: '', component: Gallery, title: 'Galeria · Museu da Perfeição Alheia' },
  { path: 'obra/:id', component: Detail, title: 'Obra · Museu da Perfeição Alheia' },
  { path: 'desejadas', component: Collection, title: 'Desejadas · Museu da Perfeição Alheia' },
  { path: 'indicar', component: Suggest, title: 'Indicar · Museu da Perfeição Alheia' },
  { path: 'sobre', component: About, title: 'Sobre · Museu da Perfeição Alheia' },
  { path: '**', component: NotFound, title: 'Sala inexistente · Museu da Perfeição Alheia' },
];
