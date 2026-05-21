import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-preloader',
  imports: [CommonModule],
  template: `
    <div *ngIf="!destroyed()" 
         [class.opacity-0]="fadeOut()"
         [class.pointer-events-none]="fadeOut()"
         class="fixed inset-0 z-[100] bg-[#000615] flex flex-col items-center justify-center transition-all duration-700 ease-out">
      <!-- Luxury Gold Emblem Grid -->
      <div class="relative flex flex-col items-center">
        <!-- Golden Logo Shape -->
        <div class="w-20 h-20 border-4 border-[#ffe088] rounded-full flex items-center justify-center animate-pulse-gold relative">
          <span class="material-symbols-outlined text-4xl text-[#ffe088] font-bold">travel_explore</span>
          <!-- Orbiting dots for extreme premium feel -->
          <div class="absolute -inset-2 border border-dashed border-[#ffe088]/30 rounded-full animate-[spin_12s_linear_infinite]"></div>
        </div>
        
        <!-- Luxury Brand Text -->
        <h1 class="text-white text-3xl font-display font-bold tracking-[0.2em] mt-6 text-center select-none">
          XIPHIAS
        </h1>
        <p class="text-[#ffe088] text-[10px] uppercase font-sans tracking-[0.4em] mt-2 opacity-80 select-none">
          GLOBAL IMMIGRATION
        </p>
      </div>
      
      <!-- Progress Bar Indicator at bottom -->
      <div class="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#ffe088] to-[#cca830] transition-all duration-[1400ms] ease-out" 
           [style.width]="progressWidth()">
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `
  ],
  standalone: true
})
export class PreloaderComponent implements OnInit {
  protected readonly fadeOut = signal(false);
  protected readonly destroyed = signal(false);
  protected readonly progressWidth = signal('0%');

  ngOnInit() {
    // Start progress loading line
    setTimeout(() => {
      this.progressWidth.set('100%');
    }, 50);

    // Start fade out after 1400ms
    setTimeout(() => {
      this.fadeOut.set(true);
      // Clean up DOM after transitions finish (700ms transition time)
      setTimeout(() => {
        this.destroyed.set(true);
      }, 700);
    }, 1400);
  }
}
