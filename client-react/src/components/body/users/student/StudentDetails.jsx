import React, { useEffect } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import UserForm from '../userForm';
import { useState } from 'react';
import { set } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setToken, setUser,setRole } from '../../../../redux/tokenSlice';

export default function StudentDetails() {
    const { token, role, user } = useSelector((state) => state.token);
    const [student, setStudent] = useState();
    const [studentDialog, setStudentDialog] = useState(false);
    const [editForm, setEditForm] = useState(false);
    const dispatch = useDispatch();

    const header = (
        <img alt="Card" src="https://primefaces.org/cdn/primereact/images/usercard.png" />
    );
    const showEditForm = () => {
        setStudent(user)
        setEditForm(true)

    };
    const footer = (
        <>
            <Button label="update" icon="pi pi-check" onClick={() => showEditForm()} />
        </>
    );

    const updateTheUser = async() => {

        try{
        const res = await axios.get(`http://localhost:1111/api/user/${user._id}`);
        console.log(res.data);
        
        dispatch(setUser(res.data));}
        catch{

        }
    };
   
    return (
        <div className="card flex justify-content-center">
            <Card title={user.fullname} footer={footer} header={header} className="md:w-25rem">
                <p className="m-0">
                    {/* <p>name: {user.fullname}</p> */}
                    <p>ID: {user.userId}</p>
                    <p>email: {user.email}</p>
                    <p>phone: {user.phone}</p>
                    <p>address: {user.address}</p>
                    <p>birthDate: {user.birthDate}</p>

                </p>
            </Card>
            {editForm ? <UserForm updateTheUser={updateTheUser}  setStudent={setStudent} student={student} setStudentDialog={setEditForm} studentDialog={editForm}></UserForm> : <></>}

        </div>
    )
}
