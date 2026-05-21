import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface MapPinFact {
  icon: string;
  label: string;
  value: string;
}

interface MapPin {
  id: string;
  name: string;
  // Coordinates as percentages on the 1:1 square map grid
  svgX: number;
  svgY: number;
  status: string;
  stay: string;
  details: string;
  icon: string;
  flag: string;
  arcColor: string;
  controlX: number;
  controlY: number;
  facts: MapPinFact[];
}

@Component({
  selector: 'app-interactive-map',
  imports: [CommonModule],
  template: `
    <section class="py-20 md:py-24 bg-[#0b1f3a] text-white relative overflow-hidden" id="map-section">
      <!-- Ambient glow orbs -->
      <div class="absolute top-1/4 left-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-[#3e5e97]/15 rounded-full blur-[100px] md:blur-[140px] pointer-events-none"></div>
      <div class="absolute bottom-1/4 right-1/4 w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-[#cca830]/10 rounded-full blur-[100px] md:blur-[120px] pointer-events-none"></div>

      <div class="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        <!-- Section Header -->
        <div class="text-center mb-10 md:text-center md:mb-16 max-w-2xl mx-auto">
          <span class="text-[#ffe088] text-xs tracking-[0.25em] uppercase font-bold">Global Access Matrix</span>
          <h2 class="text-3xl md:text-5xl font-display font-semibold mt-4 mb-4 md:mb-6 leading-tight">
            One Passport. Global Freedom.
          </h2>
          <p class="text-[#7587a7] text-sm md:text-base font-sans leading-relaxed">
            Antigua and Barbuda citizenship unlocks unrestricted, visa-free access to 150+ countries. Tap on the glowing pins to explore each destination's privileges.
          </p>
        </div>

        <!-- Map + Info Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">

          <!-- ── World Map Panel ── -->
          <div class="lg:col-span-2 relative bg-[#020e22] border border-white/10 rounded-[24px] md:rounded-[28px] overflow-hidden shadow-2xl aspect-square flex items-center justify-center">

            <!-- High-resolution generated luxury world map background -->
            <img src="/images/world_map.png" 
                 class="absolute inset-0 w-full h-full object-cover opacity-90 select-none pointer-events-none" 
                 alt="Luxury World Map Background">

            <!-- Subtle tech grid overlay -->
            <div class="absolute inset-0 opacity-[0.03] pointer-events-none"
                 style="background-image: linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px); background-size: 24px 24px;">
            </div>

            <!-- SVG Flight Arcs Overlay aligned perfectly with the 100x100 grid -->
            <svg class="absolute inset-0 w-full h-full z-10 pointer-events-none"
                 viewBox="0 0 100 100"
                 fill="none"
                 xmlns="http://www.w3.org/2000/svg">
              
              <defs>
                <!-- Glowing linear gradients for each destination path -->
                <linearGradient *ngFor="let pin of pins" [id]="'gradient-' + pin.id" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#ffe088" stop-opacity="0.8"/>
                  <stop offset="100%" [attr.stop-color]="pin.arcColor" stop-opacity="0.3"/>
                </linearGradient>
              </defs>

              <!-- ───── ANIMATED ARC LINES from Antigua (24.5, 49.5) ───── -->
              <g *ngFor="let pin of pins">
                <path *ngIf="activePin()?.id === pin.id || showAllArcs"
                      [attr.d]="'M 24.5 49.5 Q ' + pin.controlX + ' ' + pin.controlY + ' ' + pin.svgX + ' ' + pin.svgY"
                      [attr.stroke]="'url(#gradient-' + pin.id + ')'"
                      stroke-width="0.35"
                      stroke-dasharray="1.2,0.8"
                      fill="none"
                      class="map-arc"
                      [class.active-arc]="activePin()?.id === pin.id"
                      [attr.opacity]="activePin()?.id === pin.id ? 0.95 : 0.4">
                </path>
              </g>

              <!-- ───── ANTIGUA CBI SOURCE POINT ───── -->
              <g transform="translate(24.5, 49.5)">
                <!-- Pulse effect -->
                <circle r="3.5" fill="#ffe088" opacity="0.15">
                  <animate attributeName="r" values="2;4.5;2" dur="3s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" values="0.2;0;0.2" dur="3s" repeatCount="indefinite"/>
                </circle>
                <!-- Outer gold border -->
                <circle r="1.4" fill="#020e22" stroke="#ffe088" stroke-width="0.3"/>
                <!-- Center gold dot -->
                <circle r="0.6" fill="#ffe088"/>
              </g>
            </svg>

            <!-- Antigua Label Pin -->
            <div class="absolute z-20 pointer-events-none select-none text-[8px] font-sans tracking-[0.2em] font-extrabold text-[#ffe088] bg-[#0b1f3a]/90 px-1.5 py-0.5 rounded border border-[#ffe088]/30 shadow-lg"
                 style="left: 24.5%; top: 46%;">
              ANTIGUA
            </div>

            <!-- Glowing Interactive Destination Pins positioned in HTML % for pixel perfect hover/click hits -->
            <div *ngFor="let pin of pins"
                 [style.left.%]="pin.svgX"
                 [style.top.%]="pin.svgY"
                 class="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-20 p-3 md:p-4"
                 (click)="selectPin(pin)"
                 (mouseenter)="hoverPin(pin)">

              <div class="relative w-4 h-4 flex items-center justify-center">
                <!-- Ping outer ripple -->
                <span class="absolute inline-flex w-7 h-7 rounded-full bg-white/20 animate-ping opacity-60"
                      *ngIf="activePin()?.id === pin.id"></span>
                <span class="absolute inline-flex w-5 h-5 rounded-full -left-0.5 -top-0.5 transition-all duration-300"
                      [style.background-color]="pin.arcColor + '1b'"
                      [class.scale-150]="activePin()?.id === pin.id"></span>

                <!-- Central Dot -->
                <span class="relative flex h-2.5 w-2.5 rounded-full border border-white transition-all duration-300"
                      [style.background-color]="activePin()?.id === pin.id ? '#ffe088' : '#7eb3ff'"
                      [style.box-shadow]="activePin()?.id === pin.id ? '0 0 10px #ffe088' : '0 0 6px #7eb3ff'"
                      [class.scale-125]="activePin()?.id === pin.id"></span>

                <!-- Tooltip (Visible on hover OR when active on mobile) -->
                <div class="absolute left-1/2 -translate-x-1/2 bottom-6 bg-[#000615] px-2 py-0.5 rounded border border-white/10 text-[8px] font-bold tracking-wide whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none premium-shadow z-30"
                     [class.opacity-100]="activePin()?.id === pin.id">
                  {{pin.name}}
                </div>
              </div>
            </div>

            <!-- Mobile Glassmorphic Floating Panel Overlay (Visible on mobile/tablet screens only) -->
            <div *ngIf="activePin() as pin" 
                 (click)="scrollToDetails()"
                 class="absolute bottom-3 left-3 right-3 bg-[#0b1f3a]/90 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-xl z-20 lg:hidden block animate-fade-in-up cursor-pointer hover:bg-[#0b1f3a]/95 transition-all duration-300">
              <div class="flex items-center justify-between gap-2">
                <div class="flex items-center gap-3">
                  <span class="text-3xl leading-none">{{pin.flag}}</span>
                  <div>
                    <h4 class="text-sm font-display font-semibold text-white leading-tight">{{pin.name}}</h4>
                    <p class="text-[9px] text-[#ffe088] font-sans font-bold uppercase tracking-wider mt-0.5">{{pin.status}}</p>
                  </div>
                </div>
                <!-- Interactive View Specs indicator -->
                <div class="text-right border-l border-white/10 pl-3 flex items-center gap-1.5 text-[#ffe088]">
                  <span class="text-[9px] font-extrabold uppercase tracking-widest whitespace-nowrap">View Specs</span>
                  <span class="material-symbols-outlined text-xs animate-bounce">arrow_downward</span>
                </div>
              </div>
            </div>

            <!-- Bottom left legend (Hidden on very small screens to prevent clutter) -->
            <div class="absolute bottom-4 left-4 md:bottom-5 md:left-6 sm:flex hidden items-center gap-3 md:gap-4 text-[8px] md:text-[9px] text-[#7587a7] font-bold font-sans select-none z-20">
              <div class="flex items-center gap-1">
                <span class="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#ffe088] shadow-[0_0_6px_#ffe088]"></span>
                <span>CBI Origin</span>
              </div>
              <div class="flex items-center gap-1">
                <span class="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#7eb3ff] shadow-[0_0_6px_#7eb3ff]"></span>
                <span>Visa-Free Hub</span>
              </div>
            </div>

            <!-- Top right badge -->
            <div class="absolute top-4 right-4 md:top-5 md:right-6 bg-white/5 border border-white/10 rounded-xl px-2.5 py-1 text-[8px] md:text-[9px] font-bold text-[#ffe088] tracking-widest select-none z-20">
              150+ COUNTRIES
            </div>
          </div>

          <!-- ── Info Side Panel (Hidden on mobile map, but full detail displays underneath) ── -->
          <div id="details-card" class="bg-white/5 border border-white/10 rounded-[24px] md:rounded-[28px] p-5 md:p-7 backdrop-blur-xl shadow-2xl flex flex-col justify-between h-full min-h-[350px] lg:min-h-0">
            <div *ngIf="activePin() as pin; else placeholder" class="flex-1 flex flex-col justify-between">
              <div>
                <!-- Flag + Name -->
                <div class="flex items-center gap-3.5 mb-5 md:mb-6">
                  <span class="text-4xl leading-none">{{pin.flag}}</span>
                  <div>
                    <h4 class="text-lg md:text-xl font-display font-semibold text-white leading-tight">{{pin.name}}</h4>
                    <span class="text-[10px] text-[#ffe088] font-sans tracking-wider uppercase font-bold">{{pin.status}}</span>
                  </div>
                </div>

                <!-- Stay block -->
                <div class="flex gap-3.5 items-start mb-4 md:mb-5">
                  <div class="w-9 h-9 rounded-xl bg-[#ffe088]/10 flex items-center justify-center text-[#ffe088] shrink-0">
                    <span class="material-symbols-outlined text-base">{{pin.icon}}</span>
                  </div>
                  <div>
                    <h5 class="text-[9px] text-[#7587a7] uppercase tracking-wider font-bold mb-0.5">Allowed Stay</h5>
                    <p class="text-white text-sm font-semibold">{{pin.stay}}</p>
                  </div>
                </div>

                <!-- Strategic Value block -->
                <div class="flex gap-3.5 items-start mb-6 md:mb-5">
                  <div class="w-9 h-9 rounded-xl bg-[#ffe088]/10 flex items-center justify-center text-[#ffe088] shrink-0">
                    <span class="material-symbols-outlined text-base">verified_user</span>
                  </div>
                  <div class="flex-1">
                    <h5 class="text-[9px] text-[#7587a7] uppercase tracking-wider font-bold mb-0.5">Strategic Value</h5>
                    <p class="text-white text-xs leading-relaxed font-sans opacity-90">{{pin.details}}</p>
                  </div>
                </div>

                <!-- CBI Strategic Parameters (Laptop/Desktop Only - Fills vertical spacing cleanly) -->
                <div class="hidden lg:block border-t border-white/10 pt-5 mt-5">
                  <h5 class="text-[9px] text-[#ffe088] uppercase tracking-widest font-bold mb-3">CBI Strategic Facts</h5>
                  <div class="grid grid-cols-2 gap-2.5">
                    <div *ngFor="let fact of pin.facts" class="bg-white/[0.02] border border-white/5 rounded-xl p-2 md:p-2.5 flex items-center gap-2">
                      <span class="material-symbols-outlined text-[#ffe088] text-sm shrink-0">{{fact.icon}}</span>
                      <div class="min-w-0">
                        <span class="text-[8px] text-[#7587a7] block uppercase tracking-wide font-bold">{{fact.label}}</span>
                        <span class="text-[9.5px] text-white font-bold block truncate mt-0.5">{{fact.value}}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- CTA Button -->
              <button class="w-full py-3.5 bg-[#cca830] hover:bg-[#ffe088] text-[#241a00] font-bold rounded-xl text-xs tracking-wider transition-all duration-300 hover:scale-[1.02] shadow-lg mb-4 mt-6">
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
                  Tap any glowing pin on the world map to reveal visa access details and strategic benefits for Antigua &amp; Barbuda passport holders.
                </p>
              </div>
            </ng-template>

            <!-- Destination tabs at bottom -->
            <div class="mt-auto pt-4 border-t border-white/10">
              <p class="text-[9px] text-[#7587a7] uppercase tracking-widest font-bold mb-3">Quick Select</p>
              <div class="grid grid-cols-2 gap-2">
                <button *ngFor="let pin of pins"
                        (click)="selectPin(pin)"
                        class="text-[10px] font-semibold py-2 px-2.5 rounded-lg border transition-all duration-200 text-left flex items-center gap-1.5"
                        [class.bg-[#ffe088]]="activePin()?.id === pin.id"
                        [class.text-[#241a00]]="activePin()?.id === pin.id"
                        [class.border-[#ffe088]]="activePin()?.id === pin.id"
                        [class.bg-white/5]="activePin()?.id !== pin.id"
                        [class.text-[#c4c6ce]]="activePin()?.id !== pin.id"
                        [class.border-white/10]="activePin()?.id !== pin.id"
                        [class.hover:bg-white/10]="activePin()?.id !== pin.id">
                  <span>{{pin.flag}}</span>
                  <span class="truncate">{{pin.name.split(' ')[0]}}</span>
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
      stroke-dashoffset: 100;
      animation: dash-flow 4s linear infinite;
      transition: opacity 0.3s ease, stroke-width 0.3s ease;
    }

    .active-arc {
      stroke-width: 0.6;
      stroke-dasharray: 2, 1;
      animation: dash-flow 2.5s linear infinite;
    }

    @keyframes dash-flow {
      to { stroke-dashoffset: -100; }
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(12px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .animate-fade-in-up {
      animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
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
      svgX: 46.5,
      svgY: 38.0,
      status: 'Visa-Free Access',
      stay: 'Up to 180 consecutive days',
      details: "Conduct business meetings, visit family, or enjoy leisure without long visa application backlogs in Europe's leading financial center.",
      icon: 'schedule',
      flag: '🇬🇧',
      arcColor: '#a0befe',
      controlX: 33.0,
      controlY: 35.0,
      facts: [
        { icon: 'business_center', label: 'Travel Purpose', value: 'Trade, Meetings' },
        { icon: 'description', label: 'Visa Class', value: 'Direct Waiver' },
        { icon: 'flight_takeoff', label: 'Connections', value: 'Direct Flight' },
        { icon: 'account_balance', label: 'Hub Strength', value: 'World Elite' }
      ]
    },
    {
      id: 'schengen',
      name: 'Schengen Area',
      svgX: 50.0,
      svgY: 40.5,
      status: 'Visa-Free Access',
      stay: '90 days per 180-day block',
      details: 'Unrestricted transit across Germany, France, Italy, and 24 other nations for tourism, networking, and elite travel.',
      icon: 'map',
      flag: '🇪🇺',
      arcColor: '#93c5fd',
      controlX: 35.0,
      controlY: 37.0,
      facts: [
        { icon: 'language', label: 'Nations Covered', value: '27 EU States' },
        { icon: 'security', label: 'Agreement Code', value: 'Annex II Waived' },
        { icon: 'hub', label: 'Transit Core', value: 'Frankfurt/CDG' },
        { icon: 'star', label: 'Value Score', value: 'Platinum tier' }
      ]
    },
    {
      id: 'uae',
      name: 'United Arab Emirates',
      svgX: 59.5,
      svgY: 49.5,
      status: 'Visa-on-Arrival / e-Visa',
      stay: '30 days upon arrival',
      details: 'Rapid transit entry. Excellent for accessing Middle-Eastern asset management centers and networking in high-growth tax-haven hubs like Dubai.',
      icon: 'flight_land',
      flag: '🇦🇪',
      arcColor: '#86efac',
      controlX: 42.0,
      controlY: 40.0,
      facts: [
        { icon: 'currency_exchange', label: 'Asset Access', value: 'Dubai/Abu Dhabi' },
        { icon: 'speed', label: 'VoA Approval', value: 'Instant Entry' },
        { icon: 'rocket_launch', label: 'Growth Hub', value: 'Silicon Oasis' },
        { icon: 'workspace_premium', label: 'Status Tier', value: 'Premium e-Visa' }
      ]
    },
    {
      id: 'hk',
      name: 'Hong Kong',
      svgX: 77.5,
      svgY: 45.0,
      status: 'Visa-Free Access',
      stay: 'Up to 90 consecutive days',
      details: 'Vibrant gateway to Eastern trade. Crucial access option for international merchants, investors, and active portfolio managers.',
      icon: 'domain',
      flag: '🇭🇰',
      arcColor: '#fcd34d',
      controlX: 51.0,
      controlY: 30.0,
      facts: [
        { icon: 'trending_up', label: 'Market Gateway', value: 'Far East Trade' },
        { icon: 'article', label: 'Entry Code', value: 'Exemption Agrm.' },
        { icon: 'local_airport', label: 'Transit Core', value: 'Chek Lap Kok' },
        { icon: 'wallet', label: 'Diversification', value: 'Dual Asset Base' }
      ]
    },
    {
      id: 'singapore',
      name: 'Singapore',
      svgX: 74.0,
      svgY: 54.5,
      status: 'Visa-Free Access',
      stay: 'Up to 30 days per entry',
      details: "Access Asia's primary capital hub instantly. Seamless entry facilitates secure physical asset checks, corporate setups, and banking administration.",
      icon: 'payments',
      flag: '🇸🇬',
      arcColor: '#f9a8d4',
      controlX: 49.0,
      controlY: 42.0,
      facts: [
        { icon: 'account_balance_wallet', label: 'Family Office', value: 'Changi Wealth' },
        { icon: 'assignment_turned_in', label: 'Stay Code', value: '30-Day Short Stay' },
        { icon: 'apartment', label: 'HQ Base', value: 'Marina Bay Core' },
        { icon: 'verified', label: 'Bank Check', value: 'Secure Asset' }
      ]
    }
  ];

  protected readonly activePin = signal<MapPin | null>(this.pins[0]);

  protected selectPin(pin: MapPin) {
    this.activePin.set(pin);
  }

  protected hoverPin(pin: MapPin) {
    this.activePin.set(pin);
  }

  protected scrollToDetails() {
    const element = document.getElementById('details-card');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
}
