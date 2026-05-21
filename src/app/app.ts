import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreloaderComponent } from './preloader.component';
import { InteractiveMapComponent } from './interactive-map.component';
import { TimelineComponent } from './timeline.component';
import { CountryModalComponent, CountryDetail } from './country-modal.component';
import { FAQAccordionComponent } from './faq-accordion.component';
import { ScrollRevealDirective } from './scroll-reveal.directive';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    PreloaderComponent,
    InteractiveMapComponent,
    TimelineComponent,
    CountryModalComponent,
    FAQAccordionComponent,
    ScrollRevealDirective
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // Navigation active state tracker
  protected readonly isScrolled = signal(false);
  protected readonly isMobileMenuOpen = signal(false);

  // Success indicators
  protected readonly consultationBooked = signal(false);
  protected readonly isSubscribed = signal(false);

  // Active details modal control
  protected readonly selectedCountry = signal<CountryDetail | null>(null);

  // Comparison country data library
  private readonly countriesData: Record<string, CountryDetail> = {
    antigua: {
      name: 'Antigua & Barbuda',
      tagline: 'The premier Caribbean investment pathway.',
      minInvestment: '$100,000+',
      processingTime: '3-6 Months',
      visaFreeCount: '150+ Countries',
      taxBenefits: 'Zero personal income, capital gains, or inheritance tax.',
      about: 'Antigua & Barbuda offers the most versatile and cost-effective program in the Caribbean, ranking highly on safety, global reputation, and investment variety. With its high approval rate, it is particularly favored by larger families due to its sibling-friendly inclusion rules.',
      routes: [
        { name: 'NDF Contribution', cost: '$100,000', desc: 'A non-refundable direct donation to the National Development Fund for families up to 4.' },
        { name: 'Approved Real Estate', cost: '$200,000', desc: 'Purchase ownership shares in luxury five-star branded beachfront hotels, beachfront villas, or commercial suites.' }
      ],
      imageUrl: '/images/antigua.png'
    },
    dominica: {
      name: 'Dominica',
      tagline: 'The Nature Isle of the Caribbean.',
      minInvestment: '$100,000+',
      processingTime: '4-6 Months',
      visaFreeCount: '140+ Countries',
      taxBenefits: 'Zero worldwide taxation, secure asset privacy, friendly corporate structures.',
      about: 'Known as the Nature Island, Dominica’s CBI program is one of the oldest and most established in the world. It features a highly streamlined process with strong due diligence standards and offers premium eco-tourism resort assets for investment.',
      routes: [
        { name: 'Economic Diversification Fund', cost: '$100,000', desc: 'Direct direct contribution to national projects supporting local healthcare, infrastructure, and green energy.' },
        { name: 'Approved Real Estate', cost: '$200,000', desc: 'Acquire equity in world-class eco-luxury resorts, redeemable after a designated holding period.' }
      ],
      imageUrl: '/images/dominica.png'
    },
    stlucia: {
      name: 'Saint Lucia',
      tagline: 'Refined luxury, diverse investments.',
      minInvestment: '$100,000+',
      processingTime: '3-5 Months',
      visaFreeCount: '145+ Countries',
      taxBenefits: 'Zero tax on capital gains, inheritance, wealth, and foreign earnings.',
      about: 'Saint Lucia’s program offers robust financial versatility. In addition to traditional donation and real estate routes, it offers unique government bond purchase options, presenting an extremely safe, refundable asset class.',
      routes: [
        { name: 'National Action Bonds (NAB)', cost: '$300,000', desc: 'A fully refundable, non-interest-bearing government bond, held for a minimum of 5 years.' },
        { name: 'National Economic Fund Contribution', cost: '$100,000', desc: 'A non-refundable donation supporting infrastructural development and diversification.' }
      ],
      imageUrl: '/images/stlucia.png'
    },
    stkitts: {
      name: 'St. Kitts & Nevis',
      tagline: 'The Platinum Standard of dual citizenship.',
      minInvestment: '$250,000+',
      processingTime: '4-8 Months',
      visaFreeCount: '155+ Countries',
      taxBenefits: 'No income tax, capital gains levies, zero inheritance taxes, secure privacy.',
      about: 'Established in 1984, St. Kitts & Nevis holds the oldest and most prestigious CBI program in the world (The Platinum Standard). It features premium due diligence, exceptional processing integrity, and unmatched global travel privilege.',
      routes: [
        { name: 'Sustainable Island State Contribution', cost: '$250,000', desc: 'Direct direct contribution supporting renewable energy, food security, and healthcare development.' },
        { name: 'Private Real Estate Purchase', cost: '$400,000', desc: 'Purchase approved premium beachfront residential properties, private villas, or premium luxury suites.' }
      ],
      imageUrl: '/images/stkitts.png'
    }
  };

  constructor() {
    // Listen to window scroll to apply styling to TopAppBar navbar
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', () => {
        this.isScrolled.set(window.scrollY > 40);
      });
    }
  }

  protected toggleMobileMenu() {
    this.isMobileMenuOpen.set(!this.isMobileMenuOpen());
  }

  protected openCountryDetails(countryId: string) {
    const data = this.countriesData[countryId];
    if (data) {
      this.selectedCountry.set(data);
    }
  }

  protected closeCountryDetails() {
    this.selectedCountry.set(null);
  }

  protected bookConsultation(event: Event) {
    event.preventDefault();
    this.consultationBooked.set(true);
    setTimeout(() => {
      this.consultationBooked.set(false);
    }, 4500);
  }

  protected subscribeNewsletter(event: Event) {
    event.preventDefault();
    this.isSubscribed.set(true);
    setTimeout(() => {
      this.isSubscribed.set(false);
    }, 4500);
  }

  protected scrollTo(selector: string) {
    this.isMobileMenuOpen.set(false);
    const element = document.querySelector(selector);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
