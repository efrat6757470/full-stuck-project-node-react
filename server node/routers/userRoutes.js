const express=require("express")
const router=express.Router()
const userConroller=require("../controllers/userController")
router.get("/",userConroller.getAllUsers)
router.get("/donor",userConroller.getAllDonors)

router.get("/student",userConroller.getAllStudents)

router.get("/:id",userConroller.getUserById)
router.put("/",userConroller.updateUser)
router.delete("/:id",userConroller.deleteUserById)
module.exports=router