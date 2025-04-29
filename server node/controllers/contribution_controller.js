//vvvvvvvvvvvvv
const Contribution=require("../models/Contribution")
const User=require("../models/User")
const addContrbution=async(req,res)=>{///////////vvvvvvvvv
    const {donor,date,sumContribution}=req.body
    if(!donor||!date||!sumContribution)
        return res.status(406).send("All fields are required ")
    if(!Contribution.find())
        return res.status(400).send("There Donor is not exist")

    const existDonor = await User.findOne({_id:donor}).lean()
    if (!existDonor)
        return res.status(400).send("Donor is not exist")
    const contribution = await Contribution.create({donor,date,sumContribution})
    res.json(contribution)
}

const getAllContrbutions = async (req, res) => {//vvvvvvvvvv
    const allContrbutions = await Contribution.find().lean()
    res.json(allContrbutions)
}

const getContrbutionById = async (req, res) => {//vvvvvvvvv
    console.log("jisoaphd");
    const { id } = req.params
    console.log(id);
    if (!id)
        return res.status(400).send("Id is required")
    if(!Contribution.find())
        return res.status(400).send("There are no contribution ")
    const allContributions = await Contribution.find().lean()
    if (!allContributions?.length)
        return res.status(400).send("No contribution exists")
    const contribution = await Contribution.findById(id).lean()
    if (!contribution)
        return res.status(400).send("contribution is not exists")
    res.json(contribution)
}

const updateContribution=async(req,res)=>{/////////vvvvvvvvvvvvvvv
    const {id,donor,date,sumContribution}=req.body
    if(!id)
        return res.status(400).send("Id is required")
    const contribution = await Contribution.findById(id).exec()
    if (!contribution)
        return res.status(400).send("contribution is not exists")
    if(donor)
        contribution.donor=donor
    if(date)
        contribution.date=date
    if(sumContribution)
        contribution.sumContribution=sumContribution
    const updatedContribution=await contribution.save()
    res.json(updatedContribution)
}
const deleteContribution = async (req, res) => {//vvvvvvvvvvvvvvvvvvvv
    const { id } = req.params
    if (!id)
        return res.status(400).send("Id is required")
    const contribution = await Contribution.findById(id).exec()
    if (!contribution)
        return res.status(400).send("Contribution is not exists")
    const result = await contribution.deleteOne()
    res.send(result)
}
module.exports={addContrbution,getAllContrbutions,getContrbutionById,updateContribution,deleteContribution}