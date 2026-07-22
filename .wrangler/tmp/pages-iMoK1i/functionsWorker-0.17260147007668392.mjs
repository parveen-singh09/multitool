var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// api/cc-job.js
var json = /* @__PURE__ */ __name((obj, status = 200) => new Response(JSON.stringify(obj), { status, headers: { "content-type": "application/json" } }), "json");
var BASE = "https://v2.convertapi.com";
var WORD_IN = /* @__PURE__ */ new Set(["doc", "docx", "odt", "rtf"]);
var WORD_OUT = /* @__PURE__ */ new Set(["doc", "docx", "odt", "rtf"]);
var PRES_IN = /* @__PURE__ */ new Set(["ppt", "pptx", "odp", "pps", "ppsx", "potx"]);
var PRES_OUT = /* @__PURE__ */ new Set(["ppt", "pptx", "odp"]);
var SHEET_IN = /* @__PURE__ */ new Set(["xls", "xlsx", "ods"]);
var SHEET_OUT = /* @__PURE__ */ new Set(["xls", "xlsx", "ods"]);
var officeOk = /* @__PURE__ */ __name((f, t) => f !== t && (WORD_IN.has(f) && WORD_OUT.has(t) || PRES_IN.has(f) && PRES_OUT.has(t) || SHEET_IN.has(f) && SHEET_OUT.has(t)), "officeOk");
var VECTOR_IN = /* @__PURE__ */ new Set(["wmf", "emf", "cdr"]);
var VECTOR_OUT = /* @__PURE__ */ new Set(["svg", "png", "pdf", "jpg"]);
var VIDEO_IN = /* @__PURE__ */ new Set(["ts", "vob", "mpeg", "mpg", "rmvb", "m2ts", "mxf", "wtv", "3gp", "flv", "ogv", "mp4", "webm", "mkv", "mov", "avi"]);
var VIDEO_OUT = /* @__PURE__ */ new Set(["mp4", "mkv", "mov", "avi"]);
var RAW_IN = /* @__PURE__ */ new Set(["nef", "cr2", "cr3", "arw", "dng", "crw", "raf", "rw2", "orf", "pef", "srw"]);
var RAW_OUT = /* @__PURE__ */ new Set(["jpg", "png"]);
var SEVENZIP_IN = /* @__PURE__ */ new Set(["zip", "rar", "tar", "gz", "tgz", "bz2", "xz", "cab", "iso"]);
var EXTRA_LO = /* @__PURE__ */ new Set(["wpd>docx", "ods>csv", "svg>eps", "eps>svg"]);
var useLibreOffice = /* @__PURE__ */ __name((from, to) => officeOk(from, to) || VECTOR_IN.has(from) && VECTOR_OUT.has(to) || VIDEO_IN.has(from) && VIDEO_OUT.has(to) && from !== to || RAW_IN.has(from) && RAW_OUT.has(to) || SEVENZIP_IN.has(from) && to === "7z" || from === "cbr" && to === "cbz" || // comic: unar extract RAR -> zip, on main box (not calibre)
EXTRA_LO.has(`${from}>${to}`), "useLibreOffice");
var EBOOK_IN = /* @__PURE__ */ new Set(["epub", "mobi", "azw", "azw3", "fb2", "lit", "pdb", "prc", "htmlz"]);
var EBOOK_OUT = /* @__PURE__ */ new Set(["epub", "mobi", "azw3", "fb2", "txt"]);
var useCalibre = /* @__PURE__ */ __name((from, to) => EBOOK_IN.has(from) && EBOOK_OUT.has(to) && from !== to, "useCalibre");
var b64urlEncode = /* @__PURE__ */ __name((s) => btoa(unescape(encodeURIComponent(s))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""), "b64urlEncode");
var b64urlDecode = /* @__PURE__ */ __name((s) => decodeURIComponent(escape(atob(s.replace(/-/g, "+").replace(/_/g, "/")))), "b64urlDecode");
function friendlyError(body, pair) {
  let data;
  try {
    data = JSON.parse(body);
  } catch {
    data = null;
  }
  const p = pair ? ` (${pair})` : "";
  if (data) {
    const inv = data.InvalidParameters && Object.values(data.InvalidParameters)[0];
    const detail = (Array.isArray(inv) ? inv[0] : inv) || data.Message || "";
    if (data.Code === 5001) return `Couldn't convert this file${p} \u2014 it may be empty, corrupt, or password/DRM protected. Try another file.`;
    if (data.Code === 5004) return `Nothing to extract${p} \u2014 no matching content in the file.`;
    if (data.Code === 4e3) return `Unsupported or invalid file${p}.`;
    if (data.Code === 5009) return `File expired${p} \u2014 attach it again.`;
    if (detail) return `Failed${p}: ${detail}`;
  }
  const plain = body.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 100);
  return `Failed${p}${plain ? ": " + plain : "."}`;
}
__name(friendlyError, "friendlyError");
function makeJobId() {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  let s = "";
  for (const b of bytes) s += chars[b % 36];
  return s;
}
__name(makeJobId, "makeJobId");
async function convertViaService(base, token, from, to, file, url, pair) {
  base = String(base || "").replace(/\/$/, "");
  token = token || "";
  if (!base || !token) throw new Error(`This conversion (${pair}) isn't available right now.`);
  let blob, name;
  if (file && typeof file !== "string") {
    blob = file;
    name = file.name || `input.${from}`;
  } else {
    const src = await fetch(String(url));
    if (!src.ok) throw new Error(`Couldn't read the input file (${pair}).`);
    blob = await src.blob();
    name = `input.${from}`;
  }
  const upstream = new FormData();
  upstream.append("to", to);
  upstream.append("file", blob, name);
  const res = await fetch(`${base}/convert`, {
    method: "POST",
    headers: { "X-Auth-Token": token },
    body: upstream
  });
  const body = await res.text();
  if (!res.ok) {
    const clientErr = res.status >= 400 && res.status < 500;
    const err = new Error(clientErr ? `Couldn't convert this file (${pair}) \u2014 it may be empty, corrupt, password-protected, or in an unexpected format. Try another file.` : `The conversion service is temporarily unavailable (${pair}). Please try again in a moment.`);
    err.status = clientErr ? 400 : 502;
    throw err;
  }
  const out = JSON.parse(body);
  const dlUrl = `${base}/out/${out.id}/${encodeURIComponent(out.filename)}`;
  return { jobId: "lo_" + b64urlEncode(JSON.stringify({ url: dlUrl, filename: out.filename })) };
}
__name(convertViaService, "convertViaService");
async function onRequestPost({ request, env }) {
  const secret = env.CONVERTAPI_SECRET;
  let form;
  try {
    form = await request.formData();
  } catch {
    return json({ error: "Bad request." }, 400);
  }
  const from = String(form.get("from") || "").toLowerCase();
  const to = String(form.get("to") || "").toLowerCase();
  if (!from || !to) return json({ error: "Missing conversion formats." }, 400);
  const file = form.get("file");
  const url = form.get("url");
  if ((!file || typeof file === "string") && !url) return json({ error: "No input provided." }, 400);
  const pair = `${from.toUpperCase()} \u2192 ${to.toUpperCase()}`;
  if (useLibreOffice(from, to)) {
    try {
      return json(await convertViaService(env.LIBREOFFICE_URL, env.LIBREOFFICE_TOKEN, from, to, file, url, pair));
    } catch (e) {
      return json({ error: e.message || "Conversion failed." }, e.status || 502);
    }
  }
  if (useCalibre(from, to)) {
    try {
      return json(await convertViaService(env.CALIBRE_URL, env.CALIBRE_TOKEN || env.LIBREOFFICE_TOKEN, from, to, file, url, pair));
    } catch (e) {
      return json({ error: e.message || "Conversion failed." }, e.status || 502);
    }
  }
  if (!secret) return json({ error: "Conversion service is not configured." }, 500);
  const jobId = makeJobId();
  try {
    const upstream = new FormData();
    upstream.append("StoreFile", "true");
    const field = to === "gif" ? "Files" : "File";
    if (file && typeof file !== "string") upstream.append(field, file, file.name || `input.${from}`);
    else upstream.append(field, String(url));
    const res = await fetch(`${BASE}/async/convert/${from}/to/${to}?jobid=${jobId}`, {
      method: "POST",
      headers: { authorization: `Bearer ${secret}` },
      body: upstream
    });
    if (!res.ok) {
      const status = res.status >= 400 && res.status < 500 ? 400 : 502;
      return json({ error: friendlyError(await res.text(), pair) }, status);
    }
    return json({ jobId });
  } catch (e) {
    return json({ error: e.message || "Conversion failed." }, 502);
  }
}
__name(onRequestPost, "onRequestPost");
async function onRequestGet({ request, env }) {
  const params = new URL(request.url).searchParams;
  const dl = params.get("download");
  if (dl) {
    let target;
    try {
      target = new URL(dl);
    } catch {
      return json({ error: "Bad download url." }, 400);
    }
    const svcHosts = [];
    for (const v of [env.LIBREOFFICE_URL, env.CALIBRE_URL]) {
      try {
        if (v) svcHosts.push(new URL(v).hostname);
      } catch {
      }
    }
    const ok = /(^|\.)convertapi\.com$/.test(target.hostname) || svcHosts.includes(target.hostname);
    if (!ok) return json({ error: "Forbidden host." }, 403);
    const name = params.get("name") || "download";
    const up = await fetch(target.toString());
    if (!up.ok) return json({ error: "Could not fetch the converted file." }, 502);
    return new Response(up.body, {
      headers: {
        "content-type": up.headers.get("content-type") || "application/octet-stream",
        "content-disposition": `attachment; filename="${name.replace(/["\\]/g, "")}"`,
        "cache-control": "no-store"
      }
    });
  }
  const jobId = params.get("jobId");
  if (!jobId) return json({ error: "Missing jobId." }, 400);
  if (jobId.startsWith("lo_")) {
    try {
      const { url, filename } = JSON.parse(b64urlDecode(jobId.slice(3)));
      return json({ done: true, files: [{ url, filename }] });
    } catch {
      return json({ error: "Invalid job." }, 400);
    }
  }
  const secret = env.CONVERTAPI_SECRET;
  if (!secret) return json({ error: "Conversion service is not configured." }, 500);
  try {
    const res = await fetch(`${BASE}/async/job/${encodeURIComponent(jobId)}`, {
      headers: { authorization: `Bearer ${secret}` }
    });
    if (res.status === 202) return json({ done: false });
    if (!res.ok) {
      throw new Error(friendlyError(await res.text()));
    }
    const data = await res.json();
    const files = (data?.Files || []).filter((f) => f?.Url).map((f) => ({ url: f.Url, filename: f.FileName }));
    if (files.length) return json({ done: true, files });
    return json({ done: false });
  } catch (e) {
    return json({ error: e.message || "Conversion failed." }, 502);
  }
}
__name(onRequestGet, "onRequestGet");

