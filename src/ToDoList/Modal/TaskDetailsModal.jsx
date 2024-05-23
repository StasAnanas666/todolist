import {useState} from "react";
import Modal from "react-modal";

Modal.setAppElement("#root"); //где будет выводится модальное окно

const TaskDetailsModal = ({task, onClose}) => {
    return (
        <Modal isOpen={true} onRequestClose={onClose}>
            <h2>Информация о задаче</h2>
            <div>
                <strong>Название: </strong>
                {task.title}
            </div>
            <div>
                <strong>Дэдлайн: </strong>
                {task.deadline}
            </div>
            <div>
                <strong>Приоритет: </strong>
                {task.priority}
            </div>
            <button onClick={onClose}>Закрыть</button>
        </Modal>
    )
}

export default TaskDetailsModal;