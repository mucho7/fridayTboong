import { useState, useEffect } from "react";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@mui/material";

import dayjs, { Dayjs } from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimeField } from "@mui/x-date-pickers/TimeField";

type TimeInputProps = {
  setTodayWork: (time: number) => void;
};

const TimeInput = (props: TimeInputProps) => {
  const { setTodayWork } = props;
  const [vacation, setVacation] = useState(0);
  const [value, setValue] = useState<Dayjs>(dayjs("2022-04-17T09:00"));

  const handleVacation = (event) => {
    setVacation(Number(event.target.value));
  };

  const handleTimeChange = (event) => {
    setValue(event);
  };

  useEffect(() => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    let mealTimeFlag = 0;
    if (currentHour >= 14) mealTimeFlag += 1;
    if (currentHour >= 20) mealTimeFlag += 1;

    const workTime =
      (currentHour + vacation - value.get("hour") - mealTimeFlag) * 60 +
      (currentMinute - value.get("minute"));
    setTodayWork(workTime);
  }, [value, vacation, setTodayWork]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
      }}
    >
      <FormControl>
        <FormLabel>금일 휴가 여부</FormLabel>
        <RadioGroup value={vacation} onChange={handleVacation} row>
          <FormControlLabel value={0} control={<Radio />} label="정상출근" />
          <FormControlLabel value={8} control={<Radio />} label="연차" />
          <FormControlLabel value={4} control={<Radio />} label="반차" />
        </RadioGroup>
      </FormControl>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={["TimeField"]}>
          <TimeField
            label="금일 출근 시간"
            value={value}
            onChange={handleTimeChange}
          />
        </DemoContainer>
      </LocalizationProvider>
    </div>
  );
};

export default TimeInput;
