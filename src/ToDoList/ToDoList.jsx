import { useState, useEffect } from "react";
import {format} from "date-fns";
import trashbox from "../resources/images/trashbox.svg";
import add from "../resources/images/add.svg";

const ToDoList = () => {
    const [todos, setTodos] = useState([]); //массив задач(изначально пустой)
    const [inputValue, setInputValue] = useState(""); //вводимое название задачи
    const [priority, setPriority] = useState("Low"); //приоритет, по умолчнаю низкий
    const [deadline, setDeadline] = useState(""); //дэдлайн

    //сработает один раз при запуске компонента
    //загрузка задач из localStorage
    useEffect(() => {
        const savedTodos = localStorage.getItem("todos");
        if (savedTodos) {
            setTodos(JSON.parse(savedTodos));
        }
    }, []);

    //запись в localStorage при изменении массива todos
    useEffect(() => {
        if (todos.length > 0) {
            localStorage.setItem("todos", JSON.stringify(todos));
        }
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
    const handleAddTodo = () => {
        if (inputValue.trim() !== "") {
            setTodos([...todos, {name: inputValue, priority: priority, deadline: deadline}]);
            setInputValue("");
            setPriority("Low");
            setDeadline("");
        }
    };

    //удаление задачи
    const handleDeleteTodo = (index) => {
        //выбираем те задачи, которые не должны удаляться в новый массив
        const newTodos = todos.filter((todo, i) => i !== index);
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
        const formattedDateTime = datetime ? format(new Date(datetime), "dd/MM/yyyy HH:mm") : "";
        return formattedDateTime;
    }


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
                    {todos.map((todo, index) => (
                        <tr key={index} className={getPriorityColor(todo.priority)}>
                            <td className="fw-bold" style={{width: "60%"}}>{todo.name}</td>
                            <td className="text-center">{getFormattedDateTime(todo.deadline)}</td>
                            <td className="text-center">
                                <button
                                    className="btn btn-danger"
                                    onClick={() => handleDeleteTodo(index)}
                                >
                                    <img src={trashbox} alt="trashbox" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* <ul className="list-group mt-5">
                {todos.map((todo, index) => (
                    <li className="list-group-item" key={index}>
                        <div className="d-flex justify-content-between align-items-center">
                            <span>{todo}</span>
                            <button
                                className="btn btn-danger"
                                onClick={() => handleDeleteTodo(index)}
                            >
                                <img src={trashbox} alt="trashbox" />
                            </button>
                        </div>
                    </li>
                ))}
            </ul> */}
        </div>
    );
};

export default ToDoList;
