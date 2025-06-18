import type { Timer, TimerState } from './types'

export const createTimer = (
  duration: number,
  onComplete?: () => void,
): Timer => {
  let state: TimerState = 'stopped'
  let currentTime = duration
  let intervalId: NodeJS.Timeout | null = null

  return {
    start: () => {
      state = 'running'
      if (intervalId) clearInterval(intervalId)
      intervalId = setInterval(() => {
        if (state === 'running' && currentTime > 0) {
          currentTime--
          if (currentTime === 0) {
            state = 'stopped'
            if (intervalId) {
              clearInterval(intervalId)
              intervalId = null
            }
            if (onComplete) {
              onComplete()
            }
          }
        }
      }, 1000)
    },
    pause: () => {
      state = 'paused'
      if (intervalId) {
        clearInterval(intervalId)
        intervalId = null
      }
    },
    reset: () => {
      state = 'stopped'
      currentTime = duration
      if (intervalId) {
        clearInterval(intervalId)
        intervalId = null
      }
    },
    getCurrentTime: () => currentTime,
    getState: () => state,
  }
}

