import { Injectable } from '@angular/core';

declare let gtag: Function;

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private isGtagLoaded = false;

  constructor() {
    // Check if gtag is available
    this.checkGtagAvailability();
  }

  private checkGtagAvailability() {
    if (typeof gtag !== 'undefined') {
      this.isGtagLoaded = true;
    } else {
      // Retry after a short delay
      setTimeout(() => this.checkGtagAvailability(), 500);
    }
  }

  private trackEvent(eventName: string, parameters: any = {}) {
    if (this.isGtagLoaded) {
      gtag('event', eventName, parameters);
      console.log(`GA4 Event tracked: ${eventName}`, parameters);
    } else {
      console.log(`GA4 not loaded, would track: ${eventName}`, parameters);
    }
  }

  // Page view tracking
  trackPageView(pageName: string, userType: 'logged_in' | 'logged_out') {
    this.trackEvent('page_view', {
      page_title: pageName,
      user_type: userType,
      engagement_time_msec: 1
    });
  }

  // Homepage specific events
  trackHeroButtonClick(buttonText: string) {
    this.trackEvent('hero_cta_click', {
      button_text: buttonText,
      page_section: 'hero',
      event_category: 'engagement'
    });
  }

  trackFeatureCardView(featureName: string) {
    this.trackEvent('feature_viewed', {
      feature_name: featureName,
      page_section: 'features',
      event_category: 'engagement'
    });
  }

  trackFeatureCardClick(featureName: string) {
    this.trackEvent('feature_clicked', {
      feature_name: featureName,
      page_section: 'features',
      event_category: 'engagement'
    });
  }

  // Demo request tracking
  trackDemoModalOpen() {
    this.trackEvent('demo_modal_opened', {
      page_section: 'cta',
      event_category: 'lead_generation'
    });
  }

  trackDemoFormStart() {
    this.trackEvent('demo_form_started', {
      page_section: 'demo_modal',
      event_category: 'lead_generation'
    });
  }

  trackDemoFormFieldComplete(fieldName: string) {
    this.trackEvent('demo_form_field_completed', {
      field_name: fieldName,
      page_section: 'demo_modal',
      event_category: 'lead_generation'
    });
  }

  trackDemoFormSubmit(formData: any) {
    this.trackEvent('demo_request_submitted', {
      company_size: formData.productionLines,
      has_message: !!formData.message,
      page_section: 'demo_modal',
      event_category: 'conversion',
      value: 1 // Assign value for conversion tracking
    });
  }

  trackDemoModalClose(method: 'button' | 'backdrop' | 'escape') {
    this.trackEvent('demo_modal_closed', {
      close_method: method,
      page_section: 'demo_modal',
      event_category: 'engagement'
    });
  }

  // Login tracking
  trackLoginModalOpen() {
    this.trackEvent('login_modal_opened', {
      page_section: 'cta',
      event_category: 'authentication'
    });
  }

  trackLoginAttempt() {
    this.trackEvent('login_attempted', {
      page_section: 'login_modal',
      event_category: 'authentication'
    });
  }

  trackLoginSuccess() {
    this.trackEvent('login_success', {
      page_section: 'login_modal',
      event_category: 'authentication',
      value: 1
    });
  }

  // Scroll and engagement tracking
  trackScrollDepth(percentage: number) {
    this.trackEvent('scroll_depth', {
      scroll_percentage: percentage,
      event_category: 'engagement'
    });
  }

  trackTimeOnPage(seconds: number) {
    this.trackEvent('time_on_page', {
      engagement_time_seconds: seconds,
      event_category: 'engagement'
    });
  }

  // Benefits section tracking
  trackBenefitCardView(benefitName: string, metric: string) {
    this.trackEvent('benefit_viewed', {
      benefit_name: benefitName,
      metric_value: metric,
      page_section: 'benefits',
      event_category: 'engagement'
    });
  }

  // CTA section tracking
  trackCtaButtonClick(buttonType: 'primary' | 'secondary', buttonText: string) {
    this.trackEvent('cta_button_click', {
      button_type: buttonType,
      button_text: buttonText,
      page_section: 'cta',
      event_category: 'engagement'
    });
  }

  // Error tracking
  trackError(errorType: string, errorMessage: string, context: string) {
    this.trackEvent('error_occurred', {
      error_type: errorType,
      error_message: errorMessage,
      error_context: context,
      event_category: 'error'
    });
  }
}