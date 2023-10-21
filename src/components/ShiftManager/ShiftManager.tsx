import './ShiftManager.scss';
import CurrentShift from './CurrentShift/CurrentShift';
import PreviousShifts from './PreviousShifts/PreviousShifts';

function ShiftManager() {

  return (
    <div className="ShiftManager">
      <div className='DataSection'>
        <CurrentShift />
        <PreviousShifts />
      </div>
    </div>
  );
}


export default ShiftManager;
