

export interface Service {
  id: string;
  name: string;

  blurb: string;

  url: string;
}

export const SERVICES: Service[] = [
  { id: 'ga', name: 'Google Analytics', blurb: 'a web analytics service that tracks and reports website traffic', url: 'https://policies.google.com/privacy' },
  { id: 'gads', name: 'Google AdSense', blurb: 'an advertising service that uses cookies to serve ads based on your prior visits', url: 'https://policies.google.com/technologies/ads' },
  { id: 'recaptcha', name: 'Google reCAPTCHA', blurb: 'a service that protects the site from spam and abuse', url: 'https://policies.google.com/privacy' },
  { id: 'gtm', name: 'Google Tag Manager', blurb: 'a tag management system for managing marketing and analytics tags', url: 'https://policies.google.com/privacy' },
  { id: 'fbpixel', name: 'Meta (Facebook) Pixel', blurb: 'an analytics tool that measures the effectiveness of advertising', url: 'https://www.facebook.com/privacy/policy' },
  { id: 'stripe', name: 'Stripe', blurb: 'a payment processor for handling transactions', url: 'https://stripe.com/privacy' },
  { id: 'paypal', name: 'PayPal', blurb: 'a payment processor for handling transactions', url: 'https://www.paypal.com/us/legalhub/privacy-full' },
  { id: 'mailchimp', name: 'Mailchimp', blurb: 'an email marketing platform for sending newsletters and updates', url: 'https://www.intuit.com/privacy/statement/' },
  { id: 'hotjar', name: 'Hotjar', blurb: 'a product experience analytics service that records usage and behaviour', url: 'https://www.hotjar.com/legal/policies/privacy/' },
  { id: 'cloudflare', name: 'Cloudflare', blurb: 'a content delivery and security network', url: 'https://www.cloudflare.com/privacypolicy/' },
  { id: 'aws', name: 'Amazon Web Services', blurb: 'a cloud hosting and infrastructure provider', url: 'https://aws.amazon.com/privacy/' },
  { id: 'sentry', name: 'Sentry', blurb: 'an error monitoring and performance service', url: 'https://sentry.io/privacy/' },
  { id: 'intercom', name: 'Intercom', blurb: 'a customer messaging and support platform', url: 'https://www.intercom.com/legal/privacy' },
  { id: 'segment', name: 'Segment', blurb: 'a customer data platform that collects and routes analytics events', url: 'https://segment.com/legal/privacy/' },
  { id: 'mixpanel', name: 'Mixpanel', blurb: 'a product analytics service', url: 'https://mixpanel.com/legal/privacy-policy/' },
  { id: 'plausible', name: 'Plausible Analytics', blurb: 'a privacy-friendly, cookieless web analytics service', url: 'https://plausible.io/privacy' },
];

export interface PolicyData {
  entityName: string;
  siteName: string;
  siteUrl: string;
  contactEmail: string;
  entityType: 'company' | 'person';
  country: string;
  effectiveDate: string; 
  collectsPII: boolean;
  usesCookies: boolean;
  gdpr: boolean;
  ccpa: boolean;
  children: boolean;
  serviceIds: string[];
}

export const DEFAULTS: PolicyData = {
  entityName: '',
  siteName: '',
  siteUrl: '',
  contactEmail: '',
  entityType: 'company',
  country: '',
  effectiveDate: '',
  collectsPII: true,
  usesCookies: true,
  gdpr: true,
  ccpa: true,
  children: false,
  serviceIds: [],
};

