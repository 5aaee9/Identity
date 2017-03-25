<template>
    <div class="ui container">
        <div v-if="!error" class="detail">
            <i class="checkmark icon" id="inco"></i>
            <p>This Email been verifyed</p>
        </div>
        <div v-else class="detail" id="error">
            <i class="minus circle icon" id="inco"></i>
            <p>Verify error</p>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Email",
        data(){
            return {
                error: false
            }
        },
        method: {

        },
        mounted: function(){
            if (this.$route.query.error){
                this.error = true
            } else {
                setTimeout(() => {
                    this.$router.push({ path: "/" })
                }, 5000)
            }
            // console.log(this.$route.query.token)
        }
    }
</script>

<style scoped>
#inco {
    font-size: 15em
}
.detail {
    color: rgb(153,204,51);
    line-height: 50px;
    text-align: center;
    position: absolute; left: 50%; top: 55%;
    transform: translate(-45%, -45%);
    margin-bottom: 0px;
}
.detail > p {
    font-size: 30px;
    color: rgb(153,204,51);
    margin-top: 0px;
}
#error {
    color: rgb(255,80, 80);
    text-shadow: 0px 0px 0px rgb(255,80,80);
}
#error > p {
    color:rgb(255,80,80);
}
</style>