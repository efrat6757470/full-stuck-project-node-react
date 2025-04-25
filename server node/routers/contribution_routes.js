const express=require("express")
const router=express.router()
const contributionController=require("../controllers/contribution_controller")
router.post("/",contributionController.addContrbution)
router.get("/",contributionController.getAllContrbutions)
router.get(":id",contributionController.getContrbutionById)
router.put("/",contributionController.updateContribution)
router.delete("/",contributionController.deleteContribution)

module.exports=router