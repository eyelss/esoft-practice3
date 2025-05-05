import SubWindowContext from "./sub-windows/SubWindowContext";
import SubWindowCallback from "./sub-windows/SubWindowCallback";
import SubWindowUseMemo from "./sub-windows/SubWindowUseMemo";
import SubWindowRef from "./sub-windows/SubWindowRef";
import SubWindowReducer from "./sub-windows/SubWindowReducer";
import SubWindowMemo from "./sub-windows/SubWindowMemo";
import './Container.css';
import BonusWindow from "./bonus-window/BonusWindow";

function Container() {
  return (
    <>
      <div className='container'>
        <SubWindowContext/>
        <SubWindowCallback/>
        <SubWindowUseMemo/>
        <SubWindowRef/>
        <SubWindowReducer/>
        <SubWindowMemo/>
      </div>
      <BonusWindow/>
    </>
  );
}

export default Container;