import React, {useState} from "react";
import styles from "./Modal.module.css";

export const Modal: React.FC<{ballIndex: number, onClose: Function, onSave: Function }> = ({ballIndex, onClose, onSave }) => {
    const [color, setColor] = useState("");

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setColor(event.target.value);
    };

    const handleSave = () => {
        onSave(ballIndex, color);
        onClose();
    };

    return (
        <div className={styles.modal}>
            <p>Изменить цвет шара №{ballIndex}</p>
            <p>Например: purple, yellow, orange...</p>
            <input type="text" value={color} onChange={handleChange} />
            <button onClick={handleSave}>Сохранить</button>
            <button onClick={() => onClose()}>Отмена</button>
        </div>
    );
};