// api/phone-lookup.js
var json2 = /* @__PURE__ */ __name((body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { "content-type": "application/json", "cache-control": "public, max-age=86400" }
}), "json");
async function onRequestGet2({ request, env }) {
  const number = new URL(request.url).searchParams.get("number") || "";
  if (!/^\+?[0-9]{6,16}$/.test(number)) return json2({ error: "invalid number" }, 400);
  const key = env.NUMVERIFY_API_KEY;
  if (!key) return json2({ error: "lookup not configured" }, 503);
  try {
    const api = `http://apilayer.net/api/validate?access_key=${key}&number=${encodeURIComponent(number)}`;
    const d = await (await fetch(api)).json();
    if (d && d.success === false) return json2({ error: "lookup failed" }, 502);
    return json2({
      carrier: d.carrier || "",
      line_type: d.line_type || "",
      location: d.location || ""
    });
  } catch {
    return json2({ error: "lookup failed" }, 502);
  }
}
__name(onRequestGet2, "onRequestGet");

// api/summarize.js
var MAX_CHARS = 1e5;
var json3 = /* @__PURE__ */ __name((body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { "content-type": "application/json" }
}), "json");
async function onRequestPost2({ request, env }) {
  const key = env.PUBLIC_AI_API_KEY;
  if (!key) return json3({ error: "summarizer not configured" }, 503);
  const model = env.PUBLIC_AI_MODEL || "gemini-flash-latest";
  let body;
  try {
    body = await request.json();
  } catch {
    return json3({ error: "invalid request" }, 400);
  }
  const text = typeof body.text === "string" ? body.text.trim() : "";
  if (!text) return json3({ error: "no text provided" }, 400);
  if (text.length > MAX_CHARS) {
    return json3({ error: `text too long (max ${MAX_CHARS} characters)` }, 413);
  }
  const length = body.length === "short" || body.length === "detailed" ? body.length : "medium";
  const targets = {
    short: "in 2-3 sentences",
    medium: "in one concise paragraph",
    detailed: "as 5-8 bullet points covering the key sections"
  };
  const prompt = `Summarize the following document ${targets[length]}. Be faithful to the source; do not add information that isn't in the text. Reply with only the summary, no preamble.

<document>
${text}
</document>`;
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 2e3 }
        })
      }
    );
    if (!res.ok) return json3({ error: "summarizer upstream error" }, 502);
    const data = await res.json();
    const parts = data?.candidates?.[0]?.content?.parts;
    const summary = Array.isArray(parts) ? parts.map((p) => p.text ?? "").join("").trim() : "";
    if (!summary) return json3({ error: "no summary produced" }, 502);
    return json3({ summary });
  } catch {
    return json3({ error: "summarizer failed" }, 502);
  }
}
__name(onRequestPost2, "onRequestPost");

