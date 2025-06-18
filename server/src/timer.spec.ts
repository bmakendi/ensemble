import { describe, it, expect, vi } from 'vitest'
import { createTimer } from './timer.js'

describe('Timer', () => {
  it('should start the timer once we press the start button', () => {
    const timer = createTimer(300)
    timer.start()
    expect(timer.getState()).toBe('running')
  })

  it('should initialize timer in stopped state', () => {
    const timer = createTimer(300)
    expect(timer.getState()).toBe('stopped')
  })

  it('should pause the timer when running', () => {
    const timer = createTimer(300)
    timer.start()
    timer.pause()
    expect(timer.getState()).toBe('paused')
  })

  it('should reset the timer to stopped state', () => {
    const timer = createTimer(300)
    timer.start()
    timer.reset()
    expect(timer.getState()).toBe('stopped')
  })

  it('should decrease timer value every second when running', () => {
    vi.useFakeTimers()

    const timer = createTimer(5)
    timer.start()

    expect(timer.getCurrentTime()).toBe(5)

    vi.advanceTimersByTime(1000)
    expect(timer.getCurrentTime()).toBe(4)

    vi.advanceTimersByTime(2000)
    expect(timer.getCurrentTime()).toBe(2)

    vi.useRealTimers()
  })

  it('should not decrease timer when paused', () => {
    vi.useFakeTimers()

    const timer = createTimer(5)
    timer.start()
    timer.pause()

    expect(timer.getCurrentTime()).toBe(5)

    vi.advanceTimersByTime(2000)
    expect(timer.getCurrentTime()).toBe(5)

    vi.useRealTimers()
  })

  it('should trigger role rotation when timer reaches zero', () => {
    vi.useFakeTimers()

    const onComplete = vi.fn()
    const timer = createTimer(2, onComplete)
    timer.start()

    expect(timer.getCurrentTime()).toBe(2)
    expect(onComplete).not.toHaveBeenCalled()

    vi.advanceTimersByTime(2000)

    expect(timer.getCurrentTime()).toBe(0)
    expect(onComplete).toHaveBeenCalledOnce()
    expect(timer.getState()).toBe('stopped')

    vi.useRealTimers()
  })
})

