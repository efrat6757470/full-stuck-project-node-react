import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import { Calendar } from 'primereact/calendar';
import axios from 'axios';
import { Button } from 'primereact/button';
import 'primeicons/primeicons.css';
import { useSelector } from 'react-redux';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { useRef } from 'react';
//import { emit } from '../../../../../server node/models/User';
import { Toolbar } from 'primereact/toolbar';
import { useForm, Controller } from 'react-hook-form';
import UserForm from './userForm';

export default function Students() {
   
    const [students, setStudents] = useState([]);
    const [student, setStudent] = useState();
    const [add, setAdd] = useState(false);

    const [studentDialog, setStudentDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [deleteStudentDialog, setDeleteStudentDialog] = useState(false);
    const [selectedStudents, setselectedStudents] = useState(null);
    const [isUpdate, setIsUpdate] = useState(false)
    const [roles] = useState(['Student', 'Donor', 'Admin']);
    const { token, role } = useSelector((state) => state.token);
    const toast = useRef(null);
    const dt = useRef(null);
    let defaultValues = {
        id:null ,
        fullname:  student?.fullname,
        phone: null,
        email: '',
        address: null,
        birthDate: '',
        roles: '',
        userId: ''
    };

    const getStudents = async () => {
        const res = await axios.get("http://localhost:1111/api/user/student",
            { headers: { Authorization: `Bearer ${token}` } }
        )
        setStudents(res.data)
    }
    useEffect(() => {
        getStudents();
    }, []);
  


    const onRowEditComplete = (e) => {
        let _students = [...students];
        let { newData, index } = e;

        _students[index] = newData;

        setStudents(_students);
    };






    const dateEditor = (options) => {
        //const [date, setDate] = useState(options.value);
        console.log(options.value);
        // const dateValue = options.value ? new Date(options.value) : null;

        return (<div className="card flex justify-content-center">//
            <Calendar value={options.value}  //dateFormat="dd/mm/yy" 
                onChange={(e) => options.editorCallback(e.value.toLocaleDateString())} />
        </div>
            //<InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
        )
    };
    const textEditor = (options) => {
        return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
    };


    const roleEditor = (options) => {
        return (
            <Dropdown
                value={options.value}
                options={roles}
                onChange={(e) => options.editorCallback(e.value)}
                placeholder="Select a Role"
                itemTemplate={(option) => {
                    return <Tag value={option}
                    ></Tag>;
                }}
            />
        );
    };

    const roleBodyTemplate = (rowData) => {
        return <Tag value={rowData.roles} ></Tag>;
    };



    // פונקציית מחיקה
    const handleDelete = async (rowData) => {
        if (window.confirm(`Are you sure you want to delete ${rowData.fullname}?`)) {
            const res = await axios.delete(`http://localhost:1111/api/user/${rowData._id}`)
            console.log(res);
            getStudents();
        }
        // עדכון ה-state
    };

    // // תבנית כפתור מחיקה
    // const deleteButtonTemplate = (rowData) => {
    //     return (
    //         <Button
    //             icon="pi pi-trash"
    //             className="p-button-danger"
    //             onClick={() => handleDelete(rowData)}
    //         />
    //     );
    // };
    const editStudent = (student) => {
        console.log("hhhh",student);
        
        setStudentDialog(true);
    };
    const hideDialog = () => {
        setSubmitted(false);
        setStudentDialog(false);
    };
    const confirmDeleteStudent = (student) => {
        setStudent(student);
        setDeleteStudentDialog(true);
    };
    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() =>{setStudent(rowData ); editStudent(rowData)}} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteStudent(rowData)} />
            </React.Fragment>
        );
    };
    const hideDeleteStudentsDialog = () => {
        setDeleteStudentDialog(false);
    };
    const findIndexById = (id) => {
        let index = -1;

        for (let i = 0; i < students.length; i++) {
            if (students[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };
    // const saveStudent = () => {
    //     setSubmitted(true);
    //     console.log("student", student);
    //     if (student.fullname.trim()) {
    //         let _students = [...students];
    //         let _student = { ...student };
    //         console.log(student);
    //         // if (student.id) {
    //         //     const index = findIndexById(student.id);

    //         // _students[index] = _student;
    //         toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Student Updated', life: 3000 });
    //     } else {
    //         // _student.id = createId();
    //         // _students.push(_student);
    //         toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Student Created', life: 3000 });
    //     }

    //     setStudents(_students);
    //     setStudentDialog(false);
    //     setStudent(emptyStudent);
    // }

    
    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _student = { ...student };

        _student[`${name}`] = val;

        setStudent(_student);
    };
    const openNew = (rowdata) => {
// console.log(rowdata.value);
    //    setStudent(null);
    setAdd(true)
        setSubmitted(false);
        setStudentDialog(true);
    };
    const exportCSV = () => {
        dt.current.exportCSV();
    };
    const confirmDeleteSelected = () => {
        setDeleteStudentDialog(true);
    };
    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
                <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedStudents || !selectedStudents.length} />
            </div>
        );
    };
   
    const rightToolbarTemplate = () => {
        return <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
    };
    return (
        <div className="card p-fluid">
            <Toast ref={toast} />

            <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

            <DataTable ref={dt} value={students} editMode="row" dataKey="id" onRowEditComplete={onRowEditComplete} tableStyle={{ minWidth: '50rem' }}>
                <Column field="userId" header="ID" style={{ width: '10%' }}></Column>
                <Column field="fullname" header="Fullname" style={{ width: '10%' }}></Column>
                <Column field="email" header="Email" style={{ width: '10%' }}></Column>
                <Column field="phone" header="Phone" style={{ width: '10%' }}></Column>
                <Column field="address" header="Address" style={{ width: '10%' }}></Column>
                <Column field="birthDate" header="BirthDate" style={{ width: '30%' }}></Column>
                <Column field="roles" header="Role" body={roleBodyTemplate} style={{ width: '10%' }}></Column>
                <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>

            </DataTable>
{student ?<UserForm setStudent={setStudent}  student={student} setStudentDialog={setStudentDialog} getStudents={getStudents} studentDialog={studentDialog}></UserForm>:<></>}
{add ?<UserForm   setStudentDialog={setStudentDialog} getStudents={getStudents} studentDialog={studentDialog} setAdd={setAdd}></UserForm>:<></>}

        </div>
    );
}