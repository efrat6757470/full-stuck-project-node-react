import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { classNames } from 'primereact/utils';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
const UserForm = ({ userDialog, setUserDialog, getUsers, user, setAdd, setUser, updateTheUser }) => {
    const [showMessage, setShowMessage] = useState(false);
    const [showMessageError, setShowMessageError] = useState(false);
    const { token, role } = useSelector((state) => state.token);

    const [formData, setFormData] = useState();
    const defaultValues = {
        id: user?._id,
        fullname: user?.fullname,
        phone: user?.phone,
        email: user?.email,
        city: user?.address?.city || "",
        street: user?.address?.street || "",
        buildingNumber: user?.address?.buildingNumber || "",
        roles: user?.roles || null,
        userId: user?.userId,
        birthDate: user?.birthDate ? new Date(user.birthDate) : null

        
    }
    const { control, formState: { errors }, handleSubmit, reset } = useForm({ defaultValues });

    const onSubmit = async (data) => {
        console.log(data);
        if (user?._id) {
            try{
            const res = await axios.put("http://localhost:1111/api/user",
                data,
                { headers: { Authorization: `Bearer ${token}` } })}
                catch (err) {
                    console.error(err);
                }

        }
        else {
            if (!data.roles) {
                data.roles = "Donor"
            }
            try{
                const res = await axios.post("http://localhost:1111/api/user",
                    data,
                    { headers: { Authorization: `Bearer ${token}` } }
                )}
                catch (err) {
                    console.error(err);
                }
            

        }
        hideDialog()
        if (updateTheUser)
            updateTheUser()
        if (getUsers)
            getUsers()
    }
   const isValidIsraeliID=(id) =>{ id = String(id).trim(); if (id.length > 9 || id.length < 5 || isNaN(id)) 
        return false; id = id.padStart(9, '0'); let sum = 0; 
        for (let i = 0; i < 9; i++) { let num = Number(id[i]) * ((i % 2) + 1); if (num > 9) num -= 9; sum += num; } 
        return (sum % 10 === 0); }
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
        if (user) {
            setUser(false)
        }
        else {
            if (setAdd)
                setAdd(false)
        }
        setUserDialog(false);
    }
    const roleOptions = [
        { label: 'Donor', value: 'Donor' },
        { label: 'Student', value: 'Student' },
    ];
    useEffect(() => {
    }, [])
    // footer={userDialogFooter}
    return (
        <>
            <Dialog visible={userDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="User Details" modal className="p-fluid" onHide={() => { hideDialog() }}>
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
                            <span className="p-float-label">
                                <Controller name="userId" control={control} 
                                rules={{ 
                                    required: 'userId is required.',
                                    validate: value =>
                                        isValidIsraeliID(value) || 'תעודת זהות לא תקינה' }} 
                                    
                                    render={({ field, fieldState }) => (
                                    <InputText id={field.userId} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                                <label htmlFor="userId" className={classNames({ 'p-error': errors.name })}>userId*</label>
                            </span>
                            {getFormErrorMessage('userId')}
                        </div>
                        <div className="field">
                            <span className="p-float-label p-input-icon-right">
                                {/* <i className="pi pi-envelope" /> */}
                                <Controller name="email" control={control}
                               rules={{
                                pattern: {
                                  value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                                  message: "כתובת אימייל לא תקינה"
                                }
                              }}
                                    render={({ field, fieldState }) => (
                                        <InputText id={field.email} {...field} className={classNames({ 'p-invalid': fieldState.invalid })} />
                                    )} />
                                <label htmlFor="email" className={classNames({ 'p-error': !!errors.email })}>Email*</label>
                            </span>
                            {getFormErrorMessage('email')}
                        </div>
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="phone" control={control} 
                                 rules={{
                                  
                                    pattern: {
                                      value: /^0\d{1,2}-?\d{7}$/,
                                      message: "מספר טלפון לא תקין"
                                    }
                                  }}
                                render={({ field, fieldState }) => (
                                    <InputText id={field.phone} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} defaultValue={user?.phone} />
                                )} />
                                <label htmlFor="phone" className={classNames({ 'p-error': errors.name })}>Phone</label>
                            </span>{getFormErrorMessage('phone')}
                        </div>
                        <div className="field">
                            <span className="p-float-label">
                                <Controller
                                    name="birthDate"
                                    control={control}
                                    rules={{
                                      validate: value => {
                                        if (!value) return true; // מרשה להשאיר ריק
                                        const today = new Date();
                                        const birthDate = new Date(value);
                                        const age = today.getFullYear() - birthDate.getFullYear();
                                        const m = today.getMonth() - birthDate.getMonth();
                                        const isBirthdayPassed = m > 0 || (m === 0 && today.getDate() >= birthDate.getDate());
                                        const realAge = isBirthdayPassed ? age : age - 1;
                                        return realAge >= 17 || "הגיל חייב להיות לפחות 17";
                                      }
                                    }}
                                    render={({ field, fieldState }) => (
                                        <Calendar
                                            id={field.birthDate}
                                            value={field.value}
                                            onChange={(e) => field.onChange(e.value)}
                                            dateFormat="dd/mm/yy" // אפשר לשנות לפורמט אחר
                                            className={classNames({ 'p-invalid': fieldState.invalid })}
                                            showIcon // מציג אייקון של לוח שנה
                                        />
                                    )}
                                />
                                <label htmlFor="birthDate" className={classNames({ 'p-error': errors.birthDate })}>
                                    Birth Date
                                </label>
                            </span>{getFormErrorMessage('birthdate')}
                        </div>

                        <div>address:</div>
                        <br></br>
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="city" control={control} render={({ field, fieldState }) => (
                                    <InputText id={field.city} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                                <label htmlFor="city" className={classNames({ 'p-error': errors.name })}>City</label>
                            </span>
                        </div>
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="street" control={control} render={({ field, fieldState }) => (
                                    <InputText id={field.street} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                                <label htmlFor="street" className={classNames({ 'p-error': errors.name })}>Street</label>
                            </span>
                        </div>
                       
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="buildingNumber" control={control}
                                 rules={{
                                     pattern: {
                                         value: /^[0-9]+$/,
                                         message: 'Building number must be a number'
                                     }
                                 }} render={({ field, fieldState }) => (
                                    <InputText  id={field.buildingNumber} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                                <label htmlFor="buildingNumber" className={classNames({ 'p-error': errors.name })}>Building Number</label>
                            </span>

                        </div>
                        {role === "Admin" && defaultValues.roles!=="Admin" &&<div className="field">
                            <span className="p-float-label">
                                <Controller name="roles" control={control} render={({ field, fieldState }) => (
                                    <Dropdown id={field.roles} required {...field} options={roleOptions} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })}
                                    />
                                )} />
                                <label htmlFor="roles" className={classNames({ 'p-error': errors.name })}>Role*</label>
                            </span></div>}
                        <Button type="submit" label="Submit" className="mt-2" />
                    </form>

                </div>
            </Dialog>
        </>
    )
}
export default UserForm;





