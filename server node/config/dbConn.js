const mongoose =require("mongoose")
const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.DB)
    }
    catch(err){
        console.error("Error connection to DB\n"+err)
    }

}
module.exports=connectDB