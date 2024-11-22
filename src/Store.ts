import { makeAutoObservable } from "mobx";

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export type Filter = "all" | "completed" | "active";

class Store {
  todos: Todo[] = [
    { id: 1732298858501, title: "Тестовое задание", completed: false },
    { id: 1732298858502, title: "Прекрасный код", completed: true },
    { id: 1732298858503, title: "Покрытие тестами", completed: false },
  ];
  filter: Filter = "all";

  constructor() {
    makeAutoObservable(this);
  }

  setFilter(filter: Filter) {
    this.filter = filter;
  }

  addTodo(title: string) {
    const newTodo: Todo = {
      id: Date.now(),
      title,
      completed: false,
    };
    this.todos.push(newTodo);
  }

  toggleTodo(id: number) {
    const todo = this.todos.find((todo) => todo.id === id);
    if (todo) {
      todo.completed = !todo.completed;
    }
  }

  editTodo(id: number, newTitle: string) {
    const todo = this.todos.find((todo) => todo.id === id);
    if (todo) {
      todo.title = newTitle;
    }
  }

  removeTodo(id: number) {
    this.todos = this.todos.filter((todo) => todo.id !== id);
  }

  removeCompletedTodos() {
    this.todos = this.todos.filter((todo) => !todo.completed);
  }

  get filteredTodos(): Todo[] {
    switch (this.filter) {
      case "completed":
        return this.todos.filter((todo) => todo.completed);
      case "active":
        return this.todos.filter((todo) => !todo.completed);
      default:
        return this.todos;
    }
  }
}

const store = new Store();
export default store;
