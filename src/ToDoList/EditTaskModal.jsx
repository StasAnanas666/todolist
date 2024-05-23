import { useState } from "react";
import Modal from "react-modal";

Modal.setAppElement("#root"); //где будет выводится модальное окно

const EditTaskModal = ({ task, onUpdate, onClose }) => {
    const [title, setTitle] = useState(task.title); //вводимое название задачи
    const [priority, setPriority] = useState(task.priority); //приоритет, по умолчнаю низкий
    const [deadline, setDeadline] = useState(task.deadline); //дэдлайн

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!priority) {
            alert("Выберите приоритет!");
            return;
        }
        onUpdate({ ...task, title: title, deadline: deadline, priority: priority });
    };

    return (
        <Modal isOpen={true} onRequestClose={onClose}>
            <h2>Изменение задачи</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group my-2">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group my-2">
                    <select
                        value={priority}
                        className="form-select"
                        onChange={(e) => setPriority(e.target.value)}
                        required
                    >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </div>
                <div className="form-group my-2">
                    <label className="form-label">Дата выполнения: </label>
                    <input
                        type="datetime-local"
                        className="form-control"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        required
                    />
                </div>
                <div className="d-flex justify-content-between align-items-center my-2">
                    <button
                        className="btn btn-outline-danger"
                        type="button"
                        onClick={onClose}
                    >
                        Отменить
                    </button>
                    <button className="btn btn-outline-primary" type="submit">
                        Сохранить изменения
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default EditTaskModal;
