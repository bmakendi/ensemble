import { render, screen } from '@testing-library/react'
import App from './App'

describe('test', () => {
  it('should work', () => {
    render(<App />)
    expect(screen.getByText('test')).toBeInTheDocument()
  })
})
