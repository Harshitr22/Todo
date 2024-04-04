const express = require("express");//load express module
const app = express(); //create express app
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const TodoTask = require("./models/TodoTask");

dotenv.config();

app.use(express.urlencoded({ extended: true }));

app.use("/static", express.static("public"));

mongoose.connect(process.env.DB_CONNECT)
    .then( ()=> {
        console.log("Connected to db");
        app.listen(9000, () => console.log("Server Up and running"));
    })
    .catch((err) => { console.error(err); });

app.set("view engine", "ejs");


app.get('/', async (req, res) => {
    try {
        const tasks = await TodoTask.find({});
        res.render("todo.ejs", { tasks });
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).send("Internal Server Error");
    }
});



/*
app.post('/', (req, res) => { //handle GET requests
    console.log(req.body);
    });

    app.listen(3000, () => console.log("Server Up and running"));
*/

app.post('/', async (req, res) => {

    const todoTask = new TodoTask({ content: req.body.content , completed: false });

    try {
        await todoTask.save();
        res.redirect("/");
    } catch (error) {
        console.error("Error adding task:", error);
        res.status(500).send("Internal Server Error");
    }
});


app.route("/remove/:id").get(async (req, res) => {
    try{
        const id = req.params.id;
        await TodoTask.findByIdAndDelete(id);
        res.redirect('/');
    }catch(err){
        res.status(500).send("Internal Server Error");
    }
})

app.route("/edit/:id")
    .get(async (req, res) => {
        try {
            const id = req.params.id;
            const taskToEdit = await TodoTask.find({},);
            res.render("todoEdit.ejs", { todoTasks: taskToEdit, idTask: id});
        } catch (err) {
            console.error("Error fetching task for edit:", err);
            res.status(500).send("Internal Server Error");
        }
    })
    .post(async (req, res) => {
        const id = req.params.id
        try {
            const updatedTask = await TodoTask.findByIdAndUpdate(id, { content: req.body.content });
            res.redirect("/");
        } catch (err) {
            console.error("Error updating task:", err);
            res.status(500).send("Internal Server Error");
        }
    });


