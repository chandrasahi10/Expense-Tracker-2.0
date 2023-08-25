const User=require('../model/signup')

const getUserLeaderBoard=async(req,res,next)=>{
    try{
        const total_amount = await User.find().sort({total_amount:-1})
        
        res.status(201).json(total_amount)
        
    }catch(err){
        console.log(err)
        res.status(501).json({err:err})
    }
}

module.exports ={
    getUserLeaderBoard
}

// bruteforce solution
// const ExpenseAmount={}

        // expenses.forEach((expense)=>{
        //     if(ExpenseAmount[expense.userId]){
        //         ExpenseAmount[expense.userId]+=expense.amount
        //     }
        //     else{
        //         ExpenseAmount[expense.userId]=expense.amount
        //     }
        // })

        // const UserDeatils=[]
        // users.forEach((user)=>{
        //     UserDeatils.push({Name:user.Name,amount:ExpenseAmount[user.id] || 0 })
        // })
        
        // console.log(UserDeatils)
        // UserDeatils.sort((a,b)=>b.amount-a.amount)