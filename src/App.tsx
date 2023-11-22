import styled from "styled-components";
import { Warning, UserInput } from "./components";

function App() {
  return (
    <TmaxWrapper>
      <UserInput />
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
