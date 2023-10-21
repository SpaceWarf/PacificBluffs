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

  function handleMouseEnterLogo() {
    const titleEl = document.getElementsByClassName('ui header Title')[0];
    titleEl.classList.add('hovered');
  }

  function handleMouseLeaveLogo() {
    const titleEl = document.getElementsByClassName('ui header Title')[0];
    titleEl.classList.remove('hovered');
  }

  return (
    <div className={`ui sidebar inverted vertical menu visible ${collapsed ? 'collapsed' : ''}`}>
      <div className="Header">
        <Logo
          interactive
          onClick={() => navigate('/')}
          onMouseEnter={handleMouseEnterLogo}
          onMouseLeave={handleMouseLeaveLogo}
        />
        <h4
          className='ui header contrast Title'
          onClick={() => navigate('/')}
        >
          Pacific Bluffs
        </h4>
      </div>
      <div className="Nav">
        <SidebarItem name='Dashboard' icon='chart bar' path='/' onClick={() => navigate('/')} />
        <SidebarItem name='Shifts' icon='clock' path='/shifts' onClick={() => navigate('/shifts')}>
          <ClockedInLabel clockedIn={clockedIn} contrast />
        </SidebarItem>
        <SidebarItem name='Orders' icon='dollar sign' path='/orders' onClick={() => navigate('/orders')} />
        <SidebarItem name='Recipes' icon='utensils' path='/recipes' onClick={() => navigate('/recipes')} />
        <SidebarItem name='Inventory' icon='box' path='/inventory' onClick={() => navigate('/inventory')} />
        <SidebarItem name='Menus & Ads' icon='bullhorn' path='/menus-ads' onClick={() => navigate('/menus-ads')} />
        {isAdmin && (
          <div className='AdminRoutes'>
            <div className='Divider'></div>
            <SidebarItem name='Employees' icon='address book' path='/employees' onClick={() => navigate('/employees')} />
            {/* <SidebarItem name='Statistics' icon='chart line' path='/statistics' onClick={() => navigate('/statistics')} /> */}
          </div>
        )}
      </div>
      <div className="Footer">
        <div className='Divider'></div>
        <SidebarItem name='Profile' icon='user circle' image={pfpUrl} path='/profile' onClick={() => navigate('/profile')} />
        <SidebarItem name='Log Out' icon='sign-out' onClick={handleLogout} />
      </div>
      <button className='ui icon button Collapse' onClick={onCollapse}>
        {collapsed ? <i className='angle double right icon'></i> : <i className='angle double left icon'></i>}
      </button>
    </div>
  );
}

export default Sidebar;
