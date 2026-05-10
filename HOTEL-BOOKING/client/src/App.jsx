import React from 'react';
import { Route, useLocation, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';


import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HotelReg from './components/HotelReg';


import Home from './pages/Home';
import AllRooms from './pages/AllRooms';
import RoomDetails from './pages/RoomDetails';
import MyBookings from './pages/MyBookings';
import OffersPage from './pages/OffersPage';
import OfferDetail from './pages/OfferDetail';
import AboutTLStay from './pages/AboutTLStay';
import CustomerService from './pages/CustomerService';

import Layout from './pages/hotelOwner/Layout';
import Dashboard from './pages/hotelOwner/Dashboard';
import AddRoom from './pages/hotelOwner/AddRoom';
import ListRoom from './pages/hotelOwner/ListRoom';
import AddOffer from "./pages/hotelOwner/AddOffer";
import ListOffer from "./pages/hotelOwner/ListOffer";
import EditOffer from "./pages/hotelOwner/EditOffer";


import { useAppContext } from './context/AppContext';

const App = () => {
  const isOwnerPath = useLocation().pathname.includes("owner");
  const { showHotelReg } = useAppContext();

  return (
    <div>
      <Toaster />
      {}
      {!isOwnerPath && <Navbar />}
      
      {}
      {showHotelReg && <HotelReg />}
      
      <div className='min-h-[70vh]'>
        <Routes>
          {}
          <Route path='/' element={<Home />} />
          <Route path='/rooms' element={<AllRooms />} />
          <Route path='/rooms/:id' element={<RoomDetails />} />
          <Route path='/my-bookings' element={<MyBookings />} />
          <Route path='/offers' element={<OffersPage />} />
          <Route path='/offer/:id' element={<OfferDetail />} />
          <Route path='/about' element={<AboutTLStay />} />
          <Route path='/customer-service' element={<CustomerService />} />

          {}
          <Route path='/owner' element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path='add-room' element={<AddRoom />} />
            <Route path='list-room' element={<ListRoom />} />
            <Route path="add-offer" element={<AddOffer />} />
            <Route path="offers" element={<ListOffer />} />
            {}
            <Route path="edit-offer/:id" element={<EditOffer />} />
          </Route>
        </Routes>
      </div>
      
      <Footer />
    </div>
  );
};

export default App;
