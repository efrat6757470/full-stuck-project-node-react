const express=require("express")
const router=express.Router()
const msdController=require("../controllers/monthlyScholarshipDetailsController")

router.post("/",msdController.addMonthlyScholarshipDetails)
router.get("/",msdController.getAllMonthlyScholarshipDetails)
router.get("/:id",msdController.getMonthlyScholarshipDetailsById)
router.put("/",msdController.updateMonthlyScholarshipDetails)
router.delete("/:id",msdController.deleteMonthlyScholarshipDetails)

module.exports=router