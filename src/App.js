import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { useAuthState } from "react-firebase-hooks/auth";
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import MessageWrapper from './pages/MessageWrapper/MessageWrapper.js';
import SignIn from './pages/SignIn/SignIn.js';
import Register from './pages/Register/Register.js';
import Welcome from './pages/Welcome/Welcome.js';
import Navbar from './components/Navbar/Navbar.js';
function App() {
    return (
        <div className="App">
            <Navbar />
            <Router>
                <Routes>
                    {
                        //We can add conditional routes here. 
                        <>
                            <Route path="/" element={<Welcome />} />
                            <Route path="/signup" element={<Register />} />
                            <Route path="/signin" element={<SignIn />} />
                            <Route path="/welcome" element={<Welcome />} />
                            <Route path="/chat/:id" element={<MessageWrapper />} />
                        </>
                    }
                </Routes>
            </Router>
            <ToastContainer autoClose={2000} />
        </div>
    );
}

export default App;
