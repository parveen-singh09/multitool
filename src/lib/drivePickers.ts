
export const DRIVE_CFG = {
  gdriveApiKey: import.meta.env.PUBLIC_GDRIVE_API_KEY as string | undefined,
  gdriveClientId: import.meta.env.PUBLIC_GDRIVE_CLIENT_ID as string | undefined,
  gdriveAppId: import.meta.env.PUBLIC_GDRIVE_APP_ID as string | undefined,
  dropboxAppKey: import.meta.env.PUBLIC_DROPBOX_APP_KEY as string | undefined,
  onedriveClientId: import.meta.env.PUBLIC_ONEDRIVE_CLIENT_ID as string | undefined,
};

const GOOGLE_EXPORT: Record<string, { mime: string; ext: string }> = {
  'application/vnd.google-apps.spreadsheet': { mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', ext: '.xlsx' },
  'application/vnd.google-apps.document': { mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', ext: '.docx' },
  'application/vnd.google-apps.presentation': { mime: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', ext: '.pptx' },
  'application/vnd.google-apps.drawing': { mime: 'image/png', ext: '.png' },
};

export function driveReady(src: string): boolean {
  const c = DRIVE_CFG;
  if (src === 'gdrive') return !!(c.gdriveApiKey && c.gdriveClientId);
  if (src === 'dropbox') return !!c.dropboxAppKey;
  if (src === 'onedrive') return !!c.onedriveClientId;
  return false;
}

const loaded = new Set<string>();
function loadScript(src: string, attrs?: Record<string, string>): Promise<void> {
  return new Promise((resolve, reject) => {
    if (loaded.has(src)) return resolve();
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    if (attrs) for (const [k, v] of Object.entries(attrs)) s.setAttribute(k, v);
    s.onload = () => { loaded.add(src); resolve(); };
    s.onerror = () => reject(new Error('Failed to load SDK'));
    document.head.appendChild(s);
  });
}

const toFile = async (url: string, name: string, headers?: HeadersInit): Promise<File> => {
  const res = await fetch(url, headers ? { headers } : undefined);
  if (!res.ok) throw new Error('Download failed');
  const blob = await res.blob();
  return new File([blob], name, { type: blob.type || 'application/octet-stream' });
};

async function pickDropbox(onFile: (f: File) => void): Promise<void> {
  await loadScript('https://www.dropbox.com/static/api/2/dropins.js', {
    id: 'dropboxjs',
    'data-app-key': DRIVE_CFG.dropboxAppKey!,
  });
  return new Promise((resolve, reject) => {
    (window as any).Dropbox.choose({
      linkType: 'direct',
      multiselect: false,
      success: async (files: any[]) => {
        try { onFile(await toFile(files[0].link, files[0].name)); resolve(); }
        catch (e) { reject(e); }
      },
      cancel: () => resolve(),
    });
  });
}

// Load Google's SDKs ahead of the click. Mobile blocks the OAuth popup if it opens
// after network-bound awaits (the tap's user-activation is gone by then), so callers
// warm this on menu-open; at click time the awaits below are already resolved and the
// popup fires within the surviving activation window.
let googleWarm: Promise<void> | null = null;
export function warmGoogle(): Promise<void> {
  if (!DRIVE_CFG.gdriveClientId) return Promise.resolve();
  if (!googleWarm) {
    googleWarm = (async () => {
      await loadScript('https://apis.google.com/js/api.js');
      await loadScript('https://accounts.google.com/gsi/client');
      await new Promise<void>((res) => (window as any).gapi.load('picker', res));
    })().catch((e) => { googleWarm = null; throw e; }); // let a failed warm retry next time
  }
  return googleWarm;
}

async function pickGoogle(onFile: (f: File) => void): Promise<void> {
  await warmGoogle();

  const token = await new Promise<string>((resolve, reject) => {
    const tc = (window as any).google.accounts.oauth2.initTokenClient({
      client_id: DRIVE_CFG.gdriveClientId,
      scope: 'https://www.googleapis.com/auth/drive.file',
      callback: (r: any) => (r.access_token ? resolve(r.access_token) : reject(new Error('No access token'))),
    });
    tc.requestAccessToken();
  });

  return new Promise((resolve, reject) => {
    const g = (window as any).google;
    const picker = new g.picker.PickerBuilder()
      .addView(g.picker.ViewId.DOCS)
      .setOAuthToken(token)
      .setDeveloperKey(DRIVE_CFG.gdriveApiKey)
      .setAppId(DRIVE_CFG.gdriveAppId || '')
      .setCallback(async (data: any) => {
        if (data.action === g.picker.Action.PICKED) {
          try {
            const doc = data.docs[0];
            const exp = GOOGLE_EXPORT[doc.mimeType as string];
            const url = exp
              ? `https://www.googleapis.com/drive/v3/files/${doc.id}/export?mimeType=${encodeURIComponent(exp.mime)}`
              : `https://www.googleapis.com/drive/v3/files/${doc.id}?alt=media`;
            const name = exp && !doc.name.endsWith(exp.ext) ? doc.name + exp.ext : doc.name;
            onFile(await toFile(url, name, { Authorization: 'Bearer ' + token }));
            resolve();
          } catch (e) { reject(e); }
        } else if (data.action === g.picker.Action.CANCEL) resolve();
      })
      .build();
    picker.setVisible(true);
  });
}

async function pickOneDrive(onFile: (f: File) => void): Promise<void> {
  await loadScript('https://js.live.net/v7.2/OneDrive.js');
  return new Promise((resolve, reject) => {
    (window as any).OneDrive.open({
      clientId: DRIVE_CFG.onedriveClientId,
      action: 'download',
      multiSelect: false,
      advanced: { redirectUri: window.location.origin + '/onedrive-callback.html' },
      success: async (files: any) => {
        try {
          const f = files.value[0];
          onFile(await toFile(f['@microsoft.graph.downloadUrl'], f.name));
          resolve();
        } catch (e) { reject(e); }
      },
      cancel: () => resolve(),
      error: (e: any) => reject(new Error(e?.message || e?.error || JSON.stringify(e) || 'OneDrive picker error')),
    });
  });
}

export async function pickFromDrive(src: string, onFile: (f: File) => void): Promise<void> {
  // ponytail: pickers focus an offscreen node, and global `scroll-behavior: smooth`
  // animates the jump (and the return) over seconds. Force instant during the flow.
  const html = document.documentElement;
  const prev = html.style.scrollBehavior;
  html.style.scrollBehavior = 'auto';
  const restore = () => setTimeout(() => { html.style.scrollBehavior = prev; }, 600); // outlast the focus-return scroll
  try {
    if (src === 'gdrive') return await pickGoogle(onFile);
    if (src === 'dropbox') return await pickDropbox(onFile);
    if (src === 'onedrive') return await pickOneDrive(onFile);
    throw new Error('Unknown source');
  } finally {
    restore();
  }
}
