<template>
  <aside class="sidebar" :class="{ active: isOpen }">
    <nav class="menu-navegacao">
      <!-- Perfil: usa button para abrir modal (não router-link) -->
      <div class="profile" @click="openProfile" type="button">
        <i class="bi bi-person"></i>
        <span>Olá, {{ userName }}!</span>
      </div>

      <!-- Links normais -->
      <router-link
        to="/dashboard"
        class="nav-link"
        :class="{ active: isActive('/dashboard') }"
      >
        <i class="bi bi-house-door"></i>
        <span>Dashboard</span>
      </router-link>

      <router-link
        to="/create-task"
        class="nav-link"
        :class="{ active: isActive('/create-task') }"
      >
        <i class="bi bi-plus-circle"></i>
        <span>Nova Tarefa</span>
      </router-link>

      <a href="#" class="nav-link" @click.prevent="openMessages">
        <i class="bi bi-chat-dots"></i>
        <span>Mensagens</span>
        <span v-if="messageCount > 0" class="message-count">{{
          messageCount
        }}</span>
      </a>

      <router-link
        to="/create-task"
        class="nav-link"
        :class="{ active: isActive('#') }"
      >
        <i class="bi bi-gear"></i>
        <span>Configurações</span>
      </router-link>

      <!-- Logout permanece link mas dispara logout -->
      <a href="#" class="nav-link logout-link" @click.prevent="confirmLogout">
        <i class="bi bi-box-arrow-right"></i>
        <span>Sair</span>
      </a>
    </nav>

    <!-- Modal de perfil (componente importado) -->
    <UserProfileModal
      :isOpen="isProfileOpen"
      :user="currentUser"
      @close="isProfileOpen = false"
      @logout="handleLogout"
      @edit="handleEditProfile"
    />
  </aside>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useNotificationStore } from "../stores/notificationStore";
import { useUserStore } from "../stores/userStore";

// importe o componente do modal (verifique o caminho)
import UserProfileModal from "./UserProfileModal.vue";

// props (se você recebe isOpen do pai)
defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

// emits (se desejar emitir algo para o pai)
const emit = defineEmits(["openMessages", "toggle-menu"]);

// stores e rota
const notificationStore = useNotificationStore();
const userStore = useUserStore();
const route = useRoute();
const router = useRouter();

// reactive state local
const isProfileOpen = ref(false);

// usuário atual (ajuste conforme sua store - aqui é um exemplo)
const currentUser = computed(() => {
  // se sua store tem currentUser, retorne ele
  // return userStore.currentUser || { name: 'Usuário', email: '', avatar: '' }
  // exemplo genérico:
  return {
    name: userStore.currentUser?.nome ?? "Usuário",
    email: userStore.currentUser?.email ?? "email@exemplo.com",
    avatar: userStore.currentUser?.avatar ?? null,
  };
});

const userName = computed(() => currentUser.value.name);
const messageCount = computed(() => notificationStore.messages.length);

// helpers
const isActive = (path) => route.path === path;

const openMessages = () => emit("openMessages");

// Abre o modal de perfil
const openProfile = () => {
  isProfileOpen.value = true;
};

// Quando modal emite logout
const handleLogout = () => {
  // executa logout na store e redireciona
  userStore.logout();
  isProfileOpen.value = false;
  router.push("/login");
};

// Quando modal emite editar perfil
const handleEditProfile = () => {
  // aqui você pode navegar para a página de editar perfil ou abrir formulário
  isProfileOpen.value = false;
  router.push("/edit-profile"); // ajuste se não existir rota
};

// confirmação antes de sair (opcional)
const confirmLogout = () => {
  if (confirm("Deseja realmente sair?")) {
    userStore.logout();
    router.push("/login");
  }
};
</script>

<style scoped>
.sidebar {
  position: fixed;
  left: 0;
  top: 60px;
  width: 250px;
  height: calc(100vh - 60px);
  background: linear-gradient(180deg, var(--cor-sidebar), var(--color-bg));
  border-right: 1px solid var(--cor-borda);
  box-shadow: var(--sombra-cartao);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
  font-weight: bold;
  border-radius: 1 20px 20px 0;
  transition: all 0.3s ease;
  overflow-y: hidden;
  z-index: 900;
}

/* ==== Perfil ==== */
.profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-weight: bold;
  margin-bottom: 40px;
  margin-right: 15px;
  text-decoration: none;
  color: var(--color-info-dark);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.profile i {
  font-size: 60px;
  margin-bottom: 10px;
  color: var(--color-info-dark);
}

.profile:hover {
  transform: translateY(-3px);
}

/* Hover no ícone */
.profile:hover i {
  transform: scale(1.2);
  color: var(--color-primary);
}

.profile:hover {
  color: var(--color-info-dark);
}

/* ==== Menu ==== */
.menu-navegacao {
  display: flex;
  flex-direction: column;
  width: 100%;
  flex-grow: 1;
  gap: 10px;
}

/* ==== Links ==== */
.nav-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: var(--color-info-dark);
  text-decoration: none;
  padding: 12px 20px;
  border-radius: 10px;
  margin: 0 15px;
  transition: all 0.3s ease;
  position: relative;
}

.nav-link i {
  font-size: 1.3rem;
  transition: all 0.3s ease;
}

.nav-link:hover {
  color: var(--color-primary);
  background-color: var(--color-light);
}

.nav-link:hover i {
  transform: translateX(-4px);
}

/* ==== Link ativo ==== */
.nav-link.active {
  background-color: var(--color-light);
  color: var(--color-primary);
  font-weight: 600;
}

.nav-link.active::before {
  content: "";
  position: absolute;
  left: 0;
  top: 8px;
  bottom: 8px;
  width: 4px;
  background: var(--color-primary);
  border-radius: 0 4px 4px 0;
}

/* ==== Contador de mensagens ==== */
.message-count {
  background: var(--color-danger);
  color: var(--color-white);
  font-size: 0.8rem;
  font-weight: 600;
  border-radius: 12px;
  padding: 2px 8px;
  margin-left: auto;
}

/* ==== Logout ==== */
.logout-link {
  margin-top: auto; /* empurra o botão pro fim da sidebar */
  margin-bottom: 25px;
  color: var(--texto-principal);
  display: flex;
  align-items: center;
  gap: 0.8rem;
  text-decoration: none;
  font-weight: 200;
  padding: 12px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.logout-link i {
  font-size: 1.3rem;
}

.logout-link:hover {
  background-color: var(--color-light);
  color: #dc2626;
  transform: translateX(5px);
}

.logout-link:active {
  transform: scale(0.98);
}

/* Estilos de responsividade para Sidebar */

/* Mobile: Oculta a sidebar por padrão e usa transição para aparecer */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: -250px; /* Esconde a sidebar fora da tela */
    transition: left 0.3s ease;
    z-index: 999; /* Garante que fique acima do conteúdo principal */
  }

  .sidebar.active {
    left: 0; /* Mostra a sidebar quando ativa */
  }
}

/* Desktop: Sidebar sempre visível */
@media (min-width: 769px) {
  .sidebar {
    position: fixed;
    width: 250px;
    left: 0;
  }
}
</style>
