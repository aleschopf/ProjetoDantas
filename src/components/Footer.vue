<template>
    <Card>
        <template #content>
            <div class="flex flex-row gap-4 items-center justify-center py-4">
                <div class="flex flex-row items-center justify-evenly space-x-4 select-none">
                    <div class="w-[60%]">
                        <p class="mb-3 footer-title">Projeto Dantas</p>
                        <p class="footer-text mb-1">Compartilhando o conhecimento com o mundo!</p>
                    </div>
                    <div>
                    </div>
                    <div class="w-[45%] justify-center flex flex-col">
                        <div class="ml-auto gap-3">
                            <div id="text-footer" class="flex w-full items-start mb-2.5">
                                <p class="text-2xl font-bold select-none">Social</p>
                            </div>
                            <div id="icons-footer" class="flex flex-row w-full">
                                <div class="icons-footer">
                                    <a href="https://www.linkedin.com/company/gc-solutions-devs/" target="_blank"
                                        rel="noopener noreferrer">
                                        <i class="linkedin pi pi-linkedin" style="font-size: 1.6rem;"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Divider />
            <p class="m-0 text-center text-xs select-none">&copy; 2024 GC Solutions. Todos os direitos reservados.</p>
        </template>
    </Card>
</template>

<script setup lang="ts">
import Card from 'primevue/card';
</script>

<style scoped>
.linkedin:hover {
    color: #1064c4;
}
</style>