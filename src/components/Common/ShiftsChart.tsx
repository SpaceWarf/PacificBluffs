import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { getDurationAsString } from '../../utils/time';
import { Shift } from '../../redux/reducers/shifts';
import { getDatesBetween, isSameDay } from "../../utils/date";

interface ShiftsChartProps {
  shifts: Shift[];
  title: string;
  start: Date;
  end: Date;
}

interface DailyStat {
  date: string;
  amount: number;
}

function ShiftsChart(props: ShiftsChartProps) {
  const [data, setData] = useState([] as DailyStat[]);

  useEffect(() => {
    function getWeeklyStats(): DailyStat[] {
      return getDatesBetween(props.start, props.end)
        .map(day => {
          const shiftsForDay = props.shifts.filter(shift => {
            return isSameDay(new Date(shift.start), day);
          });

          return {
            date: day.toLocaleDateString(),
            amount: shiftsForDay.reduce((acc, shift) => {
              return acc + (new Date(shift.end).getTime() - new Date(shift.start).getTime());
            }, 0)
          };
        });
    }

    setData(getWeeklyStats());
  }, [props.shifts, props.end, props.start]);

  return (
    <div className='ShiftsChart Chart'>
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