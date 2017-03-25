<template>
    <div class="ui container">
        <div class="detail">
            <i class="mail icon" id="inco"></i>
            <h1>Sended email, please to active your account</h1>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'send',
        data() {
            return {

            }
        },
        methods: {
        
        }
    }

</script>

<style>
#inco {
    font-size: 15em
}
.detail {
    color: black;
    line-height: 50px;
    text-align: center;
    position: absolute; left: 50%; top: 55%;
    transform: translate(-45%, -45%);
    margin-bottom: 0px;
}
</style>