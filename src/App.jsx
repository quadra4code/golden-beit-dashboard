import { useState } from 'react';
import Home from './Pages/Home';
import StaffTable from './Components/StaffTable';
import UnitsTable from './Components/UnitsTable';
import EmailsTable from './Components/EmailsTable';
import ClientsTable from './Components/ClientsTable';
import { Routes, Route, BrowserRouter as Router} from 'react-router-dom';
import { Login } from './Pages/Login';
import ArticlesTable from './Components/ArticlesTable';
import OrdersTable from './Components/OrdersTable';
import ConsultationsTable from './Components/ConsultationsTable';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home/>}>
          <Route path="paginated-staff" element={<StaffTable />} />
          <Route path="paginated-units" element={<UnitsTable />} />
          <Route path="paginated-articles" element={<ArticlesTable />} />
          <Route path="paginated-consultations" element={<ConsultationsTable />} />
          <Route path="paginated-orders" element={<OrdersTable />} />
          <Route path="paginated-clients" element={<ClientsTable />} />
          <Route path="paginated-emails" element={<EmailsTable />} />
        </Route>
        <Route path='/login' element={<Login/>}/>
      </Routes>
    </Router>
  )
}

export default App
