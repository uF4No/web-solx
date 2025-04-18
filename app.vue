<template>
  <div class="min-h-screen" :class="{ 'dark': isDark }">
    <div class="bg-white dark:bg-gray-900 min-h-screen">
      <!-- Warning Banner -->
      <div class="bg-indigo-500 text-white py-2 md:py-3 px-4 text-center">
        <span class="inline-flex items-center font-mono text-sm md:text-base">
          ⚠️ Warning: solx is in pre-alpha state and not suitable for production use yet.
        </span>
      </div>

      <!-- Navbar -->
      <header class="border-b border-gray-200 dark:border-gray-800">
        <div class="container mx-auto px-4 py-3 md:py-4">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between">
            <!-- Logo Section -->
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <a href="/" class="p-0 mr-2">
                  <img src="@/assets/images/logo.png" alt="solx Logo" class="h-8 w-8 md:h-10 md:w-10">
                </a>
                <h3 class="text-lg md:text-2xl lg:text-3xl font-mono text-gray-900 dark:text-white">{ solx }</h3>
              </div>
              
              <!-- Mobile Menu Button -->
              <button 
                @click="isMenuOpen = !isMenuOpen" 
                class="md:hidden p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                <svg 
                  class="w-6 h-6" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    v-if="!isMenuOpen" 
                    stroke-linecap="round" 
                    stroke-linejoin="round" 
                    stroke-width="2" 
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                  <path 
                    v-else 
                    stroke-linecap="round" 
                    stroke-linejoin="round" 
                    stroke-width="2" 
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <!-- Navigation Links -->
            <nav 
              :class="{ 'hidden': !isMenuOpen }" 
              class="md:flex md:items-center mt-4 md:mt-0 pb-4 md:pb-0"
            >
              <div class="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-8">
                <a 
                  href="#quickstart" 
                  @click="isMenuOpen = false"
                  class="text-base font-mono hover:underline text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
                >
                  Quickstart
                </a>
                <a 
                  href="/features" 
                  class="text-base font-mono hover:underline text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
                >
                  Features
                </a>
                <a 
                  href="/docs" 
                  class="text-base font-mono hover:underline text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
                >
                  Docs
                </a>
                <a 
                  href="https://github.com/solx" 
                  target="_blank" 
                  class="text-base font-mono hover:underline text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
                >
                  GitHub
                </a>
              </div>
            </nav>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main>
        <HeroSection />
        <FeaturesSection />
        <FoundrySection />
        <ContributeSection />
        <SolxSolcSection />
      </main>

      <FooterSection />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import FooterSection from '@/components/FooterSection.vue'

const isMenuOpen = ref(false)
const isDark = ref(false)

function toggleDarkMode() {
  isDark.value = !isDark.value
}

// Add smooth scrolling behavior
if (typeof window !== 'undefined') {
  document.documentElement.style.scrollBehavior = 'smooth'
}
</script>
