import styled from "styled-components";
import { Warning } from "./components";

function App() {
  return (
    <TmaxWrapper>
      <Warning />
    </TmaxWrapper>
  );
}

const TmaxWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  margin: 0 30%;
`;

export default App;
