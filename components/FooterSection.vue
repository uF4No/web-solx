<template>
  <footer class="bg-secondary border-t border-primary">
    <div class="container mx-auto px-4 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
        <!-- Logo and Description -->
        <div class="col-span-1 md:col-span-2">
          <div class="flex items-center mb-4">
            <img src="@/assets/images/solx-logo.png" alt="solx Logo" class="h-8 w-6 mr-2">
            <span class="text-xl font-mono text-primary">{ solx }</span>
          </div>
          <p class="text-tertiary text-sm">
            A highly-efficient Solidity compiler for the EVM, powered by LLVM.
          </p>
        </div>

        <!-- Resources -->
        <div>
          <h4 class="text-sm font-mono text-primary mb-4">Resources</h4>
          <ul class="space-y-2">
            <li>
              <a href="/docs" class="text-tertiary hover:text-[#4ECCA3] text-sm transition-colors">Documentation</a>
            </li>
            <li>
              <a href="https://github.com/matter-labs/solx/blob/main/CONTRIBUTING.md" class="text-tertiary hover:text-[#4ECCA3] text-sm transition-colors">Contributing</a>
            </li>
            <li>
              <a href="https://github.com/matter-labs/solx/releases" class="text-tertiary hover:text-[#4ECCA3] text-sm transition-colors">Releases</a>
            </li>
          </ul>
        </div>

        <!-- Community -->
        <div>
          <h4 class="text-sm font-mono text-primary mb-4">Community</h4>
          <ul class="space-y-2">
            <li>
              <a href="https://github.com/matter-labs/solx" class="text-tertiary hover:text-[#4ECCA3] text-sm transition-colors">GitHub</a>
            </li>
            <li>
              <a href="https://twitter.com/zksync" class="text-tertiary hover:text-[#4ECCA3] text-sm transition-colors">Twitter</a>
            </li>
            <li>
              <a href="https://join.zksync.dev/" class="text-tertiary hover:text-[#4ECCA3] text-sm transition-colors">Discord</a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="border-t border-primary mt-12 pt-8 text-center">
        <p class="text-tertiary text-sm font-mono">
          2025 Built with ❤️ by the solx team
        </p>
      </div>
    </div>
  </footer>
</template> 
