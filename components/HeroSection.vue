<template>
  <section class="py-20 bg-gray-900 text-center">
    <div class="container mx-auto px-4">
      <div class="flex justify-center mb-8">
        <img src="@/assets/images/logo.png" alt="solx Cube" class="h-32 w-32">
      </div>
      <h1 class="text-3xl md:text-5xl font-mono mb-6 text-white">
        { solx }
      </h1>
      <h2 class="text-2xl md:text-4xl font-mono mb-8 text-gray-200">
        A highly-efficient Solidity compiler for the EVM
      </h2>
      <p class="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-12">
        Powered by LLVM, the most mature compiler infrastructure in the world.
      </p>
      
      <TerminalDemo />
      
      <div class="flex justify-center space-x-4 mt-8">
        <a
          href="https://github.com/solx"
          target="_blank"
          class="inline-flex items-center px-6 py-3 bg-gray-800 text-[#4ECCA3] rounded-lg hover:bg-[#4ECCA3] hover:text-white transition-colors text-base font-mono border border-gray-700"
        >
          <svg class="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path fill-rule="evenodd" d="M15.75 2.25H21a.75.75 0 01.75.75v5.25a.75.75 0 01-1.5 0V4.81L8.03 17.03a.75.75 0 01-1.06-1.06L19.19 3.75h-3.44a.75.75 0 010-1.5zm-10.5 4.5a1.5 1.5 0 00-1.5 1.5v10.5a1.5 1.5 0 001.5 1.5h10.5a1.5 1.5 0 001.5-1.5V10.5a.75.75 0 011.5 0v8.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V8.25a3 3 0 013-3h8.25a.75.75 0 010 1.5H5.25z" clip-rule="evenodd" />
          </svg>
          View on GitHub
        </a>
        <a
          href="/demo"
          class="inline-flex items-center px-6 py-3 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors text-base font-mono border border-gray-700"
        >
          Run the benchmark
        </a>
      </div>
    </div>
  </section>
</template> 
