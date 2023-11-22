import styled from "styled-components";

const Warning = () => {
  const warningContents: string[] = [
    "본 서비스의 근무시간 산정은 개발 연구원 직군 기준입니다.",
    "본 서비스의 산정 결과는 실제 산정 시간과 다소 차이가 있을 수 있으며, 이로 인해 일어날 수 있는 인사상 불이익에 대해서는 책임지지 않습니다.",
    "산정 결과는 참고용으로만 사용해주시기 바랍니다.",
  ];
  return (
    <>
      <WarningContainer>
        <WarningSign>주의사항</WarningSign>
        {warningContents.map((content, idx) => (
          <WarningContent key={idx}>{content}</WarningContent>
        ))}
      </WarningContainer>
    </>
  );
};

const WarningContainer = styled.div`
  position: relative;
  border: 2px solid red;
  border-radius: 10px;
  padding: 2rem;
`;

const WarningSign = styled.div`
  position: absolute;
  top: -10px;
  left: 30px;
  background-color: white;
  font-weight: 600;
  padding: 0px 5px;
`;

const WarningContent = styled.li`
  word-break: keep-all;
  white-space: pre-wrap;
  margin: 5px 0;
`;

export default Warning;
