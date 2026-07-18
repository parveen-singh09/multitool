// Cloud-drive file pickers for the converter. Each returns the chosen file's
// bytes as a File, handed back via onFile(). Keys are PUBLIC client-side IDs
// (safe to expose) read from PUBLIC_* env vars — set them in .env before build.
// Cannot be tested locally: each SDK only runs on its registered/verified domain.

export const DRIVE_CFG = {
  gdriveApiKey: import.meta.env.PUBLIC_GDRIVE_API_KEY as string | undefined,
  gdriveClientId: import.meta.env.PUBLIC_GDRIVE_CLIENT_ID as string | undefined,
  gdriveAppId: import.meta.env.PUBLIC_GDRIVE_APP_ID as string | undefined,
  dropboxAppKey: import.meta.env.PUBLIC_DROPBOX_APP_KEY as string | undefined,
  onedriveClientId: import.meta.env.PUBLIC_ONEDRIVE_CLIENT_ID as string | undefined,
};

// Is a source configured (its key present)?
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

// ---- Dropbox Chooser (direct link → fetch bytes) ----
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

// ---- Google Drive Picker (GIS token → Picker → Drive API download) ----
async function pickGoogle(onFile: (f: File) => void): Promise<void> {
  await loadScript('https://apis.google.com/js/api.js');
  await loadScript('https://accounts.google.com/gsi/client');
  await new Promise<void>((res) => (window as any).gapi.load('picker', res));

  const token = await new Promise<string>((resolve, reject) => {
    const tc = (window as any).google.accounts.oauth2.initTokenClient({
      client_id: DRIVE_CFG.gdriveClientId,
      scope: 'https://www.googleapis.com/auth/drive.readonly',
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
            onFile(await toFile(
              `https://www.googleapis.com/drive/v3/files/${doc.id}?alt=media`,
              doc.name,
              { Authorization: 'Bearer ' + token },
            ));
            resolve();
          } catch (e) { reject(e); }
        } else if (data.action === g.picker.Action.CANCEL) resolve();
      })
      .build();
    picker.setVisible(true);
  });
}

// ---- OneDrive File Picker (download action → downloadUrl → fetch bytes) ----
async function pickOneDrive(onFile: (f: File) => void): Promise<void> {
  await loadScript('https://js.live.net/v7.2/OneDrive.js');
  return new Promise((resolve, reject) => {
    (window as any).OneDrive.open({
      clientId: DRIVE_CFG.onedriveClientId,
      action: 'download',
      multiSelect: false,
      advanced: { redirectUri: window.location.origin },
      success: async (files: any) => {
        try {
          const f = files.value[0];
          onFile(await toFile(f['@microsoft.graph.downloadUrl'], f.name));
          resolve();
        } catch (e) { reject(e); }
      },
      cancel: () => resolve(),
      error: () => reject(new Error('OneDrive picker error')),
    });
  });
}

export function pickFromDrive(src: string, onFile: (f: File) => void): Promise<void> {
  if (src === 'gdrive') return pickGoogle(onFile);
  if (src === 'dropbox') return pickDropbox(onFile);
  if (src === 'onedrive') return pickOneDrive(onFile);
  return Promise.reject(new Error('Unknown source'));
}
