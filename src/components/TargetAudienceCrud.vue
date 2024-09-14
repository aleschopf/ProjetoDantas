<script setup lang="ts">
import { ref, onMounted, onUnmounted, reactive } from 'vue';
import { LocalStorageRepository } from '../repositories/local-storage.repository';
import { TargetAudience } from '../entities/target-audience.entity';
import { updateTargetAudience, saveTargetAudience } from '../repositories/target-audience.repository';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";

import Drawer from 'primevue/drawer';
import FloatLabel from 'primevue/floatlabel';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Select from 'primevue/select';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Toolbar from 'primevue/toolbar';
import Tag from 'primevue/tag';
import Toast from 'primevue/toast';
import Dialog from 'primevue/dialog';

const darkMode = ref(document.documentElement.classList.contains('dark'));
const targetAudienceRepo = new LocalStorageRepository<TargetAudience>(TargetAudience.table);
const targetAudiences = ref<TargetAudience[]>([]);
const selectedTargetAudiences = ref<TargetAudience[]>([]);
const editingTargetAudience = ref<TargetAudience | null>(null);
const editingTargetAudienceName = ref('');
const visibleTargetAudienceRegister = ref(false);
const visibleTargetAudienceEdit = ref(false);
const targetAudienceNameValue = ref('');
const selectedTargetAudienceColor = ref<{ color: string, class: string } | null>(null);
const targetAudienceNameHelp = ref('Digite o nome do Público Alvo que quer cadastrar');
const targetAudienceMessageClass = ref('');
const targetAudienceError = ref(false);
const targetAudienceNameHelpId = 'targetAudienceNameHelp';
const targetAudienceEditHelp = ref('Digite o nome da Público Alvo que quer atualizar');
const targetAudienceMessageEditClass = ref('');
const targetAudienceErrorEdit = ref(false);
const targetAudienceNameHelpIdEdit = 'targetAudienceNameHelpEdit';

const filters = reactive({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
});

const confirm = useConfirm();
const toast = useToast();

const colors = ref([
  { color: 'secondary', class: 'bg-gray-500' },
  { color: 'success', class: 'bg-green-500' },
  { color: 'info', class: 'bg-blue-300' },
  { color: 'warn', class: 'bg-yellow-500' },
  { color: 'danger', class: 'bg-red-500' },
  { color: 'contrast', class: 'bg-black' }
]);

const initFilters = () => {
  filters.global.value = null;
  filters.name.constraints[0].value = null;
};

const registerTargetAudience = () => {
  if (!targetAudienceNameValue.value || !selectedTargetAudienceColor.value) {
    targetAudienceNameHelp.value = 'Todos os campos são obrigatórios';
    targetAudienceMessageClass.value = 'text-red-500';
    targetAudienceError.value = true;
    return;
  }

  const newTargetAudience: TargetAudience = {
    name: targetAudienceNameValue.value,
    color: selectedTargetAudienceColor.value?.color,
    id: Date.now().toString(),
  };

  const result = saveTargetAudience(newTargetAudience);

  if (result.success) {
    targetAudienceNameHelp.value = 'Público Alvo cadastrado com sucesso';
    targetAudienceMessageClass.value = 'text-green-500';
    targetAudienceNameValue.value = '';
    selectedTargetAudienceColor.value = null;
    targetAudiences.value = targetAudienceRepo.find();
  } else {
    targetAudienceNameHelp.value = result.message;
    targetAudienceMessageClass.value = 'text-red-500';
    targetAudienceError.value = true;
  }
};

const deleteTargetAudience = (targetAudience: TargetAudience) => {
  confirm.require({
    message: `Tem certeza que deseja excluir o Público Alvo "${targetAudience.name}"?`,
    header: 'Confirmação de Exclusão',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Apagar',
    acceptClass: 'accept-delete',
    rejectLabel: 'Cancelar',
    rejectClass: 'reject-delete',
    accept: () => {
      const result = targetAudienceRepo.delete(targetAudience.id);
      if (result.success) {
        toast.add({ severity: 'warn', summary: 'Confirmado', detail: 'Público Alvo apagado', life: 3000 });
        targetAudiences.value = targetAudiences.value.filter(t => t.id !== targetAudience.id);
      } else {
        console.error(result.message);
      }
    },
  });
};

