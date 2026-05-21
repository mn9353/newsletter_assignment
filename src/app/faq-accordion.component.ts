import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface FAQItem {
  q: string;
  a: string;
}

@Component({
  selector: 'app-faq-accordion',
  imports: [CommonModule],
  template: `
    <section class="py-24 bg-slate-50 relative overflow-hidden" id="faq-section">
      <div class="max-w-4xl mx-auto px-6">
        <!-- Section Header -->
        <div class="text-center mb-16">
          <span class="text-[#3e5e97] font-sans text-xs tracking-[0.2em] uppercase font-bold">Inquiries</span>
          <h2 class="text-4xl md:text-5xl font-display font-semibold text-[#000615] mt-4 mb-4">
            Frequently Asked Questions
          </h2>
          <p class="text-[#44474d] max-w-xl mx-auto">
            Everything you need to know about the Antigua &amp; Barbuda Citizenship by Investment program.
          </p>
        </div>

        <!-- Accordion container -->
        <div class="space-y-4">
          <div *ngFor="let item of faqs; let i = index" 
               class="bg-white rounded-2xl border border-slate-200/60 premium-shadow overflow-hidden transition-all duration-300">
            
            <!-- Question header -->
            <button (click)="toggleFAQ(i)" 
                    class="w-full text-left p-6 md:p-8 flex justify-between items-center gap-6 select-none focus:outline-none hover:bg-slate-50/50 transition-colors">
              <span class="font-display font-semibold text-base md:text-lg text-[#000615] group-hover:text-[#3e5e97]">
                {{item.q}}
              </span>
              
              <!-- Expanding icon indicator -->
              <span class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-slate-500 transition-transform duration-300"
                    [class.rotate-180]="openIndex() === i"
                    [class.!bg-[#0b1f3a]]="openIndex() === i"
                    [class.!text-[#ffe088]]="openIndex() === i">
                <span class="material-symbols-outlined text-sm font-bold">keyboard_arrow_down</span>
              </span>
            </button>

            <!-- Animated Answer wrapper -->
            <div class="transition-all duration-300 ease-in-out overflow-hidden"
                 [style.maxHeight]="openIndex() === i ? '250px' : '0px'">
              <div class="p-6 md:p-8 pt-0 border-t border-slate-100/80 text-sm md:text-base text-[#44474d] leading-relaxed">
                {{item.a}}
              </div>
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
export class FAQAccordionComponent {
  protected readonly openIndex = signal<number | null>(0); // default to expand first question

  protected readonly faqs: FAQItem[] = [
    {
      q: 'Who can be included in a family application for citizenship?',
      a: 'The main applicant can include their spouse, dependent children up to 30 years of age (enrolled in full-time education), and dependent parents or grandparents aged 55 or above. Unmarried dependent siblings of both the main applicant and their spouse can also be included.'
    },
    {
      q: 'How long does the application approval process take?',
      a: 'The typical processing time for Antigua and Barbuda is between 3 to 6 months from submission of a complete dossier. Vetting procedures are highly robust, after which physical passports and citizenship certificates are issued immediately.'
    },
    {
      q: 'What is the absolute minimum investment requirement?',
      a: 'Under the National Development Fund (NDF) contribution option, the minimum donation is $100,000 for a family of up to 4 persons. For real estate routes, a government-approved purchase of luxury resorts or villa shares starts from $200,000.'
    },
    {
      q: 'Can Antigua & Barbuda citizenship be inherited by future generations?',
      a: 'Yes, citizenship obtained under the Citizenship by Investment Act is permanent and fully legally recognized for lifetime. It can be legally passed down to descendants (newborns and future spouses) through registration procedures.'
    },
    {
      q: 'Are there physical residency or visitation requirements?',
      a: 'Antigua and Barbuda requires citizens to spend a minimum of just 5 days in the country during the first 5 years of obtaining citizenship. This makes the program incredibly flexible and ideal for global business leaders.'
    }
  ];

  protected toggleFAQ(index: number) {
    if (this.openIndex() === index) {
      this.openIndex.set(null);
    } else {
      this.openIndex.set(index);
    }
  }
}
