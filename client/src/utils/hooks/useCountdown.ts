import { useState, useEffect } from 'react'
import useCountDown from 'react-countdown-hook'

interface CountdownActions {
  start(ttc?: number): void
  pause(): void
  resume(): void
  reset(): void
  render(text: string): string
  isStarted: boolean
}

function millisToMinutesAndSeconds(millis: number) {
  const minutes = Math.floor(millis / 60000)
  const seconds = Math.floor((millis % 60000) / 1000)
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds
  return `${minutes}:${formattedSeconds}`
}

const millisToHourAndMinutesAndSeconds = (millis: number) => {
  let seconds = Math.floor(millis / 1000)
  let minutes = Math.floor(seconds / 60)
  let hours = Math.floor(minutes / 60)

  seconds %= 60
  minutes %= 60

  const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(
    seconds,
  ).padStart(2, '0')}`

  return formattedTime
}

function useCountdown(
  initialTime: number,
  interval: number,
  format: string,
  onComplated?: (initialTime: number) => void,
): [string, CountdownActions] {
  const [timeLeft, { start, pause, resume, reset }] = useCountDown(initialTime, interval)
  const [isStarted, setIsStarting] = useState(false)
  const [isCalled, setIsCalled] = useState(false)

  const render = (text: string) => {
    return isStarted ? formatTime(format, timeLeft) : text
  }

  if (timeLeft === 0 && !isCalled && isStarted) {
    setIsCalled(true)
    onComplated && onComplated(initialTime)
    setIsStarting(false)
  }

  const onStart = (ttc?: number) => {
    reset()
    start(ttc)
    setIsCalled(false)
    setIsStarting(true)
  }

  return [formatTime(format, timeLeft), { start: onStart, pause, resume, reset, render, isStarted }]
}

const formatTime = (format: string, time: number) => {
  switch (format) {
    default:
      return time.toString()
    case 'minutes':
      return millisToMinutesAndSeconds(time)
    case 'hours':
      return millisToHourAndMinutesAndSeconds(time)
  }
}

export default useCountdown
