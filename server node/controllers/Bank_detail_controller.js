const BankDetails=require("../models/Bank_details")

const addBankDetails=async(req,res)=>{
    const{student,bankNumber,bankAccount,bankBranch}=req.body
    if(!student||!bankBranch||!bankAccount||!bankNumber)
        return res.status(400).send("All fields are required ")
    const existStudent = await User.findOne({student}).lean()
    if (existStudent)
        return res.status(400).send("BankDetails of this student exists")
    const bankDetails = await BankDetails.create({student,bankNumber,bankAccount,bankBranch})
    
    res.json(bankDetails)
}
const getAllBankDetails = async (req, res) => {
    const allBankDetails = await BankDetails.find().sort({_id:1}).lean()
    res.json(allBankDetails)
}
const getBankDetailsById = async (req, res) => {
    const { id } = req.params
    if (!id)
        return res.status(400).send("Id is required")
    const allBankDetails = await BankDetails.find().lean()
    if (!allBankDetails?.length)
        return res.status(400).send("No bankDetails exists")
    const bankDetails = await BankDetails.findById(id).lean()
    if (!bankDetails)
        return res.status(400).send("bankDetails is not exists")
    res.json(bankDetails)
}
const updateBankDetails=async(req,res)=>{
    const{student,bankNumber,bankAccount,bankBranch,id}=req.body
    if (!id)
        return res.status(400).send("Id is required")
    const bankDetails = await BankDetails.findById(id).exec()
    if (!bankDetails)
        return res.status(400).send("etails is not exists")
    if(student)
        bankDetails.student=student
    if(bankNumber)
        bankDetails.bankNumber=bankNumber
    if(bankAccount)
        bankDetails.bankAccount=bankAccount
    if(bankBranch)
        bankDetails.bankBranch=bankBranch
    const updatedBankDetails=await bankDetails.save()
    res.json(updatedBankDetails)

}
const deleteBankDetails = async (req, res) => {
    const { id } = req.params
    if (!id)
        return res.status(400).send("Id is required")
    const bankDetails = await BankDetails.findById(id).exec()
    if (!bankDetails)
        return res.status(400).send("BankDetails is not exists")
    const result = await bankDetails.deleteOne()
    res.send(result)
}
module.exports={addBankDetails,getAllBankDetails,deleteBankDetails,getBankDetailsById,updateBankDetails}