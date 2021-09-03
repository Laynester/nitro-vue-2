<script lang="ts">
export default {
    props: ["skin"],
};
</script>

<template>
    <div class="classic-border" :skin="skin">
        <slot />
    </div>
</template>