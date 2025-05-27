require("dotenv").config()
const express=require("express")
const cors=require("cors")
const corsOptions=require("./config/corsOptions")
const connectDB=require("./config/dbConn")

connectDB()
const mongoose = require('mongoose');
//const mongoose=require("mongoose")
const PORT=process.env.PORT||2222
const app=express();

app.use(cors(corsOptions))
app.use(express.json())

//routes
app.use("/api/auth",require("./routers/authRoutes"))
app.use("/api/bankDetails",require("./routers/bank_details_routes"))
app.use("/api/contribution",require("./routers/contribution_routes"))
app.use("/api/cashRegisterStatus", require("./routers/cashRegisterStatusRoutes"))
app.use("/api/monthlyScholarshipDetails",require("./routers/monthlyScholarshipDetailsRoutes"))
app.use("/api/studentScholarship",require("./routers/studentScholarshipRoutes"))
app.use("/api/user",require("./routers/userRoutes"))
app.use("/api/happenOnceAMonth",require("./routers/hapenOnceAMonthRoutes"))

// app.use("/api/hapenOnceAMonth",require("./routers/hapenOnceAMonthRoutes"))
const happenOnceAMonth=require("./controllers/happenOnceAMonthController")

const scheduleMonthlyTask = async () => {
    const now = new Date();
    const currentDate = now.getDate();
    if (currentDate === 1) {
        await happenOnceAMonth.addMonthlyContributionsToCRS();
        await happenOnceAMonth.addStudentScholarshipOnceAMonthAndUpdateCRS();
    }
};

// This function will run every 24 hours (86400000 milliseconds)
setInterval(scheduleMonthlyTask, 86400000);




app.get("/",(req,res)=>{
    res.send("home")
})
mongoose.connection.once('open',()=>{
    console.log("connect")
    app.listen(PORT,()=>{
        console.log(`process is running in port: ${PORT}`);
    })
})

mongoose.connection.on('error',(err)=>{
    console.log(err);
})
