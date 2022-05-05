import { writable } from "svelte/store";

export const activeSlide = writable(0);
export const dir = writable("right");