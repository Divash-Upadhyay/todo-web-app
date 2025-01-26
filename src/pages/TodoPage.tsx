import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addTodo,
  deleteTodo,
  toggleComplete,
  editTodo,
} from "../store/todoSlice";
import { RootState } from "../store/store";
import "./TodoPage.css";
import { logout } from "../store/authSlice";
import { useNavigate } from "react-router-dom";

const TodoPage: React.FC = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state: RootState) => state.todos.todos);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTodoId, setEditTodoId] = useState<string | null>(null);

  const [filter, setFilter] = useState<"all" | "completed" | "pending">("all");
  const [sortOption, setSortOption] = useState<
    "dueDate" | "task title" | "createdAt" | undefined
  >(undefined);

  const navigate = useNavigate();

  const handleAddTodo = () => {
    const newTodo = {
      id: Date.now().toString(),
      title,
      description,
      dueDate,
      isCompleted: false,
      createdAt: new Date().toISOString(),
    };
    dispatch(addTodo(newTodo));
    resetForm();
  };

  const handleEditTodo = () => {
    if (editTodoId) {
      dispatch(
        editTodo({
          id: editTodoId,
          title,
          description,
          dueDate,
        })
      );
      resetForm();
    }
  };

  const openEditModal = (todo: {
    id: string;
    title: string;
    description: string;
    dueDate: string;
  }) => {
    setTitle(todo.title);
    setDescription(todo.description);
    setDueDate(todo.dueDate);
    setEditTodoId(todo.id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDueDate("");
    setEditTodoId(null);
    setIsEditing(false);
    setIsModalOpen(false);
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "completed") return todo.isCompleted;
    if (filter === "pending") return !todo.isCompleted;
    return true; // Show all todos
  });

  const sortedTodos = [...filteredTodos].sort((a, b) => {
    switch (sortOption) {
      case "dueDate":
        const dueA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
        const dueB = b.dueDate ? new Date(b.dueDate).getTime() : 0;
        return dueA - dueB;
      case "task title":
        return a.title.localeCompare(b.title);
      case "createdAt":
        const createdAtA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const createdAtB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        console.log("Sorting by Created At:", { createdAtA, createdAtB });
        return createdAtA - createdAtB;
      default:
        return 0;
    }
  });

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  console.log(sortedTodos);

  return (
    <div className="todo-container">
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
      <h1 className="todo-title">Todo List</h1>

      <div className="todo-controls">
        <div className="filter">
          <label>Filter: </label>
          <select
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value as "all" | "completed" | "pending")
            }
          >
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        <div className="sort">
          <label>Sort By: </label>
          <select
            value={sortOption}
            onChange={(e) =>
              setSortOption(
                e.target.value as "dueDate" | "task title" | "createdAt"
              )
            }
          >
            <option value="dueDate">Due Date</option>
            <option value="completion">Task Title</option>
            <option value="createdAt">Created At</option>
          </select>
        </div>
      </div>

      <div className="todo-list">
        {sortedTodos.map((todo) => (
          <div
            key={todo.id}
            className={`todo-item ${todo.isCompleted ? "completed" : ""}`}
          >
            <h3>{todo.title}</h3>
            <p>{todo.description}</p>
            <p>{todo.dueDate || "No due date"}</p>
            <div className="todo-actions">
              <button
                className="btn complete-btn"
                onClick={() => dispatch(toggleComplete(todo.id))}
              >
                {todo.isCompleted ? "Undo" : "Complete"}
              </button>
              <button
                className="btn edit-btn"
                onClick={() => openEditModal(todo)}
              >
                Edit
              </button>
              <button
                className="btn delete-btn"
                onClick={() => dispatch(deleteTodo(todo.id))}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        className="add-todo-btn"
        onClick={() => setIsModalOpen(true)} // Open modal for adding
      >
        + Add Todo
      </button>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{isEditing ? "Edit Todo" : "Add New Todo"}</h2>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="modal-input"
            />
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="modal-input"
            />
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="modal-input"
            />
            <div className="modal-actions">
              <button className="btn cancel-btn" onClick={() => resetForm()}>
                Cancel
              </button>
              <button
                className="btn save-btn"
                onClick={isEditing ? handleEditTodo : handleAddTodo}
              >
                {isEditing ? "Save Changes" : "Add Todo"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoPage;
