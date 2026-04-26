//vvvvvvvvvvvvv
const mongoose = require("mongoose")

const Contribution=require("../models/Contribution")
const User=require("../models/User")
const addContrbution=async(req,res)=>{///////////vvvvvvvvv
    const {donor,date,sumContribution}=req.body
    if(!donor||!date||!sumContribution)
        return res.status(400).send("All fields are required ")
    if(!Contribution.find())
        return res.status(404).send("No Donors exist")

    const existDonor = await User.findOne({_id:donor}).lean()
    if (!existDonor)
        return res.status(400).send("Donor is not exist")
    const newDate = new Date(date)
    if (newDate.getMonth() !== new Date().getMonth() || newDate.getFullYear() !== new Date().getFullYear())
        return res.status(400).send("Invalid date")
    if(sumContribution<=0)
        return res.status(400).send("cannot contribute less than 1 nis ")
    const contribution = await Contribution.create({donor,date,sumContribution})
    res.json(contribution)
}

const getAllContrbutions = async (req, res) => {//vvvvvvvvvv
    const allContrbutions = await Contribution.find().populate("donor",{fullname:1,_id:1}).lean()
    if(!allContrbutions?.length)
        res.json([])
    res.json(allContrbutions)
}

const getContrbutionById = async (req, res) => {//vvvvvvvvv
    const { id } = req.params
    if (!id)
        return res.status(400).send("Id is required")
    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).send("Not valid id")
    const allContributions = await Contribution.find().lean()
    if (!allContributions?.length)
        return res.status(404).send("No contribution exists")
    const contribution = await Contribution.findById(id).populate("donor", { fullname: 1, _id: 1 }).lean()
    if (!contribution)
        return res.status(400).send("contribution is not exists")
    res.json(contribution)
}

const updateContribution=async(req,res)=>{/////////vvvvvvvvvvvvvvv
    const {id,donor,date,sumContribution}=req.body
    if(!id)
        return res.status(400).send("Id is required")
    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).send("Not valid id")
    const contribution = await Contribution.findById(id).exec()
    if (!contribution)
        return res.status(400).send("contribution is not exists")
    if(new Date().getMonth()!==new Date(date).getMonth()||new Date().getFullYear()!==new Date(date).getFullYear())
        return res.status(403).send("cannot update an old contribution")
    if(donor)
        {const existDonor = await User.findOne({_id:donor}).lean()
    if (!existDonor)
        return res.status(400).send("Donor is not exist")
    contribution.donor=donor
}
    if(date)
{   if (new Date(date).getMonth() !== new Date().getMonth() || new Date(date).getFullYear() !== new Date().getFullYear())
    return res.status(400).send("Invalid date")
         contribution.date=date
}    if(sumContribution&&sumContribution>0)
      
      contribution.sumContribution=sumContribution
   const updatedContribution=await contribution.save()
    res.json(updatedContribution)

}
const getContrbutionByDonorId = async (req, res) => {//vvvvvvvvv
    const { id } = req.params
    console.log(id);
    if (!id)
        return res.status(400).send("Id is required")
    // if (!mongoose.Types.ObjectId.isValid(id))
    //     return res.status(400).send("Not valid id")
    const contribution = await Contribution.find({ donor: id }).populate("donor", { fullname: 1, _id: 1 }).lean()
    if (!contribution)
        return res.status(400).send("contribution is not exists")
    res.json(contribution)
}
const updateContributionByDonorId = async (req, res) => {
    const { id, donor, date, sumContribution } = req.body
    if (!id)
        return res.status(400).send("Id is required")
    const contribution = await Contribution.findOne({ _id: id, donor: donor }).exec()
    if (!contribution)
        return res.status(400).send("contribution is not exists")
    if(new Date().getMonth()!==new Date(date).getMonth()||new Date().getFullYear()!==new Date(date).getFullYear())
        return res.status(403).send("cannot update an old contribution")
    if (date&&(new Date(date).getMonth() === new Date().getMonth() || new Date(date).getFullYear() === new Date().getFullYear()))
        contribution.date = date
    if (sumContribution&&sumContribution>0)
        contribution.sumContribution = sumContribution
    console.log(contribution);

    const updatedContribution = await contribution.save()
    res.json(updatedContribution)
}

const addContrbutionByDonorId = async (req, res) => {///////////vvvvvvvvv
    const { donor, date, sumContribution } = req.body
    if (!donor || !date || !sumContribution)
        return res.status(400).send("All fields are required ")
    const existDonor = await User.findOne({ _id: donor }).lean()
    if(sumContribution<=0)
        return res.status(400).send("cannot contribute less than 1 nis ")

    if (!existDonor)
        return res.status(400).send("Donor is not exist")
    const newDate = new Date(date)
    if (newDate.getMonth() !== new Date().getMonth() || newDate.getFullYear() !== new Date().getFullYear())
        return res.status(400).send("Invalid date")
    const contribution = await Contribution.create({ donor, date, sumContribution })
    res.json(contribution)
}

const deleteContribution = async (req, res) => {//vvvvvvvvvvvvvvvvvvvv
    const { id } = req.params
    if (!id) 
        return res.status(400).send("Id is required")
    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).send("Not valid id")
    const contribution = await Contribution.findById(id).exec()
    if (!contribution)
        return res.status(400).send("Contribution is not exists")
    if(new Date().getMonth()!==new Date(contribution.date).getMonth())
        return res.status(403).send("cannot delete an old contribution")
    const result = await contribution.deleteOne()
    res.send(result)
}
module.exports={addContrbution,addContrbutionByDonorId,getAllContrbutions,getContrbutionByDonorId,updateContributionByDonorId,getContrbutionById,updateContribution,deleteContribution}