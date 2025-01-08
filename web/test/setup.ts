import '@testing-library/jest-dom/vitest'

window.URL.createObjectURL = vi.fn()
window.HTMLElement.prototype.scrollIntoView = vi.fn()
