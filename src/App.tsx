import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button } from "@mui/material";
import { Stack } from '@mui/system';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { resolve } from 'node:path/win32';

// interface Timer {
//   hour?: number | string | null;
//   minute?: number | string | null;
//   second?: number | string | null;
//   isStart: boolean;
//   value?: number | string | null;
//   name: string;
//   hourInput: { value?: string | number | null };
//   minuteInput: { value?: string | number | null };
//   secondInput: { value?: string | number | null };
// }
// if I use interface type, the side code would pops error : function App(): Timer {
const App: React.FunctionComponent = () => {
  let [hour, setHour] = useState<number | string | null | undefined>();
  let [minute, setMinute] = useState<number | string | null | undefined>();
  let [second, setSecond] = useState<number | string | null | undefined>();
  let [isStart, setIsStart] = useState<boolean>(false);
  let [statu, setStatu] = useState<"toStarted" | "started" | "stoped" | "timeOut">("toStarted");
  // Timer controllers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let target = e.target as typeof e.target & {
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
    setStatu("started");
    let form = e.target as typeof e.target & {
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

    async function countDown(counts?: number | string | null) {
      if (!counts) {
        counts = 0;
        return "counted";
      }
      let countsNum = Number(counts);
      let countPromise = new Promise(
        (resolve) => {
          var counting =
            setInterval(() => {
              (countsNum > 0 && countsNum--) || clearInterval(counting);
              console.log("second count down: ", countsNum);
              setSecond(countsNum);
              if (countsNum === 0) {
                console.log("counted")
                resolve("counted");
              }
            }, 1000);
        }
      )
      return await countPromise;
    }

    function Counting(S?: number | string | null, M?: number | string | null, H?: number | string | null) {
      countDown(S).then(
        () => {
          let secondNum, minuteNum, hourNum;
          M ? minuteNum = Number(M) : minuteNum = 0 ;
          H ? hourNum = Number(H) : hourNum = 0 ;
          (minuteNum ===0 && hourNum === 0) ? secondNum = 0 : secondNum = 9;
          if (minuteNum > 0) {
            minuteNum--;
            // secondNum = 9;
            setMinute(minuteNum);
            console.log("1st Counting");
            Counting(secondNum, minuteNum, hourNum);
          };
          if (minuteNum === 0) {
            if (hourNum > 0) {
              hourNum--;
              minuteNum = 9;
              // let secondNum = 9;
              setMinute(minuteNum);
              setHour(hourNum);
              console.log("2nd Counting");
              Counting(secondNum, minuteNum, hourNum);
            }
            // if (hourNum === 0) {
            //   console.log("Timeout !!!");
            //   setStatu("timeOut");
            //   return true;
            // }
          }
          console.log("secondNum: ", secondNum, "minuteNum: ", minuteNum, "hourNum: ", hourNum)
          if (secondNum === 0 && minuteNum === 0 && hourNum === 0) {
            setStatu("timeOut");
            return true;
          }
        }
      )

    }

    Counting(second, minute, hour);


    // backup for the count down code
    //  async function countDown(unit: number, counts?: number | string | null) {
    //   if (!counts) {
    //     counts = 0;
    //     return true;
    //   }
    //   let countsNum = Number(counts);
    //   let countPromise = new Promise(
    //     (resolve) => {
    //       var counting =
    //         setInterval(() => {
    //           (statu === "stoped" && countsNum > 0 && countsNum--) || clearInterval(counting);
    //           console.log("in setInterval: ", countsNum, " unit: ", unit);
    //           switch (unit) {
    //             case 1000: setSecond(countsNum); break;
    //             case 1001: setMinute(countsNum); break;
    //             case 1002: setHour(countsNum); break;
    //           }
    //           if (countsNum === 0) {
    //             resolve(true);
    //           }
    //         }, unit);
    //     }
    //   )
    //   return await countPromise;
    // }
    // console.log("counting down seconds");
    // countDown(1000, second)
    //   .then(
    //     () => {
    //       console.log("counting down minutes");
    //       countDown(1001, minute)
    //         .then(
    //           () => {
    //             console.log("counting down hours");
    //             countDown(1002, hour).then(
    //               () => {
    //                 setStatu("timeOut");
    //               }
    //             )
    //           }
    //         );
    //     }
    //   )
  }
  const handleClear = () => {
    if (!isStart) {
      setHour(null);
      setMinute(null);
      setSecond(null);
    };
  }
  // const handleStop = () => {
  //   if (isStart) setStatu("stoped");
  //}
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
    <Container maxWidth="md">
      <Box sx={{ height: '100vh' }}
        component="form"
        onSubmit={handleSubmit}
      >
        {/* description */}
        <Stack textAlign='center'>
          <Typography variant='h6'>This is a timer based on MUI and React.JS techniques</Typography>
          {statu === "toStarted"
            ? <Typography variant='h1'>Timer</Typography>
            : statu === "started"
              ? <Typography variant='h1'>Counting Down</Typography>
              : statu === "stoped"
                ? <Typography variant='h1'>Stop for a while</Typography>
                : <Typography variant='h1'>Time Out</Typography>
          }
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
        {isStart
          ?
          (statu === "timeOut") ?
            <Stack>
              <Button onClick={handleRestart}>Restart</Button>
            </Stack>
            :
            <Stack direction="row" display="flex" justifyContent="space-between">
              <Button onClick={handleCancel}>Cancel</Button>
              <Button>Stop</Button>
              {/* {
                (statu === "stoped")
                ? <Button type='submit'>Continue</Button>
                : <Button onClick={handleStop}>Stop</Button>
              } */}
            </Stack>
          :
          <Stack direction="row" display="flex" justifyContent="space-between">
            <Button onClick={handleClear}>Clear</Button>
            <Button type='submit'>Start</Button>
          </Stack>
        }
      </Box>
    </Container>
  );
}

export default App;