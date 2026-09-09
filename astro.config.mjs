import { defineConfig, passthroughImageService } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';
import compress from 'astro-compress';
import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
  output: 'static', // <-- Forzamos la generación de HTML estático puro
  image: {
    service: passthroughImageService()
  },
  site: 'https://unahur-materias.github.io', // <-- Cambiala después por tu URL de Render si querés
  base: '/',
  compressHTML: false,
  integrations: [
    mdx(), 
    icon(), 
    tailwind({
      applyBaseStyles: false
    }), 
    compress()
  ]
});