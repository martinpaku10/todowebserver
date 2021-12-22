import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cors from "cors"
import TodoModel from "./TodoSchema/todoSchema.js"

const app = express()

dotenv.config()
app.use(cors())
app.use(express.json())

const port =  process.env.PORT||8000

const url = process.env.DB_URL
mongoose.connect(url,{
    useNewUrlParser: true,
    useUnifiedTopology: true

}).then(()=>{
    console.log("Database connected successfully")
}).catch((error)=>{
    console.log(error)
})

///home route
app.get("/",(req,res)=>{
    res.send("Welcome to Martin's Todo API")
})
//Get all Todos rout
app.get("/getAllTodos",async(req,res)=>{
    const todo= await TodoModel.find({});

    if (todo){

       return res.status(200).json({
            message:"Fetch all todos from database",
            data: todo
        })
    }else{
       return res.status(400).json({
            message:"Failed to fetch todos from database"
        })
    }

})


//Create a new Todo into the database
app.post("/createTodo",async(req,res)=>{
    const{title, description, isCompleted}=req.body
    const createTodo = await TodoModel.create({
        title,
        description,
        isCompleted
    })
    if(createTodo){
        return res.status(201).json({
            message:"Todo created successfully",
            data: createTodo
        
        })
    }else{
        return{
            message:"Failed to create a new Todo",
            
        }
    }
})

///update:
app.patch("/updateTodo/:id",async(req,res)=>{
    const {id}=req.params;
    const {isCompleted}=req.body
    const updateTodo= await TodoModel.updateOne({isCompleted:isCompleted}).where({_id:id})

    if (updateTodo){

        return res.status(200).json({
             message:"Todo updated successfully",
             data: updateTodo
         })
     }else{
        return res.status(400).json({
             message:"Update failed"
         })
     }

})
///Delete todo from Database
app.delete("/deleteTodo/:id",async(req,res)=>{
const {id}=req.params;
const deleteTodo = await TodoModel.findByIdAndDelete({_id:id})

if(deleteTodo){
    return res.status(200).json({
        message:"Todo deleted successfully",
        data: deleteTodo
    })
}else{
    return res.status(400).json({
        message: "Delete failed"
    })
}
})


app.listen(port,() => {
    console.log(`Todo server running at ${port}`)
});
