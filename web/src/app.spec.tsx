import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('should render the main heading', () => {
    render(<App />)
    expect(screen.getByText('Vite + React')).toBeInTheDocument()
  })
})
