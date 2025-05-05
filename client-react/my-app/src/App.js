import logo from './logo.svg';
import './App.css';
import { Link, Route, Routes } from 'react-router-dom'

import Nav from './components/header/Nav';
import Students from './components/body/users/Students';

function App() {
  return (
    <div className="App">
      <Nav></Nav>
      <Routes>
        <Route path='/' element={<></>}/>
        <Route path='/students' element={<Students></Students>}/>
      </Routes>
    </div>
  );
}

export default App;
