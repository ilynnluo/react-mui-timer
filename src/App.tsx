import React, { useState } from 'react'
import { Container, Box, Typography, TextField, Button } from '@mui/material'
import { Stack } from '@mui/system'
import { styled } from '@mui/material/styles'
let timer: any
let tick: number
enum StateDef {
  ToStarted = 'TOSTARTED',
  Started = 'STARTED',
  Stoped = 'STOPED',
  Timeout = 'TIMEOUT',
}
const TimerInput = styled(TextField)({
  width: '8rem',
  size: 'medium'
})
const TimerHeader = styled(Typography)({
  fontWeight: 700,
  letterSpacing: 6,
  py: 6
})
const TimeoutHeader = styled(Typography)({
  fontWeight: 700,
  letterSpacing: 6,
  py: 6,
  animationName: 'FlashText',
  animationDuration: '1s',
  animationIterationCount: 'infinite',
  '@Keyframes FlashText': {
    from: { color: 'primary.light' },
    to: { color: 'warning.main' }
  }
})
const App: React.FunctionComponent = () => {
  const [hour, setHour] = useState<number | null | undefined>()
  const [minute, setMinute] = useState<number | null | undefined>()
  const [second, setSecond] = useState<number | null | undefined>()
  const [isStart, setIsStart] = useState<boolean>(false)
  const [statu, setStatu] = useState<StateDef>(StateDef.ToStarted)
  const [showStop, setShowStop] = useState(true)
  const [showContinue, setShowContinue] = useState(false)
  // Timer controllers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const target = e.target as typeof e.target & {
      value?: number | null
      name: string
    }
    switch (target.name) {
      case 'hourInput': { setHour(target.value); break }
      case 'minuteInput': { setMinute(target.value); break }
      case 'secondInput': { setSecond(target.value); break }
    }
  }
  const handleSubmit = (): any => {
    setStatu(StateDef.Started)
    setIsStart(true)
    setSecond(second ?? 0)
    setMinute(minute ?? 0)
    setHour(hour ?? 0)
    tick = Number(second ?? 0) + Number(minute ?? 0) * 60 + Number(hour ?? 0) * 3600

    timer = setInterval((): void => {
      tick = tick - 1
      setHour(Math.floor(tick / 3600))
      setMinute(Math.floor((tick % 3600) / 60))
      setSecond((tick % 3600) % 60)
      if (tick <= 0) {
        setHour(0)
        setMinute(0)
        setSecond(0)
        handleTimeout()
      }
    }, 1000)
  }

  const handleClear = (): void => {
    if (!isStart) {
      setHour(null)
      setMinute(null)
      setSecond(null)
    };
  }
  const handleTimeout = (): void => {
    setStatu(StateDef.Timeout)
    setIsStart(false)
    setHour(null)
    setMinute(null)
    setSecond(null)
    clearInterval(timer)
  }
  const handleCancel = (): void => {
    setStatu(StateDef.ToStarted)
    setIsStart(false)
    setHour(null)
    setMinute(null)
    setSecond(null)
    clearInterval(timer)
  }
  const handleStop = (): void => {
    setStatu(StateDef.Stoped)
    clearInterval(timer)
    setHour(Math.floor(tick / 3600))
    setMinute(Math.floor((tick % 3600) / 60))
    setSecond((tick % 3600) % 60)
    setShowStop(false)
    setShowContinue(true)
  }
  const handleContinue = (): void => {
    setStatu(StateDef.Started)
    setShowStop(true)
    setShowContinue(false)
    handleSubmit()
  }
  const handleRestart = (): void => {
    setSecond(null)
    setMinute(null)
    setHour(null)
    setStatu(StateDef.ToStarted)
    setIsStart(false)
  }
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', height: '100vh' }}
      component="form"
      onSubmit={handleSubmit}
    >
      <Container sx={{ width: '480px' }} >
        {/* description */}
        <Stack textAlign='center'>
          <Typography variant='h6' mt={2} fontWeight='600' color='text.secondary'>
            The Timer is based on MUI and React.JS</Typography>
          {statu === StateDef.ToStarted
            ? <TimerHeader variant='h1' py={6}>Timer</TimerHeader>
            : statu === StateDef.Started
              ? <TimerHeader variant='h1' py={6}>Counting Down</TimerHeader>
              : statu === StateDef.Stoped
                ? <TimerHeader variant='h1'>Stop for a while</TimerHeader>
                : <TimeoutHeader variant='h1' py={6}>Time Out</TimeoutHeader>
          }
          <Typography variant='h6' fontSize='1rem' fontWeight='500' color='text.secondary'>
            Please input hours, mimutes, seconds, and then click &quot;Start&quot;</Typography>
        </Stack>
        {/* input area */}
        {isStart
          ? <Stack direction="row" display="flex" justifyContent="space-between" py={3}>
            <TimerInput disabled name='hourInput' value={hour} label="hour" type="number" />
            <Typography variant='h3'>:</Typography>
            <TimerInput disabled name='minuteInput' value={minute} label="minute" type="number" />
            <Typography variant='h3'>:</Typography>
            <TimerInput disabled name='secondInput' value={second} label="second" type="number" />
          </Stack>
          : <Stack direction="row" display="flex" justifyContent="space-between" py={3}>
            <TimerInput name='hourInput' value={hour ?? ''} onChange={handleChange} label="hour" type="number"
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} />
            <Typography variant='h3'>:</Typography>
            <TimerInput name='minuteInput' value={minute ?? ''} onChange={handleChange} label="minute" type="number"
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} />
            <Typography variant='h3'>:</Typography>
            <TimerInput name='secondInput' value={second ?? ''} onChange={handleChange} label="second" type="number"
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} />
          </Stack>}
        {/* control buttons */}
        {isStart
          ? statu === StateDef.Timeout
            ? <Stack pt={4}>
              <Button onClick={handleRestart} variant='contained'>Restart</Button>
            </Stack>
            : <Stack direction="row" display="flex" justifyContent="space-between" spacing={2} pt={4}>
              <Button onClick={handleCancel} sx={{ width: '50%' }} variant='outlined'>Cancel</Button>
              { showStop && <Button onClick={ handleStop } sx={{ width: '50%' }} variant='outlined'>Stop</Button> }
              { showContinue && <Button type='submit' onClick={ handleContinue } sx={{ width: '50%' }} variant='contained'>Continue</Button>}
            </Stack>
          : <Stack direction="row" display="flex" justifyContent="space-between" spacing={2} pt={4}>
            <Button onClick={handleClear} sx={{ width: '50%' }} variant='outlined'>Clear</Button>
            <Button onClick={handleSubmit} sx={{ width: '50%' }} variant='contained'>Start</Button>
          </Stack>
        }
      </Container>
    </Box>
  )
}

export default App
