import { Restaurant } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import styled from "styled-components";

interface workTimeType {
  time: number;
  vacation?:
    | "공휴일"
    | "월차휴가"
    | "연차휴가"
    | "반차휴가"
    | "정상근무"
    | "-"
    | "오늘";
  mealTimeFlag: number;
}

type WorkTimeViewProps = {
  excelFile: string[][];
  todayWork: number;
};

const WorkTimeView = (props: WorkTimeViewProps) => {
  const { excelFile, todayWork } = props;
  const week = ["월", "화", "수", "목", "금"];
  const today = new Date(new Date().getTime());

  const convertToHHMM = (time: number) => {
    const hour = Math.floor(time / 60);
    const minute = time % 60;
    if (hour === 0 && minute === 0) return "-";
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
    const targetWeek = weekDays.map((day) => {
      const found = weekAttend.find(
        (attend) => formatDate(day) === excelSerialToJSDate(attend[6])
      );
      return found ? found : day;
    });

    const weekRes: workTimeType[] = targetWeek.map((dayAttend) => {
      const dayRes: workTimeType = {
        time: 0,
        mealTimeFlag: 1,
      };

      if (dayAttend instanceof Date) {
        // const today = new Date();
        if (today < dayAttend) {
          dayRes.vacation = "-";
        } else if (today.getTime() === dayAttend.getTime()) {
          dayRes.vacation = "오늘";
          dayRes.time = 0;
        } else dayRes.vacation = "공휴일";
        return dayRes;
      }

      const arrive = dayAttend[7].split(":").map(Number);
      const leave = dayAttend[10].split(":").map(Number);
      const hour = leave[0] - arrive[0];
      const minute = leave[1] - arrive[1];

      if (dayAttend[13] === "월차휴가" || dayAttend[13] === "연차휴가") {
        dayRes.vacation = dayAttend[13];
        return dayRes;
      } else if (
        dayAttend[13] === "반차(오후)" ||
        dayAttend[13] === "반차(오전)"
      ) {
        dayRes.mealTimeFlag -= 1;
        dayRes.vacation = "반차휴가";
      } else dayRes.vacation = "정상근무";

      if (leave[0] >= 20) dayRes.mealTimeFlag += 1;

      dayRes.time += (hour - dayRes.mealTimeFlag) * 60 + minute;
      return dayRes;
    });

    return weekRes;
  };

  const workTime = calculateTime(excelFile);
  const totalWorkTime =
    workTime.reduce((sum, work) => sum + work.time, 0) + todayWork;
  const neededWorkTime = workTime.reduce((sum, work) => {
    let deduction = 0;
    if (work.vacation === "월차휴가" || work.vacation === "연차휴가") {
      deduction = 8;
    } else if (work.vacation === "반차휴가") {
      deduction = 4;
    }
    return sum - deduction;
  }, 40);

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
              {workTime.map((dailyWork, idx) => (
                <ThTd key={idx}>{dailyWork.vacation}</ThTd>
              ))}
            </tr>
            <tr>
              {workTime.map((dailyWork, idx) => (
                <ThTd key={idx}>
                  {dailyWork.vacation === "오늘"
                    ? convertToHHMM(todayWork)
                    : convertToHHMM(dailyWork.time)}
                </ThTd>
              ))}
            </tr>
            <tr>
              {workTime.map((dailyWork, idx) => (
                <ThTd key={idx}>
                  {Array.from(
                    { length: dailyWork.mealTimeFlag },
                    (_, index) => (
                      <Tooltip title={index ? "저녁" : "점심"}>
                        {index === 0 ? (
                          <LunchCheck key={index} />
                        ) : (
                          <DinnerCheck key={index} />
                        )}
                      </Tooltip>
                    )
                  )}
                </ThTd>
              ))}
            </tr>
          </tbody>
        </SimpleTable>
      </TableContainer>
      <SimpleTable>
        <tbody>
          <tr>
            <ThTd style={{ width: 600 }}>
              총 근무 시간 : {convertToHHMM(totalWorkTime)}
            </ThTd>
          </tr>
          <tr>
            <ThTd style={{ width: 600 }}>
              총 필요 근무 시간 : {neededWorkTime}시간
            </ThTd>
          </tr>
          <tr>
            <ThTd style={{ width: 600 }}>
              남은 근무 시간 :{" "}
              {neededWorkTime * 60 - totalWorkTime < 0
                ? "근무완료!"
                : convertToHHMM(neededWorkTime * 60 - totalWorkTime)}
            </ThTd>
          </tr>
        </tbody>
      </SimpleTable>
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

const LunchCheck = styled(Restaurant)({
  border: "solid black",
  borderRadius: "20px",
  padding: "2px",
  margin: "2px",
});

const DinnerCheck = styled(LunchCheck)({
  color: "white",
  background: "black",
});

export default WorkTimeView;
