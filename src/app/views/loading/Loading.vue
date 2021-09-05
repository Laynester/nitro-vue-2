<script lang="ts">
export default {};
</script>

<template>
    <div class="lstr-classic-loader d-flex justify-content-center">
        <div class="align-self-center loading-text">{{$store.state.app.percent}}%</div>
    </div>
</template>