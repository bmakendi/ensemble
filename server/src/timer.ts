import type { Timer, TimerState } from './types'

export const createTimer = (
  duration: number,
  onComplete?: () => void,
): Timer => {
  let state: TimerState = 'stopped'
  let currentTime = duration
  let intervalId: NodeJS.Timeout | null = null

  const clearCurrentInterval = (): void => {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  const handleTimerCompletion = (): void => {
    state = 'stopped'
    clearCurrentInterval()
    if (onComplete) {
      onComplete()
    }
  }

  const handleTimerTick = (): void => {
    if (state !== 'running') return
    if (currentTime <= 0) return

    currentTime--

    if (currentTime === 0) {
      handleTimerCompletion()
    }
  }

  return {
    start: () => {
      state = 'running'
      clearCurrentInterval()
      intervalId = setInterval(handleTimerTick, 1000)
    },
    pause: () => {
      state = 'paused'
      clearCurrentInterval()
    },
    reset: () => {
      state = 'stopped'
      currentTime = duration
      clearCurrentInterval()
    },
    getCurrentTime: () => currentTime,
    getState: () => state,
  }
}