const deleteSelectedTargetAudiences = () => {
  confirm.require({
    message: `Tem certeza que deseja excluir ${selectedTargetAudiences.value.length} Público(s) Alvo(s) selecionado(s)?`,
    header: 'Confirmação de Exclusão',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Apagar',
    acceptClass: 'accept-delete',
    rejectLabel: 'Cancelar',
    rejectClass: 'reject-delete',
    accept: () => {
      selectedTargetAudiences.value.forEach(targetAudience => {
        const result = targetAudienceRepo.delete(targetAudience.id);
        if (result.success) {
          targetAudiences.value = targetAudiences.value.filter(t => t.id !== targetAudience.id);
        } else {
          console.error(`Erro ao excluir targetAudience ${targetAudience.id}: ${result.message}`);
        }
      });
      toast.add({ severity: 'warn', summary: 'Confirmado', detail: 'TargetAudiences apagadas', life: 3000 });
      selectedTargetAudiences.value = [];
    },
  });
};

const editTargetAudience = (targetAudience: TargetAudience) => {
  editingTargetAudience.value = { ...targetAudience };
  editingTargetAudienceName.value = targetAudience.name;
  selectedTargetAudienceColor.value = colors.value.find(c => c.color === targetAudience.color) || null;
  visibleTargetAudienceEdit.value = true;
};

const saveEditedTargetAudience = () => {
  if (!editingTargetAudience.value || !selectedTargetAudienceColor.value) return;

  const result = updateTargetAudience(editingTargetAudience.value.id, {
    name: editingTargetAudienceName.value,
    color: selectedTargetAudienceColor.value.color,
  });

  if (result.success) {
    targetAudienceEditHelp.value = 'Digite o nome do Público Alvo que quer atualizar';
    targetAudienceMessageEditClass.value = '';
    visibleTargetAudienceEdit.value = false;
    targetAudiences.value = targetAudienceRepo.find();
  } else {
    targetAudienceEditHelp.value = result.message;
    targetAudienceMessageEditClass.value = 'text-red-500';
    targetAudienceErrorEdit.value = true;
  }
};

const abrirDrawer = () => {
  visibleTargetAudienceRegister.value = !visibleTargetAudienceRegister.value;
  targetAudienceNameHelp.value = "Digite o nome do Público Alvo que quer cadastrar";
  targetAudienceMessageClass.value = "";
};

const limparHelpText = () => {
  targetAudienceNameHelp.value = "Digite o nome do Público Alvo que quer cadastrar";
  targetAudienceMessageClass.value = "";
};

const cancelRegisterTargetAudience = () => {
  visibleTargetAudienceRegister.value = false;
  targetAudienceNameValue.value = '';
  selectedTargetAudienceColor.value = null;
  targetAudienceNameHelp.value = 'Digite o nome do Público Alvo que quer cadastrar';
  targetAudienceMessageClass.value = '';
  targetAudienceError.value = false;
};

const cancelEditTargetAudience = () => {
  visibleTargetAudienceEdit.value = false;
  editingTargetAudience.value = null;
  selectedTargetAudienceColor.value = null;
};

const updateDarkMode = () => {
  darkMode.value = document.documentElement.classList.contains('dark');
};

let observer: MutationObserver;

onMounted(() => {
  initFilters();
  targetAudiences.value = targetAudienceRepo.find();

  updateDarkMode()

  observer = new MutationObserver(() => {
    updateDarkMode();
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  });
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
});
</script>

