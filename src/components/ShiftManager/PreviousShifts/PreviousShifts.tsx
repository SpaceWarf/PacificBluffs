import './PreviousShifts.scss';
import { useSelector } from "react-redux";
import { getPreviousShifts } from "../../../redux/selectors/shifts";
import { RootState } from "../../../redux/store";
import Header from "../../Common/Header";
import { Accordion, Form, Icon, Rating, TextArea } from "semantic-ui-react";
import React, { Fragment, useState } from "react";
import { Receipt } from '../../../redux/reducers/receipts';
import { Shift } from '../../../redux/reducers/shifts';
import { currencyFormat } from '../../../utils/currency';
import ReceiptsDisplay from '../ReceiptsDisplay/ReceiptsDisplay';
import { getDurationAsString } from '../../../utils/time';
import ShiftEditModal from '../ShiftEditModal/ShiftEditModal';

function PreviousShifts() {
  const previousShifts = useSelector(getPreviousShifts);
  const receipts = useSelector((state: RootState) => state.receipts.receipts);
  const [activeIndex, setActiveIndex] = useState(-1);

  function handleExpandShift(i: number) {
    setActiveIndex(activeIndex === i ? -1 : i);
  }

  function getReceiptsForShift(shift: Shift): Receipt[] {
    return shift.id ? receipts.filter(receipt => receipt.shift === shift.id) : [];
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
    <div className='PreviousShifts'>
      <Header text='Previous Shifts' decorated />
      {previousShifts.length > 0 ? (
        <Accordion styled>
          {previousShifts.map((shift, i) => (
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
                {/* <div className='Review'>
                  <Form>
                    <Rating
                      icon='star'
                      maxRating={10}
                      size='large'
                      rating={shift.rating}
                      clearable
                      disabled
                    />
                    <TextArea
                      placeholder='No feedback left for this shift'
                      value={shift.comments}
                      rows={5}
                      disabled
                    ></TextArea>
                  </Form>
                </div> */}
                {getReceiptsForShift(shift).length > 0 && (
                  <ReceiptsDisplay receipts={getReceiptsForShift(shift)} />
                )}
              </Accordion.Content>
            </Fragment>
          ))}
        </Accordion>
      ) : (
        <p>There are no previous shifts to display.</p>
      )}
    </div >
  );
}

export default PreviousShifts;