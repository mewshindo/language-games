<script setup lang="ts">
const props = defineProps({
    result: String
})

</script>
<template>
<div class="results">
    <h1>Your result:</h1>
    <h2 class="green">{{props.result}} wpm</h2>
</div>
</template>
<style scoped>
.results{
    height: 60vh;
    min-height: 200px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
h2{
    font-size: 40px;
    font-weight: 700;
}
</style>