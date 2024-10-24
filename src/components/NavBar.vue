<script setup lang="ts">
import { ref, onMounted, provide, watch } from 'vue';
import Menubar from 'primevue/menubar';
import ConfirmDialog from 'primevue/confirmdialog';
import ToggleButton from 'primevue/togglebutton';
import { useRouter } from 'vue-router';
import { exportDatabase } from '../services/database-export.service';
import { importDatabase } from '../services/database-import.service';

const router = useRouter();

const darkMode = ref(false);
provide('darkMode', darkMode);

const fileInput = ref<HTMLInputElement | null>(null);

const handleFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    try {
      const fileContent = await file.text();
      const result = await importDatabase(fileContent);
    } catch (error) {
      console.error('Error reading file:', error);
    }
  }
};

const toggleDarkMode = () => {
  document.documentElement.classList.toggle('dark', darkMode.value);
  provide('darkMode', darkMode);
};

const items = ref([
  {
    label: 'Cadastrar tags e públicos alvos',
    command: () => router.push('/'),
  },
  {
    label: 'Cadastrar exercícios',
    command: () => router.push('/exercicios/cadastro'),
  },
  {
    label: 'Criar programa de exerícicios',
    command: () => router.push('/exercicios'),
  },
  {
    label: 'Exportar JSON',
    command: () => {
      exportDatabase();
    },
  },
  {
    label: 'Importar JSON',
    command: () => {
      fileInput.value?.click();
    },
  },
]);

onMounted(() => {
  const savedDarkMode = localStorage.getItem('darkMode');
  darkMode.value = savedDarkMode === 'true';
  toggleDarkMode();
});

watch(darkMode, (newValue) => {
  localStorage.setItem('darkMode', newValue.toString());
  toggleDarkMode();
});
</script>

<template>
  <div class="w-full flex items-center justify-center mb-10">
    <Menubar :model="items" class="w-[98%] rounded-lg shadow-md overflow-hidden">
      <template #end>
        <ToggleButton v-model="darkMode" class="ml-4" onLabel="Dark" offLabel="Light" @click="toggleDarkMode" />
      </template>
    </Menubar>
  </div>
  <input type="file" accept=".json" ref="fileInput" class="hidden" @change="handleFileSelect" />
  <ConfirmDialog />
</template>



<style scoped>
</style>
