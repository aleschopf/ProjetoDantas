<template>
<div class="navbar">
    <Menubar :model="items" />
    <ToggleButton v-model="darkMode" class="light-mode" onLabel="Dark" offLabel="Light" @click="toggleDarkMode" />
  </div>

  <input type="file" accept=".json" ref="fileInput" style="display: none" @change="handleFileSelect" />

  <div class="card flex justify-center">
    <Dialog v-model:visible="visibleAddTag" modal header="Cadastrar tag" class="modal-header"
      :style="{ width: '25rem'}">
      <template #header>
        <div class="inline-flex items-center justify-center gap-2" id="modal-header">
          Cadastrar tag
        </div>
      </template>
      <div class="flex items-center gap-4 mb-8">
        <label for="tag" id="modalType" class="font-semibold w-24">Tag</label>
        <InputText id="tag" class="flex-auto" autocomplete="off" />
      </div>
      <div class="flex justify-end gap-2" id="modal-buttons">
        <Button type="button" id="btn-cadastro" label="Cancelar" severity="secondary"
          @click="visibleAddTag = false"></Button>
        <Button type="button" id="btn-cadastro" label="Salvar" @click="visibleAddTag = false"></Button>
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import Menubar from 'primevue/menubar';
import InputText from 'primevue/inputtext'
import ToggleButton from 'primevue/togglebutton'
import { exportDatabase } from '../services/database-export.service'
import { importDatabase } from '../services/database-import.service';

const visibleAddTag = ref(false);

const darkMode = ref(false);

const fileInput = ref<HTMLInputElement | null>(null);

const handleFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    try {
      const fileContent = await file.text();
      const result = await importDatabase(fileContent);
      console.log(result.message);
    } catch (error) {
      console.error('Error reading file:', error);
    }
  }
};

const toggleDarkMode = () => {
  if (darkMode.value) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

const items = ref([
  {
    label: 'Cadastrar tags',
    command: () => {
      visibleAddTag.value = true;
    },
  },
  {
    label: 'Cadastrar recomendações',
  },
  {
    label: 'Cadastrar exercícios',
  },
  {
    label: 'Exportar JSON',
    command: () => {
      exportDatabase();
    }
  },
  {
    label: 'Importar JSON',
    command: () => {
      fileInput.value?.click();
    }
  }
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

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');

#modal-header {
  font-family: "Roboto", sans-serif;
  font-weight: 900;
  font-style: normal;
  font-size: large;
}

#modal-buttons {
  margin-top: 15px;
}

.navbar {
  font-family: "Roboto", sans-serif;
  font-weight: 500;
  font-style: normal;
}

.light-mode {
  font-family: "Roboto", sans-serif;
  font-weight: 500;
  font-style: normal;
  margin-right: 1rem;
}
</style>
