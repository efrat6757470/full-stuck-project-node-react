const express=require("express")
const router =express.Router()
const bankDetailsController=require("../controllers/Bank_detail_controller")
router.post("/",bankDetailsController.addBankDetails)
router.get("/:id", bankDetailsController.getBankDetailsById)
router.get("/", bankDetailsController.getAllBankDetails)
router.put("/", bankDetailsController.updateBankDetails)
router.delete("/:id", bankDetailsController.deleteBankDetails)

module.exports = router