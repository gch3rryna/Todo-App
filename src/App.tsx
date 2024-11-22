import React, { useState } from "react";
import { observer } from "mobx-react-lite";

import { Card, Checkbox, Button, Modal, Input, Popconfirm } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import type { InputProps } from "antd";

import store, { Filter } from "./Store";

import "./App.css";

const App: React.FC = observer(() => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editTodoId, setEditTodoId] = useState<number>(0);
  const [newTodo, setNewTodo] = useState<string>("");

  const cardActions = [
    {
      label: "Новая",
      key: "new",
      onClick: () => {
        setIsModalOpen(true);
      },
    },
    {
      label: "Все",
      key: "all",
      onClick: () => {
        setFilter("all");
      },
    },
    {
      label: "Активные",
      key: "active",
      onClick: () => {
        setFilter("active");
      },
    },
    {
      label: "Завершенные",
      key: "completed",
      onClick: () => {
        setFilter("completed");
      },
    },
    {
      label: "Очистить",
      key: "clear",
      onClick: () => {
        store.removeCompletedTodos();
      },
    },
  ];

  const setFilter = (filter: Filter) => {
    store.setFilter(filter);
  };

  const onCheckboxChange = (id: number) => {
    store.toggleTodo(id);
  };

  const handleModalOk = () => {
    if (editTodoId) {
      store.editTodo(editTodoId, newTodo);
    } else {
      store.addTodo(newTodo);
    }
    handleModalCancel();
  };

  const handleModalCancel = () => {
    setNewTodo("");
    setIsModalOpen(false);
  };

  const onInputChange: InputProps["onChange"] = (e) => {
    setNewTodo(e.target.value);
  };

  const handleEdit = (id: number, title: string) => {
    setEditTodoId(id);
    setNewTodo(title);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    store.removeTodo(id);
  };

  return (
    <div className="app">
      <Card
        title="todos"
        bordered={false}
        className="card"
        actions={cardActions.map((action) => (
          <Button
            onClick={action.onClick}
            color="default"
            variant="link"
            key={action.key}
            style={{
              fontWeight: store.filter === action.key ? "bold" : "normal",
            }}
          >
            {action.label}
          </Button>
        ))}
      >
        <div className="card--items">
          {store.filteredTodos.map((todo) => (
            <Checkbox
              value={todo.id}
              key={todo.id}
              checked={todo.completed}
              className={`${todo.completed && "item__completed"}`}
              onChange={() => onCheckboxChange(todo.id)}
            >
              <div className="item">
                <p>{todo.title}</p>
                <div className="item--btns">
                  <Button
                    icon={<EditOutlined />}
                    color="default"
                    variant="text"
                    onClick={() => handleEdit(todo.id, todo.title)}
                  />
                  <Popconfirm
                    title="Удаление задачи"
                    description="Вы уверены, что хотите удалить эту задачу?"
                    onConfirm={() => handleDelete(todo.id)}
                    okText="Да"
                    cancelText="Нет"
                    icon={<QuestionCircleOutlined style={{ color: "red" }} />}
                  >
                    <Button
                      icon={<DeleteOutlined />}
                      color="danger"
                      variant="text"
                    />
                  </Popconfirm>
                </div>
              </div>
            </Checkbox>
          ))}
        </div>
      </Card>
      <Modal
        title="Добавить задачу"
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Сохранить"
        cancelText="Отменить"
      >
        <Input
          value={newTodo}
          onChange={onInputChange}
          placeholder="Введите название для новой задачи"
        />
      </Modal>
    </div>
  );
});

export default App;
