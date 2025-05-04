import { Menubar } from 'primereact/menubar';
import { useNavigate } from 'react-router-dom';
const Nav=()=>{
    const navigate=useNavigate()
    const items = [
        {
            label: 'Home',
            icon: 'pi pi-home',
            command: () => {
                navigate('./home')
            }
        },
        {
            label: 'posts',
            icon: 'pi pi-bars',
            command: () => {
                navigate('./posts')
            }
        },
        {
            label: 'toDos',
            icon: 'pi pi-check',
            command: () => {
                navigate('./todos')
            }
        },
        {
            label: 'Users',
            icon: 'pi pi-user',
            command: () => {
                navigate('./users')
            }
        }]
    return(
        <>
         <Menubar  model={items} />
        </>
    )
}

export default Nav