const express=require("express")
const router =express.Router()
const studentScholarshipController=require("../controllers/studentScholarshipController")
const verifyJWTAdmin=require("../middleware/verifyJWT_admin")
const vevifyJWTStudent=require("../middleware/vevifyJWTStudent")

router.post("/",vevifyJWTStudent,studentScholarshipController.addStudentScholarship)
router.get("/:id",verifyJWTAdmin, studentScholarshipController.getStudentScholarshipById)
router.get("/",studentScholarshipController.getAllStudentScholarships)
router.put("/", vevifyJWTStudent,studentScholarshipController.updateStudentScholarship)
router.delete("/:id",verifyJWTAdmin, studentScholarshipController.deleteStudentScholarship)
router.get("/currentMonth/:student",vevifyJWTStudent, studentScholarshipController.getCurrentMonthScholarship);

module.exports = router