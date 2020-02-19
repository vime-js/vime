import { writable } from 'svelte/store'

// These are global stores, they are shared between all Vime instances.
export const mobile = writable(false)
export const touch = writable(false)
export const currentPlayer = writable(null)
