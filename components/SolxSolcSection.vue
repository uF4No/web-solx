<template>
  <section class="py-16 bg-secondary">
    <div class="container mx-auto px-4 text-center">
      <h2 class="text-3xl font-mono mb-8 text-primary">solx vs solc</h2>
      <p class="text-xl text-tertiary max-w-3xl mx-auto mb-12">
        Want to see how solx performs compared to solc? Check out our demo project to benchmark and test.
      </p>

      <!-- Gas Comparison Graph -->
      <div class="max-w-3xl mx-auto mb-12">
        <div class="bg-tertiary rounded-lg p-6 shadow-lg">
          <h3 class="text-lg font-mono mb-6 text-primary">Gas Consumption Across Different Projects</h3>
          
          <div class="relative">
            <!-- Y-axis label -->
            <div class="absolute -left-4 top-1/2 -rotate-90 transform -translate-y-1/2 text-xs text-tertiary">
              Gas Usage (%)
            </div>

            <!-- Graph container -->
            <div class="pl-6">
              <!-- Projects -->
              <div class="grid grid-cols-4 gap-3">
                <!-- ERC20 Token -->
                <div class="space-y-2">
                  <div class="h-32 flex items-end space-x-1 justify-center">
                    <div class="w-8 bg-gray-400 rounded-t-lg" style="height: 100%"></div>
                    <div class="w-8 bg-[#4ECCA3] rounded-t-lg" style="height: 97%"></div>
                  </div>
                  <div class="text-xs font-mono text-primary">ERC20</div>
                  <div class="text-xs text-[#4ECCA3]">-3%</div>
                </div>

                <!-- NFT Marketplace -->
                <div class="space-y-2">
                  <div class="h-32 flex items-end space-x-1 justify-center">
                    <div class="w-8 bg-gray-400 rounded-t-lg" style="height: 100%"></div>
                    <div class="w-8 bg-[#4ECCA3] rounded-t-lg" style="height: 98%"></div>
                  </div>
                  <div class="text-xs font-mono text-primary">ERC721</div>
                  <div class="text-xs text-[#4ECCA3]">-2%</div>
                </div>

                <!-- DEX -->
                <div class="space-y-2">
                  <div class="h-32 flex items-end space-x-1 justify-center">
                    <div class="w-8 bg-gray-400 rounded-t-lg" style="height: 100%"></div>
                    <div class="w-8 bg-[#4ECCA3] rounded-t-lg" style="height: 97%"></div>
                  </div>
                  <div class="text-xs font-mono text-primary">ERC1155</div>
                  <div class="text-xs text-[#4ECCA3]">-3%</div>
                </div>

                <!-- Lending -->
                <div class="space-y-2">
                  <div class="h-32 flex items-end space-x-1 justify-center">
                    <div class="w-8 bg-gray-400 rounded-t-lg" style="height: 100%"></div>
                    <div class="w-8 bg-[#4ECCA3] rounded-t-lg" style="height: 83%"></div>
                  </div>
                  <div class="text-xs font-mono text-primary">solmate</div>
                  <div class="text-xs text-[#4ECCA3]">-17%</div>
                </div>
              </div>

              <!-- X-axis line -->
              <div class="h-px bg-primary mt-2"></div>
            </div>
          </div>

          <!-- Legend -->
          <div class="flex justify-center items-center space-x-6 mt-6">
            <div class="flex items-center">
              <div class="w-3 h-3 bg-gray-400 rounded mr-2"></div>
              <span class="text-xs font-mono text-tertiary">solc</span>
            </div>
            <div class="flex items-center">
              <div class="w-3 h-3 bg-[#4ECCA3] rounded mr-2"></div>
              <span class="text-xs font-mono text-[#4ECCA3]">solx</span>
            </div>
          </div>

          <p class="mt-4 text-xs text-tertiary">
            * Based on Foundry tests gas reports.
          </p>
        </div>
      </div>

      <a
        href="https://github.com/popzxc/solx_demo"
        target="_blank"
        class="inline-flex items-center px-4 py-2 bg-tertiary text-[#4ECCA3] rounded-lg hover:bg-[#4ECCA3] hover:text-white transition-colors text-sm font-mono border border-primary"
      >
        Run the benchmarks
      </a>
    </div>
  </section>
</template>

<style scoped>
[class*="bg-\\[\\#4ECCA3\\]"] {
  transition: height 1s ease-in-out;
}
</style> 
