const { default: mongoose } = require("mongoose")
const CashRegisterStatus = require("../models/Cash_Register_Status")

const getAllCashRegisterStatus = async (req, res) => {//vvvvvvvvvvvvvvvvvv
    const cashregistersatuses = await CashRegisterStatus.find().lean()
    if (!cashregistersatuses?.length) {
        return res.json([])
    }
    res.json(cashregistersatuses)
}
const getCashRegisterStatusById = async (req, res) => {//vvvvvvvvvvvv
    const { id } = req.params
    const cashregistersatuses = await CashRegisterStatus.find().lean()
    if (!cashregistersatuses?.length)
        return res.status(404).send("No cashregistersatuses exists")
    if (!id)
        return res.status(400).send("Id is required")
    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).send("Not valid id")
    const cashregistersatus = await CashRegisterStatus.findById(id).lean()
    if (!cashregistersatus)
        return res.status(400).send("This cashregistersatus isn't exists")
    res.json(cashregistersatus)
}

const addCashRegisterStatus = async (req, res) => {//vvvvvvvvvvvvvvvvvvvvv
    const { action, sumPerAction, date } = req.body
    if (!action || !sumPerAction || !date)
        return res.status(400).send("All fields are required!!")
    if (action !== 'Income' && action !== 'Expense')
        return res.status(400).send("action must be Income or Expense!!")
    const cashregistersatuses = await CashRegisterStatus.find().lean()
    if (!cashregistersatuses?.length) {
        let sum = 0;
        if (action === "Income")
            sum = Number(sumPerAction)
        else
            sum = - Number(sumPerAction)
        const cashregistersatus = await CashRegisterStatus.create({ currentSum: sum, sumPerAction, action, date })
        res.json(cashregistersatus)
    }
    else {
        let sum = cashregistersatuses[cashregistersatuses.length - 1].currentSum
        if (action === "Income")
            sum += Number(sumPerAction)

        else
            sum -= Number(sumPerAction)
        const cashregistersatus = await CashRegisterStatus.create({ currentSum: sum, sumPerAction, action, date })
        res.json(cashregistersatus)
    }
}
const updateCashRegisterStatus = async (req, res) => {//vvvvvvvvvvvvvvv
    const { currentSum, sumPerAction, action, _id, date } = req.body
    const newDate = new Date(date)
    if (newDate.getMonth() === new Date().getMonth()) {
        if (!_id)
            return res.status(400).send("Id is required")
        if (!mongoose.Types.ObjectId.isValid(_id))
            return res.status(400).send("Not valid id")
        const cashregistersatuses = await CashRegisterStatus.find().lean()
        if (!cashregistersatuses?.length)
            return res.status(404).send("No cashregistersatuses exists")
        const cashregistersatus = await CashRegisterStatus.findById(_id).exec()
        if (!cashregistersatus)
            return res.status(400).send("cashregistersatus is not exists")
        // if (currentSum)
        //     cashregistersatus.currentSum = currentSum
        // if (sumPerAction)
        //     cashregistersatus.sumPerAction = sumPerAction
        // if (action)
        //     cashregistersatus.action = action
        // if (date)
        //     cashregistersatus.date = newDate
        if (sumPerAction) {
            const newSum = Number(sumPerAction);
            const oldSum = Number(cashregistersatus.sumPerAction) || 0;

            // חישוב ההפרש: כמה כסף להוסיף או להוריד מהקופה הכללית
            // אם החדש קטן מהישן (למשל 24 פחות 28) התוצאה תהיה 4-
            // ואז החיסור של מינוס יהפוך לפלוס (החזרת כסף לקופה)
            const difference = newSum - oldSum;

            cashregistersatus.currentSum -= difference; // מעדכן את היתרה הכללית
            cashregistersatus.sumPerAction = newSum;    // מעדכן את סכום הפעולה הספציפית
        }

        if (date) cashregistersatus.date = newDate;
        const upcashregistersatus = await cashregistersatus.save()
        return res.json(upcashregistersatus)
    }
    return res.status(400).send("Can't update from last monthes")
}

