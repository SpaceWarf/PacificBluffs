import './CurrentShift.scss';
import { useSelector } from "react-redux";
import Header from "../../Common/Header";
import { RootState } from "../../../redux/store";
import { getReceiptsForCurrentShift } from "../../../redux/selectors/receipts";
import { getCurrentShift } from "../../../redux/selectors/shifts";
import { currencyFormat } from "../../../utils/currency";
import ReceiptsDisplay from '../ReceiptsDisplay/ReceiptsDisplay';
import ClockOutModal from '../ClockOutModal/ClockOutModal';
import { Fragment, useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Shift } from '../../../redux/reducers/shifts';
import { updateProfileClockedIn, createShift, updateEmployeeCurrentShift } from '../../../utils/firestore';
import { getDurationAsString } from '../../../utils/time';

function CurrentShift() {
  const { user } = useAuth();
  const { clockedIn } = useSelector((state: RootState) => state.profile.info);
  const currentShift = useSelector(getCurrentShift);
  const currentShiftReceipts = useSelector(getReceiptsForCurrentShift);
  const [loading, setLoading] = useState(false);
  const [now, setNow] = useState(new Date());

  async function handleClockIn() {
    if (user) {
      setLoading(true);
      updateProfileClockedIn(user.uid, true);
      const shift: Shift = {
        employee: user.uid,
        start: new Date().toISOString(),
        end: '',
      };
      await createShift(shift);
      setLoading(false);
    }
  }

  function handleClockOut(rating: number, comments: string) {
    if (user) {
      setLoading(true);
      updateProfileClockedIn(user.uid, false);

      const update = {
        end: new Date().toISOString(),
        rating,
        comments,
      }
      updateEmployeeCurrentShift(user.uid, update);
      setLoading(false);
    }
  }

  function getShiftLengthLabel(): React.ReactNode {
    if (currentShift) {
      const duration = now.getTime() - new Date(currentShift.start).getTime();
      const durationStr = getDurationAsString(duration);
      return duration < 60000 ? (
        <p><b>You clocked in less than a minute ago</b></p>
      ) : (
        <p><b>You've been clocked in for {durationStr}</b></p>
      );
    }
  }

  function getShiftSalesLabel(): React.ReactNode {
    const sales = currentShiftReceipts.length;
    const profit = currencyFormat(getShiftTotalProfit());

    if (sales === 0) {
      return <p className='Profit'>no sales made yet</p>
    } else if (sales === 1) {
      return <p className='Profit'><b>1 sale</b> for <b>{profit}</b> in profit</p>
    }
    return <p className='Profit'><b>{sales} sales</b> for <b>{profit}</b> in profit</p>
  }

  function getShiftTotalProfit(): number {
    return currentShiftReceipts.reduce((total, receipt) => {
      return total + receipt.total + receipt.tip;
    }, 0);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className='CurrentShift'>
      <Header text='Current Shift' decorated />
      <div className={`CurrentShiftCard ui card ${currentShiftReceipts.length > 0 ? 'WithOrders' : ''}`}>
        <div className="content">
          {clockedIn ? (
            <Fragment>
              <div className='Duration'>{getShiftLengthLabel()}</div>
              {getShiftSalesLabel()}
              <ClockOutModal onConfirm={handleClockOut} />
            </Fragment>
          ) : (
            <Fragment>
              <p className='ClockedOutLabel'>You are currently clocked out</p>
              <button
                className='ui button positive hover-animation'
                disabled={loading}
                onClick={handleClockIn}
              >
                <p className='label contrast'>Clock In</p>
                <p className='IconContainer contrast'><i className='clock icon'></i></p>
              </button>
            </Fragment>
          )}
        </div>
      </div>
      {currentShiftReceipts.length > 0 && (
        <ReceiptsDisplay receipts={currentShiftReceipts} />
      )}
    </div>
  );
}

export default CurrentShift;