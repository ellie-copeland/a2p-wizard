export const ENTITY_TYPES = [
  { value: 'PRIVATE_PROFIT', label: 'Private Company', desc: 'Privately held, for-profit' },
  { value: 'PUBLIC_PROFIT', label: 'Public Company', desc: 'Publicly traded, for-profit' },
  { value: 'NON_PROFIT', label: 'Non-Profit', desc: 'Non-profit organization' },
  { value: 'GOVERNMENT', label: 'Government', desc: 'Government entity' },
  { value: 'SOLE_PROPRIETOR', label: 'Sole Proprietor', desc: 'Individual / sole proprietorship' },
];

export const VERTICALS = [
  'REAL_ESTATE', 'HEALTHCARE', 'ENERGY', 'ENTERTAINMENT', 'RETAIL',
  'AGRICULTURE', 'INSURANCE', 'EDUCATION', 'HOSPITALITY', 'FINANCIAL',
  'GAMBLING', 'CONSTRUCTION', 'NGO', 'MANUFACTURING', 'GOVERNMENT',
  'TECHNOLOGY', 'COMMUNICATION',
];

export const BRAND_RELATIONSHIPS = [
  { value: 'BASIC_ACCOUNT', label: 'Basic (< 1K msgs/mo)' },
  { value: 'SMALL_ACCOUNT', label: 'Small (1K-10K msgs/mo)' },
  { value: 'MEDIUM_ACCOUNT', label: 'Medium (10K-100K msgs/mo)' },
  { value: 'LARGE_ACCOUNT', label: 'Large (100K-1M msgs/mo)' },
  { value: 'KEY_ACCOUNT', label: 'Key (1M+ msgs/mo)' },
];

export const USE_CASES = [
  'ACCOUNT_NOTIFICATION', 'CUSTOMER_CARE', 'DELIVERY_NOTIFICATION',
  'FRAUD_ALERT', 'HIGHER_EDUCATION', 'LOW_VOLUME', 'MARKETING',
  'POLLING_VOTING', 'PUBLIC_SERVICE_ANNOUNCEMENT', 'SECURITY_ALERT',
  'SOLE_PROPRIETOR', 'SWEEPSTAKE', '2FA', 'AGENTS_FRANCHISES',
  'CHARITY', 'CONVERSATIONAL', 'EMERGENCY', 'M2M', 'MIXED',
  'POLITICAL', 'SOCIAL', 'TRIAL', 'UCaaS_HIGH', 'UCaaS_LOW',
];

export const STOCK_EXCHANGES = [
  'NONE', 'NASDAQ', 'NYSE', 'AMEX', 'AMX', 'ASX', 'B3', 'BME', 'BSE',
  'FRA', 'ICEX', 'JPX', 'JSE', 'KRX', 'LON', 'NSE', 'OMX', 'SEHK',
  'SGX', 'SSE', 'STO', 'SWX', 'SZSE', 'TSX', 'TWSE', 'VSE', 'OTHER',
];

export const STEPS = [
  'Business Type',
  'Business Info',
  'Brand Review',
  'Campaign Setup',
  'Compliance',
  'Campaign Review',
  'Confirmation',
];
