import { useState, useEffect } from "react";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@mui/material";

type TimeInputProps = {
  setTodayWork: (time: number) => void;
};

const TimeInput = (props: TimeInputProps) => {
  const { setTodayWork } = props;
  const [hour, setHour] = useState(9);
  const [minute, setMinute] = useState(0);
  const [vacation, setVacation] = useState(0);

  const limitValue = (target: number, max: number) => {
    if (target > max || target < 0) return false;
    return true;
  };

  const handleVacation = (event) => {
    setVacation(Number(event.target.value));
  };

  const handleHourChange = (event) => {
    if (limitValue(event.target.value, 23)) setHour(Number(event.target.value));
  };

  const handleMinuteChange = (event) => {
    if (limitValue(event.target.value, 59))
      setMinute(Number(event.target.value));
  };

  const style = {
    width: "20px",
  };

  useEffect(() => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const workTime =
      (currentHour + vacation - hour) * 60 + (currentMinute - minute);
    setTodayWork(workTime);
  }, [hour, minute, vacation, setTodayWork]);

  return (
    <div style={{ margin: "0 auto", display: "flex", alignItems: "center" }}>
      <FormControl>
        <FormLabel>금일 휴가 여부</FormLabel>
        <RadioGroup value={vacation} onChange={handleVacation} row>
          <FormControlLabel value={0} control={<Radio />} label="정상출근" />
          <FormControlLabel value={8} control={<Radio />} label="연차" />
          <FormControlLabel value={4} control={<Radio />} label="반차" />
        </RadioGroup>
      </FormControl>
      {`오늘 `}
      <input style={style} value={hour} onChange={handleHourChange} />
      {`시 `}
      <input style={style} value={minute} onChange={handleMinuteChange} />분
      출근
    </div>
  );
};

export default TimeInput;
