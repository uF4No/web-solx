<template>
  <section class="py-20 bg-secondary text-center">
    <div class="container mx-auto px-4">
      <div class="flex justify-center mb-8">
        <img src="@/assets/images/solx-logo.png" alt="solx Cube" class="h-32 w-28">
      </div>
      <h1 class="text-3xl md:text-5xl font-mono mb-6 text-primary">
        { solx }
      </h1>
      <h2 class="text-2xl md:text-4xl font-mono mb-8 text-secondary">
        A gas-efficient Solidity compiler for Ethereum
      </h2>
      <p class="text-xl md:text-2xl text-tertiary max-w-3xl mx-auto mb-12">
        Powered by LLVM, the most mature compiler infrastructure in the world.
      </p>
      
      <TerminalDemo />
      
      <div class="flex justify-center space-x-4 mt-8">
        <a
          href="https://github.com/solx"
          target="_blank"
          class="inline-flex items-center px-8 py-3 bg-gray-800 dark:bg-gray-900 text-[#4ECCA3] rounded-lg hover:bg-[#4ECCA3] hover:text-gray-900 dark:hover:text-white transition-colors text-base font-mono border border-[#4ECCA3]/30"
        >
          <svg class="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path fill-rule="evenodd" d="M15.75 2.25H21a.75.75 0 01.75.75v5.25a.75.75 0 01-1.5 0V4.81L8.03 17.03a.75.75 0 01-1.06-1.06L19.19 3.75h-3.44a.75.75 0 010-1.5zm-10.5 4.5a1.5 1.5 0 00-1.5 1.5v10.5a1.5 1.5 0 001.5 1.5h10.5a1.5 1.5 0 001.5-1.5V10.5a.75.75 0 011.5 0v8.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V8.25a3 3 0 013-3h8.25a.75.75 0 010 1.5H5.25z" clip-rule="evenodd" />
          </svg>
          View on GitHub
        </a>
        <a
          href="/demo"
          class="inline-flex items-center px-8 py-3 bg-[#4ECCA3] text-gray-900 dark:text-white rounded-lg hover:bg-[#3DBB92] transition-colors text-base font-mono border border-transparent"
        >
          Run the benchmark
        </a>
      </div>
    </div>
  </section>
</template> 
