import './ShiftsChart.scss';
import { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { getShiftsForLastWeek } from '../../../redux/selectors/shifts';
import { getDurationAsString } from '../../../utils/time';

interface DailyStat {
  date: string;
  amount: number;
}

function ShiftsChart() {
  const [data, setData] = useState([] as DailyStat[]);
  const shiftsForLastWeek = useSelector(getShiftsForLastWeek);

  useEffect(() => {
    function getWeeklyStats(): DailyStat[] {
      const today = new Date();
      today.setDate(today.getDate() + 1);
      const weeklyStats: DailyStat[] = [];
  
      for (let i = 0; i < 7; i++) {
        const day = new Date(today.setDate(today.getDate() - 1));
        const shiftsForDay = shiftsForLastWeek.filter(shift => {
          const shiftDate = new Date(shift.start);
          return shiftDate.getDate() === day.getDate();
        });
        weeklyStats.push({
          date: day.toLocaleDateString(),
          amount: shiftsForDay.reduce((acc, shift) => {
            return acc + (new Date(shift.end).getTime() - new Date(shift.start).getTime());
          }, 0)
        });
      }
  
      return weeklyStats.reverse();
    }

    setData(getWeeklyStats());
  }, [shiftsForLastWeek]);

  return (
    <div className='ShiftsChart Chart'>
      <p className='Title'>Hours Worked Per Day (Last 7 Days)</p>
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
        <p className="Label">{payload[0].value ? getDurationAsString(payload[0].value) : 'No shifts on record'}</p>
      </div>
    );
  }

  return null;
};

function YAxisFormatter(value: number) {
  return `${Math.floor(value / 1000 / 60 / 60).toString()}h`;
}

export default ShiftsChart;