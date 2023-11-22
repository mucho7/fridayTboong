import { useState } from "react";

import { ExcelInput, TimeInput } from "./input";
import { WorkTimeView } from "./";
import styled from "styled-components";

const UserInput = () => {
  const [todayWork, setTodayWork] = useState(0);
  const [excelFile, setExcelFile] = useState<string[][]>([]);

  return (
    <>
      {excelFile.length !== 0 ? (
        <WorkTimeView excelFile={excelFile} todayWork={todayWork} />
      ) : (
        <></>
      )}
      <InputWrapper>
        <TimeInput setTodayWork={setTodayWork} />
        <ExcelInput setExcelFile={setExcelFile} />
      </InputWrapper>
    </>
  );
};
const InputWrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  flex-direction: column;

  width: 100%;
  max-width: 600px;
  height: 200px;
  margin: 2rem 0;

  border: 2px solid black;
  border-radius: 10px;
`;

export default UserInput;
