const express=require("express")
const router=express.Router()
const verifyJWTDonor=require("../middleware/verifyJWTDonor")
const verifyJWTAdmin=require("../middleware/verifyJWT_admin")


const contributionController=require("../controllers/contribution_controller")
router.post("/",verifyJWTDonor,contributionController.addContrbution)
router.get("/", verifyJWTAdmin,contributionController.getAllContrbutions)
router.get("/:id",verifyJWTAdmin,contributionController.getContrbutionById)
router.put("/",verifyJWTDonor,contributionController.updateContribution)
router.delete("/:id",verifyJWTDonor,contributionController.deleteContribution)
router.post("/donor/:id",verifyJWTDonor,contributionController.addContrbutionByDonorId)
router.put("/donor/:id",verifyJWTDonor,contributionController.updateContributionByDonorId)
router.get("/donor/:id",verifyJWTDonor,contributionController.getContrbutionByDonorId)

module.exports=router