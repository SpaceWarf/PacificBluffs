import './Dashboard.scss';
import { useSelector } from 'react-redux';
import { getBiggestReceipts, getBiggestTipReceipts, getLifetimeProfits, getLifetimeTips } from '../../redux/selectors/receipts';
import { currencyFormat } from '../../utils/currency';
import { Receipt } from '../../redux/reducers/receipts';
import { getLifetimeHoursWorked, getLongestShifts } from '../../redux/selectors/shifts';
import { Shift } from '../../redux/reducers/shifts';
import { getDurationAsString } from '../../utils/time';
import OrdersChart from './OrdersChart/OrdersChart';
import ShiftsChart from './ShiftsChart/ShiftsChart';
import StatsCard from '../Common/StatsCard';
import { getProfilesClockedIn } from '../../utils/firestore';
import { useEffect, useState } from 'react';
import { ProfileInfo } from '../../redux/reducers/profile';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../redux/store';
import UpcomingEventsCard from './UpcomingEventsCard/UpcomingEventsCard';

function Dashboard() {
  const navigate = useNavigate();
  const profile = useSelector((state: RootState) => state.profile);
  const { roles } = useSelector((state: RootState) => state.roles);
  const biggestReceipts = useSelector(getBiggestReceipts);
  const longestShifts = useSelector(getLongestShifts);
  const biggestTipReceipts = useSelector(getBiggestTipReceipts);
  const lifetimeProfits = useSelector(getLifetimeProfits);
  const lifetimeHoursWorked = useSelector(getLifetimeHoursWorked);
  const lifetimeTips = useSelector(getLifetimeTips);
  const [profilesClockedIn, setProfilesClockedIn] = useState<Partial<ProfileInfo>[]>([]);

  function getShiftDuration(shift: Shift): string {
    return getDurationAsString(new Date(shift.end).getTime() - new Date(shift.start).getTime());
  }

  useEffect(() => {
    async function getCoworkersOnShift() {
      setProfilesClockedIn(await getProfilesClockedIn());
    }
    getCoworkersOnShift();

    const interval = setInterval(() => {
      getCoworkersOnShift();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const getRoles = (): string[] => {
    const foundRoles: string[] = [];
    profile.info.roles.forEach(roleId => {
      const foundRole = roles.find(role => role.id === roleId);
      if (foundRole) {
        foundRoles.push(foundRole.name);
      }
    });
    return foundRoles;
  }

  return (
    <div className="Dashboard">
      <div className='PageHeader'>
        <div className='UserInfo' onClick={() => navigate('/profile')}>
          {!profile.pfpUrl && <i className='user circle icon'></i>}
          {profile.pfpUrl && <img src={profile.pfpUrl} alt="Profile" />}
          <div>
            <h1 className='Name'>{profile.info.name}</h1>
            <h4 className='Division'>{getRoles().join(', ')}</h4>
          </div>
        </div>
      </div>
      <div className='content'>
        <div className='Col'>
          <div className='Row'>
            <UpcomingEventsCard />
          </div>
          <div className='Row'>
            <div className='ui card OnShift full-width'>
              <div className='content'>
                <div className='header'>
                  Employees On Shift
                </div>
                <div className='description'>
                  {profilesClockedIn.length > 0 ? (
                    <ul>
                      {profilesClockedIn.map((profile: Partial<ProfileInfo>) => (
                        <li key={profile.id}>
                          <div className='ListItem'>
                            <p className='Item'><b>{profile.name}</b></p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No employees on shift right now</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='Col'>
          <div className='Row'>
            <div className='ui card ShiftsChartCard half-width'>
              <div className='content'>
                <ShiftsChart />
              </div>
            </div>
            <div className='ui card OrdersChartCard half-width'>
              <div className='content'>
                <OrdersChart />
              </div>
            </div>
          </div>
          <div className='Row'>
            <div className='Lifetime quarter-width'>
              <StatsCard
                title={currencyFormat(lifetimeProfits)}
                description='Lifetime Profits'
                icon='dollar'
              />
              <StatsCard
                title={currencyFormat(lifetimeTips)}
                description='Lifetime Tips'
                icon='tip'
              />
              <StatsCard
                title={`${lifetimeHoursWorked} hours`}
                description='Lifetime Hours Worked'
                icon='clock'
              />
            </div>
            <div className='ui card BiggestOrders quarter-width'>
              <div className='content'>
                <div className='header'>
                  Biggest Orders
                </div>
                <div className='description'>
                  {biggestReceipts.length > 0 ? (
                    <ol>
                      {biggestReceipts.map((receipt: Receipt) => (
                        <li key={receipt.id}>
                          <div className='ListItem'>
                            <p className='Item'><b>{currencyFormat(receipt.total)}</b></p>
                            <p className='Date'>{receipt.date.split('T')[0]}</p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <p>No receipts on record</p>
                  )}
                </div>
              </div>
            </div>
            <div className='ui card BiggestOrders quarter-width'>
              <div className='content'>
                <div className='header'>
                  Biggest Tips
                </div>
                <div className='description'>
                  {biggestTipReceipts.length > 0 ? (
                    <ol>
                      {biggestTipReceipts.map((receipt: Receipt) => (
                        <li key={receipt.id}>
                          <div className='ListItem'>
                            <p className='Item'><b>{currencyFormat(receipt.tip)}</b></p>
                            <p className='Date'>{receipt.date.split('T')[0]}</p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <p>No receipts on record</p>
                  )}
                </div>
              </div>
            </div>
            <div className='ui card LongestShifts quarter-width'>
              <div className='content'>
                <div className='header'>
                  Longest Shifts
                </div>
                <div className='description'>
                  {longestShifts.length > 0 ? (
                    <ol>
                      {longestShifts.map((shift: Shift) => (
                        <li key={shift.id}>
                          <div className='ListItem'>
                            <p className='Item'><b>{getShiftDuration(shift)}</b></p>
                            <p className='Date'>{shift.start.split('T')[0]}</p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <p>No shifts on record</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}


export default Dashboard;
