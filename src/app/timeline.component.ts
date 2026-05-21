import { Component, ElementRef, OnInit, Renderer2, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface TimelineStep {
  num: string;
  title: string;
  desc: string;
  icon: string;
}

@Component({
  selector: 'app-timeline',
  imports: [CommonModule],
  template: `
    <section class="py-24 bg-white relative overflow-hidden" id="journey-timeline">
      <div class="max-w-7xl mx-auto px-6">
        <!-- Section Header -->
        <div class="text-center mb-20">
          <span class="text-[#3e5e97] font-sans text-xs tracking-[0.25em] uppercase font-bold">The Roadmap</span>
          <h2 class="text-4xl md:text-5xl font-display font-semibold text-[#000615] mt-4 mb-4">
            The Journey to Global Freedom
          </h2>
          <p class="text-[#44474d] max-w-2xl mx-auto">
            Our streamlined, five-step investment citizenship process is designed for maximum velocity, complete security, and legal conformity.
          </p>
        </div>

        <!-- Timeline Steps Container -->
        <div #timelineContainer class="relative grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-4">
          <!-- Horizontal linking line for desktop -->
          <div class="hidden md:block absolute top-10 left-[10%] right-[10%] h-[3px] bg-slate-200 z-0">
            <!-- Animated progress overlay -->
            <div class="h-full bg-gradient-to-r from-[#0b1f3a] via-[#3e5e97] to-[#cca830] transition-all duration-[2000ms] ease-out"
                 [style.width]="progressWidth()"></div>
          </div>

          <!-- Vertical linking line for mobile -->
          <div class="md:hidden absolute left-10 top-8 bottom-8 w-[3px] bg-slate-200 z-0">
            <div class="w-full bg-gradient-to-b from-[#0b1f3a] to-[#cca830] transition-all duration-[2000ms] ease-out"
                 [style.height]="progressWidth()"></div>
          </div>

          <!-- Step Item -->
          <div *ngFor="let step of steps; let i = index" 
               class="relative z-10 flex flex-row md:flex-col items-start md:items-center text-left md:text-center group cursor-pointer"
               (click)="setStep(i + 1)">
            
            <!-- Step Circle -->
            <div class="relative shrink-0 mr-6 md:mr-0 md:mb-6">
              <!-- Active Glow Ring -->
              <div class="absolute -inset-2 rounded-full opacity-0 scale-75 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500 ease-out"
                   [class.!scale-100]="activeStep() >= i + 1"
                   [class.!opacity-100]="activeStep() >= i + 1"
                   [class.bg-[#0b1f3a]/10]="i === 0 || i === 1"
                   [class.bg-[#3e5e97]/10]="i === 2 || i === 3"
                   [class.bg-[#ffe088]/30]="i === 4">
              </div>

              <!-- Primary Indicator Circle -->
              <div class="w-20 h-20 rounded-full flex items-center justify-center border-3 shadow-md transition-all duration-700 ease-out font-display font-semibold text-lg"
                   [class.border-slate-200]="activeStep() < i + 1"
                   [class.bg-white]="activeStep() < i + 1"
                   [class.text-[#000615]]="activeStep() < i + 1"
                   
                   [class.border-[#0b1f3a]]="activeStep() >= i + 1 && i < 2"
                   [class.bg-[#0b1f3a]]="activeStep() >= i + 1 && i < 2"
                   [class.text-[#ffe088]]="activeStep() >= i + 1 && i < 2"

                   [class.border-[#3e5e97]]="activeStep() >= i + 1 && (i === 2 || i === 3)"
                   [class.bg-[#3e5e97]]="activeStep() >= i + 1 && (i === 2 || i === 3)"
                   [class.text-white]="activeStep() >= i + 1 && (i === 2 || i === 3)"

                   [class.border-[#cca830]]="activeStep() >= i + 1 && i === 4"
                   [class.bg-[#ffe088]]="activeStep() >= i + 1 && i === 4"
                   [class.text-[#241a00]]="activeStep() >= i + 1 && i === 4"
                   [class.shadow-xl]="activeStep() >= i + 1"
                   [class.scale-105]="activeStep() >= i + 1">
                
                <span *ngIf="activeStep() < i + 1 || i < 4">{{ step.num }}</span>
                <span *ngIf="activeStep() >= i + 1 && i === 4" class="material-symbols-outlined text-3xl">verified_user</span>
              </div>

              <!-- Step Mini Icon -->
              <div class="absolute -bottom-1 -right-1 w-7 h-7 bg-[#f7f9fb] border border-slate-200 rounded-full flex items-center justify-center text-[#75777e] group-hover:text-[#000615] transition-colors"
                   [class.!border-[#0b1f3a]]="activeStep() >= i + 1"
                   [class.!text-[#000615]]="activeStep() >= i + 1">
                <span class="material-symbols-outlined text-[14px]">{{ step.icon }}</span>
              </div>
            </div>

            <!-- Step Meta Content -->
            <div class="md:w-full">
              <h4 class="font-display font-semibold text-lg text-[#000615] mb-2 transition-colors group-hover:text-[#3e5e97] md:text-center"
                  [class.text-[#3e5e97]]="activeStep() >= i + 1">
                {{ step.title }}
              </h4>
              <p class="text-sm text-[#44474d] max-w-[180px] md:mx-auto leading-relaxed md:text-center">
                {{ step.desc }}
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
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
export class TimelineComponent implements OnInit {
  @ViewChild('timelineContainer', { static: true }) container!: ElementRef;

  protected readonly steps: TimelineStep[] = [
    {
      num: '01',
      title: 'Consultation',
      desc: 'Free strategic evaluation, eligibility check, and custom program alignment.',
      icon: 'forum'
    },
    {
      num: '02',
      title: 'Documentation',
      desc: 'Sleek legal paperwork gathering, translation, and dossier organization.',
      icon: 'description'
    },
    {
      num: '03',
      title: 'Vetting Vows',
      desc: 'State-run due diligence, comprehensive security vetting checks.',
      icon: 'security'
    },
    {
      num: '04',
      title: 'Investment',
      desc: 'Execution of contribution (NDF, Real Estate, or UWI fund).',
      icon: 'payments'
    },
    {
      num: '05',
      title: 'Passport Issued',
      desc: 'Oaths of allegiance completed, certificate and passports issued.',
      icon: 'workspace_premium'
    }
  ];

  protected readonly activeStep = signal<number>(0);
  protected readonly progressWidth = signal<string>('0%');

  ngOnInit() {
    // Set up an intersection observer to trigger timeline animation sequence when scrolled into view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.triggerStepAnimation();
          observer.unobserve(this.container.nativeElement);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -100px 0px'
    });

    observer.observe(this.container.nativeElement);
  }

  private triggerStepAnimation() {
    let step = 0;
    const interval = setInterval(() => {
      step++;
      this.activeStep.set(step);
      
      // Calculate progress line percentage: e.g. step 1 -> 0%, step 5 -> 100%
      const percentage = ((step - 1) / 4) * 100;
      this.progressWidth.set(`${percentage}%`);

      if (step >= 5) {
        clearInterval(interval);
      }
    }, 550);
  }

  protected setStep(step: number) {
    this.activeStep.set(step);
    const percentage = ((step - 1) / 4) * 100;
    this.progressWidth.set(`${percentage}%`);
  }
}
