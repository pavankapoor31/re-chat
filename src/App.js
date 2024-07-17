import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Write from './components/write.js';
import SignIn from './pages/SignIn/SignIn.js';
import SignUp from './pages/SignUp/SignUp.js';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from './server/firebaseConfig.js';
import { ToastContainer } from 'react-toastify';
function App() {
    const [user] = useAuthState(auth);
  return (
    <div className="">
        <Router>
            <Routes>
                {
                    !user?  
                    <>
                        <Route path="/signup" element={<SignUp/>}/>
                        <Route path="/signin" element={<SignIn/>}/>
                    </> 
                    :
                    <>
                        
                        <Route path="/signup" element={<SignUp/>}/>
                        <Route path="/signin" element={<SignIn/>}/>
                        <Route path="/chats:id" element={<Write/>}/>
                    </>
                }
            </Routes>
        </Router>
        <ToastContainer autoClose={2000} />
    </div>
  );
}

export default App;
