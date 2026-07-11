import { onRequestGet as __api_phone_lookup_js_onRequestGet } from "N:\\toolcities\\my-app\\functions\\api\\phone-lookup.js"

export const routes = [
    {
      routePath: "/api/phone-lookup",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_phone_lookup_js_onRequestGet],
    },
  ]