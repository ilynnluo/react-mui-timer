import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button } from "@mui/material";
import { Stack } from '@mui/system';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { resolve } from 'node:path/win32';

// interface Timer {
//   hour?: number | null;
//   minute?: number | null;
//   second?: number | null;
//   isStart: boolean;
//   value?: number | null;
//   name: string;
//   hourInput: { value?: string | null };
//   minuteInput: { value?: string | null };
//   secondInput: { value?: string | null };
// }
// if I use interface type, the side code would pops error : function App(): Timer {
const App: React.FunctionComponent = () => {
  const [hour, setHour] = useState<number | string | null | undefined>();
  const [minute, setMinute] = useState<number | string | null | undefined>();
  let [second, setSecond] = useState<number | string | null | undefined>();
  const [isStart, setIsStart] = useState<boolean>(false);
  // Timer controllers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as typeof e.target & {
      value?: number | string | null,
      name: string,
    }
    switch (target.name) {
      case "hourInput": { setHour(target.value); break; }
      case "minuteInput": { setMinute(target.value); break; }
      case "secondInput": { setSecond(target.value); break; }
    }
  }
  const handleSubmit = (e: React.FormEvent<HTMLInputElement>): void => {
    e.preventDefault();
    const form = e.target as typeof e.target & {
      hourInput: {
        value?: number | string | null
      };
      minuteInput: {
        value?: number | string | null
      };
      secondInput: {
        value?: number | string | null
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
    async function countDown(unit: number, counts?: number | string | null) {
      let countsNum = Number(counts);
      let countPromise = new Promise(
        (resolve) => {
          let counting =
            setInterval(() => {
              (countsNum-- && countsNum > 0) || clearInterval(counting);
              switch (unit) {
                case 1000: setSecond(countsNum); break;
                case 1001: setMinute(countsNum); break;
                case 1002: setHour(countsNum); break;
              }
              console.log("in setInterval: ", countsNum)
              if (countsNum === 0)
                resolve(true);
            }, unit);
        }
      )
      let result = await countPromise;
      return result;
    }
    console.log("counting down seconds");
    countDown(1000, second).then(
      () => {
        console.log("counting down minutes");
        countDown(1001, minute).then(
          () => {
            console.log("counting down hours");
            countDown(1002, hour)
          }
        );
      }
    )
  }
  const handleClear = (e: React.MouseEvent<HTMLElement>): void => {
    if (!isStart)
      setHour(null);
    setMinute(null);
    setSecond(null);
  }
  const handleCancel = (e: React.MouseEvent<HTMLElement>): void => {
    if (isStart)
      setIsStart(false);
    setHour(null);
    setMinute(null);
    setSecond(null);
  }
  return (
    <Container maxWidth="md">
      <Box sx={{ height: '100vh' }}
        component="form"
        onSubmit={handleSubmit}
      >
        {/* description */}
        <Stack textAlign='center'>
          <Typography variant='h6'>This is a timer based on MUI and React.JS techniques</Typography>
          <Typography variant='h1'>Timer</Typography>
          <Typography variant='h6' >Please input hours, mimutes, seconds, and then click "Start"</Typography>
        </Stack>
        {/* input area */}
        {isStart
          ?
          <Stack direction="row" spacing={2} display="flex" justifyContent="center" alignItems="center">
            <TextField disabled name='hourInput' value={hour} size="medium" label="hour" />
            <Typography variant='h3'>:</Typography>
            <TextField disabled name='minuteInput' value={minute} size="medium" label="minute" />
            <Typography variant='h3'>:</Typography>
            <TextField disabled name='secondInput' value={second} size="medium" label="second" />
          </Stack>
          :
          <Stack direction="row" spacing={2} display="flex" justifyContent="center" alignItems="center">
            <TextField name='hourInput' value={hour || ''} onChange={handleChange} size="medium" label="hour"
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} />
            <Typography variant='h3'>:</Typography>
            <TextField name='minuteInput' value={minute || ''} onChange={handleChange} size="medium" label="minute"
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} />
            <Typography variant='h3'>:</Typography>
            <TextField name='secondInput' value={second || ''} onChange={handleChange} size="medium" label="second"
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} />
          </Stack>}
        {/* control buttons */}
        {/* {isStart */}
        {/* ? */}
        <Stack direction="row" display="flex" justifyContent="space-between">
          <Button onClick={handleCancel}>Cancel</Button>
          <Button>Stop</Button>
        </Stack>
        {/* : */}
        <Stack direction="row" display="flex" justifyContent="space-between">
          <Button onClick={handleClear}>Clear</Button>
          <Button type='submit'>Start</Button>
        </Stack>
        {/* } */}
      </Box>
    </Container>
  );
}

export default App;