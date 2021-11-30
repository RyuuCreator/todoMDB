const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const TodoTask = require("./models/TodoTask");

dotenv.config();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// CONNECT TO DB
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
	console.log("🖥️  Connected to DB");

	app.listen(3000, () => {
		console.log("🎬  Server Up and running");
	});
});

// VIEW ENGINE CONFIG

app.set("view engine", "ejs");

//GET METHOD

app.get("/", (req, res) => {
	TodoTask.find({}, (err, tasks) => {
		res.render("index.ejs", { todoTasks: tasks });
	});
});

// POST METHOD

app.post("/", async (req, res) => {
	console.log("📝 " + req.body);
	const todoTask = new TodoTask({
		content: req.body.content,
	});

	try {
		await todoTask.save();
		console.log("✔️  Houraaaa !");
		res.redirect("/");
	} catch (err) {
		console.log("❌  Faiiiiilll !");
		res.redirect("/");
	}
});

// UPDATE

app.route("/edit/:id")
	.get((req, res) => {
		const id = req.params.id;

		TodoTask.find({}, (err, tasks) => {
			res.render("edit.ejs", { todoTasks: tasks, idTask: id });
		});
	})
	.post((req, res) => {
		const id = req.params.id;

		TodoTask.findByIdAndUpdate(id, { content: req.body.content }, (err) => {
			if (err) return res.send(500, err);
			res.redirect("/");
		});
	});

	// DELETE
	app.route("/remove/:id").get((req, res) => {
		const id = req.params.id;

		TodoTask.findByIdAndRemove(id, err => {
			if(err) return res.send(500, err);
			res.redirect("/");
		});
	});