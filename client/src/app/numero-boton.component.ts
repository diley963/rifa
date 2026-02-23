import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-numero-boton',
  styleUrls: ['./numero-boton.component.scss'],
  template: `
    <button
      [ngClass]="['numero-boton', estado]"
      [disabled]="estado !== 'disponible'"
      (click)="onClick()"
    >
      {{ numero }}
    </button>
  `
})
export class NumeroBotonComponent {
  @Input() numero!: number;
  @Input() estado: 'disponible' | 'reservado' | 'vendido' = 'disponible';
  @Output() reservar = new EventEmitter<number>();

  onClick() {
    if (this.estado === 'disponible') {
      this.reservar.emit(this.numero);
    }
  }
}
