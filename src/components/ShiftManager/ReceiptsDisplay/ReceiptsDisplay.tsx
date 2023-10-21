import "./ReceiptsDisplay.scss";
import { Accordion, Icon } from "semantic-ui-react";
import { Receipt } from "../../../redux/reducers/receipts";
import { Fragment, useState } from "react";
import { Combo, MenuItem } from "../../../redux/reducers/menuItems";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { currencyFormat } from "../../../utils/currency";
import ReceiptEditModal from "../ReceiptEditModal/ReceiptEditModal";

interface ReceiptsDisplayProps {
  receipts: Receipt[];
}

function ReceiptsDisplay({ receipts }: ReceiptsDisplayProps) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const { items, combos } = useSelector((state: RootState) => state.menuItems);

  function handleExpandReceipt(i: number) {
    setActiveIndex(activeIndex === i ? -1 : i);
  }

  function getMenuItem(id: string): MenuItem | undefined {
    return items.find(item => item.id === id);
  }

  function getCombo(id: string): Combo | undefined {
    return combos.find(combo => combo.id === id);
  }

  function getReceiptTime(receipt: Receipt): string {
    const date = new Date(receipt.date).toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
    });
    return date;
  }

  function getOrderedReceipts(): Receipt[] {
    return receipts.sort((a, b) => {
      const aDate = new Date(a.date);
      const bDate = new Date(b.date);
      return bDate.getTime() - aDate.getTime();
    });
  }

  return (
    <Accordion styled className="ReceiptsDisplay">
      {getOrderedReceipts().map((receipt, i) => (
        <Fragment key={receipt.id}>
          <Accordion.Title
            active={activeIndex === i}
            index={i}
            onClick={() => handleExpandReceipt(i)}
          >
            <Icon name='dropdown' />
            <div className='Label'>
              <p>Receipt {receipt.id} - {getReceiptTime(receipt)}</p>
              <div>
                <p>{currencyFormat(receipt.total + receipt.tip)}</p>
                <ReceiptEditModal receipt={receipt} />
              </div>
            </div>
          </Accordion.Title>
          <Accordion.Content active={activeIndex === i}>
            {receipt.combos.map(receiptCombo => {
              const combo = getCombo(receiptCombo.id)
              return combo && (
                <div key={`${receipt.id}-${combo.id}`} className='ReceiptLine'>
                  <p>{combo.name} x {receiptCombo.quantity}</p>
                  <p>{currencyFormat(combo.price * receiptCombo.quantity)}</p>
                </div>
              )
            })}
            {receipt.items.map(receiptItem => {
              const item = getMenuItem(receiptItem.id);
              return item && (
                <div key={`${receipt.id}-${receiptItem.id}`} className='ReceiptLine'>
                  <p>{item.name} x {receiptItem.quantity}</p>
                  <p>{currencyFormat(item.price * receiptItem.quantity)}</p>
                </div>
              )
            })}
            <div key={`${receipt.id}-tip`} className='ReceiptLine'>
              <p>Tip</p>
              <p>{currencyFormat(receipt.tip)}</p>
            </div>
          </Accordion.Content>
        </Fragment>
      ))}
    </Accordion>
  );
}

export default ReceiptsDisplay;