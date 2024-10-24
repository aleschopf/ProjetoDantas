<script setup>
import NavBar from '@/components/NavBar.vue';
import Footer from '@/components/Footer.vue';
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <header>
      <NavBar />
    </header>
    <main class="flex-grow">
      <div class="flex-grow flex items-center justify-center py-6">
        <router-view />
      </div>
    </main>
    <footer class="mt-auto">
      <Footer />
    </footer>
  </div>
</template>