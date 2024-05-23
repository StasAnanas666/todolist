import { useState, useEffect } from "react";
import { format } from "date-fns";
import axios from "axios";
import trashbox from "../resources/images/trashbox.svg";
import add from "../resources/images/add.svg";
import edit from "../resources/images/edit.svg";
import EditTaskModal from "./Modal/EditTaskModal";
import TaskDetailsModal from "./Modal/TaskDetailsModal";

const serverUrl = "http://localhost:3001/tasks"; //адрес сервера

const ToDoList = () => {
    const [todos, setTodos] = useState([]); //массив задач(изначально пустой)
    const [inputValue, setInputValue] = useState(""); //вводимое название задачи
    const [priority, setPriority] = useState("Low"); //приоритет, по умолчнаю низкий
    const [deadline, setDeadline] = useState(""); //дэдлайн
    const [selectedTask, setSelectedTask] = useState(null); //выбранная задача

    //загрузка данных из Бд при запускее компонента, запись в Бд при изменении массива todos
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(serverUrl);
                setTodos(response.data);
            } catch (error) {
                console.error("Ошибка получения списка задач: ", error);
            }
        };
        fetchData();
    }, [todos]);

    //значение состояния inputValue меняется при изменении в поле ввода
    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    //значение состояния priority меняется при изменении выбора приоритета в выпадающем списке
    const handlePriorityChange = (event) => {
        setPriority(event.target.value);
    };

    //значение состояния deadline меняется при изменении даты/времени в поле ввода
    const handleDeadlineChange = (event) => {
        setDeadline(event.target.value);
    };

    //добавление новой задачи
    //обрезка лишних символов, добавление в массив todos, очистка полей ввода
    const handleAddTodo = async () => {
        try {
            const response = await axios.post(serverUrl, {
                title: inputValue,
                deadline: deadline,
                priority: priority,
            });
            console.log("Задача добавлена: ", response.data);
            setInputValue("");
            setPriority("Low");
            setDeadline("");
        } catch (error) {
            console.error("Ошибка добавления задачи: ", error);
        }
    };

    //открытие модального окна для выбранной задачи
    const handleEdit = (todo) => {
        setSelectedTask(todo);
    };

    //открытие модального окна с подробной информацией при клике на задачу
    const handleTaskClick = (todo) => {
        setSelectedTask(todo);
    };

    //изменение задачи
    const handleUpdate = async (updatedTodo) => {
        try {
            const response = await axios.put(
                `${serverUrl}/${updatedTodo.id}`,
                {title: updatedTodo.title, priority: updatedTodo.priority, deadline: updatedTodo.deadline}
            );
            setTodos(
                todos.map((todo) =>
                    todo.id === updatedTodo.id ? response.data : todo
                )
            );
            setSelectedTask(null);
        } catch (error) {
            console.error("Ошибка изменения задачи: ", error);
        }
    };

    //удаление задачи
    const handleDeleteTodo = async (id) => {
        await axios.delete(`${serverUrl}/${id}`);
        //выбираем те задачи, которые не должны удаляться в новый массив
        const newTodos = todos.filter((todo) => todo.id !== id);
        setTodos(newTodos);
    };

    //возвращает цвет для выбранного приоритета
    const getPriorityColor = (priority) => {
        switch (priority) {
            case "Low":
                return "table-info";
            case "Medium":
                return "table-warning";
            case "High":
                return "table-danger";
            default:
                return "";
        }
    };

    //получение форматированной даты и времени
    const getFormattedDateTime = (datetime) => {
        const formattedDateTime = datetime
            ? format(new Date(datetime), "dd/MM/yyyy HH:mm")
            : "";
        return formattedDateTime;
    };

    return (
        <div className="container">
            <h1 className="mb-5">TO DO</h1>

            <div className="d-flex flex-wrap justify-content-between align-items-end">
                <div className="form-group" style={{ width: "60%" }}>
                    <label className="form-label">Название: </label>
                    <input
                        type="text"
                        className="form-control"
                        value={inputValue}
                        onChange={handleInputChange}
                        placeholder="Введите название задачи..."
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Приоритет: </label>
                    <select
                        className="form-select"
                        value={priority}
                        onChange={handlePriorityChange}
                    >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </div>
                <div className="form-group">
                    <label className="form-label">Дата выполнения: </label>
                    <input
                        type="datetime-local"
                        className="form-control"
                        value={deadline}
                        onChange={handleDeadlineChange}
                    />
                </div>
                <button className="btn btn-primary" onClick={handleAddTodo}>
                    <img src={add} alt="add" />
                </button>
            </div>

            {/* список задач */}
            <table className="table table-hover align-middle mt-5">
                <thead>
                    <tr>
                        <th>Название</th>
                        <th className="text-center">Дэдлайн</th>
                        <th className="text-center">Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {todos.map((todo) => (
                        <tr
                            key={todo.id}
                            className={getPriorityColor(todo.priority)}
                        >
                            <td className="fw-bold" style={{ width: "60%" }}>
                                {todo.title}
                            </td>
                            <td className="text-center">
                                {getFormattedDateTime(todo.deadline)}
                            </td>
                            <td className="text-center">
                                <button
                                    className="btn btn-warning me-3"
                                    onClick={() => handleEdit(todo)}
                                >
                                    <img src={edit} alt="edit" />
                                </button>
                                <button
                                    className="btn btn-danger"
                                    onClick={() => handleDeleteTodo(todo.id)}
                                >
                                    <img src={trashbox} alt="trashbox" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {selectedTask && (
                <EditTaskModal 
                    task={selectedTask}
                    onUpdate={handleUpdate}
                    onClose={() => setSelectedTask(null)}
                />
            )}
            {/* {selectedTask && (
                <TaskDetailsModal 
                    task={selectedTask}
                    onClose={() => setSelectedTask(null)}
                />
            )} */}

        </div>
    );
};

export default ToDoList;
