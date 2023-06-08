import { Component, OnInit, Inject, HostListener, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-scroll-to-top',
  templateUrl: './scroll-to-top.component.html',
  styleUrls: ['./scroll-to-top.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScrollToTopComponent implements OnInit {
    windowScrolled: boolean;
    
    constructor(
        @Inject(DOCUMENT) private document: Document,
        private cdr: ChangeDetectorRef
    ) { }
    
  @HostListener("window:scroll", [])
  onWindowScroll() {
      if (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop > 100) {
          this.windowScrolled = true;
      } 
     else if (this.windowScrolled && window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop < 10) {
          this.windowScrolled = false;
      }
      this.cdr.detectChanges();
  }
  scrollToTop() {
      (function smoothscroll() {
          var currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
          if (currentScroll > 0) {
              window.requestAnimationFrame(smoothscroll);
              window.scrollTo(0, 0);
          }
      })();
  }
  ngOnInit() {}
}


