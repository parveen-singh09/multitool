

import { COUNTRIES, INDIA_STATES } from './geo';

export interface PartyOptions {
  prefix: string;
  companyLabel?: string;
  companyPlaceholder: string;
  taxLabel: string;          
  addressLabel: string;      
  addressPlaceholder: string;
  contact?: boolean;         
  contactPlaceholder?: string;
  defaultCompany?: string;
  defaultAddress?: string;
}

const opt = (v: string, selected = false) =>
  `<option value="${v.replace(/"/g, '&quot;')}"${selected ? ' selected' : ''}>${v}</option>`;

/**
 * Render the structured fields into `container`. Field ids are namespaced with
 * the prefix so both parties (and both tools) coexist on one page.
 */
export function renderParty(container: HTMLElement, o: PartyOptions): void {
  const p = o.prefix;
  const contact = o.contact
    ? `<input id="${p}-contact" class="field text-[13px]" placeholder="${o.contactPlaceholder ?? 'Contact Person'}" />`
    : '';
  container.innerHTML = `
    <div class="flex flex-col gap-2">
      <input id="${p}-company" class="field text-[13px]" placeholder="${o.companyPlaceholder}" value="${(o.defaultCompany ?? '').replace(/"/g, '&quot;')}" />
      ${contact}
      <input id="${p}-gstin" class="field text-[13px]" placeholder="${o.taxLabel}" />
      <textarea id="${p}-address" class="field min-h-20 resize-y text-[13px]" placeholder="${o.addressPlaceholder}">${o.defaultAddress ?? ''}</textarea>
      <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <label class="flex flex-col gap-1 text-[13px] text-ink-subtle">Country
          <select id="${p}-country" class="field text-[13px]">${COUNTRIES.map((c) => opt(c, c === 'India')).join('')}</select>
        </label>
        <label id="${p}-state-wrap" class="flex flex-col gap-1 text-[13px] text-ink-subtle">State
          <select id="${p}-state" class="field text-[13px]">${INDIA_STATES.map((s, i) => opt(s, i === 0)).join('')}</select>
        </label>
      </div>
      <input id="${p}-city" class="field text-[13px]" placeholder="City" />
    </div>`;
}

const el = <T extends HTMLElement>(id: string) => document.getElementById(id) as T | null;

/**
 * Attach change listeners. The state dropdown is only meaningful for India, so
 * it's hidden for every other country (matching the Razorpay behaviour). Calls
 * `onChange` on every edit so the live preview/total stays in sync.
 */
export function wireParty(prefix: string, onChange: () => void): void {
  const country = el<HTMLSelectElement>(`${prefix}-country`);
  const stateWrap = el<HTMLElement>(`${prefix}-state-wrap`);
  const syncState = () => {
    if (stateWrap) stateWrap.style.display = country?.value === 'India' ? '' : 'none';
  };
  country?.addEventListener('change', () => { syncState(); onChange(); });
  syncState();

  for (const suffix of ['company', 'contact', 'gstin', 'address', 'state', 'city']) {
    el(`${prefix}-${suffix}`)?.addEventListener('input', onChange);
  }
}

/**
 * Compose the fields into the multi-line block the PDF/preview renders. Empty
 * fields are dropped so a minimal fill (just a company name) stays clean, and
 * the GST id is only emitted when present. State is included only for India.
 */
export function collectParty(prefix: string): string[] {
  const val = (suffix: string) => el<HTMLInputElement>(`${prefix}-${suffix}`)?.value.trim() ?? '';
  const lines: string[] = [];

  if (val('company')) lines.push(val('company'));
  if (val('contact')) lines.push(val('contact'));

  for (const l of val('address').split('\n')) {
    if (l.trim()) lines.push(l.trim());
  }

  const country = val('country');
  const isIndia = country === 'India';
  const cityState = [val('city'), isIndia ? val('state') : ''].filter(Boolean).join(', ');
  if (cityState) lines.push(cityState);
  if (country) lines.push(country);

  // Prefix the GST id so a reader sees "GSTIN: 29ABCDE..." not a bare number.
  if (val('gstin')) lines.push(`GSTIN: ${val('gstin')}`);

  return lines;
}
