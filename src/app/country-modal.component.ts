import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface CountryDetail {
  name: string;
  tagline: string;
  minInvestment: string;
  processingTime: string;
  visaFreeCount: string;
  taxBenefits: string;
  routes: Array<{ name: string; cost: string; desc: string }>;
  about: string;
  imageUrl: string;
}

@Component({
  selector: 'app-country-modal',
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 md:p-6" role="dialog" aria-modal="true">
      
      <!-- Backdrop with premium blur and fade-in -->
      <div class="fixed inset-0 bg-[#000615]/80 backdrop-blur-md transition-opacity duration-300 animate-fade-in" (click)="closeModal()"></div>

      <!-- Modal Content Card -->
      <div class="bg-white rounded-[32px] overflow-hidden premium-shadow max-w-4xl w-full relative z-10 border border-slate-200/50 flex flex-col md:flex-row transition-all transform scale-100 duration-500 max-h-[90vh] md:max-h-[85vh]">
        
        <!-- Image Column -->
        <div class="w-full md:w-5/12 h-64 md:h-auto relative overflow-hidden shrink-0">
          <img [src]="country.imageUrl" [alt]="country.name" class="w-full h-full object-cover">
          <!-- Gradient overlay -->
          <div class="absolute inset-0 bg-gradient-to-t from-[#000615]/95 via-[#0b1f3a]/40 to-transparent"></div>
          
          <div class="absolute bottom-8 left-8 right-8">
            <span class="text-[#ffe088] text-xs tracking-wider uppercase font-semibold">Caribbean Sovereignty</span>
            <h3 class="text-3xl font-display font-bold text-white mt-1">{{country.name}}</h3>
            <p class="text-slate-300 text-xs mt-2 italic leading-relaxed">{{country.tagline}}</p>
          </div>
        </div>

        <!-- Info / Data Column -->
        <div class="w-full md:w-7/12 p-8 md:p-10 overflow-y-auto flex flex-col justify-between">
          <!-- Close Button -->
          <button (click)="closeModal()" class="absolute top-6 right-6 w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-primary flex items-center justify-center transition-colors">
            <span class="material-symbols-outlined font-bold text-lg">close</span>
          </button>

          <div>
            <!-- Header Metrics Grid -->
            <div class="grid grid-cols-3 gap-4 pb-6 border-b border-slate-100 mb-6">
              <div class="text-center">
                <span class="text-[10px] text-[#75777e] uppercase tracking-wider block mb-1">Investment</span>
                <span class="text-sm md:text-base font-semibold text-[#000615] font-display">{{country.minInvestment}}</span>
              </div>
              <div class="text-center border-x border-slate-100">
                <span class="text-[10px] text-[#75777e] uppercase tracking-wider block mb-1">Vetting Time</span>
                <span class="text-sm md:text-base font-semibold text-[#000615] font-display">{{country.processingTime}}</span>
              </div>
              <div class="text-center">
                <span class="text-[10px] text-[#75777e] uppercase tracking-wider block mb-1">Visa-Free</span>
                <span class="text-sm md:text-base font-semibold text-[#000615] font-display">{{country.visaFreeCount}}</span>
              </div>
            </div>

            <!-- About description -->
            <div class="mb-6">
              <h4 class="text-xs text-[#3e5e97] uppercase tracking-widest font-semibold mb-2">Program Overview</h4>
              <p class="text-sm text-[#44474d] leading-relaxed">{{country.about}}</p>
            </div>

            <!-- Investment Routes list -->
            <div class="mb-8">
              <h4 class="text-xs text-[#3e5e97] uppercase tracking-widest font-semibold mb-3">Available Investment Paths</h4>
              <div class="space-y-3">
                <div *ngFor="let r of country.routes" class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div class="flex justify-between items-center mb-1">
                    <span class="text-sm font-semibold text-[#000615]">{{r.name}}</span>
                    <span class="text-xs font-bold text-[#3e5e97] bg-[#a0befe]/15 px-2.5 py-0.5 rounded-full">{{r.cost}}</span>
                  </div>
                  <p class="text-xs text-[#44474d] mt-1 leading-relaxed">{{r.desc}}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Advisory Action CTA Form -->
          <div class="bg-[#0b1f3a] text-white p-6 rounded-2xl border border-white/10 mt-2">
            <h5 class="text-sm font-display font-semibold text-[#ffe088] mb-1">Request Private Consultation</h5>
            <p class="text-[11px] text-[#7587a7] mb-3">Get custom financial quotes and assessment details for {{country.name}}.</p>
            
            <div class="flex gap-2">
              <input type="email" placeholder="Your email address" class="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:ring-1 focus:ring-[#ffe088] outline-none shrink">
              <button class="bg-[#cca830] text-[#241a00] hover:bg-[#ffe088] font-bold px-4 py-2 rounded-xl text-xs transition-colors whitespace-nowrap">
                Contact Now
              </button>
            </div>
          </div>

        </div>

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
export class CountryModalComponent {
  @Input({ required: true }) country!: CountryDetail;
  @Output() close = new EventEmitter<void>();

  protected closeModal() {
    this.close.emit();
  }
}
