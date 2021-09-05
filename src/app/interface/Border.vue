<script lang="ts">
export default {
    props: ["skin"]
};
</script>

<template>
    <div class="lstr-classic-border" :skin="skin">
        <slot />
    </div>
</template>