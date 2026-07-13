

export type FieldType =
  | 'text'
  | 'url'
  | 'textarea'
  | 'date'
  | 'datetime-local'
  | 'time'
  | 'number'
  | 'select';

export interface FieldDef {
  id: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: string[];

  half?: boolean;

  recommended?: boolean;
}

export interface GroupDef {
  id: string;
  label: string;
  addLabel: string;
  fields: FieldDef[];

  initial?: number;
}

export interface SchemaType {
  id: string;
  name: string;
  fields: FieldDef[];
  groups?: GroupDef[];
  build: (v: Vals) => Record<string, any>;
}

export type Vals = Record<string, any>;

export function clean(input: any): any {
  if (Array.isArray(input)) {
    return input.map(clean).filter((x) => !isEmpty(x));
  }
  if (input && typeof input === 'object') {
    const out: Record<string, any> = {};
    for (const k of Object.keys(input)) {
      const c = clean(input[k]);
      if (!isEmpty(c)) out[k] = c;
    }
    return out;
  }
  return input;
}

function isEmpty(x: any): boolean {
  if (x == null || x === '') return true;
  if (Array.isArray(x)) return x.length === 0;
  if (typeof x === 'object') {

    const keys = Object.keys(x).filter((k) => k !== '@type');
    return keys.length === 0;
  }
  return false;
}

const g = (v: Vals, id: string): any[] => (Array.isArray(v[id]) ? v[id] : []);
const has = (v: Vals, id: string) => v[id] != null && v[id] !== '';

const AVAILABILITY = [
  'https://schema.org/InStock',
  'https://schema.org/OutOfStock',
  'https://schema.org/PreOrder',
  'https://schema.org/Discontinued',
  'https://schema.org/BackOrder',
];
const CONDITION = [
  'https://schema.org/NewCondition',
  'https://schema.org/UsedCondition',
  'https://schema.org/RefurbishedCondition',
  'https://schema.org/DamagedCondition',
];

function postalAddress(v: Vals, p = ''): Record<string, any> {
  return {
    '@type': 'PostalAddress',
    streetAddress: v[p + 'street'],
    addressLocality: v[p + 'city'],
    addressRegion: v[p + 'region'],
    postalCode: v[p + 'zip'],
    addressCountry: v[p + 'country'],
  };
}

