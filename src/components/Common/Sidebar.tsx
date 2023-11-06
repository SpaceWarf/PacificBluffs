import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';
import SidebarItem from './SidebarItem';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import ClockedInLabel from './ClockedInLabel';

interface SidebarProps {
  onCollapse: () => void;
  collapsed: boolean;
}

function Sidebar({ onCollapse, collapsed }: SidebarProps) {
  const { logout, isAdmin } = useAuth();
  const { clockedIn } = useSelector((state: RootState) => state.profile.info);
  const pfpUrl = useSelector((state: RootState) => state.profile.pfpUrl);
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <div className={`ui sidebar inverted vertical menu visible ${collapsed ? 'collapsed' : ''}`}>
      <div className='CollapseContainer'>
        <button className='ui icon button Collapse' onClick={onCollapse}>
          {collapsed ? <i className='angle double right icon'></i> : <i className='angle double left icon'></i>}
        </button>
      </div>
      <div className='SidebarContent'>
        <div className="Header">
          <Logo
            interactive
            onClick={() => navigate('/')}
          />
        </div>
        <div className="Nav">
          <SidebarItem name='Dashboard' icon='chart bar' path='/' onClick={() => navigate('/')} />
          <SidebarItem name='Calendar' icon='calendar alternate' path='/calendar' onClick={() => navigate('/calendar')} />
          <SidebarItem name='Shifts' icon='clock' path='/shifts' onClick={() => navigate('/shifts')}>
            <ClockedInLabel clockedIn={clockedIn} contrast />
          </SidebarItem>
          <SidebarItem name='Orders' icon='dollar sign' path='/orders' onClick={() => navigate('/orders')} />
          <SidebarItem name='Recipes' icon='utensils' path='/recipes' onClick={() => navigate('/recipes')} />
          <SidebarItem name='Inventory' icon='box' path='/inventory' onClick={() => navigate('/inventory')} />
          <SidebarItem name='Menus & Ads' icon='bullhorn' path='/menus-ads' onClick={() => navigate('/menus-ads')} />
          <SidebarItem name='Employees' icon='address book' path='/employees' onClick={() => navigate('/employees')} />
          {isAdmin && (
            <div className='AdminRoutes'>
              <div className='Divider'></div>
              <SidebarItem name='Statistics' icon='chart line' path='/statistics' onClick={() => navigate('/statistics')} />
            </div>
          )}
        </div>
        <div className="Footer">
          <div className='Divider'></div>
          <SidebarItem name='Profile' icon='user circle' image={pfpUrl} path='/profile' onClick={() => navigate('/profile')} />
          <SidebarItem name='Log Out' icon='sign-out' onClick={handleLogout} />
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
