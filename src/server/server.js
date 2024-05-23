const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
const port = 3001;

app.use(express.json()); //использование авто сериализации/десериализации json
app.use(cors()); //обход cors-блокировок

//получение списка задач
app.get("/tasks", (req, res) => {
    db.all("select * from tasks", (err, rows) => {
        if (err) {
            //в случае ошибки возвращает статус ошибки сервера и сообщение с описанием ошибки
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

//добавление задачи
app.post("/tasks", (req, res) => {
    const { title, deadline, priority } = req.body;
    db.run(
        "insert into tasks(title, deadline, priority) values(?,?,?)",
        [title, deadline, priority],
        (err) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ id: this.lastID });
        }
    );
});

//изменение задачи
app.put("/tasks/:id", (req, res) => {
    const { id } = req.params;
    const { title, deadline, priority } = req.body;
    db.run(
        "update tasks set title = ?, deadline = ?, priority = ? where id = ?",
        [title, deadline, priority, id],
        (err) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ id, title, deadline, priority });
        }
    );
});

//удаление задачи
app.delete("/tasks/:id", (req, res) => {
    const { id } = req.params;
    db.run("delete from tasks where id=?", id, (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ deleted: this.changes });
    });
});

//запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен по адресу: http://localhost:${port}`);
});
