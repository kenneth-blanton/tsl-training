import { Component, inject, NgModule, OnInit, OnDestroy, AfterViewInit, ElementRef, PLATFORM_ID } from '@angular/core';
import { LoginComponent } from '../login-component/login-component';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AuthService } from '../auth/auth.service';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AnalyticsService } from '../services/analytics.service';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [LoginComponent, CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home implements OnInit, OnDestroy, AfterViewInit {
  authService = inject(AuthService);
  formBuilder = inject(FormBuilder);
  analytics = inject(AnalyticsService);
  elementRef = inject(ElementRef);
  platformId = inject(PLATFORM_ID);

  user$ = this.authService.user$;
  showLogin = false;
  showDemo = false;
  
  private pageLoadTime = Date.now();
  private timeOnPageSubscription?: Subscription;
  private scrollListener?: () => void;
  private hasTrackedScrollDepths = new Set<number>();
  private isBrowser = isPlatformBrowser(this.platformId);
  
  demoForm: FormGroup = this.formBuilder.group({
    company: ['', [Validators.required]],
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required]],
    productionLines: ['', [Validators.required]],
    message: ['']
  });

  ngOnInit() {
    // Track initial page view
    this.user$.subscribe(user => {
      const userType = user ? 'logged_in' : 'logged_out';
      this.analytics.trackPageView('Homepage', userType);
    });

    // Track time on page every 30 seconds
    this.timeOnPageSubscription = interval(30000).subscribe(() => {
      const timeOnPage = Math.floor((Date.now() - this.pageLoadTime) / 1000);
      this.analytics.trackTimeOnPage(timeOnPage);
    });

    // Track form field completions
    this.setupFormTracking();
  }

  ngAfterViewInit() {
    if (this.isBrowser) {
      // Setup scroll tracking
      this.setupScrollTracking();
      
      // Setup intersection observer for feature cards
      this.setupIntersectionObserver();
    }
  }

  ngOnDestroy() {
    if (this.timeOnPageSubscription) {
      this.timeOnPageSubscription.unsubscribe();
    }
    if (this.scrollListener && this.isBrowser) {
      window.removeEventListener('scroll', this.scrollListener);
    }
  }

  private setupFormTracking() {
    // Track when user starts filling out the demo form
    let hasStartedForm = false;
    
    Object.keys(this.demoForm.controls).forEach(fieldName => {
      const control = this.demoForm.get(fieldName);
      if (control) {
        control.valueChanges.subscribe(value => {
          if (!hasStartedForm && value && value.trim()) {
            this.analytics.trackDemoFormStart();
            hasStartedForm = true;
          }
          
          if (value && value.trim()) {
            this.analytics.trackDemoFormFieldComplete(fieldName);
          }
        });
      }
    });
  }

  private setupScrollTracking() {
    if (!this.isBrowser) return;
    
    this.scrollListener = () => {
      const scrolled = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = Math.round((scrolled / maxScroll) * 100);

      // Track scroll depths at 25%, 50%, 75%, and 100%
      [25, 50, 75, 100].forEach(depth => {
        if (scrollPercentage >= depth && !this.hasTrackedScrollDepths.has(depth)) {
          this.analytics.trackScrollDepth(depth);
          this.hasTrackedScrollDepths.add(depth);
        }
      });
    };

    window.addEventListener('scroll', this.scrollListener, { passive: true });
  }

  private setupIntersectionObserver() {
    if (this.isBrowser && typeof IntersectionObserver !== 'undefined') {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const element = entry.target;
            
            // Track feature card views
            if (element.classList.contains('feature-card')) {
              const featureName = element.querySelector('h3')?.textContent || 'Unknown Feature';
              this.analytics.trackFeatureCardView(featureName);
            }
            
            // Track benefit card views
            if (element.classList.contains('benefit-item')) {
              const benefitName = element.querySelector('h4')?.textContent || 'Unknown Benefit';
              const metric = element.querySelector('.benefit-metric')?.textContent || '';
              this.analytics.trackBenefitCardView(benefitName, metric);
            }
          }
        });
      }, { threshold: 0.5 });

      // Observe feature cards and benefit items
      setTimeout(() => {
        const featureCards = this.elementRef.nativeElement.querySelectorAll('.feature-card');
        const benefitItems = this.elementRef.nativeElement.querySelectorAll('.benefit-item');
        
        featureCards.forEach((card: Element) => observer.observe(card));
        benefitItems.forEach((item: Element) => observer.observe(item));
      }, 100);
    }
  }

  // Enhanced event tracking methods
  onHeroButtonClick() {
    this.analytics.trackHeroButtonClick('Access Platform');
    this.showLogin = true;
    this.analytics.trackLoginModalOpen();
  }

  onDemoButtonClick() {
    this.analytics.trackCtaButtonClick('primary', 'Request Demo');
    this.showDemo = true;
    this.analytics.trackDemoModalOpen();
  }

  onSignInButtonClick() {
    this.analytics.trackCtaButtonClick('secondary', 'Sign In');
    this.showLogin = true;
    this.analytics.trackLoginModalOpen();
  }

  onDemoModalClose() {
    this.analytics.trackDemoModalClose('button');
    this.showDemo = false;
  }

  onLoginModalClose() {
    this.showLogin = false;
  }

  onFeatureCardClick(featureName: string) {
    this.analytics.trackFeatureCardClick(featureName);
  }

  requestDemo() {
    if (this.demoForm.valid) {
      try {
        this.analytics.trackDemoFormSubmit(this.demoForm.value);
        console.log('Demo request submitted:', this.demoForm.value);
        
        // Here you would typically send the data to your backend
        // For now, we'll just show a success message and close the modal
        alert('Thank you for your interest! We will contact you within 24 hours to schedule your demo.');
        this.showDemo = false;
        this.demoForm.reset();
      } catch (error) {
        this.analytics.trackError('demo_form_submit', String(error), 'requestDemo');
        console.error('Error submitting demo request:', error);
      }
    }
  }

  signOut() {
    this.authService
      .signOut()
      .then(() => {
        console.log('User signed out');
      })
      .catch((error) => {
        this.analytics.trackError('sign_out', String(error), 'signOut');
        console.error('Failed to sign out:', error);
      });
  }
}
