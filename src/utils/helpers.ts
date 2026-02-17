/**
 * Helper functions for manipulating CSS custom properties
 * Migrated from update.js
 */

export function getCustomProperty(elem: HTMLElement | null, prop: string): number {
  if (!elem) return 0
  return parseFloat(getComputedStyle(elem).getPropertyValue(prop)) || 0
}

export function setCustomProperty(elem: HTMLElement | null, prop: string, value: number) {
  if (!elem) return
  elem.style.setProperty(prop, value.toString())
}

export function incrementCustomProperty(elem: HTMLElement | null, prop: string, inc: number) {
  setCustomProperty(elem, prop, getCustomProperty(elem, prop) + inc)
}

export function randomNumberBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
