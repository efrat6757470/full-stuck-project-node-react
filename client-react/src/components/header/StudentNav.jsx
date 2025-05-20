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
        },
        {
            label: 'EnterNumberOfHours',
            icon: 'pi pi-user',
            command: () => {
                navigate('./enterNumberOfHours')
            }
        },
        {
            label: 'NumberOfHoursBtn',
            icon: 'pi pi-user',
            command: () => {
                navigate('./numberOfHoursBtn')
            }
        },
        {
            label: 'Home',
            icon: 'pi pi-user',
            command: () => {
                navigate('./home')
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