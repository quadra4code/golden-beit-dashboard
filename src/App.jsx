import { useState } from 'react';
import Home from './Pages/Home';
import StaffTable from './Components/StaffTable';
import { Routes, Route, BrowserRouter as Router} from 'react-router-dom';
import { Login } from './Pages/Login';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home/>}>
          <Route path="paginated-staff" element={<StaffTable />} />
          {/* <Route path="paginated-clients" element={<Reports />} />
          <Route path="paginated-emails" element={<Settings />} /> */}
        </Route>
        <Route path='/login' element={<Login/>}/>
      </Routes>
    </Router>
  )
}

export default App
