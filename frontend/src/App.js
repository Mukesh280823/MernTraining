import React, { useState } from 'react';
import { BrowserRouter as Router, Route,  Routes } from 'react-router-dom';
import Login from './Login';
import RegistrationForm from './RegisterForm';
import Userdashboard from './Component/Userdashboard';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div>
      <nav>
      </nav>
      <Routes>sss
        <Route path='/userdashboard' element={<Userdashboard />} />
        <Route path='/' element={<RegistrationForm />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        {/* <Route path="update/:id" element={<UpdateData />} /> */}
        {/* <Route path='/Add' element={<AddUser />} /> */}
      </Routes>
    </div>
  );
}

export default App;
