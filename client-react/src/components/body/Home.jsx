import { setToken, setUser,setRole } from '../../redux/tokenSlice'
import { useDispatch, useSelector } from 'react-redux';
import NumberOfHoursBtn from './users/student/NumberOfHoursBtn';

const Home=()=>{
    const { token, role, user } = useSelector((state) => state.token);
    const dispatch = useDispatch();

    return(
        <>
         {role === "Admin" ?<></>: role === "Student" ?<NumberOfHoursBtn></NumberOfHoursBtn>: <></>}
        </>
    )
}
export default Home;