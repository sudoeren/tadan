const STORAGE_KEY = "tadan:has-authed"

export function hasAuthed(): boolean {
  if (typeof window === "undefined") return false
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1"
  } catch {
    return false
  }
}

export function markHasAuthed(): void {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(STORAGE_KEY, "1")
  } catch {
    // ignore (private mode, quota, etc.)
  }
}
