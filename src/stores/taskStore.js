import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useTaskStore = defineStore("tasks", () => {
  const tasks = ref([]);

  // Carregar tarefas do localStorage
  const loadTasks = () => {
    const saved = localStorage.getItem("tarefas");
    if (saved) {
      tasks.value = JSON.parse(saved);
    }
  };

  // Salvar tarefas no localStorage
  const saveTasks = () => {
    localStorage.setItem("tarefas", JSON.stringify(tasks.value));
  };

  // Adicionar tarefa
  const addTask = (titulo, descricao) => {
    const newTask = {
      id: Date.now(),
      titulo,
      descricao,
      status: "🕓 Pendente",
      concluida: false,
    };
    tasks.value.push(newTask);
    saveTasks();
    return newTask;
  };

  // Obter tarefa por ID
  const getTaskById = (id) => {
    return tasks.value.find((t) => t.id === id);
  };

  // Atualizar tarefa
  const updateTask = (id, titulo, descricao) => {
    const task = getTaskById(id);
    if (task) {
      task.titulo = titulo;
      task.descricao = descricao;
      saveTasks();
    }
  };

  // Alternar status da tarefa
  const toggleTask = (id) => {
    const task = getTaskById(id);
    if (task) {
      task.concluida = !task.concluida;
      task.status = task.concluida ? "✅ Concluída" : "🕓 Pendente";
      saveTasks();
    }
  };

  // Excluir tarefa
  const deleteTask = (id) => {
    tasks.value = tasks.value.filter((t) => t.id !== id);
    saveTasks();
  };

  // Obter todas as tarefas
  const getAllTasks = computed(() => tasks.value);

  // Obter tarefas pendentes
  const getPendingTasks = computed(() =>
    tasks.value.filter((t) => !t.concluida)
  );

  // Obter tarefas concluídas
  const getCompletedTasks = computed(() =>
    tasks.value.filter((t) => t.concluida)
  );

  // Inicializar ao criar a store
  loadTasks();

  return {
    tasks,
    loadTasks,
    saveTasks,
    addTask,
    getTaskById,
    updateTask,
    toggleTask,
    deleteTask,
    getAllTasks,
    getPendingTasks,
    getCompletedTasks,
  };
});
