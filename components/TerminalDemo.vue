<template>
  <div class="max-w-3xl mx-auto bg-gray-800 rounded-lg overflow-hidden shadow-xl">
    <div class="px-4 py-2 bg-gray-900 flex items-center">
      <div class="flex space-x-2">
        <div class="w-3 h-3 rounded-full bg-red-500"/>
        <div class="w-3 h-3 rounded-full bg-yellow-500"/>
        <div class="w-3 h-3 rounded-full bg-green-500"/>
      </div>
      <div class="ml-4 text-gray-400 text-sm">Terminal</div>
    </div>
    <div class="p-4 font-mono text-sm text-white text-left h-[350px] overflow-y-auto">
      <div class="flex items-start">
        <span class="text-green-400 shrink-0">$</span>
        <span class="ml-2 flex-1 text-left">
          <span ref="typewriterElement" class="text-left"></span>
        </span>
      </div>
      <div class="space-y-1 text-left">
        <div v-show="showLine1" class="text-green-400 mt-2 transition-opacity duration-200" :class="{ 'opacity-100': showLine1, 'opacity-0': !showLine1 }">[+] Compiling...</div>
        <div v-show="showLine2" class="text-green-400 transition-opacity duration-200" :class="{ 'opacity-100': showLine2, 'opacity-0': !showLine2 }">[+] Compiling 49 files with <span class="text-blue-400">solx 0.8.29</span></div>
        <div v-show="showLine3" class="text-green-400 transition-opacity duration-200" :class="{ 'opacity-100': showLine3, 'opacity-0': !showLine3 }">[+] solx finished in <span class="text-blue-400">1.32s</span></div>
        <div v-show="showLine4" class="text-green-500 transition-opacity duration-200" :class="{ 'opacity-100': showLine4, 'opacity-0': !showLine4 }">Compiler run successful</div>
        <div v-show="showLine5" class="text-white transition-opacity duration-200" :class="{ 'opacity-100': showLine5, 'opacity-0': !showLine5 }">Ran 13 tests for test/ERC20.t.sol:<span class="text-yellow-400">ERC20Test</span></div>
        <div v-show="showLine6" class="text-white transition-opacity duration-200" :class="{ 'opacity-100': showLine6, 'opacity-0': !showLine6 }">Suite result: <span class="text-green-500">ok. 13 passed;</span> <span class="text-red-500">0 failed;</span> <span class="text-yellow-500">0 skipped;</span> finished in <span class="text-blue-400">1.98ms</span> (<span class="text-blue-400">7.81ms</span> CPU time)</div>
        
        <!-- Gas Test Results -->
        <div v-show="showLine7" class="text-white mt-4 transition-opacity duration-200" :class="{ 'opacity-100': showLine7, 'opacity-0': !showLine7 }">==== Summary of Gas Test Results vs solc ====</div>
        <pre v-show="showLine8" class="transition-opacity duration-200" :class="{ 'opacity-100': showLine8, 'opacity-0': !showLine8 }"><span class="text-gray-500">+----------------+------------+-----------------+---------------+--------------+</span>
<span class="text-gray-500">|</span> <span class="text-blue-400">Project</span>        <span class="text-gray-500">|</span> <span class="text-blue-400"># of Tests</span> <span class="text-gray-500">|</span> <span class="text-blue-400">Avg Gas Savings</span> <span class="text-gray-500">|</span> <span class="text-blue-400">Least Savings</span> <span class="text-gray-500">|</span> <span class="text-blue-400">Most Savings</span> <span class="text-gray-500">|</span>
<span class="text-gray-500">+----------------+------------+-----------------+---------------+--------------+</span>
<span class="text-gray-500">|</span> <span class="text-yellow-400">ERC20</span>          <span class="text-gray-500">|</span> <span class="text-white">12</span>         <span class="text-gray-500">|</span> <span class="text-green-400">-2.02%</span>          <span class="text-gray-500">|</span> <span class="text-green-400">-0.79%</span>        <span class="text-gray-500">|</span> <span class="text-green-400">-5.20%</span>       <span class="text-gray-500">|</span>
<span class="text-gray-500">+----------------+------------+-----------------+---------------+--------------+</span></pre>
      </div>
    </div>
  </div>
</template>

<script setup>
import Typewriter from 'typewriter-effect/dist/core'
import { ref, onMounted, nextTick } from 'vue'

const typewriterElement = ref(null)
const showLine1 = ref(false)
const showLine2 = ref(false)
const showLine3 = ref(false)
const showLine4 = ref(false)
const showLine5 = ref(false)
const showLine6 = ref(false)
const showLine7 = ref(false)
const showLine8 = ref(false)

const DELAY_BETWEEN_LINES = 300 // milliseconds

async function showResultsSequentially() {
  const lines = [showLine1, showLine2, showLine3, showLine4, showLine5, showLine6, showLine7, showLine8]
  for (let i = 0; i < lines.length; i++) {
    await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_LINES))
    lines[i].value = true
    await nextTick()
    // Auto-scroll to bottom as new content appears
    const terminal = document.querySelector('.terminal-content')
    if (terminal) {
      terminal.scrollTop = terminal.scrollHeight
    }
  }
}

onMounted(() => {
  const typewriter = new Typewriter(typewriterElement.value, {
    delay: 50,
    cursor: '▋',
  });

  typewriter
    .typeString('FOUNDRY_PROFILE=solx forge test --gas-report')
    .callFunction(() => {
      showResultsSequentially()
    })
    .start();
})
</script>

<style scoped>
.space-y-1 > * + * {
  margin-top: 0.25rem;
}

/* Custom scrollbar for the terminal */
.terminal-content::-webkit-scrollbar {
  width: 8px;
}

.terminal-content::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

.terminal-content::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

.terminal-content::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style> 
