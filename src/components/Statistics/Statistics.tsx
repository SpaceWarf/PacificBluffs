import './Statistics.scss';
import { useEffect, useState } from 'react';
import Header from '../Common/Header';
import Dropdown, { DropdownOption } from '../Common/Dropdown';
import { ProfileInfo } from '../../redux/reducers/profile';
import { getProfiles, getReceiptsForEmployee, getShiftsForEmployee, onProfilesSnapshot } from '../../utils/firestore';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Shift } from '../../redux/reducers/shifts';
import { Receipt } from '../../redux/reducers/receipts';
import ShiftsChart from '../Common/ShiftsChart';
import OrdersChart from '../Common/OrdersChart';
import StatsCard from '../Common/StatsCard';
import { currencyFormat } from '../../utils/currency';
import { getDatesBetween, isSameDay } from '../../utils/date';
import ShiftListing from '../Common/ShiftListing';

function Statistics() {
  const [employee, setEmployee] = useState<string>('');
  const [employees, setEmployees] = useState([] as ProfileInfo[]);
  const [loading, setLoading] = useState(true);
  const [start, setStart] = useState<Dayjs>(dayjs().subtract(6, 'days'));
  const [end, setEnd] = useState<Dayjs>(dayjs());
  const [dateError, setDateError] = useState<boolean>(false);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [generatingReport, setGeneratingReport] = useState<boolean>(false);

  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      const profiles = await getProfiles();
      setEmployees(profiles);
      onProfilesSnapshot((profiles: ProfileInfo[]) => setEmployees(profiles));
      setLoading(false);
    }
    fetchProfiles();
  }, []);

  useEffect(() => {
    const getShifts = async () => {
      setShifts(await getShiftsForEmployee(employee));
    }
    const getReceipts = async () => {
      setReceipts(await getReceiptsForEmployee(employee));
    }

    if (!dateError) {
      getShifts();
      getReceipts();
    }
  }, [employee, start, end, dateError])

  const getEmployeeDropdownOptions = (): DropdownOption[] => {
    return employees.map(employee => ({
      text: employee.name,
      key: employee.id,
      value: employee.id,
    }));
  }

  const handleUpdateStart = (start: Dayjs) => {
    setDateError(false);
    setStart(start);

    if (!start.isBefore(end)) {
      setDateError(true);
    }
  }

  const handleUpdateEnd = (end: Dayjs) => {
    setDateError(false);
    setEnd(end);

    if (!start.isBefore(end)) {
      setDateError(true);
    }
  }

  const getOrderedShifts = (shifts: Shift[]): Shift[] => {
    return getFilteredShifts(shifts)
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
  }

  const getFilteredShifts = (shifts: Shift[]): Shift[] => {
    return shifts.filter(shift => {
      const daysTofilter = getDatesBetween(start.toDate(), end.toDate());
      return shift.end && daysTofilter.some(day => isSameDay(new Date(shift.start), day));
    });
  }

  const getFilteredReceipts = (receipts: Receipt[]): Receipt[] => {
    return receipts.filter(receipt => {
      const daysTofilter = getDatesBetween(start.toDate(), end.toDate());
      return daysTofilter.some(day => isSameDay(new Date(receipt.date), day));
    });
  }

  const handleDownload = async () => {
    setGeneratingReport(true);
    const rows = [['Name', 'Hours Worked', 'Profits', 'Expected Bonus']];

    for (const employee of employees) {
      const shifts = await getShiftsForEmployee(employee.id);
      const receipts = await getReceiptsForEmployee(employee.id);
      rows.push([
        employee.name,
        `${getHoursWorked(getFilteredShifts(shifts))}`,
        `${getProfits(getFilteredReceipts(receipts))}`,
        `${getBonus(getFilteredShifts(shifts))}`,
      ]);
    }

    const csvContent = "data:text/csv;charset=utf-8,"
      + rows
        .sort((a, b) => Number(b[1]) - Number(a[1]))
        .map(row => row.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    window.open(encodedUri);
    setGeneratingReport(false);
  }

  const getHoursWorked = (shifts: Shift[], minLength = 0): number => {
    const time = shifts.reduce((total, shift) => {
      if (shift.end) {
        const length = new Date(shift.end).getTime() - new Date(shift.start).getTime();
        return length >= minLength ? total + length : total;
      }
      return total;
    }, 0);
    return Math.round(time / 1000 / 60 / 60);
  }

  const getProfits = (receipts: Receipt[]): number => {
    return receipts.reduce((total, receipt) => {
      return total + receipt.total + receipt.tip;
    }, 0);
  }

  const getBonus = (shifts: Shift[]): number => {
    return getHoursWorked(shifts, 3600000) * 1000;
  }

  return (
    <div className="Statistics">
      <Header text='Statistics' decorated />
      <div className='Actions'>
        <div className='Filters'>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Start"
              value={start}
              disabled={loading || generatingReport}
              onChange={value => handleUpdateStart(dayjs(value))}
            />
            <DatePicker
              label="End"
              value={end}
              disabled={loading || generatingReport}
              onChange={value => handleUpdateEnd(dayjs(value))}
            />
          </LocalizationProvider>
          <Dropdown
            placeholder="Employee"
            disabled={loading || generatingReport}
            options={getEmployeeDropdownOptions()}
            value={employee}
            onChange={(_, { value }) => setEmployee(value)}
          />
        </div>
        <div className='Buttons'>
          <button
            className="ui button positive hover-animation"
            disabled={loading || generatingReport || dateError}
            onClick={handleDownload}
          >
            <p className='label contrast'>Download For All Employees</p>
            <p className='IconContainer contrast'><i className='download icon'></i></p>
          </button>
        </div>
      </div>
      {dateError && <p className='error'>The start date must be before the end date.</p>}
      {employee && (
        <div className='content'>
          <div className='Row'>
            <div className='Cards'>
              <StatsCard
                title={`${getHoursWorked(getFilteredShifts(shifts))} hours`}
                description='Hours Worked'
                icon='clock'
              />
              <StatsCard
                title={currencyFormat(getProfits(getFilteredReceipts(receipts)))}
                description='Profits'
                icon='dollar'
              />
              <StatsCard
                title={currencyFormat(getBonus(getFilteredShifts(shifts)))}
                description='Expected Bonus'
                icon='tip'
              />
            </div>
            <div className='ui card ShiftsChartCard half-width'>
              <div className='content'>
                <ShiftsChart
                  title='Hours Worked Per Day'
                  shifts={getFilteredShifts(shifts)}
                  start={start.toDate()}
                  end={end.toDate()}
                />
              </div>
            </div>
            <div className='ui card OrdersChartCard half-width'>
              <div className='content'>
                <OrdersChart
                  title='Profit Per Day'
                  receipts={getFilteredReceipts(receipts)}
                  start={start.toDate()}
                  end={end.toDate()}
                />
              </div>
            </div>
          </div>
          <div className='Row'>
            <div className='Shifts'>
              <h2>Shifts</h2>
              <ShiftListing
                shifts={getOrderedShifts(shifts)}
                receipts={getFilteredReceipts(receipts)}
              />
            </div>
          </div>
        </div>
      )}
      {!employee && (
        <div className='content'>
          <p>Select an employee to view their stats</p>
        </div>
      )}
    </div>
  );
}

export default Statistics;
