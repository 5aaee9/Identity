<template>
    <div>
        <div id="background-img"></div>
        <div id="detail">
            <h1>Hello, welcome to VeryAuth</h1>
            <p>A simple minecraft login solution.</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'index'
}
</script>

<style scoped>
#background-img {
    background: url('~assets/Sketch.png') no-repeat top;
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    height: 100%;
    width: 100%;
    background-size: cover;
    z-index: -1;
}
#detail {
    color: lightcyan;
    text-shadow: 1px 1px 6px black;
    line-height: 50px;
    text-align: center;
    position: absolute; left: 50%; top: 50%;
    transform: translate(-50%, -50%);
}
#detail > h1 {
    font-size: 50px;
}
#detail > p {
    font-size: 20px;
}
@media (min-width: 1024px) {
    #detail {
      line-height: 10px;
    }
}
</style>
