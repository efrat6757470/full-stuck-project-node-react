import { Menubar } from 'primereact/menubar';
import { useNavigate } from 'react-router-dom';
const StudentNav=()=>{
    const navigate=useNavigate()
    const items = [
       
        {
            label: 'LogOut',
            icon: 'pi pi-bars',
            command: () => {
                navigate('./logOut')
            }
        },
        
        {
            label: 'StudentDSetails',
            icon: 'pi pi-user',
            command: () => {
                navigate('./studentDetails')
            }
        }
        
        ]
    return(
        <>
         <Menubar  model={items} />
        </>
    )
}

export default StudentNav