import React, { useState } from 'react';
// import Grid from "@mui/material/Unstable_Grid2";
import { Container, Box, Typography, TextField, Button } from "@mui/material";
import { Stack } from '@mui/system';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

function App() {
  const [hour, setHour] = useState<number | null | undefined>();
  const [minute, setMinute] = useState<number | null | undefined>();
  let [second, setSecond] = useState<number | null | undefined>();
  const [isStart, setIsStart] = useState<boolean>(false);
  // Timer controllers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as typeof e.target & {
      value?: number | null,
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
      hourInput: { value?: number | null };
      minuteInput: { value?: number | null };
      secondInput: { value?: number | null };
    };
    setIsStart(true);
    setHour(form.hourInput.value);
    setMinute(form.minuteInput.value);
    setSecond(form.secondInput.value);
    
    // count down
    if (!second) { setSecond(0) };
    console.log("second is: ", second)
    // while (second != null && second >= 1) {
    //   setTimeout(() => {
    //     setSecond((second) => second -1 );
    //   }, 1000)
    // }
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
            <TextField disabled name='hourInput' value={hour || ''} size="medium" label="hour" />
            <Typography variant='h3'>:</Typography>
            <TextField disabled name='minuteInput' value={minute || ''} size="medium" label="minute" />
            <Typography variant='h3'>:</Typography>
            <TextField disabled name='secondInput' value={second || ''} size="medium" label="second" />
          </Stack>
          :
          <Stack direction="row" spacing={2} display="flex" justifyContent="center" alignItems="center">
            <TextField name='hourInput' value={hour} onChange={handleChange} size="medium" label="hour" inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} />
            <Typography variant='h3'>:</Typography>
            <TextField name='minuteInput' value={minute} onChange={handleChange} size="medium" label="minute" inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} />
            <Typography variant='h3'>:</Typography>
            <TextField name='secondInput' value={second} onChange={handleChange} size="medium" label="second" inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} />
          </Stack>}
        {/* control buttons */}
        {isStart
          ?
          <Stack direction="row" display="flex" justifyContent="space-between">
            <Button onClick={handleCancel}>Cancel</Button>
            <Button>Stop</Button>
          </Stack>
          :
          <Stack direction="row" display="flex" justifyContent="space-between">
            <Button onClick={handleClear}>Clear</Button>
            <Button type='submit'>Start</Button>
          </Stack>}
      </Box>
    </Container>
  );
}

export default App;
