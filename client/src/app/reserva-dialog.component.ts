import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-reserva-dialog',
  template: `
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur">
    <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-2 animate-fade-in">
      <h2 class="text-2xl font-extrabold text-purple-700 mb-6 text-center">
        Reservar {{ data.numeros ? 'números' : 'número' }}
        <span *ngIf="data.numeros">{{ data.numeros.join(', ') }}</span>
        <span *ngIf="!data.numeros">{{ data.numero }}</span>
      </h2>
      <form (ngSubmit)="onSubmit()" [formGroup]="form" class="space-y-5">
        <div>
          <label class="block text-purple-700 font-bold mb-1">Nombre</label>
          <input formControlName="nombre" class="w-full px-4 py-2 rounded-lg border border-purple-200 focus:ring-2 focus:ring-purple-400 focus:outline-none font-semibold transition" />
          <div *ngIf="form.get('nombre')?.invalid && form.get('nombre')?.touched" class="text-red-500 font-semibold text-sm mt-1">Nombre obligatorio</div>
        </div>
        <div>
          <label class="block text-purple-700 font-bold mb-1">Celular</label>
          <input formControlName="telefono" maxlength="10" class="w-full px-4 py-2 rounded-lg border border-purple-200 focus:ring-2 focus:ring-purple-400 focus:outline-none font-semibold transition" />
          <div *ngIf="form.get('telefono')?.invalid && form.get('telefono')?.touched" class="text-red-500 font-semibold text-sm mt-1">Ingresa un celular colombiano válido</div>
        </div>
        <div class="flex justify-end gap-3 mt-6">
          <button type="button" class="px-4 py-2 rounded-lg font-bold text-purple-700 bg-purple-100 hover:bg-purple-200 transition" mat-dialog-close>Cancelar</button>
          <button type="submit" [disabled]="form.invalid" class="px-6 py-2 rounded-lg font-bold text-white bg-gradient-to-r from-purple-500 to-purple-700 shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50">Reservar</button>
        </div>
      </form>
    </div>
  </div>
  `,
  // styleUrls eliminado para migrar a Tailwind CSS
})
export class ReservaDialogComponent {
  form = this.fb.group({
    nombre: ['', Validators.required],
    telefono: ['', [Validators.required, Validators.pattern(/^3\d{9}$/)]]
  });

  constructor(
    public dialogRef: MatDialogRef<ReservaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { numero?: number; numeros?: number[] },
    private fb: FormBuilder
  ) {}

  onSubmit() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}
