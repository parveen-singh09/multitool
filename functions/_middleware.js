// 301 the preview host to the canonical domain so Google consolidates ranking
// signals on toolsilk.com instead of indexing a duplicate .pages.dev copy.
// Host-based, so it lives here (not _headers/_redirects, which match path only).
export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);
  if (url.hostname === 'toolsilk.pages.dev') {
    url.hostname = 'toolsilk.com';
    return Response.redirect(url.toString(), 301); // preserves path + query
  }
  return next();
}