// ../.wrangler/tmp/pages-iMoK1i/functionsRoutes-0.23238845534284247.mjs
var routes = [
  {
    routePath: "/api/cc-job",
    mountPath: "/api",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet]
  },
  {
    routePath: "/api/cc-job",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost]
  },
  {
    routePath: "/api/phone-lookup",
    mountPath: "/api",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet2]
  },
  {
    routePath: "/api/summarize",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost2]
  }
];

// C:/Users/Parveen/AppData/Roaming/npm/node_modules/wrangler/node_modules/path-to-regexp/dist.es2015/index.js
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count--;
          if (count === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
__name(lexer, "lexer");
function parse(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path = "";
  var tryConsume = /* @__PURE__ */ __name(function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  }, "tryConsume");
  var mustConsume = /* @__PURE__ */ __name(function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  }, "mustConsume");
  var consumeText = /* @__PURE__ */ __name(function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  }, "consumeText");
  var isSafe = /* @__PURE__ */ __name(function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  }, "isSafe");
  var safePattern = /* @__PURE__ */ __name(function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  }, "safePattern");
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path += prefix;
        prefix = "";
      }
      if (path) {
        result.push(path);
        path = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path += value;
      continue;
    }
    if (path) {
      result.push(path);
      path = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
__name(parse, "parse");
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
__name(match, "match");
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = /* @__PURE__ */ __name(function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    }, "_loop_1");
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path, index, params };
  };
}
__name(regexpToFunction, "regexpToFunction");
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
__name(escapeString, "escapeString");
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
__name(flags, "flags");
function regexpToRegexp(path, keys) {
  if (!keys)
    return path;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path.source);
  }
  return path;
}
__name(regexpToRegexp, "regexpToRegexp");
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path) {
    return pathToRegexp(path, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
__name(arrayToRegexp, "arrayToRegexp");
function stringToRegexp(path, keys, options) {
  return tokensToRegexp(parse(path, options), keys, options);
}
__name(stringToRegexp, "stringToRegexp");
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
__name(tokensToRegexp, "tokensToRegexp");
function pathToRegexp(path, keys, options) {
  if (path instanceof RegExp)
    return regexpToRegexp(path, keys);
  if (Array.isArray(path))
    return arrayToRegexp(path, keys, options);
  return stringToRegexp(path, keys, options);
}
__name(pathToRegexp, "pathToRegexp");

// C:/Users/Parveen/AppData/Roaming/npm/node_modules/wrangler/templates/pages-template-worker.ts
var escapeRegex = /[.+?^${}()|[\]\\]/g;
function* executeRequest(request) {
  const requestPath = new URL(request.url).pathname;
  for (const route of [...routes].reverse()) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult) {
      for (const handler of route.middlewares.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: mountMatchResult.path
        };
      }
    }
  }
  for (const route of routes) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: true
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult && route.modules.length) {
      for (const handler of route.modules.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: matchResult.path
        };
      }
      break;
    }
  }
}
__name(executeRequest, "executeRequest");
var pages_template_worker_default = {
  async fetch(originalRequest, env, workerContext) {
    let request = originalRequest;
    const handlerIterator = executeRequest(request);
    let data = {};
    let isFailOpen = false;
    const next = /* @__PURE__ */ __name(async (input, init) => {
      if (input !== void 0) {
        let url = input;
        if (typeof input === "string") {
          url = new URL(input, request.url).toString();
        }
        request = new Request(url, init);
      }
      const result = handlerIterator.next();
      if (result.done === false) {
        const { handler, params, path } = result.value;
        const context = {
          request: new Request(request.clone()),
          functionPath: path,
          next,
          params,
          get data() {
            return data;
          },
          set data(value) {
            if (typeof value !== "object" || value === null) {
              throw new Error("context.data must be an object");
            }
            data = value;
          },
          env,
          waitUntil: workerContext.waitUntil.bind(workerContext),
          passThroughOnException: /* @__PURE__ */ __name(() => {
            isFailOpen = true;
          }, "passThroughOnException")
        };
        const response = await handler(context);
        if (!(response instanceof Response)) {
          throw new Error("Your Pages function should return a Response");
        }
        return cloneResponse(response);
      } else if ("ASSETS") {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      } else {
        const response = await fetch(request);
        return cloneResponse(response);
      }
    }, "next");
    try {
      return await next();
    } catch (error) {
      if (isFailOpen) {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      }
      throw error;
    }
  }
};
var cloneResponse = /* @__PURE__ */ __name((response) => (
  // https://fetch.spec.whatwg.org/#null-body-status
  new Response(
    [101, 204, 205, 304].includes(response.status) ? null : response.body,
    response
  )
), "cloneResponse");

// C:/Users/Parveen/AppData/Roaming/npm/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// C:/Users/Parveen/AppData/Roaming/npm/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// ../.wrangler/tmp/bundle-qVL5jv/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = pages_template_worker_default;

// C:/Users/Parveen/AppData/Roaming/npm/node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// ../.wrangler/tmp/bundle-qVL5jv/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=functionsWorker-0.17260147007668392.mjs.map
