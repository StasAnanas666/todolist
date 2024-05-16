import { useState, useEffect } from "react";
import trashbox from "../resources/images/trashbox.svg";
import add from "../resources/images/add.svg";

const ToDoList = () => {
    const [todos, setTodos] = useState([]); //массив задач(изначально пустой)
    const [inputValue, setInputValue] = useState(""); //вводимое название задачи

    //сработает один раз при запуске компонента
    //загрузка задач из localStorage
    useEffect(() => {
        const savedTodos = localStorage.getItem("todos");
        if(savedTodos) {
            setTodos(JSON.parse(savedTodos));
        }
    }, [])

    //запись в localStorage при изменении массива todos
    useEffect(() => {
        if(todos.length > 0) {
            localStorage.setItem("todos", JSON.stringify(todos));
        }        
    }, [todos]);

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    //добавление новой задачи
    //обрезка лишних символов, добавление в массив todos, очистка поля ввода
    const handleAddTodo = () => {
        if (inputValue.trim() !== "") {
            setTodos([...todos, inputValue]);
            setInputValue("");
        }
    };

    //удаление задачи
    const handleDeleteTodo = (index) => {
        //выбираем те задачи, которые не должны удаляться в новый массив
        const newTodos = todos.filter((todo, i) => i !== index);
        setTodos(newTodos);
    };

    return (
        <div className="container">
            <h1 className="mb-5">Список задач</h1>

            <div className="d-flex justify-content-between align-items-center">
                <input
                    type="text"
                    className="form-control w-75"
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder="Введите название задачи..."
                />
                <button
                    className="btn btn-primary"
                    onClick={handleAddTodo}
                >
                    <img src={add} alt="add" />
                </button>
            </div>

            {/* список задач */}
            <ul className="list-group mt-3">
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
            </ul>
        </div>
    );
};

export default ToDoList;
