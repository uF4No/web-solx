<template>
  <div class="min-h-screen" :class="isDark ? 'dark' : 'light'">
    <div class="bg-primary min-h-screen">
      <!-- Warning Banner -->
      <div class="bg-indigo-500 text-white py-2 md:py-3 px-4 text-center">
        <span class="inline-flex items-center font-mono text-sm md:text-base">
          ⚠️ Warning: solx is in pre-alpha state and not suitable for production use yet.
        </span>
      </div>

      <!-- Navbar -->
      <header class="border-b border-primary">
        <div class="container mx-auto px-4 py-3 md:py-4">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between">
            <!-- Logo and Mobile Controls Section -->
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <a href="/" class="p-0 mr-2">
                  <img src="@/assets/images/logo.png" alt="solx Logo" class="h-8 w-8 md:h-10 md:w-10">
                </a>
                <h3 class="text-lg md:text-2xl lg:text-3xl font-mono text-primary">{ solx }</h3>
              </div>

              <div class="flex items-center md:hidden">
                <!-- Theme Toggle Button (Mobile) -->
                <button 
                  @click="toggleTheme" 
                  class="p-2 text-tertiary hover:text-primary transition-colors mr-2"
                  aria-label="Toggle theme"
                >
                  <svg 
                    v-if="isDark" 
                    class="w-6 h-6" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      stroke-linecap="round" 
                      stroke-linejoin="round" 
                      stroke-width="2" 
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  <svg 
                    v-else 
                    class="w-6 h-6" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      stroke-linecap="round" 
                      stroke-linejoin="round" 
                      stroke-width="2" 
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                </button>

                <!-- Mobile Menu Button -->
                <button 
                  @click="isMenuOpen = !isMenuOpen" 
                  class="p-2 text-tertiary hover:text-primary transition-colors"
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
            </div>

            <!-- Navigation Links and Desktop Theme Toggle -->
            <div class="flex items-center">
              <nav 
                :class="{ 'hidden': !isMenuOpen }" 
                class="md:flex md:items-center mt-4 md:mt-0 pb-4 md:pb-0"
              >
                <div class="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-8">
                  <a 
                    href="#quickstart" 
                    @click="isMenuOpen = false"
                    class="text-base font-mono hover:underline text-tertiary hover:text-primary transition-colors"
                  >
                    Quickstart
                  </a>
                  <a 
                    href="#features" 
                    class="text-base font-mono hover:underline text-tertiary hover:text-primary transition-colors"
                  >
                    Features
                  </a>
                  <a 
                    href="https://github.com/matter-labs/solx/blob/main/docs/src/SUMMARY.md" 
                    target="_blank"
                    class="text-base font-mono hover:underline text-tertiary hover:text-primary transition-colors"
                  >
                    Docs
                  </a>
                  <a
                    href="https://github.com/matter-labs/solx/"
                    target="_blank"
                    class="text-base font-mono hover:underline text-tertiary hover:text-primary transition-colors"
                  >
                    GitHub
                  </a>
                </div>
              </nav>

              <!-- Theme Toggle Button (Desktop) -->
              <button 
                @click="toggleTheme" 
                class="hidden md:block p-2 text-tertiary hover:text-primary transition-colors ml-4"
                aria-label="Toggle theme"
              >
                <svg 
                  v-if="isDark" 
                  class="w-6 h-6" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    stroke-linecap="round" 
                    stroke-linejoin="round" 
                    stroke-width="2" 
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                <svg 
                  v-else 
                  class="w-6 h-6" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    stroke-linecap="round" 
                    stroke-linejoin="round" 
                    stroke-width="2" 
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              </button>
            </div>
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
import { ref, onMounted } from 'vue'
import FooterSection from '@/components/FooterSection.vue'

const isMenuOpen = ref(false)
const isDark = ref(true) // Set dark mode as default

function toggleTheme() {
  isDark.value = !isDark.value
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

onMounted(() => {
  // Check for saved theme preference
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    isDark.value = savedTheme === 'dark'
  } else {
    // If no saved preference, check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    isDark.value = prefersDark
  }
})

// Add smooth scrolling behavior
if (typeof window !== 'undefined') {
  document.documentElement.style.scrollBehavior = 'smooth'
}
</script>

<style>
:root {
  --primary-color: #4ECCA3;
  --primary-hover: #3DBB92;
}

/* Light mode colors */
.light {
  --bg-primary: #ffffff;
  --bg-secondary: #f9fafb;
  --bg-tertiary: #f3f4f6;
  --text-primary: #111827;
  --text-secondary: #374151;
  --text-tertiary: #6b7280;
  --border-color: #e5e7eb;
}

/* Dark mode colors */
.dark {
  --bg-primary: #111827;
  --bg-secondary: #111827;  /* Matching bg-gray-900 */
  --bg-tertiary: #1f2937;   /* Slightly lighter for contrast */
  --text-primary: #ffffff;
  --text-secondary: #e5e7eb;
  --text-tertiary: #9ca3af;
  --border-color: #1f2937;
}

/* Apply CSS variables */
.bg-primary { background-color: var(--bg-primary); }
.bg-secondary { background-color: var(--bg-secondary); }
.bg-tertiary { background-color: var(--bg-tertiary); }
.text-primary { color: var(--text-primary); }
.text-secondary { color: var(--text-secondary); }
.text-tertiary { color: var(--text-tertiary); }
.border-primary { border-color: var(--border-color); }

/* Transitions */
.transition-colors {
  transition-property: background-color, border-color, color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
</style>
