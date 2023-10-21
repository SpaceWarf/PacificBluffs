import './OrdersChart.scss';
import { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { getReceiptsForLastWeek } from '../../../redux/selectors/receipts';
import { currencyFormat } from '../../../utils/currency';

interface DailyStat {
  date: string;
  amount: number;
}

function OrdersChart() {
  const [data, setData] = useState([] as DailyStat[]);
  const receiptsForLastWeek = useSelector(getReceiptsForLastWeek);

  useEffect(() => {
    function getWeeklyStats(): DailyStat[] {
      const today = new Date();
      today.setDate(today.getDate() + 1);
      const weeklyStats: DailyStat[] = [];
  
      for (let i = 0; i < 7; i++) {
        const day = new Date(today.setDate(today.getDate() - 1));
        const ordersForDay = receiptsForLastWeek.filter(receipt => {
          const receiptDate = new Date(receipt.date);
          return receiptDate.getDate() === day.getDate();
        });
        weeklyStats.push({
          date: day.toLocaleDateString(),
          amount: ordersForDay.reduce((acc, receipt) => acc + receipt.total + receipt.tip, 0)
        });
      }
  
      return weeklyStats.reverse();
    }

    setData(getWeeklyStats());
  }, [receiptsForLastWeek]);

  return (
    <div className='OrdersChart Chart'>
      <p className='Title'>Profit Per Day (Last 7 Days)</p>
      <ResponsiveContainer width='100%' height={400}>
        <BarChart
          data={data}
          barSize={50}
          margin={{
            top: 5,
            right: 5,
            left: 20,
            bottom: 40,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis angle={-45} textAnchor='end' dataKey="date" />
          <YAxis tickFormatter={YAxisFormatter} />
          <Tooltip content={<CustomTooltip />}/>
          <Bar dataKey="amount" fill="#dcb77d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="CustomTooltip">
        <p className="Label"><b>{label}</b></p>
        <p className="Label">{currencyFormat(payload[0].value)}</p>
      </div>
    );
  }

  return null;
};

function YAxisFormatter(value: number) {
  return currencyFormat(value).toString();
}

export default OrdersChart;