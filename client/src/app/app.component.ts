
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ReservaDialogComponent } from './reserva-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  // styleUrls eliminado para migrar a Tailwind CSS
})
export class AppComponent implements OnInit {
    showAddAlert = false;
    lastAdded: number | null = null;
  title = 'Rifa Proxxxxx BMX';
  numeros: { numero: number; estado: string }[] = [];
  seleccionados: number[] = [];
  whatsappNumber: string = '';
  facebookUrl: string = '';
  instagramUrl: string = '';
  whatsappUrl: string = '';

  constructor(private http: HttpClient, private dialog: MatDialog) {}

  ngOnInit() {
    this.cargarNumeros();
    this.cargarRedes();
  }

  cargarNumeros() {
    this.http.get<{ numero: number; estado: string }[]>('/api/numeros').subscribe({
      next: (data) => {
        this.numeros = data;
        // Limpiar seleccionados si ya no están disponibles
        this.seleccionados = this.seleccionados.filter(num => {
          const found = data.find(n => n.numero === num && n.estado === 'disponible');
          return !!found;
        });
      },
      error: () => alert('Error al cargar los números de la rifa')
    });
  }

  cargarRedes() {
    // Cargar datos de .env expuestos por backend (puedes exponerlos por un endpoint /api/config si lo deseas)
    this.http.get<any>('/api/config').subscribe({
      next: (cfg) => {
        this.whatsappNumber = cfg.WHATSAPP_NUMBER || '';
        this.facebookUrl = cfg.FACEBOOK_URL || '';
        this.instagramUrl = cfg.INSTAGRAM_URL || '';
        this.whatsappUrl = cfg.WHATSAPP_URL || '';
      },
      error: () => {
        // Si no existe endpoint, usar valores por defecto
        this.whatsappNumber = '573508045496';
        this.facebookUrl = '#';
        this.instagramUrl = '#';
        this.whatsappUrl = '#';
      }
    });
  }

  reservarNumero(numero: number) {
    // Cambia lógica: seleccionar/deseleccionar
    if (this.seleccionados.includes(numero)) {
      this.seleccionados = this.seleccionados.filter(n => n !== numero);
    } else {
      // Solo permitir si está disponible
      const numObj = this.numeros.find(n => n.numero === numero);
      if (numObj && numObj.estado === 'disponible') {
        this.seleccionados.push(numero);
        this.lastAdded = numero;
        this.showAddAlert = true;
        setTimeout(() => {
          this.showAddAlert = false;
        }, 5000);
      }
    }
  }

  reservarSeleccionados() {
    if (this.seleccionados.length === 0) {
      alert('Selecciona al menos un número disponible');
      return;
    }
    const dialogRef = this.dialog.open(ReservaDialogComponent, {
      width: '340px',
      data: { numeros: this.seleccionados },
      disableClose: true,
      panelClass: 'custom-dialog-container'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.nombre && result.telefono) {
        this.http.post('/api/reservar-multiple', {
          numeros: this.seleccionados,
          nombre: result.nombre,
          telefono: result.telefono
        }).subscribe({
          next: () => {
            this.cargarNumeros();
            this.redirigirWhatsapp(this.seleccionados);
            this.seleccionados = [];
          },
          error: (err) => {
            if (err.status === 409) {
              alert('¡Alguno de los números ya fue reservado o vendido!');
            } else {
              alert('Error al reservar los números');
            }
            this.cargarNumeros();
          }
        });
      }
    });
  }

  redirigirWhatsapp(numero: number | number[]) {
    let mensaje = '';
    if (Array.isArray(numero)) {
      mensaje = encodeURIComponent(`Hola, quiero apartar los números ${numero.join(', ')} de la rifa BMX`);
    } else {
      mensaje = encodeURIComponent(`Hola, quiero apartar el número ${numero} de la rifa BMX`);
    }
    const url = this.whatsappNumber
      ? `https://wa.me/${this.whatsappNumber}?text=${mensaje}`
      : this.whatsappUrl || '#';
    window.location.href = url;
  }

  getEstadoClase(estado: string): 'disponible' | 'reservado' | 'vendido' {
    if (estado === 'disponible') return 'disponible';
    if (estado === 'reservado') return 'reservado';
    return 'vendido';
  }
}
