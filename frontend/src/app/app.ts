import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para usar *ngIf y *ngFor
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule], // Importante para que el HTML reconozca las etiquetas de Angular
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  selectedFile: File | null = null;
  prediction: string = "";
  imageName: string = "";
  probs: any = null;
  imageUrl: string = "";
  graphUrl: string = "";
  
  // URL de tu backend en Render
  private apiUrl = 'https://modelo-predictivo-7.onrender.com';

  constructor(private http: HttpClient) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.prediction = "";
    this.probs = null;
  }

  onSubmit() {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('image', this.selectedFile);

    // Se corrigió el uso de this.apiUrl para que coincida con la definición de arriba
    this.http.post<any>(`${this.apiUrl}/api/clasificar`, formData).subscribe({
      next: (data) => {
        this.prediction = data.prediction;
        this.imageName = data.image_name;
        this.probs = data.probs;
        
        // Rutas actualizadas para apuntar al servidor de Render
        this.imageUrl = `${this.apiUrl}/static/uploads/${this.imageName}`;
        this.graphUrl = `${this.apiUrl}/static/uploads/probabilidades.png?t=${new Date().getTime()}`;
      },
      error: (err) => {
        alert("Error al conectar con el servidor Flask en Render");
        console.error(err);
      }
    });
  }

  getProbsList() {
    return this.probs ? Object.entries(this.probs) : [];
  }
}
