import { writable } from "svelte/store";

export const activeSlide = writable(0);
export const dir = writable("right");
export const selectY = writable(0);