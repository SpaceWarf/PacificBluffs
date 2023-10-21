import './PageLayout.scss';
import Sidebar from '../Common/Sidebar';
import { Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Loading from '../Common/Loading';
import { useAuth } from '../../contexts/AuthContext';
import * as FirestoreService from '../../services/firestore';

function PageLayout() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsub = FirestoreService.loadingSubject.subscribe(isLoading => {
      setIsLoading(isLoading);
    });
    FirestoreService.loadData(user?.uid || '', dispatch);
    return () => { unsub.unsubscribe(); };
  }, [user, dispatch]);

  return (
    <div className="PageLayout">
      <Sidebar onCollapse={() => setCollapsed(!collapsed)} collapsed={collapsed} />
      <div className={`PageContent ${collapsed ? 'collapsed' : ''}`}>
        {isLoading ? <Loading/> : <Outlet />}
      </div>
    </div>
  );
}


export default PageLayout;
