import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Write from './components/write';
function App() {
  return (
    <div className="">
        <Router>
            <Routes>
                <Route path="/" element={<Write/>}/>
                <Route path="/home" element={<Write/>}/>
            </Routes>
        </Router>
    </div>
  );
}

export default App;
