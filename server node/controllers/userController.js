const User = require("../models/User")
const bcrypt = require("bcrypt")
const mongoose = require("mongoose")
function isValidPhone(phone) {
    // טלפון ישראלי: מתחיל ב-0, 9 או 10 ספרות
    return /^0\d{1,2}-?\d{7}$|^0\d{9}$/.test(phone);
  }
  function isValidEmail(email) {
    // Regex פשוט לבדיקה בסיסית של אימייל
    return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
  }
  function isValidIsraeliID(id) 
  { id = String(id).trim(); if (id.length > 9 || id.length < 5 || isNaN(id)) 
    return false; id = id.padStart(9, '0'); 
    let sum = 0; for (let i = 0; i < 9; i++) 
        { let num = Number(id[i]) * ((i % 2) + 1); if (num > 9) num -= 9; sum += num; }
     return (sum % 10 === 0); }
  function isValidBirthdate(birthDate){
    const today = new Date();
     birthDate = new Date(birthDate);

    const age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    const isBirthdayPassed = m > 0 || (m === 0 && today.getDate() >= birthDate.getDate());
    const realAge = isBirthdayPassed ? age : age - 1;
    return realAge >= 17
  }
const getAllUsers = async (req, res) => {//vvvvvvvvvvv
    const users = await User.find({active:true}).lean()
    if (!users?.length) {
         res.json([])
        }

    res.json(users)
}
const getAllStudents = async (req, res) => {//vvvvvvvvvvv
    const students = await User.find({roles:"Student",active:true}).lean()
    if (!students?.length) {
        res.json([])    }
    res.json(students)
}
const getAllDonors = async (req, res) => {//vvvvvvvvvvvvvvvvvv
    const donors = await User.find({roles:"Donor"}).lean()
    
    res.json(donors)
}


const getUserById = async (req, res) => {//vvvvvvvvvvvvvvv
    const { id } = req.params
    
    const users = await User.findById({active:true}).lean()
    console.log(users);
    if (!users)
        return res.status(404).send("No users exists")
    if (!id)
        return res.status(400).send("Id is required")
    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).send("Not valid id")

    const user = await User.findById({_id:id}).lean()
    if (!user||user.active==false)
        return res.status(400).send("This user isn't exists")
    const userInfo = {
        _id: user._id, fullname: user.fullname,
        role:user.roles,
        phone: user.phone, address: user.address,
        email: user.email, birthDate: user.birthDate, active: user.active, userId: user.userId
    }
    res.json(userInfo)
}

const addUser=async (req,res)=>{
    const { userId, password, fullname, email, phone, city,buildingNumber,street, birthDate, active, roles } = req.body
    if (!userId || !password || !fullname || !roles) {
        return res.status(400).json({ message: 'userId, roles, password and fullname are required' })
    }
    const duplicate = await User.findOne({ userId }).lean()
    if (duplicate&&duplicate.active) {
        return res.status(409).json({ message: "Duplicate user id" })
    }
    if(!isValidIsraeliID(userId))
        return res.status(400).send("not valid id!!")

    if (roles !== 'Donor' && roles !== 'Admin' && roles !== 'Student')
        return res.status(400).send("roles must be User or Donor or Admin!!")
    const hashedPassword = await bcrypt.hash(password, 10)
    console.log(hashedPassword);
if(phone&&!isValidPhone(phone))
    return res.status(400).send("Not valid phone!!")

if(email&&!isValidEmail(email))
    return res.status(400).send("Not valid email!!")

if(birthDate&&!isValidBirthdate(birthDate))
    return res.status(400).send("Not valid birthDate!!")

if (isNaN(Number(buildingNumber))) {
    return res.status(400).json({ message: 'Building number must be a number.' });
}
const newNum=Number(buildingNumber)
    const userObject = { userId, password: hashedPassword, fullname, email, phone, address:{city,street,buildingNumber:newNum}, birthDate, active, roles }
    const user = await User.create(userObject)
    if (user) { // Created
        return res.status(201).json({
            message: `New user ${user.fullname} created`,
            user
        })
    } else {
        return res.status(400).json({ message: 'Invalid user received' })
    }
}

const updateUser = async (req, res) => {////vvvvvvvvvvvvv
    const { userId, password, fullname, email, phone, street, buildingNumber, city, birthDate, roles, id } = req.body
    if (!id)
        return res.status(400).send("Id is required")
    const users = await User.find().lean()
    if (!users?.length) {
        return res.status(404).json({ message: 'No users found' })
    }
    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).send("Not valid id")
    const user = await User.findOne({_id:id,active:true}).exec()

    if (!user)
        return res.status(400).send("user is not exists")
    if (userId&&isValidIsraeliID(userId)) {
        const existingUser = await User.findOne({ userId ,active:true});
       

        if (existingUser && user.userId!=userId) {
            return res.status(400).send("User with same userId already exists");
        }
        user.userId = userId
    }
    if (password)
        user.password = password
    if (fullname)
        user.fullname = fullname
    if (email&&isValidEmail(email))
        user.email = email
    if (phone&&isValidPhone(phone))
        user.phone = phone
    if (street)
        user.address.street = street
    if (city)
        user.address.city = city
    if (buildingNumber&&!isNaN(Number(buildingNumber))) {
        user.address.buildingNumber=Number(buildingNumber)
    }
        user.address.buildingNumber = buildingNumber
    if (birthDate&&isValidBirthdate(birthDate))
        user.birthDate = birthDate
    if (roles) {
        if (roles !== 'Donor' && roles !== 'Admin' && roles !== 'Student')
            return res.status(400).send("roles must be User or Donor or Admin!!")
        user.roles = roles

    }
    const upuser = await user.save()
    res.json(upuser)
}

const deleteUserById = async (req, res) => {//vvvvvvvvvvvvvvv
    const { id } = req.params
    if (!id)
        return res.status(400).send("Id is required")
    const users = await User.find().lean()
    if (!users?.length) {
        return res.status(404).json({ message: 'No users found' })
    }
    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).send("Not valid id")
    const user = await User.findById(id).exec()
    if (!user)
        return res.status(400).send("user is not exists")
    user.active=false
    const deletedUser=await user.save()
    res.send({deletedUser})
}

module.exports = { getAllUsers, getUserById, updateUser, deleteUserById,getAllDonors,getAllStudents,addUser }