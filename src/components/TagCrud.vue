<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { LocalStorageRepository } from '../repositories/local-storage.repository';
import { Tags } from '../entities/tag.entity';
import { updateTag, saveTag } from '../repositories/tag.repository';
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
import ConfirmDialog from 'primevue/confirmdialog';
import Dialog from 'primevue/dialog';

const tagRepo = new LocalStorageRepository<Tags>('tags');
const tags = ref<Tags[]>([]);
const selectedTags = ref<Tags[]>([]);
const editingTag = ref<Tags | null>(null);
const editingTagName = ref('');
const visibleTagRegister = ref(false);
const visibleTagEdit = ref(false);
const tagNameValue = ref('');
const selectedTagColor = ref<{ color: string, class: string } | null>(null);
const tagNameHelp = ref('Digite o nome da tag que quer cadastrar');
const tagMessageClass = ref('');
const tagError = ref(false);
const tagNameHelpId = 'tagNameHelp';
const tagEditHelp = ref('Digite o nome da tag que quer atualizar');
const tagMessageEditClass = ref('');
const tagErrorEdit = ref(false);
const tagNameHelpIdEdit = 'tagNameHelpEdit';

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

const registerTag = () => {
  if (!tagNameValue.value || !selectedTagColor.value) {
    tagNameHelp.value = 'Todos os campos são obrigatórios';
    tagMessageClass.value = 'text-red-500';
    tagError.value = true;
    return;
  }

  const newTag: Tags = {
    name: tagNameValue.value,
    color: selectedTagColor.value?.color,
    id: Date.now().toString(),
  };

  const result = saveTag(newTag);

  if (result.success) {
    tagNameHelp.value = 'Tag cadastrada com sucesso';
    tagMessageClass.value = 'text-green-500';
    tagNameValue.value = '';
    selectedTagColor.value = null;
    tags.value = tagRepo.find();
  } else {
    tagNameHelp.value = result.message;
    tagMessageClass.value = 'text-red-500';
    tagError.value = true;
  }
};

const deleteTag = (tag: Tags) => {
  confirm.require({
    message: `Tem certeza que deseja excluir a tag "${tag.name}"?`,
    header: 'Confirmação de Exclusão',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Apagar',
    acceptClass: 'accept-delete',
    rejectLabel: 'Cancelar',
    rejectClass: 'reject-delete',
    accept: () => {
      const result = tagRepo.delete(tag.id);
      if (result.success) {
        toast.add({ severity: 'info', summary: 'Confirmado', detail: 'Tag apagada', life: 3000 });
        tags.value = tags.value.filter(t => t.id !== tag.id);
      } else {
        console.error(result.message);
      }
    },
  });
};

const deleteSelectedTags = () => {
  confirm.require({
    message: `Tem certeza que deseja excluir ${selectedTags.value.length} tag(s) selecionada(s)?`,
    header: 'Confirmação de Exclusão',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Apagar',
    acceptClass: 'accept-delete',
    rejectLabel: 'Cancelar',
    rejectClass: 'reject-delete',
    accept: () => {
      selectedTags.value.forEach(tag => {
        const result = tagRepo.delete(tag.id);
        if (result.success) {
          tags.value = tags.value.filter(t => t.id !== tag.id);
        } else {
          console.error(`Erro ao excluir tag ${tag.id}: ${result.message}`);
        }
      });
      toast.add({ severity: 'warn', summary: 'Confirmado', detail: 'Tags apagadas', life: 3000 });
      selectedTags.value = [];
    },
  });
};

const editTag = (tag: Tags) => {
  editingTag.value = { ...tag };
  editingTagName.value = tag.name;
  selectedTagColor.value = colors.value.find(c => c.color === tag.color) || null;
  visibleTagEdit.value = true;
};

const saveEditedTag = () => {
  if (!editingTag.value || !selectedTagColor.value) return;

  const result = updateTag(editingTag.value.id, {
    name: editingTagName.value,
    color: selectedTagColor.value.color,
  });

  if (result.success) {
    tagEditHelp.value = 'Digite o nome da tag que quer atualizar';
    tagMessageEditClass.value = '';
    visibleTagEdit.value = false;
    tags.value = tagRepo.find();
  } else {
    tagEditHelp.value = result.message;
    tagMessageEditClass.value = 'text-red-500';
    tagErrorEdit.value = true;
  }
};

