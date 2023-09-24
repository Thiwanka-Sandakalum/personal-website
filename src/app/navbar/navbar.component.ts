import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isNavbarVisible = true;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    // Calculate the scroll position
    const scrollY = window.scrollY;

    // You can adjust the threshold value as needed
    if (scrollY > 100) {
      this.isNavbarVisible = false;
    } else {
      this.isNavbarVisible = true;
    }
  }
}
