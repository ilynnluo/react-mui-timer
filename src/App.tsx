import React, { useState } from 'react'
import { Container, Box, Typography, TextField, Button } from '@mui/material'
import { Stack } from '@mui/system'
import { styled } from '@mui/material/styles'

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
  const handleSubmit = (e: React.FormEvent<HTMLInputElement>): void => {
    e.preventDefault()
    setStatu(StateDef.Started)
    const form = e.target as typeof e.target & {
      hourInput: {
        value?: number | null
      }
      minuteInput: {
        value?: number | null
      }
      secondInput: {
        value?: number | null
      }
    }
    setHour(form.hourInput.value)
    setMinute(form.minuteInput.value)
    setSecond(form.secondInput.value)
    setIsStart(true)
    // set default timer
    second ?? setSecond(0)
    minute ?? setMinute(0)
    hour ?? setHour(0)
    // count down
    async function countDown (counts?: number | null): Promise<unknown> {
      let countsNum = counts ?? 0
      const countPromise = await new Promise(
        (resolve) => {
          const counting = setInterval(() => {
            (countsNum && countsNum--) || clearInterval(counting)
            console.log('countPromise, the counting down second is: ', countsNum)
            setSecond(countsNum)
            if (countsNum === 0) resolve('counted')
          }, 1000)
        }
      )
      return countPromise
    }
    function Counting (S?: number | null, M?: number | null, H?: number | null): void {
      countDown(S)
        .then(
          () => {
            let secondNum, minuteNum, hourNum
            minuteNum = M ?? 0
            hourNum = H ?? 0;
            (minuteNum === 0 && hourNum === 0) ? secondNum = 0 : secondNum = 10
            if (minuteNum > 0) {
              minuteNum--
              setMinute(minuteNum)
              Counting(secondNum, minuteNum, hourNum)
            };
            if (minuteNum === 0) {
              if (hourNum > 0) {
                hourNum--
                minuteNum = 9
                setMinute(minuteNum)
                setHour(hourNum)
                Counting(secondNum, minuteNum, hourNum)
              }
            }
            console.log('secondNum: ', secondNum, 'minuteNum: ', minuteNum, 'hourNum: ', hourNum)
            if (secondNum === 0 && minuteNum === 0 && hourNum === 0) {
              setStatu(StateDef.Timeout)
              // error if change DOM
              // () => { document.getElementById('alert').style.color = 'red'; };
              return true
            }
          }
        )
        .catch(e => console.log(e))
    }
    Counting(second, minute, hour)
  }
  const handleClear = (): void => {
    if (!isStart) {
      setHour(null)
      setMinute(null)
      setSecond(null)
    };
  }
  const handleStop = (): void => {
    if (isStart) {
      setStatu(StateDef.Stoped)
      console.log('handleStop statu: ', statu)
    }
  }
  const handleCancel = (): void => {
    if (isStart) {
      setStatu(StateDef.ToStarted)
      setIsStart(false)
      setHour(null)
      setMinute(null)
      setSecond(null)
    }
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
              // : statu === "stoped"
              //   ? <Typography variant='h1'>Stop for a while</Typography>
              : <TimeoutHeader id='alert' variant='h1' py={6}>Time Out</TimeoutHeader>
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
          ? (statu === StateDef.Timeout)
              ? <Stack pt={4}>
                <Button onClick={handleRestart} variant='contained' >Restart</Button>
                </Stack>
              : <Stack direction="row" display="flex" justifyContent="space-between" spacing={2} pt={4}>
                <Button onClick={handleCancel} sx={{ width: '50%' }} variant='outlined' disabled>Cancel</Button>
                <Button onClick={handleStop} sx={{ width: '50%' }} variant='outlined' disabled>Stop</Button>
                {/* { (statu === "stoped")
                    ? <Button type='submit'>Continue</Button>
                    : <Button onClick={handleStop}>Stop</Button>
                } */}
              </Stack>
          : <Stack direction="row" display="flex" justifyContent="space-between" spacing={2} pt={4}>
            <Button onClick={handleClear} sx={{ width: '50%' }} variant='outlined'>Clear</Button>
            <Button type='submit' sx={{ width: '50%' }} variant='contained'>Start</Button>
          </Stack>
        }
      </Container>
    </Box>

  )
}

export default App
