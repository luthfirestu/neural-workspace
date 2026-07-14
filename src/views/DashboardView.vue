<script setup lang="ts">
import Sidebar from '../components/Sidebar.vue'
import Header from '../components/Header.vue'
import KanbanBoard from '../components/KanbanBoard.vue'
import TeamActivity from '../components/TeamActivity.vue'
import ModalAddTask from '../components/ModalAddTask.vue'
</script>

<template>
  <div
    class="grid grid-cols-[64px_1fr_320px] grid-rows-[60px_1fr] h-screen w-screen overflow-hidden relative"
    style="background: linear-gradient(135deg, #07080f 0%, #0a0c18 50%, #08070f 100%);"
  >
    
    <div class="absolute top-[-15%] left-[20%] w-[600px] h-[600px] rounded-full pointer-events-none z-0" style="background: radial-gradient(circle, rgba(79,172,254,0.06) 0%, transparent 70%);"></div>
    <div class="absolute bottom-[-10%] right-[15%] w-[500px] h-[500px] rounded-full pointer-events-none z-0" style="background: radial-gradient(circle, rgba(124,92,252,0.07) 0%, transparent 70%);"></div>

    <div class="row-[1/3] col-[1] z-10"><Sidebar /></div>
    <div class="row-[1] col-[2/4] z-10"><Header /></div>
    <div class="row-[2] col-[2] overflow-hidden z-5"><KanbanBoard /></div>
    <div class="row-[2] col-[3] z-5"><TeamActivity /></div>

    <ModalAddTask />

  </div>
</template>