export const SCHEMA_TYPES: SchemaType[] = [
  {
    id: 'Article',
    name: 'Article',
    fields: [
      {
        id: 'articleType',
        label: 'Article type',
        type: 'select',
        options: ['Article', 'NewsArticle', 'BlogPosting'],
        half: true,
      },
      { id: 'url', label: 'URL', type: 'url', placeholder: 'https://example.com/post', half: true },
      { id: 'headline', label: 'Headline', type: 'text', recommended: true },
      {
        id: 'authorType',
        label: 'Author type',
        type: 'select',
        options: ['Person', 'Organization'],
        half: true,
      },
      { id: 'author', label: 'Author name', type: 'text', half: true, recommended: true },
      { id: 'description', label: 'Description', type: 'textarea' },
      { id: 'datePublished', label: 'Date published', type: 'date', half: true, recommended: true },
      { id: 'dateModified', label: 'Date modified', type: 'date', half: true },
      { id: 'image', label: 'Image URL', type: 'url', recommended: true },
      { id: 'publisher', label: 'Publisher name', type: 'text', half: true },
      { id: 'publisherLogo', label: 'Publisher logo URL', type: 'url', half: true },
    ],
    build: (v) => ({
      '@context': 'https://schema.org',
      '@type': v.articleType || 'Article',
      mainEntityOfPage: has(v, 'url') ? { '@type': 'WebPage', '@id': v.url } : undefined,
      headline: v.headline,
      description: v.description,
      image: v.image,
      datePublished: v.datePublished,
      dateModified: v.dateModified || v.datePublished,
      author: has(v, 'author')
        ? { '@type': v.authorType || 'Person', name: v.author }
        : undefined,
      publisher: has(v, 'publisher')
        ? {
            '@type': 'Organization',
            name: v.publisher,
            logo: has(v, 'publisherLogo')
              ? { '@type': 'ImageObject', url: v.publisherLogo }
              : undefined,
          }
        : undefined,
    }),
  },

  {
    id: 'Breadcrumb',
    name: 'Breadcrumb',
    fields: [],
    groups: [
      {
        id: 'items',
        label: 'Breadcrumb items',
        addLabel: 'Add page',
        initial: 3,
        fields: [
          { id: 'name', label: 'Page name', type: 'text', half: true },
          { id: 'url', label: 'Page URL', type: 'url', half: true },
        ],
      },
    ],
    build: (v) => ({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: g(v, 'items')
        .filter((it) => it.name)
        .map((it, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: it.name,
          item: it.url || undefined,
        })),
    }),
  },

  {
    id: 'Event',
    name: 'Event',
    fields: [
      { id: 'name', label: 'Event name', type: 'text', recommended: true },
      { id: 'image', label: 'Image URL', type: 'url' },
      { id: 'description', label: 'Description', type: 'textarea' },
      { id: 'startDate', label: 'Start date & time', type: 'datetime-local', half: true, recommended: true },
      { id: 'endDate', label: 'End date & time', type: 'datetime-local', half: true },
      {
        id: 'eventStatus',
        label: 'Status',
        type: 'select',
        half: true,
        options: [
          'https://schema.org/EventScheduled',
          'https://schema.org/EventCancelled',
          'https://schema.org/EventPostponed',
          'https://schema.org/EventRescheduled',
        ],
      },
      {
        id: 'attendanceMode',
        label: 'Attendance mode',
        type: 'select',
        half: true,
        options: [
          'https://schema.org/OfflineEventAttendanceMode',
          'https://schema.org/OnlineEventAttendanceMode',
          'https://schema.org/MixedEventAttendanceMode',
        ],
      },
      { id: 'streamUrl', label: 'Stream / online URL', type: 'url' },
      { id: 'venueName', label: 'Venue name', type: 'text', half: true },
      { id: 'street', label: 'Street', type: 'text', half: true },
      { id: 'city', label: 'City', type: 'text', half: true },
      { id: 'region', label: 'Region / state', type: 'text', half: true },
      { id: 'zip', label: 'Postal code', type: 'text', half: true },
      { id: 'country', label: 'Country', type: 'text', half: true },
      { id: 'orgType', label: 'Organizer type', type: 'select', options: ['Organization', 'Person'], half: true },
      { id: 'orgName', label: 'Organizer name', type: 'text', half: true },
      { id: 'orgUrl', label: 'Organizer URL', type: 'url' },
      { id: 'perfType', label: 'Performer type', type: 'select', options: ['PerformingGroup', 'Person'], half: true },
      { id: 'perfName', label: 'Performer name', type: 'text', half: true },
      { id: 'currency', label: 'Currency', type: 'text', placeholder: 'USD', half: true },
    ],
    groups: [
      {
        id: 'offers',
        label: 'Tickets',
        addLabel: 'Add ticket',
        fields: [
          { id: 'name', label: 'Ticket name', type: 'text', half: true },
          { id: 'price', label: 'Price', type: 'number', half: true },
          { id: 'url', label: 'Buy URL', type: 'url', half: true },
          { id: 'availability', label: 'Availability', type: 'select', options: AVAILABILITY, half: true },
        ],
      },
    ],
    build: (v) => {
      const online =
        v.attendanceMode && v.attendanceMode.includes('Online');
      const location: any[] = [];
      if (has(v, 'venueName') || has(v, 'street') || has(v, 'city')) {
        location.push({ '@type': 'Place', name: v.venueName, address: postalAddress(v) });
      }
      if (has(v, 'streamUrl')) {
        location.push({ '@type': 'VirtualLocation', url: v.streamUrl });
      }
      return {
        '@context': 'https://schema.org',
        '@type': 'Event',
        name: v.name,
        description: v.description,
        image: v.image,
        startDate: v.startDate,
        endDate: v.endDate,
        eventStatus: v.eventStatus,
        eventAttendanceMode: v.attendanceMode,
        location: location.length === 1 ? location[0] : location.length ? location : undefined,
        organizer: has(v, 'orgName')
          ? { '@type': v.orgType || 'Organization', name: v.orgName, url: v.orgUrl }
          : undefined,
        performer: has(v, 'perfName')
          ? { '@type': v.perfType || 'PerformingGroup', name: v.perfName }
          : undefined,
        offers: g(v, 'offers')
          .filter((o) => o.price || o.name)
          .map((o) => ({
            '@type': 'Offer',
            name: o.name,
            price: o.price,
            priceCurrency: v.currency || 'USD',
            availability: o.availability,
            url: o.url,
          })),
      };
    },
  },

  {
    id: 'FAQ',
    name: 'FAQ Page',
    fields: [],
    groups: [
      {
        id: 'qa',
        label: 'Questions',
        addLabel: 'Add question',
        initial: 2,
        fields: [
          { id: 'q', label: 'Question', type: 'text' },
          { id: 'a', label: 'Answer', type: 'textarea' },
        ],
      },
    ],
    build: (v) => ({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: g(v, 'qa')
        .filter((it) => it.q && it.a)
        .map((it) => ({
          '@type': 'Question',
          name: it.q,
          acceptedAnswer: { '@type': 'Answer', text: it.a },
        })),
    }),
  },

  {
    id: 'HowTo',
    name: 'How To',
    fields: [
      { id: 'name', label: 'Name', type: 'text', recommended: true },
      { id: 'description', label: 'Description', type: 'textarea' },
      { id: 'totalTime', label: 'Total time (ISO 8601, e.g. PT1H30M)', type: 'text', placeholder: 'PT30M', half: true },
      { id: 'cost', label: 'Estimated cost', type: 'number', half: true },
      { id: 'currency', label: 'Currency', type: 'text', placeholder: 'USD', half: true },
      { id: 'image', label: 'Image URL', type: 'url', half: true },
    ],
    groups: [
      {
        id: 'supply',
        label: 'Supplies',
        addLabel: 'Add supply',
        fields: [{ id: 'name', label: 'Supply', type: 'text' }],
      },
      {
        id: 'tool',
        label: 'Tools',
        addLabel: 'Add tool',
        fields: [{ id: 'name', label: 'Tool', type: 'text' }],
      },
      {
        id: 'steps',
        label: 'Steps',
        addLabel: 'Add step',
        initial: 2,
        fields: [
          { id: 'name', label: 'Step text', type: 'textarea' },
          { id: 'image', label: 'Step image URL', type: 'url', half: true },
          { id: 'url', label: 'Step URL', type: 'url', half: true },
        ],
      },
    ],
    build: (v) => ({
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: v.name,
      description: v.description,
      totalTime: v.totalTime,
      image: v.image,
      estimatedCost: has(v, 'cost')
        ? { '@type': 'MonetaryAmount', currency: v.currency || 'USD', value: v.cost }
        : undefined,
      supply: g(v, 'supply')
        .filter((s) => s.name)
        .map((s) => ({ '@type': 'HowToSupply', name: s.name })),
      tool: g(v, 'tool')
        .filter((t) => t.name)
        .map((t) => ({ '@type': 'HowToTool', name: t.name })),
      step: g(v, 'steps')
        .filter((s) => s.name)
        .map((s) => ({ '@type': 'HowToStep', text: s.name, image: s.image, url: s.url })),
    }),
  },

  {
    id: 'JobPosting',
    name: 'Job Posting',
    fields: [
      { id: 'title', label: 'Job title', type: 'text', recommended: true },
      { id: 'identifier', label: 'Identifier / req ID', type: 'text', half: true },
      { id: 'industry', label: 'Industry', type: 'text', half: true },
      { id: 'description', label: 'Description', type: 'textarea', recommended: true },
      { id: 'company', label: 'Company name', type: 'text', half: true, recommended: true },
      { id: 'companyUrl', label: 'Company URL', type: 'url', half: true },
      {
        id: 'employmentType',
        label: 'Employment type',
        type: 'select',
        half: true,
        options: ['FULL_TIME', 'PART_TIME', 'CONTRACTOR', 'TEMPORARY', 'INTERN', 'VOLUNTEER', 'PER_DIEM', 'OTHER'],
      },
      { id: 'datePosted', label: 'Date posted', type: 'date', half: true, recommended: true },
      { id: 'validThrough', label: 'Expiry date', type: 'date', half: true },
      { id: 'minSalary', label: 'Min salary', type: 'number', half: true },
      { id: 'maxSalary', label: 'Max salary', type: 'number', half: true },
      { id: 'currency', label: 'Currency', type: 'text', placeholder: 'USD', half: true },
      {
        id: 'salaryUnit',
        label: 'Salary period',
        type: 'select',
        half: true,
        options: ['HOUR', 'DAY', 'WEEK', 'MONTH', 'YEAR'],
      },
      { id: 'street', label: 'Street', type: 'text', half: true },
      { id: 'city', label: 'City', type: 'text', half: true },
      { id: 'region', label: 'Region / state', type: 'text', half: true },
      { id: 'zip', label: 'Postal code', type: 'text', half: true },
      { id: 'country', label: 'Country', type: 'text', half: true },
    ],
    build: (v) => ({
      '@context': 'https://schema.org',
      '@type': 'JobPosting',
      title: v.title,
      identifier: has(v, 'identifier')
        ? { '@type': 'PropertyValue', name: v.company, value: v.identifier }
        : undefined,
      description: v.description,
      industry: v.industry,
      employmentType: v.employmentType,
      datePosted: v.datePosted,
      validThrough: v.validThrough,
      hiringOrganization: has(v, 'company')
        ? { '@type': 'Organization', name: v.company, sameAs: v.companyUrl }
        : undefined,
      jobLocation: has(v, 'city') || has(v, 'street')
        ? { '@type': 'Place', address: postalAddress(v) }
        : undefined,
      baseSalary: has(v, 'minSalary') || has(v, 'maxSalary')
        ? {
            '@type': 'MonetaryAmount',
            currency: v.currency || 'USD',
            value: {
              '@type': 'QuantitativeValue',
              minValue: v.minSalary,
              maxValue: v.maxSalary,
              unitText: v.salaryUnit,
            },
          }
        : undefined,
    }),
  },

  {
    id: 'LocalBusiness',
    name: 'Local Business',
    fields: [
      { id: 'type', label: 'Business type', type: 'text', placeholder: 'Restaurant / Store / LocalBusiness', half: true },
      { id: 'name', label: 'Name', type: 'text', half: true, recommended: true },
      { id: 'image', label: 'Image URL', type: 'url', half: true },
      { id: 'id', label: '@id (canonical URL)', type: 'url', half: true },
      { id: 'url', label: 'Website URL', type: 'url', half: true },
      { id: 'telephone', label: 'Phone', type: 'text', half: true },
      { id: 'priceRange', label: 'Price range', type: 'text', placeholder: '$$', half: true },
      { id: 'email', label: 'Email', type: 'text', half: true },
      { id: 'street', label: 'Street', type: 'text', half: true },
      { id: 'city', label: 'City', type: 'text', half: true },
      { id: 'region', label: 'Region / state', type: 'text', half: true },
      { id: 'zip', label: 'Postal code', type: 'text', half: true },
      { id: 'country', label: 'Country', type: 'text', half: true },
      { id: 'lat', label: 'Latitude', type: 'number', half: true },
      { id: 'lng', label: 'Longitude', type: 'number', half: true },
    ],
    groups: [
      {
        id: 'hours',
        label: 'Opening hours',
        addLabel: 'Add hours',
        fields: [
          {
            id: 'days',
            label: 'Day(s), comma-separated',
            type: 'text',
            placeholder: 'Monday, Tuesday',
            half: true,
          },
          { id: 'opens', label: 'Opens', type: 'time', half: true },
          { id: 'closes', label: 'Closes', type: 'time', half: true },
        ],
      },
    ],
    build: (v) => ({
      '@context': 'https://schema.org',
      '@type': v.type || 'LocalBusiness',
      '@id': v.id,
      name: v.name,
      image: v.image,
      url: v.url,
      telephone: v.telephone,
      email: v.email,
      priceRange: v.priceRange,
      address: postalAddress(v),
      geo: has(v, 'lat') && has(v, 'lng')
        ? { '@type': 'GeoCoordinates', latitude: v.lat, longitude: v.lng }
        : undefined,
      openingHoursSpecification: g(v, 'hours')
        .filter((h) => h.days && h.opens)
        .map((h) => ({
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: h.days.split(',').map((d: string) => d.trim()).filter(Boolean),
          opens: h.opens,
          closes: h.closes,
        })),
    }),
  },

  {
    id: 'Organization',
    name: 'Organization',
    fields: [
      { id: 'type', label: 'Organization type', type: 'text', placeholder: 'Organization / Corporation', half: true },
      { id: 'name', label: 'Name', type: 'text', half: true, recommended: true },
      { id: 'alternateName', label: 'Alternative name', type: 'text', half: true },
      { id: 'url', label: 'URL', type: 'url', half: true, recommended: true },
      { id: 'logo', label: 'Logo URL', type: 'url', recommended: true },
      { id: 'telephone', label: 'Contact phone', type: 'text', half: true },
      { id: 'email', label: 'Contact email', type: 'text', half: true },
    ],
    groups: [
      {
        id: 'sameAs',
        label: 'Social profiles',
        addLabel: 'Add profile',
        fields: [{ id: 'url', label: 'Profile URL', type: 'url' }],
      },
    ],
    build: (v) => ({
      '@context': 'https://schema.org',
      '@type': v.type || 'Organization',
      name: v.name,
      alternateName: v.alternateName,
      url: v.url,
      logo: v.logo,
      contactPoint: has(v, 'telephone') || has(v, 'email')
        ? { '@type': 'ContactPoint', telephone: v.telephone, email: v.email, contactType: 'customer service' }
        : undefined,
      sameAs: g(v, 'sameAs').map((s) => s.url).filter(Boolean),
    }),
  },

  {
    id: 'Person',
    name: 'Person',
    fields: [
      { id: 'name', label: 'Name', type: 'text', recommended: true },
      { id: 'url', label: 'URL', type: 'url', half: true },
      { id: 'image', label: 'Picture URL', type: 'url', half: true },
      { id: 'jobTitle', label: 'Job title', type: 'text', half: true },
      { id: 'company', label: 'Company', type: 'text', half: true },
    ],
    groups: [
      {
        id: 'sameAs',
        label: 'Social profiles',
        addLabel: 'Add profile',
        fields: [{ id: 'url', label: 'Profile URL', type: 'url' }],
      },
    ],
    build: (v) => ({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: v.name,
      url: v.url,
      image: v.image,
      jobTitle: v.jobTitle,
      worksFor: has(v, 'company') ? { '@type': 'Organization', name: v.company } : undefined,
      sameAs: g(v, 'sameAs').map((s) => s.url).filter(Boolean),
    }),
  },

  {
    id: 'Product',
    name: 'Product',
    fields: [
      { id: 'name', label: 'Name', type: 'text', recommended: true },
      { id: 'image', label: 'Image URL', type: 'url', recommended: true },
      { id: 'description', label: 'Description', type: 'textarea' },
      { id: 'brand', label: 'Brand', type: 'text', half: true },
      {
        id: 'idType',
        label: 'ID property',
        type: 'select',
        half: true,
        options: ['sku', 'gtin8', 'gtin13', 'gtin14', 'mpn'],
      },
      { id: 'idValue', label: 'ID value', type: 'text', half: true },
      { id: 'ratingValue', label: 'Rating value', type: 'number', half: true },
      { id: 'ratingCount', label: 'Rating count', type: 'number', half: true },
      { id: 'bestRating', label: 'Best rating', type: 'number', half: true, placeholder: '5' },
      { id: 'worstRating', label: 'Worst rating', type: 'number', half: true, placeholder: '1' },
      { id: 'price', label: 'Price', type: 'number', half: true },
      { id: 'currency', label: 'Currency', type: 'text', placeholder: 'USD', half: true },
      { id: 'availability', label: 'Availability', type: 'select', options: AVAILABILITY, half: true },
      { id: 'condition', label: 'Condition', type: 'select', options: CONDITION, half: true },
      { id: 'priceValidUntil', label: 'Price valid until', type: 'date', half: true },
      { id: 'url', label: 'Offer URL', type: 'url', half: true },
    ],
    groups: [
      {
        id: 'reviews',
        label: 'Reviews',
        addLabel: 'Add review',
        fields: [
          { id: 'author', label: 'Author', type: 'text', half: true },
          { id: 'rating', label: 'Rating', type: 'number', half: true },
          { id: 'body', label: 'Review text', type: 'textarea' },
        ],
      },
    ],
    build: (v) => {
      const out: Record<string, any> = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: v.name,
        image: v.image,
        description: v.description,
        brand: has(v, 'brand') ? { '@type': 'Brand', name: v.brand } : undefined,
      };
      if (has(v, 'idType') && has(v, 'idValue')) out[v.idType] = v.idValue;
      if (has(v, 'price')) {
        out.offers = {
          '@type': 'Offer',
          price: v.price,
          priceCurrency: v.currency || 'USD',
          availability: v.availability,
          itemCondition: v.condition,
          priceValidUntil: v.priceValidUntil,
          url: v.url,
        };
      }
      if (has(v, 'ratingValue')) {
        out.aggregateRating = {
          '@type': 'AggregateRating',
          ratingValue: v.ratingValue,
          reviewCount: v.ratingCount,
          bestRating: v.bestRating || '5',
          worstRating: v.worstRating || '1',
        };
      }
      out.review = g(v, 'reviews')
        .filter((r) => r.author || r.body)
        .map((r) => ({
          '@type': 'Review',
          author: { '@type': 'Person', name: r.author },
          reviewBody: r.body,
          reviewRating: has(r, 'rating')
            ? { '@type': 'Rating', ratingValue: r.rating, bestRating: '5', worstRating: '1' }
            : undefined,
        }));
      return out;
    },
  },

  {
    id: 'Recipe',
    name: 'Recipe',
    fields: [
      { id: 'name', label: 'Name', type: 'text', recommended: true },
      { id: 'image', label: 'Image URL', type: 'url', recommended: true },
      { id: 'description', label: 'Description', type: 'textarea' },
      { id: 'keywords', label: 'Keywords', type: 'text', half: true },
      { id: 'author', label: 'Author', type: 'text', half: true },
      { id: 'datePublished', label: 'Date published', type: 'date', half: true },
      { id: 'prepTime', label: 'Prep time (e.g. PT20M)', type: 'text', placeholder: 'PT20M', half: true },
      { id: 'cookTime', label: 'Cook time (e.g. PT1H)', type: 'text', placeholder: 'PT1H', half: true },
      { id: 'recipeYield', label: 'Servings', type: 'text', half: true },
      { id: 'category', label: 'Category', type: 'text', placeholder: 'Dessert', half: true },
      { id: 'cuisine', label: 'Cuisine', type: 'text', placeholder: 'Italian', half: true },
      { id: 'videoUrl', label: 'Video content URL', type: 'url', half: true },
      { id: 'calories', label: 'Calories', type: 'text', half: true },
      { id: 'servingSize', label: 'Serving size', type: 'text', half: true },
      { id: 'ratingValue', label: 'Rating value', type: 'number', half: true },
      { id: 'ratingCount', label: 'Rating count', type: 'number', half: true },
    ],
    groups: [
      {
        id: 'ingredients',
        label: 'Ingredients',
        addLabel: 'Add ingredient',
        fields: [{ id: 'text', label: 'Ingredient', type: 'text' }],
      },
      {
        id: 'steps',
        label: 'Instructions',
        addLabel: 'Add step',
        fields: [{ id: 'text', label: 'Step', type: 'textarea' }],
      },
    ],
    build: (v) => ({
      '@context': 'https://schema.org',
      '@type': 'Recipe',
      name: v.name,
      image: v.image,
      description: v.description,
      keywords: v.keywords,
      author: has(v, 'author') ? { '@type': 'Person', name: v.author } : undefined,
      datePublished: v.datePublished,
      prepTime: v.prepTime,
      cookTime: v.cookTime,
      recipeYield: v.recipeYield,
      recipeCategory: v.category,
      recipeCuisine: v.cuisine,
      recipeIngredient: g(v, 'ingredients').map((i) => i.text).filter(Boolean),
      recipeInstructions: g(v, 'steps')
        .filter((s) => s.text)
        .map((s) => ({ '@type': 'HowToStep', text: s.text })),
      video: has(v, 'videoUrl')
        ? { '@type': 'VideoObject', contentUrl: v.videoUrl, name: v.name }
        : undefined,
      nutrition: has(v, 'calories') || has(v, 'servingSize')
        ? { '@type': 'NutritionInformation', calories: v.calories, servingSize: v.servingSize }
        : undefined,
      aggregateRating: has(v, 'ratingValue')
        ? { '@type': 'AggregateRating', ratingValue: v.ratingValue, ratingCount: v.ratingCount }
        : undefined,
    }),
  },

  {
    id: 'Video',
    name: 'Video',
    fields: [
      { id: 'name', label: 'Name', type: 'text', recommended: true },
      { id: 'description', label: 'Description', type: 'textarea', recommended: true },
      { id: 'thumbnailUrl', label: 'Thumbnail URL', type: 'url', recommended: true },
      { id: 'uploadDate', label: 'Upload date', type: 'date', half: true, recommended: true },
      { id: 'duration', label: 'Duration (e.g. PT2M30S)', type: 'text', placeholder: 'PT2M30S', half: true },
      { id: 'contentUrl', label: 'Content URL', type: 'url', half: true },
      { id: 'embedUrl', label: 'Embed URL', type: 'url', half: true },
      { id: 'publisher', label: 'Publisher name', type: 'text', half: true },
      { id: 'publisherLogo', label: 'Publisher logo URL', type: 'url', half: true },
      { id: 'logoWidth', label: 'Logo width', type: 'number', half: true },
      { id: 'logoHeight', label: 'Logo height', type: 'number', half: true },
    ],
    build: (v) => ({
      '@context': 'https://schema.org',
      '@type': 'VideoObject',
      name: v.name,
      description: v.description,
      thumbnailUrl: v.thumbnailUrl,
      uploadDate: v.uploadDate,
      duration: v.duration,
      contentUrl: v.contentUrl,
      embedUrl: v.embedUrl,
      publisher: has(v, 'publisher')
        ? {
            '@type': 'Organization',
            name: v.publisher,
            logo: has(v, 'publisherLogo')
              ? {
                  '@type': 'ImageObject',
                  url: v.publisherLogo,
                  width: v.logoWidth,
                  height: v.logoHeight,
                }
              : undefined,
          }
        : undefined,
    }),
  },

  {
    id: 'Website',
    name: 'Website',
    fields: [
      { id: 'name', label: 'Site name', type: 'text', recommended: true },
      { id: 'url', label: 'Site URL', type: 'url', recommended: true },
      {
        id: 'searchUrl',
        label: 'Search URL template',
        type: 'url',
        placeholder: 'https://example.com/search?q={search_term_string}',
      },
    ],
    build: (v) => ({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: v.name,
      url: v.url,
      potentialAction: has(v, 'searchUrl')
        ? {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: v.searchUrl,
            },
            'query-input': 'required name=search_term_string',
          }
        : undefined,
    }),
  },
];

export function getSchemaType(id: string): SchemaType | undefined {
  return SCHEMA_TYPES.find((t) => t.id === id);
}

export function buildJsonLd(typeId: string, vals: Vals): Record<string, any> {
  const t = getSchemaType(typeId);
  if (!t) return {};
  return clean(t.build(vals));
}

export function missingRecommended(typeId: string, vals: Vals): string[] {
  const t = getSchemaType(typeId);
  if (!t) return [];
  return t.fields
    .filter((f) => f.recommended && !has(vals, f.id))
    .map((f) => f.label);
}
