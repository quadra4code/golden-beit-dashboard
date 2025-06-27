import { useState } from 'react';
import Home from './Pages/Home';
import StaffTable from './Components/StaffTable';
// import UnitsTable from './Components/UnitsTable';
import EmailsTable from './Components/EmailsTable';
import ClientsTable from './Components/ClientsTable';
import { Routes, Route, BrowserRouter as Router} from 'react-router-dom';
import { Login } from './Pages/Login';
import ArticlesTable from './Components/ArticlesTable';
import OrdersTable from './Components/OrdersTable';
import ConsultationsTable from './Components/ConsultationsTable';
import ProtectedRoute from './Components/ProtectedRoute';
import NewUnits from './Components/NewUnits';
import CurrentUnits from './Components/CurrentUnits';
import RejectedUnits from './Components/RejectedUnits';
import DeletedUnits from './Components/DeletedUnits';
import ReviewsTable from './Components/ReviewsTable';
import FeaturedUnits from './Components/FeaturedUnits';
import UnitTypesTable from './Components/UnitTypesTable';
import ProposalsTable from './Components/ProposalsTable';
import ProjectsTable from './Components/ProjectsTable';
import CitiesTable from './Components/CitiesTable';
import RegionsTable from './Components/RegionsTable';
import StatusTable from './Components/StatusTable';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<ProtectedRoute><Home/></ProtectedRoute>}>
          <Route path="paginated-staff" element={<StaffTable />} />
          {/* <Route path="paginated-units" element={<UnitsTable />} /> */}
          <Route path="paginated-new-units" element={<NewUnits />} />
          <Route path="paginated-current-units" element={<CurrentUnits />} />
          <Route path="paginated-featured-units" element={<FeaturedUnits />} />
          <Route path="paginated-rejected-units" element={<RejectedUnits />} />
          <Route path="paginated-deleted-units" element={<DeletedUnits />} />
          <Route path="paginated-articles" element={<ArticlesTable />} />
          <Route path="paginated-consultations" element={<ConsultationsTable />} />
          <Route path="paginated-reviews" element={<ReviewsTable />} />
          <Route path="paginated-orders" element={<OrdersTable />} />
          <Route path="paginated-clients" element={<ClientsTable />} />
          <Route path="paginated-emails" element={<EmailsTable />} />
          <Route path="all-unit-types" element={<UnitTypesTable />} />
          <Route path="all-proposals" element={<ProposalsTable />} />
          <Route path="all-projects" element={<ProjectsTable />} />
          <Route path="all-cities" element={<CitiesTable />} />
          <Route path="all-regions" element={<RegionsTable />} />
          <Route path="all-status" element={<StatusTable />} />
        </Route>
        <Route path='/login' element={<Login/>}/>
      </Routes>
    </Router>
  )
}

export default App
