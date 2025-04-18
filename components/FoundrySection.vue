<template>
  <section id="quickstart" class="py-16 bg-secondary">
    <div class="container mx-auto px-4">
      <h2 class="text-4xl font-mono mb-12 text-center text-primary">Use solx with Foundry</h2>
      
      <div class="max-w-3xl mx-auto space-y-12">
        <!-- Step 1 -->
        <div class="relative pl-10">
          <div class="absolute left-0 top-2 flex items-center">
            <div class="w-7 h-7 rounded-full bg-[#4ECCA3] flex items-center justify-center text-sm font-mono text-white">
              1
            </div>
          </div>
          <div class="space-y-3">
            <h3 class="text-2xl font-mono text-primary">Download the solx binary</h3>
            <p class="text-lg text-tertiary">
              Get the latest version of solx from the <a href="https://github.com/matter-labs/solx/releases" target="_blank" class="text-[#4ECCA3] hover:text-[#3DBB92] hover:underline">GitHub releases page</a>.
            </p>
          </div>
        </div>

        <!-- Step 2 -->
        <div class="relative pl-10">
          <div class="absolute left-0 top-2 flex items-center">
            <div class="w-7 h-7 rounded-full bg-[#4ECCA3] flex items-center justify-center text-sm font-mono text-white">
              2
            </div>
          </div>
          <div class="space-y-4">
            <h3 class="text-2xl font-mono text-primary">Create a solx profile in your <span class="font-mono text-[#4ECCA3]">foundry.toml</span></h3>
            
            <div class="bg-tertiary rounded-lg overflow-hidden shadow-xl">
              <!-- Terminal Header -->
              <div class="px-4 py-2 bg-tertiary flex items-center border-b border-primary">
                <div class="flex space-x-2">
                  <div class="w-3 h-3 rounded-full bg-red-500"/>
                  <div class="w-3 h-3 rounded-full bg-yellow-500"/>
                  <div class="w-3 h-3 rounded-full bg-green-500"/>
                </div>
                <div class="ml-4 text-tertiary text-base font-mono">foundry.toml</div>
              </div>

              <!-- Terminal Content -->
              <div class="p-4 font-mono text-base text-primary text-left bg-tertiary/50">
                <div class="text-[#4ECCA3]">[profile.solx]</div>
                <div class="ml-4">
                  <span class="text-blue-400">solc_version</span>
                  <span class="text-primary"> = </span>
                  <span class="text-yellow-400">"/path/to/solx"</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 3 -->
        <div class="relative pl-10">
          <div class="absolute left-0 top-2 flex items-center">
            <div class="w-7 h-7 rounded-full bg-[#4ECCA3] flex items-center justify-center text-sm font-mono text-white">
              3
            </div>
          </div>
          <div class="space-y-4">
            <h3 class="text-2xl font-mono text-primary">Build your project with solx</h3>
            <p class="text-lg text-tertiary">
              Use the solx profile to compile your project with enhanced optimizations.
            </p>

            <div class="bg-tertiary rounded-lg overflow-hidden shadow-xl">
              <!-- Terminal Header -->
              <div class="px-4 py-2 bg-tertiary flex items-center border-b border-primary">
                <div class="flex space-x-2">
                  <div class="w-3 h-3 rounded-full bg-red-500"/>
                  <div class="w-3 h-3 rounded-full bg-yellow-500"/>
                  <div class="w-3 h-3 rounded-full bg-green-500"/>
                </div>
                <div class="ml-4 text-tertiary text-base font-mono">Terminal</div>
              </div>

              <!-- Terminal Content -->
              <div class="p-4 font-mono text-base text-primary text-left bg-tertiary/50">
                <div class="flex items-start">
                  <span class="text-green-400 shrink-0">$</span>
                  <span class="ml-2 flex-1 text-primary">FOUNDRY_PROFILE=solx forge build</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Additional Info -->
        <div class="mt-8 p-6 bg-tertiary rounded-lg">
          <p class="text-base text-tertiary">
            💡 <span class="font-mono font-semibold text-[#4ECCA3]">Pro tip:</span> You can also use the solx profile for testing and get gas reports.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Add a connecting line between steps */
.relative::before {
  content: '';
  position: absolute;
  left: 13px;
  top: 40px;
  bottom: -12px;
  width: 1px;
  background: rgba(78, 204, 163, 0.1); /* #4ECCA3 with very low opacity */
  display: block;
}

/* Remove the line from the last step */
.relative:last-of-type::before {
  display: none;
}

@media (max-width: 768px) {
  .absolute {
    display: none;
  }
  
  .relative::before {
    display: none;
  }
  
  .relative {
    padding-left: 0;
  }
}
</style> 
