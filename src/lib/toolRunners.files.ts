
import type { Runner, RunCtx } from './toolRunners';
import { textFile } from './toolRunners';
import { generatePolicy, SERVICES, type PolicyData } from './privacypolicy';
import { firstName, lastName, email as fakeEmail, phoneUS, companyName, address, birthDate } from './fakegen';

const today = () => new Date().toISOString().slice(0, 10);

async function askJson<T extends object>(extract: RunCtx['extract'], instruction: string, fallback: T): Promise<T> {
  try {
    const raw = await extract(instruction + ' Return ONLY a JSON object, no prose, no code fences.');
    const json = raw.replace(/^[^{]*/, '').replace(/[^}]*$/, '');
    return { ...fallback, ...JSON.parse(json) };
  } catch {
    return fallback;
  }
}

export const RUNNERS_FILES: Record<string, Runner> = {
  'terms-conditions-generator': {
    needs: 'text',
    async run({ extract }) {
      const d = await askJson(extract,
        'Extract terms & conditions details from the user\'s request. JSON: {name (company/site), url (website URL), law (governing country/state), email (contact email), date (e.g. "July 12, 2026"), platform ("website" | "app" | "both")}. Empty strings for anything missing.',
        { name: '', url: '', law: '', email: '', date: '', platform: 'website' },
      );
      const name = d.name.trim() || 'the Company';
      const url = d.url.trim() || 'our website';
      const law = d.law.trim() || 'your jurisdiction';
      const eml = d.email.trim() || 'us';
      const date = d.date.trim() || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      const svc = d.platform === 'app' ? 'application' : d.platform === 'both' ? 'website and application' : 'website';

      const s: { title: string; body: string }[] = [];
      s.push({ title: 'Agreement to Terms', body: `By accessing ${url} (the "Service"), a ${svc} operated by ${name}, you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not access the Service.` });
      s.push({ title: 'Use of the Service', body: `You agree to use the Service only for lawful purposes and in a way that does not infringe the rights of others or restrict or inhibit their use and enjoyment of the Service.` });
      s.push({ title: 'User Accounts', body: `When you create an account, you must provide accurate and complete information. You are responsible for safeguarding your password and for all activity that occurs under your account. You must notify us immediately of any unauthorized use.` });
      s.push({ title: 'Prohibited Uses', body: `You may not use the Service to: violate any law or regulation; infringe the intellectual property or privacy rights of others; transmit malware or harmful code; attempt to gain unauthorized access to the Service or its systems; harass, abuse or harm another person; or scrape, data-mine or reverse-engineer any part of the Service.` });
      s.push({ title: 'Cookies', body: `The Service uses cookies to remember your preferences and understand how it is used. By using the Service you consent to the use of cookies in accordance with our policy. You can instruct your browser to refuse cookies, though some features of the Service may not function properly.` });
      s.push({ title: 'Intellectual Property', body: `The Service and its original content, features and functionality are and will remain the exclusive property of ${name} and its licensors, and are protected by copyright, trademark and other laws. Our trademarks may not be used without our prior written consent.` });
      s.push({ title: 'Hyperlinking and External Links', body: `Government agencies, search engines and news organizations may link to the Service without prior written approval, provided the link is not deceptive and does not falsely imply sponsorship or endorsement. The Service may also contain links to third-party websites that are not owned or controlled by ${name}. We have no control over, and assume no responsibility for, the content or practices of any third-party sites.` });
      s.push({ title: 'Content Liability', body: `We are not responsible for any content that appears on third-party sites that link to the Service. You agree to protect and defend us against all claims arising out of or based upon content on any such site.` });
      s.push({ title: 'Disclaimer of Warranties', body: `The Service is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, whether express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose and non-infringement. We do not warrant that the Service will be uninterrupted, secure or error-free.` });
      s.push({ title: 'Limitation of Liability', body: `To the fullest extent permitted by law, in no event shall ${name} be liable for any indirect, incidental, special, consequential or punitive damages, or any loss of profits or revenues, arising from your use of the Service.` });
      s.push({ title: 'Termination', body: `We may terminate or suspend your access to the Service immediately, without prior notice or liability, for any reason, including if you breach these Terms. Upon termination, your right to use the Service will cease immediately.` });
      s.push({ title: 'Reservation of Rights', body: `We reserve the right to request that you remove any link to the Service and to amend these Terms and our linking policy at any time. By continuing to use the Service you agree to be bound by these terms.` });
      s.push({ title: 'Governing Law', body: `These Terms shall be governed by and construed in accordance with the laws of ${law}, without regard to its conflict of law provisions. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts located there.` });
      s.push({ title: 'Changes to These Terms', body: `We reserve the right to modify or replace these Terms at any time at our sole discretion. If a revision is material, we will provide reasonable notice. Continued use of the Service after changes become effective constitutes acceptance of the revised Terms.` });
      s.push({ title: 'Contact Us', body: `If you have any questions about these Terms, please contact us at ${eml}.` });

      const parts = [`TERMS AND CONDITIONS\n\nLast updated: ${date}\n`];
      s.forEach((sec, i) => parts.push(`${i + 1}. ${sec.title}\n${sec.body}`));
      return { files: [textFile('terms-and-conditions.txt', parts.join('\n\n'))], note: `Terms & conditions for ${name} · ${s.length} sections` };
    },
  },

  'privacy-policy-generator': {
    needs: 'text',
    async run({ extract }) {
      const d = await askJson(extract,
        'Extract privacy-policy details from the user\'s request. JSON: {entityName (company/person), siteName, siteUrl, contactEmail, country, effectiveDate (YYYY-MM-DD), entityType ("company" | "person"), collectsPII (bool), usesCookies (bool), gdpr (bool), ccpa (bool), children (bool), services (array of third-party service names they mention, e.g. ["Google Analytics","Stripe"])}. Use empty strings / true / false / [] sensibly for anything missing.',
        { entityName: '', siteName: '', siteUrl: '', contactEmail: '', country: '', effectiveDate: '', entityType: 'company', collectsPII: true, usesCookies: true, gdpr: true, ccpa: true, children: false, services: [] as string[] },
      );
      const names = (Array.isArray(d.services) ? d.services : []).map((n) => String(n).toLowerCase());
      const serviceIds = SERVICES.filter((sv) => names.some((n) => n.includes(sv.name.toLowerCase()) || sv.name.toLowerCase().includes(n))).map((sv) => sv.id);
      const data: PolicyData = {
        entityName: d.entityName, siteName: d.siteName, siteUrl: d.siteUrl, contactEmail: d.contactEmail,
        entityType: d.entityType === 'person' ? 'person' : 'company', country: d.country, effectiveDate: d.effectiveDate,
        collectsPII: !!d.collectsPII, usesCookies: !!d.usesCookies, gdpr: !!d.gdpr, ccpa: !!d.ccpa, children: !!d.children,
        serviceIds,
      };
      const md = generatePolicy(data);
      return { files: [textFile('privacy-policy.txt', md)], note: `Privacy policy for ${d.siteName.trim() || d.entityName.trim() || 'your site'}` };
    },
  },

  'csv-test-data-generator': {
    needs: 'text',
    async run({ extract }) {
      const KNOWN = ['id', 'first_name', 'last_name', 'email', 'phone', 'city', 'state', 'zip', 'company', 'birthday'];
      const d = await askJson(extract,
        `Extract CSV test-data options from the user's request. JSON: {rows (integer count), columns (subset of ${KNOWN.join(', ')}), delimiter ("," | ";" | "\\t"), header (bool)}. Default to 25 rows, columns ["id","first_name","last_name","email"], comma, header true if the user didn't say.`,
        { rows: 25, columns: ['id', 'first_name', 'last_name', 'email'], delimiter: ',', header: true },
      );
      const n = Math.max(1, Math.min(5000, Number(d.rows) || 25));
      const cs = (Array.isArray(d.columns) ? d.columns : []).map((c) => String(c)).filter((c) => KNOWN.includes(c));
      const cols = cs.length ? cs : ['id', 'first_name', 'last_name', 'email'];
      const delim = d.delimiter === ';' ? ';' : d.delimiter === '\\t' || d.delimiter === '\t' ? '\t' : ',';

      const esc = (v: string) => (v.includes(delim) || v.includes('"') || v.includes('\n')) ? '"' + v.replace(/"/g, '""') + '"' : v;
      const row = (id: number): string[] => {
        const first = firstName(), last = lastName(), a = address();
        const map: Record<string, string> = {
          id: String(id), first_name: first, last_name: last, email: fakeEmail(first, last),
          phone: phoneUS(), city: a.city, state: a.stateAbbr, zip: a.zip,
          company: companyName(), birthday: birthDate(),
        };
        return cols.map((c) => map[c] ?? '');
      };
      const lines: string[] = [];
      if (d.header) lines.push(cols.join(delim));
      for (let i = 0; i < n; i++) lines.push(row(i + 1).map(esc).join(delim));
      return { files: [textFile('test-data.csv', lines.join('\n'), 'text/csv')], note: `${n} rows · ${cols.join(', ')}` };
    },
  },

  'email-signature-creator': {
    needs: 'text',
    async run({ extract }) {
      const d = await askJson(extract,
        'Extract email-signature details from the user\'s request. JSON: {name, title (job title), company, department, phone, email, website, address, accent (hex like #5e6ad2), links:[{label, url}]}. Empty strings / [] for anything missing.',
        { name: '', title: '', company: '', department: '', phone: '', email: '', website: '', address: '', accent: '#5e6ad2', links: [] as { label: string; url: string }[] },
      );
      const accent = /^#[0-9a-f]{6}$/i.test(d.accent) ? d.accent : '#5e6ad2';
      const font = 'Arial, Helvetica, sans-serif';
      const MUTED = '#666666', SUB = '#888888';
      const SEP = '<span style="color:#cccccc;"> &nbsp;·&nbsp; </span>';
      const esc = (s: string) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
      const href = (url: string, mail = false) => mail ? (url.startsWith('mailto:') ? url : `mailto:${url}`) : (/^https?:\/\//.test(url) ? url : `https://${url}`);

      const titleLine = [d.title, d.company].filter(Boolean).join(', ') && (d.department && d.company
        ? `${d.title ? d.title + ', ' : ''}${d.department} · ${d.company}`
        : [d.title, d.company].filter(Boolean).join(', '));
      const nameEl = d.name ? `<div style="font-size:17px;font-weight:700;color:#111111;">${esc(d.name)}</div>` : '';
      const titleEl = titleLine ? `<div style="font-size:13px;color:${MUTED};margin-top:2px;">${esc(titleLine)}</div>` : '';
      const contactRows = (() => {
        const rows: string[] = [];
        if (d.phone) rows.push(`<span style="color:${MUTED};">${esc(d.phone)}</span>`);
        if (d.email) rows.push(`<a href="${esc(href(d.email, true))}" style="color:${esc(accent)};text-decoration:none;">${esc(d.email)}</a>`);
        if (d.website) rows.push(`<a href="${esc(href(d.website))}" style="color:${esc(accent)};text-decoration:none;">${esc(d.website)}</a>`);
        if (d.address) rows.push(`<span style="color:${SUB};">${esc(d.address)}</span>`);
        return rows.length ? `<div style="margin-top:8px;font-size:13px;">${rows.join(SEP)}</div>` : '';
      })();
      const links = Array.isArray(d.links) && d.links.length
        ? `<div style="margin-top:6px;font-size:13px;">${d.links.filter((l) => l && (l.label || l.url)).map((l) => `<a href="${esc(href(l.url || l.label))}" style="color:${esc(accent)};text-decoration:none;font-weight:600;">${esc(l.label || l.url)}</a>`).join(SEP)}</div>`
        : '';

      const html = `<table cellpadding="0" cellspacing="0" border="0" style="font-family:${font};font-size:14px;line-height:1.5;color:#222222;border-collapse:collapse;">` +
        `<tr><td style="border-left:3px solid ${esc(accent)};padding-left:14px;">${nameEl}${titleEl}${contactRows}${links}</td></tr></table>`;
      return { text: html, note: `Email signature HTML for ${d.name.trim() || 'you'} · paste into Gmail/Outlook/Apple Mail` };
    },
  },

  'ics-calendar-downloader': {
    needs: 'text',
    async run({ extract }) {
      const d = await askJson(extract,
        'Extract calendar-event details from the user\'s request. JSON: {title, start (local date-time "YYYY-MM-DDTHH:MM"), end (same format), allDay (bool), startDay ("YYYY-MM-DD" if all-day), endDay ("YYYY-MM-DD" if all-day), location, url, description}. Empty strings / false for anything missing.',
        { title: '', start: '', end: '', allDay: false, startDay: '', endDay: '', location: '', url: '', description: '' },
      );
      if (!d.title.trim()) throw new Error('Tell me the event title (and a date/time).');

      const pad = (n: number) => String(n).padStart(2, '0');
      const escapeText = (v: string) => v.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r\n|\n|\r/g, '\\n');
      const utcStamp = (dt: Date) => `${dt.getUTCFullYear()}${pad(dt.getUTCMonth() + 1)}${pad(dt.getUTCDate())}T${pad(dt.getUTCHours())}${pad(dt.getUTCMinutes())}${pad(dt.getUTCSeconds())}Z`;
      const wallStamp = (v: string) => v.replace(/[-:]/g, '') + '00'; 
      const dayStamp = (v: string) => v.replace(/-/g, '');
      const addDay = (v: string) => { const t = new Date(`${v}T00:00:00`); t.setDate(t.getDate() + 1); return `${t.getFullYear()}${pad(t.getMonth() + 1)}${pad(t.getDate())}`; };
      const fold = (line: string) => {
        if (line.length <= 75) return line;
        const parts = [line.slice(0, 75)]; let rest = line.slice(75);
        while (rest.length > 74) { parts.push(` ${rest.slice(0, 74)}`); rest = rest.slice(74); }
        if (rest.length) parts.push(` ${rest}`);
        return parts.join('\r\n');
      };

      const lines = [
        'BEGIN:VEVENT',
        `UID:${Date.now()}-${Math.random().toString(36).slice(2)}@toolsilk`,
        `DTSTAMP:${utcStamp(new Date())}`,
        `SUMMARY:${escapeText(d.title.trim())}`,
      ];
      if (d.allDay) {
        const startDay = d.startDay || today();
        lines.push(`DTSTART;VALUE=DATE:${dayStamp(startDay)}`);
        lines.push(`DTEND;VALUE=DATE:${d.endDay ? addDay(d.endDay) : addDay(startDay)}`); 
      } else {
        if (!d.start) throw new Error('Tell me the event start date and time.');
        const s = new Date(d.start);
        if (isNaN(s.getTime())) throw new Error('The start time is invalid.');
        const endStr = d.end || (() => {
          const t = new Date(s.getTime() + 3600000);
          return `${t.getFullYear()}-${pad(t.getMonth() + 1)}-${pad(t.getDate())}T${pad(t.getHours())}:${pad(t.getMinutes())}`;
        })();
        lines.push(`DTSTART:${wallStamp(d.start)}`);
        lines.push(`DTEND:${wallStamp(endStr)}`);
      }
      if (d.location) lines.push(`LOCATION:${escapeText(d.location)}`);
      if (d.url) lines.push(`URL:${escapeText(d.url)}`);
      if (d.description) lines.push(`DESCRIPTION:${escapeText(d.description)}`);
      lines.push('END:VEVENT');

      const ics = [
        'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//ToolSilk//ICS Calendar Downloader//EN', 'CALSCALE:GREGORIAN',
        ...lines, 'END:VCALENDAR',
      ].map(fold).join('\r\n');
      return { files: [textFile('event.ics', ics, 'text/calendar')], note: `Calendar event · ${d.title.trim()}` };
    },
  },

  // subtitle-maker: omitted. Its real output is timed captions synced to a video
  // playhead (or an imported .srt/.vtt), which needs an interactive timeline and
  // a loaded media file — neither survives a one-shot inline chat call. Use the
  // full tool at /subtitle-maker to sync and export SRT/VTT.
};
