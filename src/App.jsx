import { useState } from 'react';
import Home from './Pages/Home';
import StaffTable from './Components/StaffTable';
import UnitsTable from './Components/UnitsTable';
import EmailsTable from './Components/EmailsTable';
import ClientsTable from './Components/ClientsTable';
import { Routes, Route, BrowserRouter as Router} from 'react-router-dom';
import { Login } from './Pages/Login';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home/>}>
          <Route path="paginated-staff" element={<StaffTable />} />
          <Route path="paginated-units" element={<UnitsTable />} />
          <Route path="paginated-clients" element={<ClientsTable />} />
          <Route path="paginated-emails" element={<EmailsTable />} />
        </Route>
        <Route path='/login' element={<Login/>}/>
      </Routes>
    </Router>
  )
}

export default App
