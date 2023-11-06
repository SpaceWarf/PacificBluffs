import { Accordion, Icon } from "semantic-ui-react";
import React, { Fragment, useState } from "react";
import { Receipt } from '../../redux/reducers/receipts';
import { Shift } from '../../redux/reducers/shifts';
import { currencyFormat } from '../../utils/currency';
import { getDurationAsString } from '../../utils/time';
import ReceiptsDisplay from '../ShiftManager/ReceiptsDisplay/ReceiptsDisplay';

interface ShiftListingProps {
  shifts: Shift[],
  receipts: Receipt[],
}

function ShiftListing(props: ShiftListingProps) {
  const [activeIndex, setActiveIndex] = useState(-1);

  function handleExpandShift(i: number) {
    setActiveIndex(activeIndex === i ? -1 : i);
  }

  function getReceiptsForShift(shift: Shift): Receipt[] {
    return shift.id ? props.receipts.filter(receipt => receipt.shift === shift.id) : [];
  }

  function getShiftStartLabel(shift: Shift): React.ReactNode {
    const dateLocale = new Date(shift.start).toLocaleString([], {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
    return (
      <p className='ShiftLength'>
        Shift started on <b>{dateLocale.split(', ')[0]}</b> at <b>{dateLocale.split(', ')[1]}</b> and lasted for {getShiftLengthLabel(shift)}
      </p>
    );
  }

  function getShiftLengthLabel(shift: Shift): React.ReactNode {
    const duration = getDurationAsString(
      new Date(shift.end).getTime() - new Date(shift.start).getTime()
    );
    return <span><b>{duration}</b></span>
  }

  function getShiftProfitLabel(shift: Shift): React.ReactNode {
    const receipts = getReceiptsForShift(shift);
    const profit = receipts.reduce((acc, receipt) => acc + receipt.total + receipt.tip, 0);

    if (receipts.length === 0) {
      return <p className='ShiftProfit'><b>no sales</b></p>
    } else if (receipts.length === 1) {
      return <p className='ShiftProfit'><b>1 sale</b> for <b>{currencyFormat(profit)}</b> in profit</p>
    }

    return <p className='ShiftProfit'><b>{receipts.length} sales</b> for <b>{currencyFormat(profit)}</b> in profit</p>
  }

  return (
    <div className='ShiftListing'>
      {props.shifts.length > 0 ? (
        <Accordion styled>
          {props.shifts.map((shift, i) => (
            <Fragment key={shift.id}>
              <Accordion.Title
                active={activeIndex === i}
                index={i}
                onClick={() => handleExpandShift(i)}
              >
                <Icon name='dropdown' />
                <div className='Label'>
                  <div>{getShiftStartLabel(shift)}</div>
                  <div>
                    <div>{getShiftProfitLabel(shift)}</div>
                    {/* <ShiftEditModal shift={shift} /> */}
                  </div>
                </div>
              </Accordion.Title>
              <Accordion.Content active={activeIndex === i}>
                {getReceiptsForShift(shift).length > 0 && (
                  <ReceiptsDisplay receipts={getReceiptsForShift(shift)} />
                )}
              </Accordion.Content>
            </Fragment>
          ))}
        </Accordion>
      ) : (
        <p>There are no shifts to display.</p>
      )}
    </div >
  );
}

export default ShiftListing;