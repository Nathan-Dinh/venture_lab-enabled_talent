<template>
  <SidebarProvider>
    <AppSideBar />
    <div class="flex-1 flex flex-col overflow-hidden">
      <header
        class="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4"
      >
        <SidebarTrigger />
        <UserProfileDropdown />
      </header>

      <div class="flex-1 overflow-auto p-6">
        <slot />
      </div>
    </div>
  </SidebarProvider>
</template>

<script setup lang="ts">
import AppSideBar from '@/components/navigations/AppSideBar.vue';
import UserProfileDropdown from '@/components/navigations/UserProfileDropdown.vue';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
</script>
