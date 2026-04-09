
// ── Math ──
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

export function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function randomChance(probability) {
  return Math.random() < probability
}

export function lerp(a, b, t) {
  return a + (b - a) * t
}

export function round(value, decimals = 0) {
  return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals)
}

// ── Array ──
export function last(arr) {
  return arr[arr.length - 1]
}

export function sample(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function groupBy(arr, key) {
  return arr.reduce((acc, item) => {
    const group = item[key]
    if (!acc[group]) acc[group] = []
    acc[group].push(item)
    return acc
  }, {})
}

export function uniqueById(arr) {
  const seen = new Set()
  return arr.filter(item => {
    if (seen.has(item.id)) return false
    seen.add(item.id)
    return true
  })
}

// ── Object ──
export function omit(obj, keys) {
  return Object.fromEntries(
    Object.entries(obj).filter(([k]) => !keys.includes(k))
  )
}

export function pick(obj, keys) {
  return Object.fromEntries(
    keys.filter(k => k in obj).map(k => [k, obj[k]])
  )
}

// ── Timing ──
export function debounce(fn, ms) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), ms)
  }
}

export function throttle(fn, ms) {
  let last = 0
  return (...args) => {
    const now = Date.now()
    if (now - last < ms) return
    last = now
    return fn(...args)
  }
}

// ── DOM ──
export function copyToClipboard(text) {
  return navigator.clipboard.writeText(text)
}