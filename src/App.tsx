import React, { useState } from 'react';
import Grid from "@mui/material/Unstable_Grid2";
import { Container, Box, Typography, TextField, Button } from "@mui/material";
import { Stack } from '@mui/system';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

interface timerProp {
  hour: number | null,
  minute: number | null,
  second: number | null,
  isStart: boolean
}

function App() {
  let [hour, setHour] = useState();
  let [minute, setMinute] = useState();
  let [second, setSecond] = useState();
  let [isStart, setIsStart] = useState(false);

  return (
    <Container maxWidth="md">
      <Box sx={{height: '100vh'}}>
        {/* description */}
        <Stack textAlign='center'>
          <Typography variant='h6'>This is a timer based on MUI and React.JS techniques</Typography>
          <Typography variant='h1'>Timer</Typography>
          <Typography variant='h6' >Please input hours, mimutes, seconds, and then click "Start"</Typography>
        </Stack>
        {/* input area */}
        <Stack component="form" direction="row" spacing={2} display="flex" justifyContent="center" alignItems="center">
          <TextField id='hours' size="medium" label="hour" inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} />
          <Typography variant='h3'>:</Typography>
          <TextField id='minutes' size="medium" label="minute" inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} />
          <Typography variant='h3'>:</Typography>
          <TextField id='seconds' size="medium" label="second" inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} />
        </Stack>
        {/* control buttons */}
        <Stack direction="row" display="flex" justifyContent="space-between">
          <Button>Clear</Button>
          <Button>Start</Button>
        </Stack>
        <Stack direction="row" display="flex" justifyContent="space-between">
          <Button>Cancel</Button>
          <Button>Stop</Button>
        </Stack>
      </Box>
    </Container>
  );
}

export default App;
