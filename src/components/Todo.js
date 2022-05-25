import React, { useState, useEffect } from "react";
import "./Todo.css";
import { MdDone } from "react-icons/md";
import axios from "axios";
axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
axios.defaults.headers.common["Access-Control-Allow-Methods"] = "*";

function Task({ task, index, completeTask, removeTask }) {
  return (
    <div
      className="task"
      style={{ textDecoration: task.completed ? "line-through" : "" }}
    >
      {task.title}

      <button style={{ background: "red" }} onClick={() => removeTask(index)}>
        X
      </button>
      <button onClick={() => completeTask(index)}>
        <MdDone />
      </button>
    </div>
  );
}

function CreateTask({ addTask }) {
  const [value, setValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value) return;
    addTask(value);
    setValue("");
  };
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        className="input"
        value={value}
        placeholder="Add a new task"
        onChange={(e) => setValue(e.target.value)}
      />
      <button>
        <p>Add</p>
      </button>
    </form>
  );
}

function Header() {
  return <h1>My To Do List!</h1>;
}

function Todo() {
  const [tasks, setTasks] = useState([]);

  const addTask = (title) => {
    postTask(title);
  };

  const postTask = (postTitle) => {
    axios
      .post("http://localhost:8080/todos", {
        title: postTitle,
        completed: false,
      })
      .then((response) => {});
    getToDos();
  };

  const completeTask = (index) => {
    const newTasks = [...tasks];
    newTasks[index].completed = true;
    setTasks(newTasks);
    const patchId = tasks[index].id;
    axios.patch(`http://localhost:8080/todos/${patchId}`, { completed: true });
  };

  const removeTask = (index) => {
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);
    const deleteId = tasks[index].id;
    axios
      .delete(`http://localhost:8080/todos/${deleteId}`)
      .then((response) => {});
  };
  const getToDos = async () => {
    const { data } = await axios.get("http://localhost:8080/todos");
    setTasks(data);
  };

  useEffect(() => {
    getToDos();
  }, []);

  return (
    <>
      <div className="list">
        <Header />
      </div>
      <div className="todo-container">
        <div className="create-task">
          <CreateTask addTask={addTask} />
        </div>

        <div className="tasks">
          {tasks.map((task, index) => (
            <Task
              task={task}
              index={index}
              completeTask={completeTask}
              removeTask={removeTask}
              key={index}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default Todo;
