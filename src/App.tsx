import './App.scss';
import Dashboard from './components/Dashboard/Dashboard';
import Login from './components/Login/Login';
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import NotFound from './components/NotFound/NotFound';
import ShiftManager from './components/ShiftManager/ShiftManager';
import OrderCalculator from './components/OrderCalculator/OrderCalculator';
import Inventory from './components/Inventory/Inventory';
import Recipes from './components/Recipes/Recipes';
import Profile from './components/Profile/Profile';
import PageLayout from './components/PageLayout/PageLayout';
import Employees from './components/Employees/Employees';
import Statistics from './components/Statistics/Statistics';
import MenusAndAds from './components/MenusAndAds/MenusAndAds';
import EventCalendar from './components/Calendar/Calendar';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/notfound' element={<NotFound />} />
          <Route element={<ProtectedRoute><PageLayout /></ProtectedRoute>}>
            <Route index element={<Dashboard />}></Route>
            <Route path='/shifts' element={<ShiftManager />} />
            <Route path='/orders' element={<OrderCalculator />} />
            <Route path='/inventory' element={<Inventory />} />
            <Route path='/recipes' element={<Recipes />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/menus-ads' element={<MenusAndAds />} />
            <Route path='/calendar' element={<EventCalendar />} />
            <Route path='/employees' element={<Employees />} />
            <Route element={<AdminRoute />}>
              <Route path='/statistics' element={<Statistics />} />
            </Route>
          </Route>
          <Route path='*' element={<Navigate to='/notfound' />} />
        </Routes>
      </Router>
    </div>
  );
}

//@ts-ignore
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return !!user ? children : <Navigate to="/login" replace />;
};

//@ts-ignore
function AdminRoute() {
  const { isAdmin } = useAuth();
  return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
};

export default App;
