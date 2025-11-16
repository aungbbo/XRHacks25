// src/Secondpage.tsx
import React, { useState } from "react";
import "./App.css";

type Todo = {
  id: number;
  text: string;
  done: boolean;
};

export default function SecondPage() {
  const [input, setInput] = useState("");
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: "Capture quick ideas", done: false },
    { id: 2, text: "Turn notes into tasks", done: false },
    { id: 3, text: "Review today’s priorities", done: false },
  ]);

  const toggleTodo = (id: number) => {
    setTodos((items) =>
      items.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const addTodo = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setTodos((items) => [
      ...items,
      { id: Date.now(), text: trimmed, done: false },
    ]);
    setInput("");
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") addTodo();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-base font-semibold text-white">
            Second Space – To-Do
          </h2>
          <p className="text-xs text-white/70">
            A separate board for this room’s tasks.
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a task..."
          className="flex-1 px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-sm text-white placeholder:text-white/50 outline-none"
        />
        <button
          onClick={addTodo}
          className="px-3 py-2 rounded-xl bg-blue-500 text-white text-xs font-medium hover:bg-blue-600 transition-colors"
          type="button"
        >
          Add
        </button>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {todos.map((todo) => (
          <label
            key={todo.id}
            className="flex items-start gap-2 rounded-xl bg-white/10 hover:bg-white/15 px-3 py-2 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => toggleTodo(todo.id)}
              className="mt-0.5 h-4 w-4 rounded border border-white/40 bg-transparent"
            />
            <span
              className={`text-xs text-white ${
                todo.done ? "line-through opacity-60" : ""
              }`}
            >
              {todo.text}
            </span>
          </label>
        ))}
        {todos.length === 0 && (
          <p className="text-xs text-white/50">No tasks yet. Add one above.</p>
        )}
      </div>
    </div>
  );
}