function fmtDate(iso: string): string {
  if (!iso) return '[Effective Date]';

  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return '[Effective Date]';
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

export function generatePolicy(data: PolicyData): string {
  const name = data.entityName.trim() || '[Your Company / Name]';
  const site = data.siteName.trim() || '[Website Name]';
  const url = data.siteUrl.trim() || '[https://example.com]';
  const email = data.contactEmail.trim() || '[contact@example.com]';
  const we = data.entityType === 'person' ? 'I' : 'we';
  const us = data.entityType === 'person' ? 'me' : 'us';
  const our = data.entityType === 'person' ? 'my' : 'our';
  const Cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  const chosen = SERVICES.filter((s) => data.serviceIds.includes(s.id));

  const P: string[] = [];
  P.push(`# Privacy Policy for ${site}`);
  P.push(`_Effective date: ${fmtDate(data.effectiveDate)}_`);
  P.push(
    `This Privacy Policy describes how ${name} ("${we === 'I' ? 'I' : 'we'}", "${us}", or "${our}") ` +
    `collects, uses, and discloses your information when you use ${site} (the "Service") ` +
    `at ${url}. By using the Service, you agree to the collection and use of information in ` +
    `accordance with this policy.`
  );

  P.push(`## Information We Collect`);
  if (data.collectsPII) {
    P.push(
      `While using the Service, ${we} may ask you to provide personally identifiable information ` +
      `that can be used to contact or identify you ("Personal Data"). This may include, but is not ` +
      `limited to, your name, email address, and any information you voluntarily submit.`
    );
  }
  P.push(
    `${Cap(we)} also collect information that your browser sends whenever you visit the Service ` +
    `("Log Data"), such as your IP address, browser type and version, the pages you visit, the time ` +
    `and date of your visit, and other diagnostic data.`
  );

  if (data.usesCookies) {
    P.push(`## Cookies`);
    P.push(
      `${Cap(we)} use cookies and similar tracking technologies to track activity on the Service and ` +
      `hold certain information. Cookies are small files placed on your device. You can instruct your ` +
      `browser to refuse all cookies or to indicate when a cookie is being sent. If you do not accept ` +
      `cookies, some portions of the Service may not function properly.`
    );
  }

  P.push(`## How We Use Your Information`);
  P.push(
    `${Cap(we)} use the collected information to provide and maintain the Service, to notify you ` +
    `about changes, to allow you to participate in interactive features, to provide support, to ` +
    `monitor usage, and to detect and address technical issues.`
  );

  if (chosen.length) {
    P.push(`## Third-Party Services`);
    P.push(
      `${Cap(we)} may employ third-party companies and services to facilitate the Service, provide ` +
      `it on ${our} behalf, or analyse how it is used. These third parties have access to your ` +
      `information only to perform these tasks on ${our} behalf and are obligated not to disclose ` +
      `or use it for any other purpose. The Service uses the following:`
    );
    chosen.forEach((s) => {
      P.push(`- **${s.name}** — ${s.blurb}. Privacy policy: ${s.url}`);
    });
  }

  if (data.gdpr) {
    P.push(`## Your Rights Under the GDPR`);
    P.push(
      `If you are a resident of the European Economic Area (EEA), you have certain data protection ` +
      `rights. ${Cap(we)} aim to take reasonable steps to allow you to correct, amend, delete, or ` +
      `limit the use of your Personal Data. You have the right to access, update, or delete your ` +
      `information; the right to rectification; the right to object; the right to restriction; the ` +
      `right to data portability; and the right to withdraw consent. To exercise these rights, ` +
      `contact ${us} at ${email}.`
    );
  }

  if (data.ccpa) {
    P.push(`## Your Rights Under the CCPA (California Residents)`);
    P.push(
      `If you are a California resident, you have the right to request disclosure of the categories ` +
      `and specific pieces of personal information ${we} have collected, the right to request ` +
      `deletion of your personal information, and the right to opt out of the sale of your personal ` +
      `information. ${Cap(we)} do not sell your personal information. To exercise these rights, ` +
      `contact ${us} at ${email}.`
    );
  }

  if (data.children) {
    P.push(`## Children's Privacy`);
    P.push(
      `The Service does not address anyone under the age of 13 ("Children"). ${Cap(we)} do not ` +
      `knowingly collect personally identifiable information from children under 13. If you are a ` +
      `parent or guardian and you are aware that your child has provided ${us} with Personal Data, ` +
      `please contact ${us} so that ${we} can take the necessary action.`
    );
  }

  P.push(`## Data Security`);
  P.push(
    `The security of your data is important to ${us}, but no method of transmission over the ` +
    `Internet or method of electronic storage is 100% secure. While ${we} strive to use ` +
    `commercially acceptable means to protect your Personal Data, ${we} cannot guarantee its ` +
    `absolute security.`
  );

  P.push(`## Changes to This Privacy Policy`);
  P.push(
    `${Cap(we)} may update this Privacy Policy from time to time. ${Cap(we)} will notify you of any ` +
    `changes by posting the new policy on this page and updating the effective date above. You are ` +
    `advised to review this Privacy Policy periodically for any changes.`
  );

  P.push(`## Contact ${data.entityType === 'person' ? 'Me' : 'Us'}`);
  const loc = data.country.trim() ? ` ${we} are based in ${data.country.trim()}.` : '';
  P.push(`If you have any questions about this Privacy Policy, contact ${us} at ${email}.${loc}`);

  return P.join('\n\n');
}
