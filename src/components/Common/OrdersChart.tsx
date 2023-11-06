import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { currencyFormat } from '../../utils/currency';
import { Receipt } from "../../redux/reducers/receipts";
import { getDatesBetween, isSameDay } from "../../utils/date";

interface OrdersChartProps {
  receipts: Receipt[];
  title: string;
  start: Date;
  end: Date;
}

interface DailyStat {
  date: string;
  amount: number;
}

function OrdersChart(props: OrdersChartProps) {
  const [data, setData] = useState([] as DailyStat[]);

  useEffect(() => {
    function getWeeklyStats(): DailyStat[] {
      return getDatesBetween(props.start, props.end)
        .map(day => {
          const ordersForDay = props.receipts.filter(receipt => {
            return isSameDay(new Date(receipt.date), day);
          });

          return {
            date: day.toLocaleDateString(),
            amount: ordersForDay.reduce((acc, receipt) => acc + receipt.total + receipt.tip, 0)
          };
        });
    }

    setData(getWeeklyStats());
  }, [props.receipts, props.end, props.start]);

  return (
    <div className='OrdersChart Chart'>
      <p className='Title'>{props.title}</p>
      <ResponsiveContainer width='100%' height={350}>
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
          <Tooltip content={<CustomTooltip />} />
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