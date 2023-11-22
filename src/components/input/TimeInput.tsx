import React, { useState } from "react";

const TimeInput = () => {
  const [hour, setHour] = useState(9);
  const [minute, setMinute] = useState(0);

  const limitValue = (target: number, max: number) => {
    if (target > max || target < 0) return false;
    return true;
  };

  const handleHourChange = (event) => {
    if (limitValue(event.target.value, 23)) setHour(event.target.value);
  };

  const handleMinuteChange = (event) => {
    if (limitValue(event.target.value, 59)) setMinute(event.target.value);
  };

  const style = {
    width: "20px",
  };

  return (
    <div style={{ margin: "0 auto" }}>
      <input style={style} value={hour} onChange={handleHourChange} />
      시
      <input style={style} value={minute} onChange={handleMinuteChange} />분
      출근
    </div>
  );
};

export default TimeInput;
