import { Component, signal, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface MapPin {
  id: string;
  name: string;
  // SVG coords within the 1009x665 viewBox
  svgX: number;
  svgY: number;
  status: string;
  stay: string;
  details: string;
  icon: string;
  flag: string;
  arcColor: string;
}

@Component({
  selector: 'app-interactive-map',
  imports: [CommonModule],
  template: `
    <section class="py-24 bg-[#0b1f3a] text-white relative overflow-hidden" id="map-section">
      <!-- Ambient glow orbs -->
      <div class="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#3e5e97]/15 rounded-full blur-[140px] pointer-events-none"></div>
      <div class="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#cca830]/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div class="max-w-7xl mx-auto px-6 relative z-10">
        <!-- Section Header -->
        <div class="text-center mb-16 max-w-2xl mx-auto">
          <span class="text-[#ffe088] text-xs tracking-[0.25em] uppercase font-bold">Global Access Matrix</span>
          <h2 class="text-4xl md:text-5xl font-display font-semibold mt-4 mb-6 leading-tight">
            One Passport. Global Freedom.
          </h2>
          <p class="text-[#7587a7] font-sans leading-relaxed">
            Antigua and Barbuda citizenship unlocks unrestricted, visa-free access to 150+ countries. Hover over the glowing pins to explore each destination's privileges.
          </p>
        </div>

        <!-- Map + Info Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          <!-- ── World Map Panel ── -->
          <div class="lg:col-span-2 relative bg-[#020e22] border border-white/10 rounded-[28px] overflow-hidden shadow-2xl"
               style="aspect-ratio:16/9">

            <!-- Subtle grid lines overlay for a data-dashboard feel -->
            <div class="absolute inset-0 opacity-[0.04]"
                 style="background-image: linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px); background-size: 40px 40px;">
            </div>

            <!-- Actual SVG World Map -->
            <svg #mapSvg
                 class="w-full h-full"
                 viewBox="0 0 1009 665"
                 fill="none"
                 xmlns="http://www.w3.org/2000/svg"
                 preserveAspectRatio="xMidYMid meet">

              <!-- ───── CONTINENT FILLS ───── -->
              <!-- North America -->
              <path d="M 80 90 L 95 75 L 120 70 L 155 68 L 175 75 L 190 85
                       L 200 100 L 210 95 L 230 88 L 255 85 L 265 95 L 260 110
                       L 245 120 L 260 130 L 265 145 L 255 160 L 240 165
                       L 235 180 L 245 195 L 235 210 L 215 220 L 200 235
                       L 185 230 L 170 215 L 155 205 L 140 215 L 125 210
                       L 110 200 L 95 180 L 80 165 L 70 145 L 68 120 L 75 105 Z"
                    fill="#1a3a5c" stroke="#2a4f7c" stroke-width="1.2"/>
              <!-- Greenland -->
              <path d="M 200 35 L 220 28 L 250 30 L 260 45 L 245 58 L 220 60 L 205 50 Z"
                    fill="#162f4a" stroke="#2a4f7c" stroke-width="0.8"/>
              <!-- Central America -->
              <path d="M 185 230 L 195 240 L 200 255 L 192 265 L 182 260 L 175 248 L 178 237 Z"
                    fill="#1a3a5c" stroke="#2a4f7c" stroke-width="1"/>
              <!-- Caribbean (Antigua area) -->
              <path d="M 220 242 L 228 240 L 232 245 L 227 250 L 221 247 Z"
                    fill="#ffe088" stroke="#ffe088" stroke-width="0.5" opacity="0.8"/>

              <!-- South America -->
              <path d="M 195 270 L 215 260 L 240 258 L 265 265 L 285 280
                       L 300 300 L 305 325 L 295 355 L 280 375 L 265 395
                       L 248 415 L 232 430 L 220 420 L 210 400 L 205 375
                       L 200 350 L 195 325 L 188 300 L 188 280 Z"
                    fill="#1a3a5c" stroke="#2a4f7c" stroke-width="1.2"/>

              <!-- Europe -->
              <path d="M 430 68 L 450 62 L 475 60 L 500 65 L 515 75
                       L 520 90 L 510 105 L 495 115 L 480 118 L 465 115
                       L 448 108 L 438 95 L 430 80 Z"
                    fill="#1a3a5c" stroke="#2a4f7c" stroke-width="1.2"/>
              <!-- UK blob -->
              <path d="M 418 72 L 428 68 L 432 78 L 425 85 L 416 80 Z"
                    fill="#1e4a7c" stroke="#2a4f7c" stroke-width="0.8"/>
              <!-- Scandinavia -->
              <path d="M 460 40 L 478 35 L 492 42 L 490 60 L 478 65 L 462 58 Z"
                    fill="#1a3a5c" stroke="#2a4f7c" stroke-width="1"/>

              <!-- Africa -->
              <path d="M 440 130 L 465 118 L 495 120 L 520 132 L 535 150
                       L 545 175 L 550 205 L 548 235 L 535 270 L 515 300
                       L 495 330 L 478 355 L 462 365 L 448 355 L 435 330
                       L 425 300 L 420 265 L 418 230 L 420 195 L 425 165
                       L 432 145 Z"
                    fill="#1a3a5c" stroke="#2a4f7c" stroke-width="1.2"/>
              <!-- Madagascar -->
              <path d="M 548 278 L 555 268 L 562 278 L 558 295 L 550 292 Z"
                    fill="#162f4a" stroke="#2a4f7c" stroke-width="0.8"/>

              <!-- Middle East / Arabian Peninsula -->
              <path d="M 535 148 L 560 140 L 590 148 L 605 162 L 610 180
                       L 600 200 L 585 208 L 568 205 L 552 195 L 542 178 Z"
                    fill="#1a3a5c" stroke="#2a4f7c" stroke-width="1"/>

              <!-- Asia (main body) -->
              <path d="M 535 68 L 575 55 L 620 50 L 670 52 L 715 58 L 760 65
                       L 800 72 L 825 85 L 835 102 L 828 120 L 810 132
                       L 790 138 L 770 145 L 752 155 L 738 168 L 720 175
                       L 700 172 L 680 165 L 660 162 L 638 168 L 618 178
                       L 600 188 L 588 200 L 572 205 L 558 195 L 548 178
                       L 542 162 L 538 145 L 535 128 L 532 108 L 533 88 Z"
                    fill="#1a3a5c" stroke="#2a4f7c" stroke-width="1.2"/>
              <!-- Indian subcontinent -->
              <path d="M 600 188 L 620 185 L 640 192 L 652 210 L 645 235
                       L 630 250 L 615 252 L 602 240 L 596 220 L 598 205 Z"
                    fill="#1a3a5c" stroke="#2a4f7c" stroke-width="1"/>
              <!-- Southeast Asia / Indochina -->
              <path d="M 690 175 L 712 172 L 730 180 L 738 198 L 728 215
                       L 712 220 L 698 212 L 688 195 Z"
                    fill="#1a3a5c" stroke="#2a4f7c" stroke-width="1"/>
              <!-- Japan -->
              <path d="M 795 115 L 808 108 L 818 118 L 812 132 L 800 135 L 792 125 Z"
                    fill="#162f4a" stroke="#2a4f7c" stroke-width="0.8"/>
              <!-- Indonesia (Sumatra / Java approximate) -->
              <path d="M 700 272 L 725 268 L 748 272 L 758 282 L 748 292
                       L 725 294 L 706 287 Z"
                    fill="#1a3a5c" stroke="#2a4f7c" stroke-width="0.8"/>
              <!-- Borneo -->
              <path d="M 748 252 L 768 248 L 782 258 L 780 275 L 765 282
                       L 750 278 L 742 265 Z"
                    fill="#1a3a5c" stroke="#2a4f7c" stroke-width="0.8"/>

              <!-- Australia -->
              <path d="M 758 360 L 785 348 L 818 348 L 845 358 L 862 378
                       L 865 402 L 855 425 L 835 438 L 808 442 L 782 435
                       L 762 418 L 752 395 L 752 372 Z"
                    fill="#1a3a5c" stroke="#2a4f7c" stroke-width="1.2"/>
              <!-- New Zealand -->
              <path d="M 878 432 L 888 422 L 896 432 L 890 445 L 880 442 Z"
                    fill="#162f4a" stroke="#2a4f7c" stroke-width="0.8"/>

              <!-- ───── ANIMATED ARC LINES from Antigua ───── -->
              <!-- Antigua SVG coordinates ~ (227, 244) -->

              <!-- Arc to UK (425, 78) -->
              <path *ngIf="activePin()?.id === 'uk' || showAllArcs"
                    d="M 227 244 Q 310 80 425 78"
                    stroke="#ffe088" stroke-width="1.8" stroke-dasharray="6,4"
                    fill="none" opacity="0.7"
                    class="map-arc">
              </path>
              <!-- Arc to Schengen (480, 85) -->
              <path *ngIf="activePin()?.id === 'schengen' || showAllArcs"
                    d="M 227 244 Q 330 60 480 85"
                    stroke="#a0befe" stroke-width="1.8" stroke-dasharray="6,4"
                    fill="none" opacity="0.7"
                    class="map-arc">
              </path>
              <!-- Arc to UAE (572, 168) -->
              <path *ngIf="activePin()?.id === 'uae' || showAllArcs"
                    d="M 227 244 Q 400 100 572 168"
                    stroke="#86efac" stroke-width="1.8" stroke-dasharray="6,4"
                    fill="none" opacity="0.6"
                    class="map-arc">
              </path>
              <!-- Arc to Singapore (730, 285) -->
              <path *ngIf="activePin()?.id === 'singapore' || showAllArcs"
                    d="M 227 244 Q 480 60 730 285"
                    stroke="#f9a8d4" stroke-width="1.8" stroke-dasharray="6,4"
                    fill="none" opacity="0.6"
                    class="map-arc">
              </path>
              <!-- Arc to Hong Kong (770, 195) -->
              <path *ngIf="activePin()?.id === 'hk' || showAllArcs"
                    d="M 227 244 Q 500 40 770 195"
                    stroke="#fcd34d" stroke-width="1.8" stroke-dasharray="6,4"
                    fill="none" opacity="0.6"
                    class="map-arc">
              </path>

              <!-- ───── ANTIGUA SOURCE PIN ───── -->
              <g transform="translate(227,244)">
                <!-- Outer glow rings -->
                <circle r="18" fill="#ffe088" opacity="0.08"/>
                <circle r="12" fill="#ffe088" opacity="0.15"/>
                <!-- Core dot -->
                <circle r="6" fill="#ffe088" stroke="white" stroke-width="1.5"/>
                <!-- Pulsing ring -->
                <circle r="10" fill="none" stroke="#ffe088" stroke-width="1.5" opacity="0.6">
                  <animate attributeName="r" values="10;18;10" dur="2.5s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" values="0.6;0;0.6" dur="2.5s" repeatCount="indefinite"/>
                </circle>
              </g>

              <!-- ANTIGUA label callout -->
              <g transform="translate(227,244)">
                <line x1="6" y1="-6" x2="22" y2="-22" stroke="#ffe088" stroke-width="1" opacity="0.7"/>
                <rect x="22" y="-32" width="62" height="16" rx="4" fill="#0b1f3a" stroke="#ffe088" stroke-width="0.8" opacity="0.9"/>
                <text x="53" y="-20" text-anchor="middle" font-size="8" fill="#ffe088" font-family="sans-serif" font-weight="600" letter-spacing="0.08em">ANTIGUA</text>
              </g>

              <!-- ───── DESTINATION PINS ───── -->
              <g *ngFor="let pin of pins"
                 [attr.transform]="'translate(' + pin.svgX + ',' + pin.svgY + ')'"
                 class="cursor-pointer"
                 (click)="selectPin(pin)"
                 (mouseenter)="hoverPin(pin)">

                <!-- Highlight ring when active -->
                <circle r="16" [attr.fill]="activePin()?.id === pin.id ? '#ffe08830' : 'transparent'"
                        class="transition-all duration-300"/>

                <!-- Pin glow -->
                <circle r="10" [attr.fill]="activePin()?.id === pin.id ? '#ffe088' : '#3e5e97'" opacity="0.25"/>

                <!-- Pin core -->
                <circle r="5.5"
                        [attr.fill]="activePin()?.id === pin.id ? '#ffe088' : '#7eb3ff'"
                        stroke="white" stroke-width="1.2"
                        class="transition-all duration-300"/>

                <!-- Pulse on active -->
                <circle *ngIf="activePin()?.id === pin.id" r="8" fill="none" stroke="#ffe088" stroke-width="1.2" opacity="0.5">
                  <animate attributeName="r" values="8;14;8" dur="2s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite"/>
                </circle>

                <!-- Country label (visible on active) -->
                <text *ngIf="activePin()?.id === pin.id"
                      y="-14" text-anchor="middle" font-size="8"
                      fill="white" font-family="sans-serif" font-weight="600">
                  {{pin.name}}
                </text>
              </g>

            </svg>

            <!-- Bottom left legend -->
            <div class="absolute bottom-4 left-5 flex items-center gap-4 text-[10px] text-[#7587a7] font-semibold font-sans select-none">
              <div class="flex items-center gap-1.5">
                <span class="w-2.5 h-2.5 rounded-full bg-[#ffe088] shadow-[0_0_6px_#ffe088]"></span>
                <span>CBI Origin</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="w-2.5 h-2.5 rounded-full bg-[#7eb3ff] shadow-[0_0_6px_#7eb3ff]"></span>
                <span>Visa-Free Destination</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="w-6 border-t border-dashed border-[#ffe088]"></span>
                <span>Direct Flight Route</span>
              </div>
            </div>

            <!-- Top right badge -->
            <div class="absolute top-4 right-5 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-[10px] font-bold text-[#ffe088] tracking-wider select-none">
              150+ COUNTRIES
            </div>
          </div>

          <!-- ── Info Side Panel ── -->
          <div class="bg-white/5 border border-white/10 rounded-[28px] p-7 backdrop-blur-xl shadow-2xl flex flex-col justify-between min-h-[380px] lg:min-h-0 lg:h-full">
            <div *ngIf="activePin() as pin; else placeholder">
              <!-- Flag + Name -->
              <div class="flex items-center gap-3 mb-6">
                <span class="text-4xl leading-none">{{pin.flag}}</span>
                <div>
                  <h4 class="text-xl font-display font-semibold text-white leading-tight">{{pin.name}}</h4>
                  <span class="text-[10px] text-[#ffe088] font-sans tracking-wider uppercase font-bold">{{pin.status}}</span>
                </div>
              </div>

              <!-- Stay block -->
              <div class="flex gap-3 items-start mb-5">
                <div class="w-9 h-9 rounded-xl bg-[#ffe088]/10 flex items-center justify-center text-[#ffe088] shrink-0">
                  <span class="material-symbols-outlined text-base">{{pin.icon}}</span>
                </div>
                <div>
                  <h5 class="text-[9px] text-[#7587a7] uppercase tracking-wider font-bold mb-0.5">Allowed Stay</h5>
                  <p class="text-white text-sm font-semibold">{{pin.stay}}</p>
                </div>
              </div>

              <!-- Strategic Value block -->
              <div class="flex gap-3 items-start mb-8">
                <div class="w-9 h-9 rounded-xl bg-[#ffe088]/10 flex items-center justify-center text-[#ffe088] shrink-0">
                  <span class="material-symbols-outlined text-base">verified_user</span>
                </div>
                <div>
                  <h5 class="text-[9px] text-[#7587a7] uppercase tracking-wider font-bold mb-0.5">Strategic Value</h5>
                  <p class="text-white text-xs leading-relaxed">{{pin.details}}</p>
                </div>
              </div>

              <!-- CTA Button -->
              <button class="w-full py-4 bg-[#cca830] hover:bg-[#ffe088] text-[#241a00] font-bold rounded-xl text-xs tracking-wider transition-all duration-300 hover:scale-[1.02] shadow-lg">
                Check Access Rules
              </button>
            </div>

            <!-- No pin selected placeholder -->
            <ng-template #placeholder>
              <div class="text-center flex flex-col items-center justify-center h-full py-12 gap-4">
                <div class="w-16 h-16 rounded-full bg-[#ffe088]/10 flex items-center justify-center">
                  <span class="material-symbols-outlined text-3xl text-[#7587a7] animate-bounce">ads_click</span>
                </div>
                <h4 class="text-lg font-display font-semibold">Explore Destinations</h4>
                <p class="text-sm text-[#7587a7] leading-relaxed">
                  Click any glowing pin on the world map to reveal visa access details and strategic benefits for Antigua &amp; Barbuda passport holders.
                </p>
              </div>
            </ng-template>

            <!-- Destination tabs at bottom -->
            <div class="mt-6 pt-5 border-t border-white/10">
              <p class="text-[9px] text-[#7587a7] uppercase tracking-widest font-bold mb-3">Quick Select</p>
              <div class="flex flex-wrap gap-2">
                <button *ngFor="let pin of pins"
                        (click)="selectPin(pin)"
                        class="text-[10px] font-semibold px-2.5 py-1 rounded-lg border transition-all duration-200"
                        [class.bg-[#ffe088]]="activePin()?.id === pin.id"
                        [class.text-[#241a00]]="activePin()?.id === pin.id"
                        [class.border-[#ffe088]]="activePin()?.id === pin.id"
                        [class.bg-white/5]="activePin()?.id !== pin.id"
                        [class.text-[#7587a7]]="activePin()?.id !== pin.id"
                        [class.border-white/10]="activePin()?.id !== pin.id"
                        [class.hover:bg-white/10]="activePin()?.id !== pin.id">
                  {{pin.flag}} {{pin.name.split(' ')[0]}}
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  `,
  styles: [`
    :host { display: block; }

    .map-arc {
      stroke-dashoffset: 200;
      animation: dash-flow 3s linear infinite;
    }

    @keyframes dash-flow {
      to { stroke-dashoffset: -200; }
    }
  `],
  standalone: true
})
export class InteractiveMapComponent {
  protected readonly showAllArcs = true;

  protected readonly pins: MapPin[] = [
    {
      id: 'uk',
      name: 'United Kingdom',
      svgX: 422,
      svgY: 78,
      status: 'Visa-Free Access',
      stay: 'Up to 180 consecutive days',
      details: "Conduct business meetings, visit family, or enjoy leisure without long visa application backlogs in Europe's leading financial center.",
      icon: 'schedule',
      flag: '🇬🇧',
      arcColor: '#ffe088'
    },
    {
      id: 'schengen',
      name: 'Schengen Area',
      svgX: 478,
      svgY: 90,
      status: 'Visa-Free Access',
      stay: '90 days per 180-day block',
      details: 'Unrestricted transit across Germany, France, Italy, and 24 other nations for tourism, networking, and elite travel.',
      icon: 'map',
      flag: '🇪🇺',
      arcColor: '#a0befe'
    },
    {
      id: 'uae',
      name: 'United Arab Emirates',
      svgX: 572,
      svgY: 168,
      status: 'Visa-on-Arrival / e-Visa',
      stay: '30 days upon arrival',
      details: 'Rapid transit entry. Excellent for accessing Middle-Eastern asset management centers and networking in high-growth tax-haven hubs like Dubai.',
      icon: 'flight_land',
      flag: '🇦🇪',
      arcColor: '#86efac'
    },
    {
      id: 'hk',
      name: 'Hong Kong',
      svgX: 770,
      svgY: 195,
      status: 'Visa-Free Access',
      stay: 'Up to 90 consecutive days',
      details: 'Vibrant gateway to Eastern trade. Crucial access option for international merchants, investors, and active portfolio managers.',
      icon: 'domain',
      flag: '🇭🇰',
      arcColor: '#fcd34d'
    },
    {
      id: 'singapore',
      name: 'Singapore',
      svgX: 730,
      svgY: 285,
      status: 'Visa-Free Access',
      stay: 'Up to 30 days per entry',
      details: "Access Asia's primary capital hub instantly. Seamless entry facilitates secure physical asset checks, corporate setups, and banking administration.",
      icon: 'payments',
      flag: '🇸🇬',
      arcColor: '#f9a8d4'
    }
  ];

  protected readonly activePin = signal<MapPin | null>(this.pins[0]);

  protected selectPin(pin: MapPin) {
    this.activePin.set(pin);
  }

  protected hoverPin(pin: MapPin) {
    this.activePin.set(pin);
  }
}
