<script>
export default {};
</script>

<template>
    <div class="classic-loader d-flex justify-content-center">
        <div class="align-self-center loading-text">{{$store.state.app.percent}}%</div>
    </div>
</template>