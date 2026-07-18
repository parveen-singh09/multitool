import { onRequestPost as __api_cc_job_js_onRequestPost } from "N:\\toolcities\\my-app\\functions\\api\\cc-job.js"
import { onRequestGet as __api_phone_lookup_js_onRequestGet } from "N:\\toolcities\\my-app\\functions\\api\\phone-lookup.js"
import { onRequestPost as __api_summarize_js_onRequestPost } from "N:\\toolcities\\my-app\\functions\\api\\summarize.js"

export const routes = [
    {
      routePath: "/api/cc-job",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_cc_job_js_onRequestPost],
    },
  {
      routePath: "/api/phone-lookup",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_phone_lookup_js_onRequestGet],
    },
  {
      routePath: "/api/summarize",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_summarize_js_onRequestPost],
    },
  ]