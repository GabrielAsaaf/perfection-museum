export interface PhotoSrc {
  original: string; large2x: string; large: string; medium: string;
  small: string; portrait: string; landscape: string; tiny: string;
}

export interface Photo {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  avg_color: string;
  alt: string;
  src: PhotoSrc;
}

export interface PexelsSearch {
  page: number;
  per_page: number;
  total_results: number;
  next_page?: string;
  photos: Photo[];
}

export interface Category {
  label: string;
  term: string; // termo em inglês: a busca do Pexels rende muito mais
}

export const CATEGORIES: Category[] = [
  { label: 'Praias intocadas', term: 'pristine empty beach' },
  { label: 'Montanhas', term: 'snowy mountain peak' },
  { label: 'Lagos', term: 'calm lake reflection' },
  { label: 'Jardins', term: 'perfect garden' },
  { label: 'Arquitetura', term: 'minimalist architecture' },
  { label: 'Interiores', term: 'minimal interior design' },
  { label: 'Florestas', term: 'misty forest' },
];
