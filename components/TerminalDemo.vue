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
    <div class="p-4 font-mono text-sm text-white">
      <div class="flex">
        <span class="text-green-400">$</span>
        <span class="ml-2">
          <TypeWriter :text="'FOUNDRY_PROFILE=solx forge test --gas-report'" :delay="50" />
        </span>
      </div>
      <div class="text-green-400 mt-2">[+] Compiling...</div>
      <div class="text-green-400">[+] Compiling 49 files with <span class="text-blue-400">Solx 0.8.28</span></div>
      <div class="text-green-400">[+] Solx finished in <span class="text-blue-400">1.32s</span></div>
      <div class="text-green-500">Compiler run successful</div>
      <div class="text-white">Ran 13 tests for test/ERC20.t.sol:<span class="text-yellow-400">ERC20Test</span></div>
      <div class="text-white">Suite result: <span class="text-green-500">ok. 13 passed;</span> <span class="text-red-500">0 failed;</span> <span class="text-yellow-500">0 skipped;</span> finished in <span class="text-blue-400">1.98ms</span> (<span class="text-blue-400">7.81ms</span> CPU time)</div>
    </div>
  </div>
</template>

<script setup>
// TypeWriter component for the terminal effect
const TypeWriter = defineComponent({
  props: {
    text: {
      type: String,
      required: true
    },
    delay: {
      type: Number,
      default: 70
    }
  },
  setup(props) {
    const displayedText = ref('');
    const currentIndex = ref(0);

    onMounted(() => {
      const interval = setInterval(() => {
        if (currentIndex.value < props.text.length) {
          displayedText.value += props.text[currentIndex.value];
          currentIndex.value++;
        } else {
          clearInterval(interval);
        }
      }, props.delay);
    });

    return { displayedText };
  },
  template: `<span>{{ displayedText }}</span>`
});
</script> 
