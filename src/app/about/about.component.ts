import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {
  downloadCV(): void {
    const cvFileName = 'your-cv-file.pdf'; // Replace with your CV file name
    const cvFilePath = `/assets/${cvFileName}`;

    const a = document.createElement('a');
    a.href = cvFilePath;
    a.target = '_blank';
    a.download = cvFileName;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