const abrirDrawer = () => {
  visibleTagRegister.value = !visibleTagRegister.value;
  tagNameHelp.value = "Digite o nome da tag que quer cadastrar";
  tagMessageClass.value = "";
};

const limparHelpText = () => {
  tagNameHelp.value = "Digite o nome da tag que quer cadastrar";
  tagMessageClass.value = "";
};

const cancelRegisterTag = () => {
  visibleTagRegister.value = false;
  tagNameValue.value = '';
  selectedTagColor.value = null;
  tagNameHelp.value = 'Digite o nome da tag que quer cadastrar';
  tagMessageClass.value = '';
  tagError.value = false;
};

const cancelEditTag = () => {
  visibleTagEdit.value = false;
  editingTag.value = null;
  selectedTagColor.value = null;
};

onMounted(() => {
  initFilters();
  tags.value = tagRepo.find();
});
</script>

<template>
  <Toast />
  <ConfirmDialog />

  <Dialog v-model:visible="visibleTagEdit" header="Editar tag" :modal="true" class="p-fluid">
    <div class="p-4 font-roboto">
      <FloatLabel class="p-float-label mb-0.5">
        <InputText id="editTagName" v-model="editingTagName" class="w-full p-2 border border-gray-300 rounded"
          :class="{ 'border-red-500': tagErrorEdit }" />
        <label for="editTagName">Nome da Tag</label>
      </FloatLabel>
      <small :id="tagNameHelpIdEdit" :class="tagMessageEditClass">{{ tagEditHelp }}</small>

      <div class="mb-3 mt-2">
        <Select v-model="selectedTagColor" :options="colors" optionLabel="color" placeholder="Selecione uma cor"
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
          severity="danger" @click="cancelEditTag" />
        <Button label="Salvar" icon="pi pi-check" class="w-48 bg-green-400 font-roboto text-center text-white"
          severity="success" @click="saveEditedTag" />
      </div>
    </div>
  </Dialog>

  <Drawer v-model:visible="visibleTagRegister" header="Cadastrar tag" position="right" class="w-full md:w-80 lg:w-96">
    <div class="p-4 font-roboto">
      <FloatLabel class="p-float-label">
        <InputText id="tagName" v-model="tagNameValue" class="w-full p-2 border border-gray-300 rounded"
          :class="{ 'border-red-500': tagError }" @change="limparHelpText" />
        <label for="tagName">Nome da Tag</label>
      </FloatLabel>
      <small :id="tagNameHelpId" :class="tagMessageClass">{{ tagNameHelp }}</small>

      <div class="mt-4">
        <Select v-model="selectedTagColor" :options="colors" optionLabel="color" placeholder="Selecione uma cor"
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
          severity="danger" @click="cancelRegisterTag" />
        <Button label="Cadastrar" icon="pi pi-check" class="w-48 bg-green-400 font-roboto text-center text-white"
          severity="success" @click="registerTag" />
      </div>
    </div>
  </Drawer>

  <div class="table-view">
    <Toolbar class="mb-6">
      <template #start>
        <h4 class="mr-full">Gerenciar tags</h4>
      </template>
      <template #end>
        <Button label="Adicionar" icon="pi pi-plus" severity="success" class="mr-2" @click="abrirDrawer" />
        <Button label="Apagar Selecionadas" icon="pi pi-trash" severity="danger" class="mr-2"
          @click="deleteSelectedTags" :disabled="!selectedTags.length" />
      </template>
    </Toolbar>

    <DataTable ref="dt" v-model:selection="selectedTags" :value="tags" dataKey="id" :paginator="true" :rows="10"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      :rowsPerPageOptions="[10, 20, 30]"
      currentPageReportTemplate="Mostrando de {first} a {last}. Total de {totalRecords} tags" :filters="filters"
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
          <Button icon="pi pi-pencil" rounded class="mr-2" @click="editTag(slotProps.data)" />
          <Button icon="pi pi-trash" rounded severity="danger" @click="deleteTag(slotProps.data)" />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped>
</style>
