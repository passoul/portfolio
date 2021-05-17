import { writable, readable } from "svelte/store";

export const SHOWHEADER = writable(false);
export const SHOWPROFIL = writable(false);
export const SHOWINTRO = writable(false);
export const SHOWMENUEITEM = writable(false);
export const SHOWBACKTOTOP = writable(false);
export const HEADERINTROEND = writable(false);
export const MENUISACTIVE = writable(false);
export const MENUBTNPRESSED = writable(false);
export const DARKMODE = writable(false);
export const SKILLSANIMEND = writable(false);

export const TRIGGERBACKTOTOPPOINT = readable(200);
