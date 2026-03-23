import OmniProvider from "./features/Omni/OmniProvider";
import { Omni } from "./features/Omni/page/Omni";

function App() {
  return (
    <OmniProvider>
      <Omni />
    </OmniProvider>
  );
}

export default App;
