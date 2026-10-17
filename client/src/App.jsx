import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Layout from './component/Layout';
import UserLayout from './component/UserLayout';
import AdminLayout from './component/AdminLayout';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';

// User Pages
import Dashboard from './pages/user/Dashboard';
import Profile from './pages/user/settings/Profile.jsx';
import WalletAddress from './pages/user/settings/WalletAddress.jsx';
import TransactionPassword from './pages/user/settings/TransactionPassword.jsx';
import Trade from './pages/user/Trade.jsx'; 
import Transaction from './pages/user/Transaction.jsx';
import Deposit from './pages/user/wallet/Deposit.jsx';
import Withdraw from './pages/user/wallet/Withdraw.jsx'
import NewTicket from './pages/user/helpdesk/NewTicket.jsx';
import MyTickets from './pages/user/helpdesk/MyTickets.jsx';


// admin pages
import AdminPannel from './pages/admin/AdminPannel';
import UserList from './pages/admin/users/UserList';
import BumperOffers from './pages/admin/users/BumperOffers.jsx';
import Documents from './pages/admin/users/Documents.jsx';
import TransactionList from './pages/admin/transactions/TransactionList.jsx';
import PendingTransactions from './pages/admin/transactions/PendingTransactions.jsx'; 
import IncomeHistory from './pages/admin/transactions/IncomeHistory.jsx';
import BannerList from './pages/admin/content/BannerList.jsx';
import AddBanner from './pages/admin/content/AddBanner.jsx';
import PopupList from './pages/admin/content/PopupList.jsx';
import AddPopup from './pages/admin/content/AddPopup.jsx';
import AdminTickets from "./pages/admin/AdminTickets.jsx";


function App() {
  return (
    <Router>
      <Toaster position="top-right" /> 
      
      <Routes>

        {/* 🟢 PUBLIC ROUTES */}
        <Route element={<Layout />}> 
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

{/* 🟢 USER ROUTES */}
        <Route path="/user" element={<UserLayout />}>
          
          <Route index element={<Dashboard />} />
          
          {/* Settings Routes */}
          <Route path="settings/profile" element={<Profile />} />
          <Route path="settings/wallet" element={<WalletAddress />} />
          <Route path="settings/transaction-password" element={<TransactionPassword />} />
          
          {/* Trade & Transaction */}
          <Route path="trade" element={<Trade />} />    
          <Route path="transaction" element={<Transaction />} />  

          {/* 🟢 FIXED: Shuru ka '/user' hata diya hai kyunki parent path='/user' pehle se hai */}
          <Route path="wallet/deposit" element={<Deposit />} />
          <Route path="wallet/withdraw" element={<Withdraw />} />
          <Route path="helpdesk/newticket" element={<NewTicket />} />
          <Route path="helpdesk/mytickets" element={<MyTickets />} />

        </Route>
        {/* 🟢 ADMIN ROUTES (Aapka theek tha) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminPannel />} />
          
          <Route path="users/list" element={<UserList />} />
          <Route path="users/offers" element={<BumperOffers />} />
          <Route path="users/documents" element={<Documents />} />
          
          <Route path="transactions" element={<Navigate to="/admin/transactions/list" />} />
          <Route path="transactions/list" element={<TransactionList />} />
          <Route path="transactions/pending" element={<PendingTransactions />} />
          <Route path="transactions/income" element={<IncomeHistory />} />

          <Route path="banners" element={<BannerList />} />
          <Route path="banners/add" element={<AddBanner />} />  

          <Route path="popups" element={<PopupList />} />
          <Route path="popups/add" element={<AddPopup />} />        
          
          <Route path='tickets' element={<AdminTickets/>}/>
        </Route>

      </Routes>
    </Router>
  );
}

export default App;