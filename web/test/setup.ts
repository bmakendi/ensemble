import '@testing-library/jest-dom/vitest'
import React from 'react'

// Make React available globally for JSX in tests
globalThis.React = React

window.URL.createObjectURL = vi.fn()
window.HTMLElement.prototype.scrollIntoView = vi.fn()
