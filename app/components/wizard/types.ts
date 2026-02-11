export interface BrandData {
  entityType: string;
  displayName: string;
  companyName: string;
  ein: string;
  country: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  vertical: string;
  brandRelationship: string;
  website: string;
  stockSymbol: string;
  stockExchange: string;
  firstName: string;
  lastName: string;
}

export interface CampaignData {
  brandId: string;
  usecase: string;
  description: string;
  sample1: string;
  sample2: string;
  messageFlow: string;
  helpMessage: string;
  helpKeywords: string;
  optinMessage: string;
  optinKeywords: string;
  optoutMessage: string;
  optoutKeywords: string;
  subscriberOptin: boolean;
  subscriberOptout: boolean;
  subscriberHelp: boolean;
  embeddedLink: boolean;
  embeddedPhone: boolean;
  numberPool: boolean;
  ageGated: boolean;
  directLending: boolean;
  autoRenewal: boolean;
  termsAndConditions: boolean;
}

export const defaultBrand: BrandData = {
  entityType: '',
  displayName: '',
  companyName: '',
  ein: '',
  country: 'US',
  email: '',
  phone: '',
  street: '',
  city: '',
  state: '',
  postalCode: '',
  vertical: '',
  brandRelationship: '',
  website: '',
  stockSymbol: '',
  stockExchange: '',
  firstName: '',
  lastName: '',
};

export const defaultCampaign: CampaignData = {
  brandId: '',
  usecase: '',
  description: '',
  sample1: '',
  sample2: '',
  messageFlow: '',
  helpMessage: 'Reply HELP for help. Msg & data rates may apply.',
  helpKeywords: 'HELP',
  optinMessage: '',
  optinKeywords: 'START, YES',
  optoutMessage: 'You have been unsubscribed and will not receive any more messages. Reply START to resubscribe.',
  optoutKeywords: 'STOP, QUIT, CANCEL, UNSUBSCRIBE',
  subscriberOptin: true,
  subscriberOptout: true,
  subscriberHelp: true,
  embeddedLink: false,
  embeddedPhone: false,
  numberPool: false,
  ageGated: false,
  directLending: false,
  autoRenewal: true,
  termsAndConditions: false,
};
