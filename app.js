const express=require("express")
const bodyParser=require("body-parser")
const mongoose=require("mongoose")
const cors=require("cors")

const app=express()
app.use(cors({
    origin:"*"
}))

app.use(bodyParser.json({extended:false}));

const signUpRoute=require("./route/signup")
const expenseRoute=require("./route/expense")
const purchaseRoute=require('./route/purchase');
const premiumRoute=require('./route/premiumFeatures');
const forgotPasswordRoute=require('./route/forgotPassword');



app.use(signUpRoute)
app.use(expenseRoute)
app.use(purchaseRoute)
app.use(premiumRoute)
app.use(forgotPasswordRoute)

mongoose.connect("mongodb+srv://chandrachud:0542Mongo@cluster0.oazpryq.mongodb.net/Expense1?retryWrites=true&w=majority")
.then(result=>{
    app.listen(3000)
    console.log("done")
})
.catch(err=>{
    console.log(err)
})
