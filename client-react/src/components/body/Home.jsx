import { setToken, setUser,setRole } from '../../redux/tokenSlice'
import { useDispatch, useSelector } from 'react-redux';
import NumberOfHoursBtn from './users/student/NumberOfHoursBtn';
import StudentDetails from './users/student/StudentDetails';
    const Home=()=>{
    const { token, role, user } = useSelector((state) => state.token);
    const dispatch = useDispatch();

    return(
        <>
         {role === "Admin" ?<></>: role === "Student" ?
         <>
         <StudentDetails></StudentDetails>
        </>: <></>}
        </>
    )
}
export default Home;