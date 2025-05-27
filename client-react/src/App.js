import logo from './logo.svg';
import './App.css';
import { Link, Route, Routes } from 'react-router-dom'

import Nav from './components/header/Nav';
import Students from './components/body/users/Students';
import Login from './components/features/auth/login';
import LogOut from './components/features/auth/logOut';
import { useDispatch, useSelector } from 'react-redux';
import Contributions from './components/body/contributions/ShowContributions';
import StudentNav from './components/header/StudentNav';
import Home from './components/body/Home';
import ShowMSDetails from './components/body/msDetails/ShowMSDetails';
import StudentDetails from './components/body/users/student/StudentDetails';
import EnterNumberOfHours from './components/body/users/student/EnterNumberOfHours';
import NumberOfHoursBtn from './components/body/users/student/NumberOfHoursBtn';
import CRStatus from './components/body/crStatus/CRStatus'
import StudentScholarships from './components/body/studentScholarship/StudentScholarships';
import ScholarshipForStudent from './components/body/users/student/ScholarshipForStudent';
import ShowContributions from './components/body/contributions/ShowContributions'
import Users from './components/body/users/Users';
import DonorNav from './components/header/DonorNav';
import CreateContribution from './components/body/contributions/CreateContribution';
import ShowContributionAccToDonor from './components/body/contributions/ShowContributionAccToDonor';
function App() {
  const { token, role, user } = useSelector((state) => state.token);

  return (
    <div className="App">
      {role == "Admin" ? <Nav></Nav> : role == "Student" ? <StudentNav></StudentNav> : role==="Donor"? <DonorNav></DonorNav>:<></>}
      {role == "Admin" ? 
      <Routes>

        <Route path='/' element={<Login></Login>} /> 
         <Route path='/login' element={<Login></Login>} />
        <Route path='/logOut' element={<LogOut></LogOut>} />
        {/* <Route path='/students' element={<Students></Students>} /> */}
        <Route path='/studentDetails' element={<StudentDetails></StudentDetails>} />
        <Route path='/enterNumberOfHours' element={<EnterNumberOfHours></EnterNumberOfHours>} />
        {/* <Route path='/contribution' element={<Contributions></Contributions>} /> */}
        <Route path='/home' element={<Home></Home>}/>
        <Route path='/showMSDetails' element={<ShowMSDetails></ShowMSDetails>}/>
        <Route path='/cRStatus' element={<CRStatus></CRStatus>}/>
        <Route path='/studentScholarships' element={<StudentScholarships></StudentScholarships>}/>
        <Route path='/contribution' element={<ShowContributions></ShowContributions>}/>
        <Route path='/users' element={<Users></Users>}/>


      </Routes>
      :role == "Student" ?
      <Routes>
        <Route path='/' element={<Login></Login>} /> 
        <Route path='/home' element={<Home></Home>}/>
        <Route path='/enterNumberOfHours' element={<EnterNumberOfHours></EnterNumberOfHours>} />
        <Route path='/numberOfHoursBtn' element={<NumberOfHoursBtn></NumberOfHoursBtn>} />
        <Route path='/scholarshipForStudent' element={<ScholarshipForStudent></ScholarshipForStudent>} />

         <Route path='/login' element={<Login></Login>} />
        <Route path='/logOut' element={<LogOut></LogOut>} />
        <Route path='/studentDetails' element={<StudentDetails></StudentDetails>} />
      </Routes>
      :role == "Donor" ?
      <Routes>
        
      <Route path='/' element={<Login></Login>} /> 
      <Route path='/home' element={<Home></Home>}/>

         <Route path='/login' element={<Login></Login>} />
        <Route path='/logOut' element={<LogOut></LogOut>} />
      <Route path='/contribution' element={<Contributions></Contributions>} />
      <Route path="/addContribution" element={<CreateContribution />} />
      <Route path='/donorContribution' element={<ShowContributionAccToDonor />} />

      </Routes>
      :
      <Routes>
      <Route path='/' element={<Login></Login>} /> 
      <Route path='/login' element={<Login></Login>} />
     <Route path='/logOut' element={<LogOut></LogOut>} />
   </Routes>}

    </div>
  );
}

export default App;