const deleteCashRegisterStatusById = async (req, res) => {//vvvvvvvvvvvv
    const { id } = req.params
    if (!id)
        return res.status(400).send("Id is required")
    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).send("Not valid id")
    const cashregistersatuses = await CashRegisterStatus.find().lean()
    if (!cashregistersatuses?.length)
        return res.status(404).send("No cashregistersatuses exists")
    const cashregistersatus = await CashRegisterStatus.findById(id).exec()
    if (!cashregistersatus)
        return res.status(400).send("cashregistersatus is not exists")
    if (cashregistersatus.date.getMonth() === new Date().getMonth()) {
        const result = await cashregistersatus.deleteOne()
        return res.send(result)
    }
    return res.status(400).send("You can't delete from previous month")
}
const calculateMonthlyScholarships = async (req, res) => {
    try {
        // שליפת הסטודנטים
        const students = await User.find({ role: "Student" }).lean();
        if (!students?.length) {
            return res.status(200).json({ message: "No students found in the system." });
        }

        // הגדרת טווח תאריכים (החודש החולף)
        const startOfMonth = new Date();
        startOfMonth.setMonth(startOfMonth.getMonth() - 1);
        startOfMonth.setDate(1); 

        const endOfMonth = new Date();
        endOfMonth.setDate(0); 

        // שליפת התעריף השעתי לחודש זה
        const hourlyRate = await monthlyScholarshipDetailsSchema
            .findOne({
                date: { $gte: startOfMonth, $lt: endOfMonth },
            })
            .lean()
            .then((doc) => doc?.sumPerHour);

        if (!hourlyRate) {
            return res.status(404).json({ error: "Hourly rate not found for the requested month." });
        }

        let totalExpenses = 0;

        // לולאה לעדכון המלגה של כל סטודנט
        for (const student of students) {
            const studentScholarship = await StudentScholarship.findOne({
                student: student._id,
                date: { $gte: startOfMonth, $lt: endOfMonth },
            }).exec();

            if (studentScholarship && studentScholarship.numHours) {
                const scholarshipAmount = hourlyRate * studentScholarship.numHours;
                studentScholarship.sumMoney = scholarshipAmount;
                await studentScholarship.save();
                totalExpenses += scholarshipAmount; 
            }
        }

        // שליפת היתרה האחרונה בקופה ויצירת שורת הוצאה חדשה
        const lastStatus = await Cash_Register_Status.findOne().sort({ date: -1 }).lean();
        const currentSum = lastStatus ? lastStatus.currentSum : 0;

        const newStatus = await Cash_Register_Status.create({
            action: "Expense",
            sumPerAction: totalExpenses,
            date: new Date(),
            currentSum: currentSum - totalExpenses, 
        });

        // החזרת תשובה חיובית לפרונטנד
        return res.status(200).json({ 
            success: true,
            message: "Scholarships calculated and cash register updated successfully.", 
            totalExpenses 
        });

    } catch (error) {
        console.error("Error in calculateMonthlyScholarships:", error);
        return res.status(500).json({ error: "Internal server error while calculating scholarships." });
    }
};
const processMonthlyContributions = async (req, res) => {
    try {
        // הגדרת טווח תאריכים (החודש החולף)
        const startOfMonth = new Date();
        startOfMonth.setMonth(startOfMonth.getMonth() - 1); 
        startOfMonth.setDate(1); 

        const endOfMonth = new Date();
        endOfMonth.setDate(0); 
        
        // סכימת כל התרומות בטווח התאריכים באמצעות אגרגציה
        const totalDonations = await Contribution.aggregate([
            {
                $match: {
                    date: { $gte: startOfMonth, $lt: endOfMonth },
                },
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$sumContribution" },
                },
            },
        ]);

        const totalIncome = totalDonations[0]?.totalAmount || 0;

        if (totalIncome === 0) {
            return res.status(200).json({ success: true, message: "No donations found for this month." });
        }

        // שליפת היתרה האחרונה בקופה ויצירת שורת הכנסה חדשה
        const lastStatus = await Cash_Register_Status.findOne().sort({ date: -1 }).lean();
        const currentSum = lastStatus ? lastStatus.currentSum : 0;

        await Cash_Register_Status.create({
            action: "Income",
            sumPerAction: totalIncome,
            date: new Date(),
            currentSum: currentSum + totalIncome,
        });

        // החזרת תשובה חיובית לפרונטנד
        return res.status(200).json({ 
            success: true,
            message: "Contributions integrated into cash register successfully.", 
            totalIncome 
        });

    } catch (error) {
        console.error("Error in processMonthlyContributions:", error);
        return res.status(500).json({ error: "Internal server error while processing contributions." });
    }
};
module.exports = { getAllCashRegisterStatus, getCashRegisterStatusById, addCashRegisterStatus, updateCashRegisterStatus, deleteCashRegisterStatusById,processMonthlyContributions,calculateMonthlyScholarships }