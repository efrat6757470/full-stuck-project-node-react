import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { classNames } from 'primereact/utils';
import axios from 'axios';
import { useSelector } from 'react-redux';

const UserForm = ({ studentDialog, setStudentDialog, getStudents, student, setAdd, setStudent, updateTheUser }) => {
    const [showMessage, setShowMessage] = useState(false);
    const [showMessageError, setShowMessageError] = useState(false);
    const { token, role } = useSelector((state) => state.token);

    const [formData, setFormData] = useState();
    const defaultValues = {
        id: student?._id,
        fullname: student?.fullname,
        phone: student?.phone,
        email: student?.email,
        address: student?.address,
        birthDate: student?.birthDate,
        roles: student?.roles,
        userId: student?.userId
    }
    const { control, formState: { errors }, handleSubmit, reset } = useForm({ defaultValues });

    const onSubmit = async (data) => {
        //console.log(student);
        data = { ...data, roles: "Student" }
        if (student) {
            //console.log(data);
            const res = await axios.put("http://localhost:1111/api/user",
                data,
                { headers: { Authorization: `Bearer ${token}` } }
            )

        }
        else {
            //console.log(data);
            const res = await axios.post("http://localhost:1111/api/user",
                data,
                { headers: { Authorization: `Bearer ${token}` } }

            )
        }
        hideDialog()
        if (updateTheUser)
            updateTheUser()
        if (getStudents)
            getStudents()

    }
    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };
    const studentDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={() => { hideDialog() }} />
            {/* <Button label="Save" icon="pi pi-check" onClick={save } /> */}
        </React.Fragment>
    );

    const hideDialog = () => {
        if (student) {
            setStudent(false)
        }
        else {
            if (setAdd)
                setAdd(false)
        }
        setStudentDialog(false);
    }
    useEffect(() => {
        console.log(student);
    }, [])
    return (
        <>
            <Dialog visible={studentDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="student Details" modal className="p-fluid" footer={studentDialogFooter} onHide={() => { hideDialog() }}>
                <div className="field">

                    <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="fullname" control={control} rules={{ required: 'FullName is required.' }} render={({ field, fieldState }) => (
                                    <InputText id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                                <label htmlFor="fullname" className={classNames({ 'p-error': errors.name })}>FullName*</label>
                            </span>
                            {getFormErrorMessage('fullname')}
                        </div>
                        {setAdd && <div className="field">
                            <span className="p-float-label">
                                <Controller name="password" control={control} rules={{ required: 'Password is required.' }} render={({ field, fieldState }) => (
                                    <InputText id={field.password} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                                <label htmlFor="password" className={classNames({ 'p-error': errors.name })}>Password*</label>
                            </span>
                            {getFormErrorMessage('password')}
                        </div>}
                        <div className="field">
                            <span className="p-float-label p-input-icon-right">
                                {/* <i className="pi pi-envelope" /> */}
                                <Controller name="email" control={control}
                                    render={({ field, fieldState }) => (
                                        <InputText id={field.email} {...field} className={classNames({ 'p-invalid': fieldState.invalid })} />
                                    )} />
                                <label htmlFor="email" className={classNames({ 'p-error': !!errors.email })}>Email*</label>
                            </span>
                            {getFormErrorMessage('email')}
                        </div>
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="userId" control={control} rules={{ required: 'userId is required.' }} render={({ field, fieldState }) => (
                                    <InputText id={field.userId} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                                <label htmlFor="userId" className={classNames({ 'p-error': errors.name })}>userId*</label>
                            </span>
                            {getFormErrorMessage('username')}
                        </div>
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="phone" control={control} render={({ field, fieldState }) => (
                                    <InputText id={field.phone} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} defaultValue={student?.phone} />
                                )} />
                                <label htmlFor="phone" className={classNames({ 'p-error': errors.name })}>Phone</label>
                            </span>
                        </div>
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="address" control={control} render={({ field, fieldState }) => (
                                    <InputText id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                                <label htmlFor="address" className={classNames({ 'p-error': errors.name })}>Address</label>
                            </span>

                        </div>
                        <Button type="submit" label="Submit" className="mt-2" />
                    </form>




                </div>
            </Dialog>
        </>
    )
}
export default UserForm;