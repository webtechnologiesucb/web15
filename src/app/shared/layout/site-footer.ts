// src/app/shared/layout/site-footer.ts
// Pie con créditos y enlaces de referencia.
import { Component } from '@angular/core';

@Component({
  selector: 'app-site-footer',
  template: `
    <footer class="footer">
      <div class="container footer__inner">
        <p class="dim">
          Showcase didáctico de <strong>Angular 21</strong> (standalone components, signals y
          zoneless). Datos de
          <a href="https://swapi.dev" target="_blank" rel="noopener noreferrer">SWAPI</a>.
        </p>
        <p class="dim footer__links">
          <a href="https://angular.dev" target="_blank" rel="noopener noreferrer">Angular</a> ·
          <a href="https://rxjs.dev" target="_blank" rel="noopener noreferrer">RxJS</a> ·
          <a href="https://swapi.dev/documentation" target="_blank" rel="noopener noreferrer">
            Documentación de SWAPI
          </a>
        </p>
      </div>
    </footer>
  `,
  styles: ':host { display: contents; }',
})
export class SiteFooter {}
