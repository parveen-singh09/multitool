// Minimal ambient types for Cloudflare Pages Functions — enough for the three
// endpoints here, without pulling in @cloudflare/workers-types.
declare module 'cloudflare:email' {
  export class EmailMessage {
    constructor(from: string, to: string, raw: string);
  }
}

type PagesFunction<Env = unknown> = (context: {
  request: Request;
  env: Env;
}) => Response | Promise<Response>;
