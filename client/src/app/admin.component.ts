import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  numeros: any[] = [];
  estados = ['Disponible', 'Reservado', 'Vendido'];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.cargarNumeros();
  }

  cargarNumeros() {
    this.http.get<any[]>('/api/numeros').subscribe(data => {
      this.numeros = data;
    });
  }

  cambiarEstado(numero: number, nuevoEstado: string) {
    this.http.post('/api/cambiar-estado', { numero, estado: nuevoEstado }).subscribe(() => {
      this.cargarNumeros();
    });
  }

  contarPorEstado(estado: string): number {
    return this.numeros.filter(n => n.estado && n.estado.toLowerCase() === estado.toLowerCase()).length;
  }
}
