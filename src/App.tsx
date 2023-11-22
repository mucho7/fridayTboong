import styled from "styled-components";
import { Warning, ExcelInput } from "./components";

function App() {
  return (
    <TmaxWrapper>
      <ExcelInput />
      <Warning />
    </TmaxWrapper>
  );
}

const TmaxWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  max-width: 600px;
`;

export default App;
