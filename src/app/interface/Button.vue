<script lang="ts">
export default {
    props: ["text", "skin"]
};
</script>

<template>
    <button class="lstr-classic-button" :skin="skin" @click="$emit('clicked')">{{text}}</button>
</template>