<template>
  <section class="py-20 bg-secondary">
    <div class="container mx-auto px-4">
      <div class="text-center mb-16">
        <h2 class="text-4xl font-mono mb-6 text-primary">Get involved</h2>
        <p class="text-2xl text-tertiary max-w-3xl mx-auto">
          Help us build the future of Solidity compilation
        </p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <!-- Learn -->
        <div class="relative">
          <div class="p-6 bg-tertiary rounded-lg border border-primary h-full flex flex-col">
            <div class="mb-6">
              <svg class="w-10 h-10 text-[#4ECCA3]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
              </svg>
            </div>
            
            <h3 class="text-2xl font-mono mb-4 text-primary">Learn solx</h3>
            <p class="mb-6 text-tertiary text-lg flex-grow">
              Take some time to explore our documentation to help you better understand how solx works.
            </p>
            
            <a href="https://github.com/matter-labs/solx/tree/main/docs" 
               class="inline-block w-full py-3 px-6 bg-gray-800 dark:bg-gray-900 text-[#4ECCA3] rounded-lg hover:bg-[#4ECCA3] hover:text-gray-900 dark:hover:text-white transition-colors text-base font-mono border border-[#4ECCA3]/30"
               target="_blank" 
               rel="noopener">
              READ THE DOCS
            </a>
          </div>
        </div>
        
        <!-- Try -->
        <div class="relative">
          <div class="p-6 bg-tertiary rounded-lg border border-primary h-full flex flex-col">
            <div class="mb-6">
              <svg class="w-10 h-10 text-[#4ECCA3]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                <polyline points="7.5 4.21 12 6.81 16.5 4.21"/>
                <polyline points="7.5 19.79 7.5 14.6 3 12"/>
                <polyline points="21 12 16.5 14.6 16.5 19.79"/>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                <line x1="12" y1="22.08" x2="12" y2="12"/>
              </svg>
            </div>
            
            <h3 class="text-2xl font-mono mb-4 text-primary">Try Solx</h3>
            <p class="mb-6 text-tertiary text-lg flex-grow">
              The solx team has compiled demos and examples to help you get started with the compiler quickly.
            </p>
            
            <a href="https://github.com/popzxc/solx_demo" 
               class="inline-block w-full py-3 px-6 bg-gray-800 dark:bg-gray-900 text-[#4ECCA3] rounded-lg hover:bg-[#4ECCA3] hover:text-gray-900 dark:hover:text-white transition-colors text-base font-mono border border-[#4ECCA3]/30"
               target="_blank" 
               rel="noopener">
              TRY THE DEMO
            </a>
          </div>
        </div>
        
        <!-- Contribute -->
        <div class="relative">
          <div class="p-6 bg-tertiary rounded-lg border border-primary h-full flex flex-col">
            <div class="mb-6">
              <svg class="w-10 h-10 text-[#4ECCA3]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
              </svg>
            </div>
            
            <h3 class="text-2xl font-mono mb-4 text-primary">Contribute code</h3>
            <p class="mb-6 text-tertiary text-lg flex-grow">
              solx is truly a community effort, and we welcome contribution from hobbyists and production users alike!
            </p>
            
            <a href="https://github.com/matter-labs/solx/blob/main/CONTRIBUTING.md" 
               class="inline-block w-full py-3 px-6 bg-gray-800 dark:bg-gray-900 text-[#4ECCA3] rounded-lg hover:bg-[#4ECCA3] hover:text-gray-900 dark:hover:text-white transition-colors text-base font-mono border border-[#4ECCA3]/30"
               target="_blank" 
               rel="noopener">
              CONTRIBUTION GUIDE
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@media (max-width: 768px) {
  .relative {
    padding-left: 0;
  }
}
</style> 
