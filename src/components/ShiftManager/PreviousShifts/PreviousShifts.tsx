import './PreviousShifts.scss';
import { useSelector } from "react-redux";
import { getPreviousShifts } from "../../../redux/selectors/shifts";
import Header from "../../Common/Header";
import ShiftListing from '../../Common/ShiftListing';
import { RootState } from '../../../redux/store';

function PreviousShifts() {
  const previousShifts = useSelector(getPreviousShifts);
  const receipts = useSelector((state: RootState) => state.receipts.receipts);

  return (
    <div className='PreviousShifts'>
      <Header text='Previous Shifts' decorated />
      {previousShifts.length > 0 ? (
        <ShiftListing
          shifts={previousShifts}
          receipts={receipts}
        />
      ) : (
        <p>There are no previous shifts to display.</p>
      )}
    </div >
  );
}

export default PreviousShifts;