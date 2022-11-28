import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button } from "@mui/material";
import { Stack } from '@mui/system';
import { styled } from "@mui/material/styles";

const TimerInput = styled(TextField)({
  width: '8rem',
  size: 'medium',
});
const TimerHeader = styled(Typography)({
  fontWeight: 700,
  letterSpacing: 6,
  py: 6
})

const App: React.FunctionComponent = () => {
  
  // dont use mutiple types
  const [hour, setHour] = useState<number | null | undefined>();
  const [minute, setMinute] = useState<number | null | undefined>();
  const [second, setSecond] = useState<number | null | undefined>();
  const [isStart, setIsStart] = useState<boolean>(false);
  //enum
  const [statu, setStatu] = useState<"toStarted" | "started" | "stoped" | "timeOut">("toStarted");

  // Timer controllers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let target = e.target as typeof e.target & {
      value?: number | null,
      name: string,
    }
    switch (target.name) {
      case "hourInput": { setHour(target.value); break; }
      case "minuteInput": { setMinute(target.value); break; }
      case "secondInput": { setSecond(target.value); break; }
    }
  }
  // try to install eslint
  const handleSubmit = (e: React.FormEvent<HTMLInputElement>): void => {
    e.preventDefault();
    setStatu("started");
    let form = e.target as typeof e.target & {
      hourInput: {
        value?: number | null
      };
      minuteInput: {
        value?: number | null
      };
      secondInput: {
        value?: number | null
      };
    };
    setHour(Number(form.hourInput.value));
    setMinute(Number(form.minuteInput.value));
    setSecond(Number(form.secondInput.value));
    setIsStart(true);
    // set default timer
    if (!second) setSecond(0);
    if (!minute) setMinute(0);
    if (!hour) setHour(0);
    // count down
    async function countDown(counts?: number | null) {
      if (!counts) {
        counts = 0;
        return "counted";
      }
      let countsNum = Number(counts);
      let countPromise = new Promise(
        (resolve) => {
          let counting = setInterval(() => {
            (countsNum > 0 && countsNum--) || clearInterval(counting);
            console.log("countPromise, the counting down second is: ", countsNum);
            setSecond(countsNum);
            if (countsNum === 0) resolve("counted");
          }, 1000);
        }
      )
      return await countPromise;
    }
    function Counting(S?: number | null, M?: number | string | null, H?: number | null) {
      countDown(S).then(
        () => {
          let secondNum, minuteNum, hourNum;
          M ? minuteNum = Number(M) : minuteNum = 0;
          H ? hourNum = Number(H) : hourNum = 0;
          (minuteNum === 0 && hourNum === 0) ? secondNum = 0 : secondNum = 10;
          if (minuteNum > 0) {
            minuteNum--;
            setMinute(minuteNum);
            Counting(secondNum, minuteNum, hourNum);
          };
          if (minuteNum === 0) {
            if (hourNum > 0) {
              hourNum--;
              minuteNum = 9;
              setMinute(minuteNum);
              setHour(hourNum);
              Counting(secondNum, minuteNum, hourNum);
            }
          }
          console.log("secondNum: ", secondNum, "minuteNum: ", minuteNum, "hourNum: ", hourNum)
          if (secondNum === 0 && minuteNum === 0 && hourNum === 0) {
            setStatu("timeOut");
            // error if change DOM 
            // () => { document.getElementById('alert').style.color = 'red'; };
            return true;
          }
        }
      )
    }
    Counting(second, minute, hour);
  }
  const handleClear = () => {
    if (!isStart) {
      setHour(null);
      setMinute(null);
      setSecond(null);
    };
  }
  const handleStop = () => {
    if (isStart) {
      setStatu("stoped");
      console.log("handleStop statu: ", statu);
    }
  }
  const handleCancel = () => {
    if (isStart) {
      setStatu("toStarted");
      setIsStart(false);
      setHour(null);
      setMinute(null);
      setSecond(null);
    }
  }
  const handleRestart = () => {
    setStatu("toStarted");
    setIsStart(false);
  }
  return (

    <Box sx={{ display: 'flex', justifyContent: 'center', height: '100vh' }}
      component="form"
      onSubmit={handleSubmit}
    >
      <Container sx={{width: "480px"}} >
        {/* description */}

        <Stack textAlign='center'>
          <Typography variant='h6' mt={2} fontWeight='600' color='text.secondary'>
            The Timer is based on MUI and React.JS</Typography>
          {statu === "toStarted"
            ? <TimerHeader variant='h1' py={6}>Timer</TimerHeader>
            : statu === "started"
              ? <TimerHeader variant='h1' py={6}>Counting Down</TimerHeader>
              // : statu === "stoped"
              //   ? <Typography variant='h1'>Stop for a while</Typography>
              : <TimerHeader id='alert' variant='h1' py={6}
                sx={{ color: (theme) => setInterval(theme.palette.info.main ? theme.palette.info.main : theme.palette.info.main, 1000) }}
              >Time Out</TimerHeader>
          }
          <Typography variant='h6' fontSize='1rem' fontWeight='500' color='text.secondary'>
            Please input hours, mimutes, seconds, and then click "Start"</Typography>
        </Stack>
        {/* input area */}
        {isStart
          ?
          <Stack direction="row" display="flex" justifyContent="space-between" py={3}>
            <TimerInput disabled name='hourInput' value={hour} label="hour" type="number" />
            <Typography variant='h3'>:</Typography>
            <TimerInput disabled name='minuteInput' value={minute} label="minute" type="number" />
            <Typography variant='h3'>:</Typography>
            <TimerInput disabled name='secondInput' value={second} label="second" type="number" />
          </Stack>
          :
          <Stack direction="row" display="flex" justifyContent="space-between" py={3}>
            <TimerInput name='hourInput' value={hour || ''} onChange={handleChange} label="hour" type="number"
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} />
            <Typography variant='h3'>:</Typography>
            <TimerInput name='minuteInput' value={minute || ''} onChange={handleChange} label="minute" type="number"
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} />
            <Typography variant='h3'>:</Typography>
            <TimerInput name='secondInput' value={second || ''} onChange={handleChange} label="second" type="number"
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} />
          </Stack>}
        {/* control buttons */}
        {isStart
          ?
          (statu === "timeOut")
            ?
            <Stack pt={4}>
              <Button onClick={handleRestart} variant='contained' >Restart</Button>
            </Stack>
            :
            <Stack direction="row" display="flex" justifyContent="space-between" spacing={2} pt={4}>
              <Button onClick={handleCancel} sx={{ width: '50%' }} variant='outlined' disabled>Cancel</Button>
              <Button onClick={handleStop} sx={{ width: '50%' }} variant='outlined' disabled>Stop</Button>
              {/* { (statu === "stoped")
                  ? <Button type='submit'>Continue</Button>
                  : <Button onClick={handleStop}>Stop</Button>
              } */}
            </Stack>
          :
          <Stack direction="row" display="flex" justifyContent="space-between" spacing={2} pt={4}>
            <Button onClick={handleClear} sx={{ width: '50%' }} variant='outlined'>Clear</Button>
            <Button type='submit' sx={{ width: '50%' }} variant='contained'>Start</Button>
          </Stack>
        }
      </Container>
    </Box>

  );
}

export default App;