<template>
  <Toast />
  <Dialog v-model:visible="visibleTargetAudienceEdit" header="Editar   " :modal="true" class="p-fluid">
    <div class="p-4 font-roboto">
      <FloatLabel class="p-float-label mb-0.5">
        <InputText id="editTargetAudienceName" v-model="editingTargetAudienceName"
          class="w-full p-2 border border-gray-300 rounded" :class="{ 'border-red-500': targetAudienceErrorEdit }" />
        <label for="editTargetAudienceName">Nome do Público Alvo</label>
      </FloatLabel>
      <small :id="targetAudienceNameHelpIdEdit" :class="targetAudienceMessageEditClass">{{ targetAudienceEditHelp
        }}</small>

      <div class="mb-3 mt-2">
        <Select v-model="selectedTargetAudienceColor" :options="colors" optionLabel="color" placeholder="Selecione uma cor"
          class="w-full color-select">
          <template #value="slotProps">
            <div v-if="slotProps.value" :class="['color-box', slotProps.value.class]"></div>
            <span v-else class="text-gray-400">{{ slotProps.placeholder }}</span>
          </template>
          <template #option="slotProps">
            <div :class="['color-box', slotProps.option.class]"></div>
          </template>
        </Select>
      </div>

      <div class="w-full flex justify-center mt-4 space-x-2">
        <Button label="Cancelar" icon="pi pi-times" class="w-48 bg-red-400 font-roboto text-center text-white"
          severity="danger" @click="cancelEditTargetAudience" />
        <Button label="Salvar" icon="pi pi-check" class="w-48 bg-green-400 font-roboto text-center text-white"
          severity="success" @click="saveEditedTargetAudience" />
      </div>
    </div>
  </Dialog>

  <Drawer v-model:visible="visibleTargetAudienceRegister" header="Cadastrar Público Alvo" position="right"
    class="w-full md:w-80 lg:w-96">
    <div class="p-4 font-roboto">
      <FloatLabel class="p-float-label">
        <InputText id="targetAudienceName" v-model="targetAudienceNameValue"
          class="w-full p-2 border border-gray-300 rounded" :class="{ 'border-red-500': targetAudienceError }"
          @change="limparHelpText" />
        <label for="targetAudienceName">Nome do Público Alvo</label>
      </FloatLabel>
      <small :id="targetAudienceNameHelpId" :class="targetAudienceMessageClass">{{ targetAudienceNameHelp }}</small>

      <div class="mt-4">
        <Select v-model="selectedTargetAudienceColor" :options="colors" optionLabel="color" placeholder="Selecione uma cor"
          class="w-full color-select">
          <template #value="slotProps">
            <div v-if="slotProps.value" :class="['color-box', slotProps.value.class]"></div>
            <span v-else class="text-gray-400">{{ slotProps.placeholder }}</span>
          </template>
          <template #option="slotProps">
            <div :class="['color-box', slotProps.option.class]"></div>
          </template>
        </Select>
      </div>

      <div class="w-full flex justify-center mt-4 space-x-2">
        <Button label="Cancelar" icon="pi pi-times" class="w-48 bg-red-400 font-roboto text-center text-white"
          severity="danger" @click="cancelRegisterTargetAudience" />
        <Button label="Cadastrar" icon="pi pi-check" class="w-48 bg-green-400 font-roboto text-center text-white"
          severity="success" @click="registerTargetAudience" />
      </div>
    </div>
  </Drawer>

  <div :class="['table-view', darkMode ? 'table-view-dark' : 'table-view-light']">
    <Toolbar class="mb-6">
      <template #start>
        <h4 class="mr-full">Gerenciar Públicos Alvos</h4>
      </template>
      <template #end>
        <Button label="Adicionar" icon="pi pi-plus" severity="success" class="mr-2" @click="abrirDrawer" />
        <Button label="Apagar selecionados" icon="pi pi-trash" severity="danger" class="mr-2"
          @click="deleteSelectedTargetAudiences" :disabled="!selectedTargetAudiences.length" />
      </template>
    </Toolbar>

    <DataTable ref="dt" v-model:selection="selectedTargetAudiences" :value="targetAudiences" dataKey="id"
      :paginator="true" :rows="10"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      :rowsPerPageOptions="[10, 20, 30]"
      currentPageReportTemplate="Mostrando de {first} a {last}. Total de {totalRecords} Público Alvo" :filters="filters"
      :globalFilterFields="['name']" removableSort>
      <template #header>
        <div class="flex flex-wrap gap-2 items-center justify-between">
          <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText v-model="filters['global'].value" class="ml-2" placeholder="Buscar..." />
          </span>
        </div>
      </template>

      <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>

      <Column field="name" header="Nome" sortable filterField="name" style="min-width: 16rem">
        <template #body="slotProps">
          <Tag :value="slotProps.data.name" :severity="slotProps.data.color" />
        </template>
      </Column>

      <Column header="Ações" style="min-width: 12rem">
        <template #body="slotProps">
          <Button icon="pi pi-pencil" rounded class="mr-2" @click="editTargetAudience(slotProps.data)" />
          <Button icon="pi pi-trash" rounded severity="danger" @click="deleteTargetAudience(slotProps.data)" />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped></style>
