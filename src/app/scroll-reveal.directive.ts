import { Directive, ElementRef, OnInit, Renderer2, Input } from '@angular/core';

@Directive({
  selector: '[reveal]',
  standalone: true
})
export class ScrollRevealDirective implements OnInit {
  @Input() revealDelay = 0; // delay in ms
  @Input() revealClass = 'show'; // class to add when revealed

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    this.renderer.addClass(this.el.nativeElement, 'reveal');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            this.renderer.addClass(this.el.nativeElement, this.revealClass);
          }, this.revealDelay);
          observer.unobserve(this.el.nativeElement);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    observer.observe(this.el.nativeElement);
  }
}
