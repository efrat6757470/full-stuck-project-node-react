const MonthlyScholarshipDetails=require("../models/Monthly_scholarship_details")
const mongoose = require("mongoose")

const addMonthlyScholarshipDetails=async(req,res)=>{//vvvvvvvvvv
    const {sumPerHour,MaximumNumberOfHours,date}=req.body
    if(!date||!sumPerHour||!MaximumNumberOfHours)
        return res.status(400).send("All fields are required")
    if (sumPerHour < 10 || sumPerHour > 100)
        return res.status(400).send("Invalid sum per hour")
    if (MaximumNumberOfHours < 10 || MaximumNumberOfHours > 1000)
        return res.status(400).send("Invalid Maximum Number Of Hours")
    const date1=new Date(date)
    if (date1.getMonth() !== new Date().getMonth() || date1.getFullYear() !== new Date().getFullYear())
        return res.status(400).send("Invalid date")
    const monthlyScholarshipDetails=await MonthlyScholarshipDetails.create({sumPerHour,MaximumNumberOfHours,date})
    res.json(monthlyScholarshipDetails)
}

const getAllMonthlyScholarshipDetails=async(req,res)=>{//vvvvvvvvvvvvv
    const allMonthlyScholarshipDetails= await MonthlyScholarshipDetails.find().lean()
    if(!getAllMonthlyScholarshipDetails?.length)
        res.json([])
    res.json(allMonthlyScholarshipDetails)
}   
const getMonthlyScholarshipDetailsByCurrentDate = async (req, res) => {//vvvvvvvvvvvvvvv
    const startOfMonth = new Date();
    startOfMonth.setDate(1); // Set to the first day of the current month
    const endOfMonth = new Date();
    endOfMonth.setMonth(endOfMonth.getMonth() + 1); // Set to the first day of the next month
    endOfMonth.setDate(0); // Set to the last day of the current month
    const monthlyScholarshipDetails = await MonthlyScholarshipDetails.findOne({
        date: {
            $gte: startOfMonth,
            $lt: endOfMonth
        }
    }).lean();
    if (!monthlyScholarshipDetails)
        return res.status(200).send("")
    res.json(monthlyScholarshipDetails)
}

const getMonthlyScholarshipDetailsById=async (req,res)=>{//vvvvvvvvvvvvvvv
    const {id}=req.params
    if(!id)
        return res.status(400).send("Id is required")
    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).send("Not valid id")
    const allMonthlyScholarshipDetails= await MonthlyScholarshipDetails.find().lean()
    if(!allMonthlyScholarshipDetails?.length)
        return res.status(404).send("No monthlyScholarshipDetails exists")
    const monthlyScholarshipDetails=await MonthlyScholarshipDetails.findById(id).lean()
    if(!monthlyScholarshipDetails)
        return res.status(400).send("monthlyScholarshipDetails is not exists")
    res.json(monthlyScholarshipDetails)
}

const updateMonthlyScholarshipDetails=async(req,res)=>{//vvvvvvvvvvvvvvvvv
    const {_id,sumPerHour,MaximumNumberOfHours,date}=req.body
    if(!_id)
        return res.status(400).send("Id is required")
    if (!mongoose.Types.ObjectId.isValid(_id))
        return res.status(400).send("Not valid id")
    const newDate = new Date(date)
    if (newDate.getMonth() === new Date().getMonth()&&newDate.getFullYear()===new Date().getFullYear()) {
    const monthlyScholarshipDetails=await MonthlyScholarshipDetails.findById(_id).exec()
    if(!monthlyScholarshipDetails)
        return res.status(400).send("monthlyScholarshipDetails is not exists")
    if(sumPerHour)
        monthlyScholarshipDetails.sumPerHour=sumPerHour
    if(MaximumNumberOfHours)
        monthlyScholarshipDetails.MaximumNumberOfHours=MaximumNumberOfHours
    if(date){
        if (sumPerHour >= 10 && sumPerHour <= 100)
            monthlyScholarshipDetails.sumPerHour = sumPerHour
    }
    if (MaximumNumberOfHours) {
        if (MaximumNumberOfHours >= 10 && MaximumNumberOfHours <= 1000)
            monthlyScholarshipDetails.MaximumNumberOfHours = MaximumNumberOfHours
    }
        monthlyScholarshipDetails.date=date
    const updatedmonthlyScholarshipDetails= await monthlyScholarshipDetails.save()
     return res.json(updatedmonthlyScholarshipDetails)}
    return res.status(400).send("You can't update from previous month")

}
const deleteMonthlyScholarshipDetails = async (req, res) => {//vvvvvvvvvv
    const { id } = req.params
    if (!id)
        return res.status(400).send("Id is required")
    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).send("Not valid id")
    const msd = await MonthlyScholarshipDetails.findById(id).exec()
    if (!msd)
        return res.status(400).send("MonthlyScholarshipDetails is not exists")
    if (msd.date.getMonth() !== new Date().getMonth() || msd.date.getFullYear() !== new Date().getFullYear())
        return res.status(400).send("You can't delete from previous month")
    const result = await msd.deleteOne()
    res.send(result)
}

module.exports={addMonthlyScholarshipDetails,getMonthlyScholarshipDetailsByCurrentDate,getMonthlyScholarshipDetailsById,getAllMonthlyScholarshipDetails,updateMonthlyScholarshipDetails,deleteMonthlyScholarshipDetails}