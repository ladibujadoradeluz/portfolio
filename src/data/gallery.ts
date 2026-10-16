export interface GalleryImage {
  src: string;
  alt: string;
  title?: string;
}

// Las fotos viven en `public/images/` y se sirven tal cual (sin
// transformación de Astro). Los `alt` son neutros a propósito: para
// describir cada foto hace falta conocer su contenido.
export const galleryImages: GalleryImage[] = [
  { src: '/images/001.webp', alt: 'Fotografía 1' },
  { src: '/images/002.webp', alt: 'Fotografía 2' },
  { src: '/images/003.webp', alt: 'Fotografía 3' },
  { src: '/images/004.webp', alt: 'Fotografía 4' },
  { src: '/images/005.webp', alt: 'Fotografía 5' },
  { src: '/images/006.webp', alt: 'Fotografía 6' },
  { src: '/images/007.webp', alt: 'Fotografía 7' },
  { src: '/images/008.webp', alt: 'Fotografía 8' },
  { src: '/images/009.webp', alt: 'Fotografía 9' },
  { src: '/images/010.webp', alt: 'Fotografía 10' },
  { src: '/images/011.webp', alt: 'Fotografía 11' },
  { src: '/images/012.webp', alt: 'Fotografía 12' },
];
