import { writable } from 'svelte/store'

// These are global stores, they are shared between all Vime instances.
export const isMobile = writable(false)
export const isTouch = writable(false)
export const currentPlayer = writable(null)
