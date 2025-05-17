import React from 'react';

export interface HeroProps {
  onGetStarted: () => void;
  onAdvancedCalculator?: () => void;
}

export interface FeaturesSectionProps {}

export interface BenefitsSectionProps {}

export interface CallToActionProps {
  onGetStarted: () => void;
}

// Add more component type declarations as needed 