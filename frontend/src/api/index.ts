import type { Api } from "./types";
import http from "./http";
import demo from "../demo/api";

/** Sur GitHub Pages il n'y a pas de backend : le mode démo rejoue l'API dans le navigateur. */
export const modeDemo = import.meta.env.VITE_API_MODE === "demo";

const api: Api = modeDemo ? demo : http;

export default api;
export * from "./types";
export { ApiError, messageErreur } from "./erreurs";
