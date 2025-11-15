<template>
  <div class="edit-task-page">
    <Header @toggle-menu="toggleSidebar" />
    <div class="dashboard-layout">
      <Sidebar :isOpen="isSidebarOpen" @openMessages="openMessages" />
      <main class="main-content">
        <div class="container">
          <div v-if="task" class="formulario-tarefa">
            <h2>Editar Tarefa</h2>
            <form @submit.prevent="handleUpdateTask">
              <div class="campo-formulario">
                <label for="titulo">Título:</label>
                <input
                  id="titulo"
                  v-model="titulo"
                  type="text"
                  placeholder="Título da tarefa"
                />
              </div>

              <div class="campo-formulario">
                <label for="descricao">Descrição:</label>
                <textarea
                  id="descricao"
                  v-model="descricao"
                  placeholder="Descrição da tarefa"
                  rows="5"
                ></textarea>
              </div>

              <div class="acoes-detalhes">
                <button type="submit" class="botao-salvar-alteracoes">
                  Salvar Alterações
                </button>
                <router-link to="/dashboard" class="botao-cancelar-edicao"
                  >Cancelar</router-link
                >
              </div>
            </form>
          </div>
          <div v-else class="sem-tarefas-container">
            <p class="sem-tarefas">Tarefa não encontrada.</p>
            <router-link to="/dashboard" class="botao-voltar-lista"
              >Voltar ao Dashboard</router-link
            >
          </div>
        </div>
      </main>
    </div>
    <Notification />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import Header from "../components/Header.vue";
import Sidebar from "../components/Sidebar.vue";
import Notification from "../components/Notification.vue";
import { useTaskStore } from "../stores/taskStore";
import { useNotificationStore } from "../stores/notificationStore";

const router = useRouter();
const route = useRoute();
const taskStore = useTaskStore();
const notificationStore = useNotificationStore();

const titulo = ref("");
const descricao = ref("");
const taskId = ref<number | null>(null);

const isModalOpen = ref(false);
const isSidebarOpen = ref(false);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const openMessages = () => {
  isModalOpen.value = true;
};

const closeMessages = () => {
  isModalOpen.value = false;
};

const task = computed(() => {
  if (!taskId.value) return null;
  return taskStore.getTaskById(taskId.value);
});

onMounted(() => {
  const id = route.params.id as string;
  taskId.value = Number(id);

  const currentTask = taskStore.getTaskById(taskId.value);
  if (currentTask) {
    titulo.value = currentTask.titulo;
    descricao.value = currentTask.descricao;
  }
});

const handleUpdateTask = () => {
  if (!taskId.value) return;

  // Verifica se todos os campos estão preenchidos
  if (!titulo.value && !descricao.value) {
    notificationStore.addNotification(
      "Por favor, preencha todos os campos antes de continuar.",
      "erro"
    );
    return;
  }

  if (titulo.value.length < 5) {
    notificationStore.addNotification(
      "O título deve ter pelo menos 5 caracteres.",
      "erro"
    );
    return;
  }

  if (descricao.value && descricao.value.length < 3) {
    notificationStore.addNotification(
      "A descrição deve ter pelo menos 3 caracteres, se preenchida.",
      "erro"
    );
    return;
  }
  taskStore.updateTask(taskId.value, titulo.value, descricao.value);
  notificationStore.addNotification(
    "Tarefa atualizada com sucesso!",
    "sucesso"
  );

  setTimeout(() => {
    router.push("/dashboard");
  }, 1500);
};
</script>

<style scoped>
.edit-task-page {
  min-height: 100vh;
  background-color: var(--cor-fundo);
  padding-top: 60px; /* Espaço para o header fixo */
}

.dashboard-layout {
  display: flex;
  min-height: calc(100vh - 60px);
}

.main-content {
  flex: 1;
  padding: 40px 20px;
  background: linear-gradient(180deg, var(--cor-sidebar), var(--color-bg));
  overflow-y: auto;
  transition: margin-left 0.3s ease;
}

/* Desktop: Sidebar visível, conteúdo principal deslocado */
@media (min-width: 769px) {
  .main-content {
    margin-left: 250px; /* Largura da sidebar */
  }
}

/* Mobile: Sidebar oculta, conteúdo principal ocupa 100% */
@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
  }
}

.container {
  max-width: 800px;
  margin: 0 auto;
}

.formulario-tarefa {
  background-color: var(--cor-cartao);
  padding: 30px;
  border-radius: 8px;
  box-shadow: var(--sombra-cartao);
  border: 1px solid var(--cor-borda);
}

.formulario-tarefa h2 {
  color: var(--texto-principal);
  margin-bottom: 30px;
  text-align: center;
}

.campo-formulario {
  margin-bottom: 20px;
}

.campo-formulario label {
  display: block;
  color: var(--texto-label);
  margin-bottom: 8px;
  font-weight: 600;
}

.campo-formulario input[type="text"],
.campo-formulario textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--cor-input-borda);
  border-radius: 4px;
  background-color: var(--cor-input);
  color: var(--texto-principal);
  font-family: Arial, sans-serif;
  box-sizing: border-box;
  transition: all 0.3s ease;
}

.campo-formulario input::placeholder,
.campo-formulario textarea::placeholder {
  color: var(--texto-placeholder);
}

.campo-formulario input:focus,
.campo-formulario textarea:focus {
  outline: none;
  border-color: var(--cor-primaria);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.campo-formulario textarea {
  resize: vertical;
  min-height: 100px;
}

.acoes-detalhes {
  display: flex;
  gap: 15px;
  margin-top: 30px;
  justify-content: space-between;
}

.botao-salvar-alteracoes,
.botao-cancelar-edicao {
  flex: 1;
  width: 200px;
  padding: 10px;
  border: none;
  border-radius: 6px;
  text-decoration: none;
  text-align: center;
  cursor: pointer;
  font-weight: bold;
  margin-top: 10px;
  transition: background 0.3s;
}

/* Responsividade para botões de ação */
@media (max-width: 500px) {
  .acoes-detalhes {
    flex-direction: column;
    gap: 10px;
  }

  .botao-salvar-alteracoes,
  .botao-cancelar-edicao {
    width: 100%;
  }
}

.botao-salvar-alteracoes {
  background-color: var(--cor-sucesso);
  color: white;
}

.botao-salvar-alteracoes:hover {
  background-color: var(--cor-sucesso-hover);
}

.botao-cancelar-edicao {
  background-color: var(--cor-primaria);
  color: white;
}

.botao-cancelar-edicao:hover {
  background-color: var(--cor-primaria-hover);
}

.sem-tarefas-container {
  text-align: center;
  padding: 60px 20px;
  background-color: var(--cor-cartao);
  border-radius: 8px;
  border: 1px dashed var(--cor-borda);
}

.sem-tarefas {
  color: var(--texto-secundario);
  font-size: 1.1em;
  margin-bottom: 20px;
}

.botao-voltar-lista {
  display: inline-block;
  background-color: var(--cor-primaria);
  color: white;
  padding: 10px 20px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  transition: background-color 0.3s ease;
}

.botao-voltar-lista:hover {
  background-color: var(--cor-primaria-hover);
}
</style>
