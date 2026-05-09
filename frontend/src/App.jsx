import React from 'react'
import { Route, Routes } from 'react-router-dom'


import Navbar from './components/Navbar' 
import ChatbotSophie from './components/ChatbotSophie' 

import HomePage from './pages/UIPages/HomePage' 
import RegisterPage from './pages/UIPages/RegisterPage'
import LoginPage from './pages/UIPages/LoginPage'
import RoomDetailPage from './pages/UIPages/RoomDetailPage' 
import AllRoomsPage from './pages/UIPages/AllRoomsPage' 
import CheckoutPage from './pages/UIPages/CheckoutPage' 
import MyBookingsPage from './pages/UIPages/MyBookingsPage' 

import RoomManagement from './pages/admin/RoomManagement' 
import VoucherManagement from './pages/admin/VoucherManagement'
import EmployeeManagement from './pages/admin/EmployeeManagement'
import BookingManagement from './pages/admin/BookingManagement' 
import AccountManagement from './pages/admin/AccountManagement'
import HotelDashboard from './pages/admin/HotelDashboard' 

const App = () => {
  return (
    <>
      {}
      <Navbar />

      <Routes>
        {}
        <Route path='/' element={<HomePage />} />
        <Route path='/rooms' element={<AllRoomsPage />} />
        <Route path='/room/:id' element={<RoomDetailPage />} />
        <Route path='/register' element={<RegisterPage />} /> 
        <Route path='/login' element={<LoginPage />} />
        <Route path='/checkout/:bookingId' element={<CheckoutPage />} /> 
        <Route path='/my-bookings' element={<MyBookingsPage />} />

        {}
        {}
        <Route path='/admin/dashboard' element={<HotelDashboard />} />
        <Route path='/admin/rooms' element={<RoomManagement />} />
        <Route path='/admin/vouchers' element={<VoucherManagement />} />
        <Route path='/admin/customers' element={<CustomerManagement />} />
        <Route path='/admin/employees' element={<EmployeeManagement />} />
        <Route path='/admin/bookings' element={<BookingManagement />} />
        <Route path='/admin/accounts' element={<AccountManagement />} />
      </Routes>

      {}
      <ChatbotSophie />
    </>
  )
}

export default App