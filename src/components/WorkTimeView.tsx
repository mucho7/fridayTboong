import styled from "styled-components";

interface workTimeType {
  time: number;
  vacation?: "공휴일" | "월차휴가" | "연차휴가" | "반차휴가" | "정상근무";
}

type WorkTimeViewProps = {
  excelFile: string[][];
};

const WorkTimeView = (props: WorkTimeViewProps) => {
  const { excelFile } = props;
  const week = ["월", "화", "수", "목", "금"];

  const convertToHHMM = (time: number) => {
    const hour = Math.floor(time / 60);
    const minute = time % 60;
    return `${hour}시간 ${minute}분`;
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const excelSerialToJSDate = (serial) => {
    const secondsInDay = 24 * 60 * 60;
    const delta = serial - 25569;

    const jsDate = new Date(delta * secondsInDay * 1000);

    return formatDate(jsDate);
  };

  const getDatesOfThisWeek = () => {
    // const today = new Date();
    const today = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000 * 2);
    const dayOfWeek = today.getDay();

    const monday = new Date(today);
    monday.setDate(today.getDate() - dayOfWeek + 1);

    const friday = new Date(monday);
    friday.setDate(monday.getDate() + 4);

    const datesOfWeek: Date[] = [];
    for (
      let date = new Date(monday);
      date <= friday;
      date.setDate(date.getDate() + 1)
    ) {
      datesOfWeek.push(new Date(date));
    }
    return datesOfWeek;
  };

  const calculateTime = (weekAttend: string[][]) => {
    const weekDays = getDatesOfThisWeek();
    const targetWeek = weekDays.map((day) =>
      weekAttend.find(
        (attend) => formatDate(day) === excelSerialToJSDate(attend[6])
      )
    );
    const weekRes: workTimeType[] = targetWeek.map((dayAttend) => {
      const dayRes: workTimeType = {
        time: 0,
      };

      if (dayAttend === undefined) {
        console.log(dayAttend);
        dayRes.vacation = "공휴일";
        return dayRes;
      }

      if (dayAttend[13] === "월차휴가" || dayAttend[13] === "연차휴가") {
        dayRes.time = 8 * 60;
        dayRes.vacation = dayAttend[13];
        return dayRes;
      }

      let mealTimeFlag = 1;
      const arrive = dayAttend[7].split(":").map(Number);
      const leave = dayAttend[10].split(":").map(Number);
      const hour = leave[0] - arrive[0];
      const minute = leave[1] - arrive[1];

      if (dayAttend[13] === "반차(오후)" || dayAttend[13] === "반차(오전)") {
        mealTimeFlag -= 1;
      }

      if (leave[0] >= 20) mealTimeFlag += 1;

      dayRes.time = (hour - mealTimeFlag) * 60 + minute;
      dayRes.vacation = "정상근무";
      return dayRes;
    });
    return weekRes;
  };

  const workTime = calculateTime(excelFile);
  const totalWorkTime = workTime.reduce((sum, work) => sum + work.time, 0);

  return (
    <WorkTimeWrapper>
      <TableContainer>
        <SimpleTable>
          <thead>
            <tr>
              {week.map((day) => (
                <HeaderTh key={day}>{day}</HeaderTh>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {workTime.map((dailyWork) => (
                <ThTd>{dailyWork.vacation}</ThTd>
              ))}
            </tr>
            <tr>
              {workTime.map((dailyWork) => (
                <ThTd>{convertToHHMM(dailyWork.time)}</ThTd>
              ))}
            </tr>
          </tbody>
        </SimpleTable>
      </TableContainer>
      <tr>
        <ThTd style={{ width: 600 }}>
          총 근무 시간 : {convertToHHMM(totalWorkTime)}
        </ThTd>
      </tr>
    </WorkTimeWrapper>
  );
};

const width = 600;

const WorkTimeWrapper = styled.div``;

const TableContainer = styled.div`
  width: ${width}px;
  margin: 0 auto;
`;

const SimpleTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const ThTd = styled.td`
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
  width: ${width / 6}px;
`;

const HeaderTh = styled.th`
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
`;

export default WorkTimeView;
