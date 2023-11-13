<template>
   <span v-html="props.html"></span>
</template>
   
<script lang="ts" setup>
const props = defineProps({
   html: String
})

</script>
   