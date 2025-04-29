const express=require("express")
const router=express.Router()
const userConroller=require("../controllers/userController")
router.get("/",userConroller.getAllUsers)
router.get("/:id",userConroller.getUserById)
router.put("/",userConroller.updateUser)
router.delete("/:id",userConroller.deleteUserById)
module.exports=router