<template>
  <div class="min-h-screen" :class="{ 'dark': isDark }">
    <div class="bg-white dark:bg-gray-900 min-h-screen">
      <!-- Warning Banner -->
      <div class="bg-indigo-700 text-white py-2 px-4 text-center">
        <span class="inline-flex items-center">
          ⚠️ Warning: solx is in pre-alpha state and not suitable for production use yet.
        </span>
      </div>

      <!-- Navbar -->
      <header class="border-b border-gray-200 dark:border-gray-800">
        <div class="container mx-auto px-4 py-4 flex justify-between items-center">
          <div class="flex items-center">
            <a href="/" class="p-0 mr-2">
              <img src="@/assets/images/logo.png" alt="solx Logo" class="h-10 w-10">
            </a>
            <h3 class="text-2xl font-mono font-bold text-gray-900 dark:text-white">solx</h3>
          </div>
          <div class="flex items-center space-x-6">
            <a href="/features" class="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Features</a>
            <a href="/docs" class="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Docs</a>
            <a href="https://github.com/solx" target="_blank" class="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">GitHub</a>
            <!-- <button
              class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Toggle dark mode"
              @click="toggleDarkMode"
            >
              <svg v-if="isDark" class="w-5 h-5 text-gray-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
              </svg>
              <svg v-else class="w-5 h-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path fill-rule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clip-rule="evenodd" />
              </svg>
            </button> -->
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main>
        <HeroSection />
        <FeaturesSection />
        <TrySolxSection />
        <FoundrySection />
      </main>
    </div>
  </div>
</template>

<script setup>


 function toggleDarkMode() {
 }
</script>
