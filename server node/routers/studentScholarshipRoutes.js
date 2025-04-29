const express=require("express")
const router =express.Router()
const studentScholarshipController=require("../controllers/studentScholarshipController")
router.post("/",studentScholarshipController.addStudentScholarship)
router.get("/:id", studentScholarshipController.getStudentScholarshipById)
router.get("/", studentScholarshipController.getAllStudentScholarships)
router.put("/", studentScholarshipController.updateStudentScholarship)
router.delete("/:id", studentScholarshipController.deleteStudentScholarship)

module.exports = router