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
  
  private apiUrl = 'https://modelo-predictivo-6.onrender.com/api/clasificar'

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

    this.http.post<any>(`${this.API_URL}/api/clasificar`, formData).subscribe({
      next: (data) => {
        this.prediction = data.prediction;
        this.imageName = data.image_name;
        this.probs = data.probs;
        
        this.imageUrl = `${this.API_URL}/static/uploads/${this.imageName}`;
        this.graphUrl = `${this.API_URL}/static/uploads/probabilidades.png?t=${new Date().getTime()}`;
      },
      error: (err) => {
        alert("Error al conectar con el servidor Flask");
        console.error(err);
      }
    });
  }

  getProbsList() {
    return this.probs ? Object.entries(this.probs) : [];
  }
}
