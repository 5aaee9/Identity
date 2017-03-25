<template>
    <div id="app">
        <div class="ui menu" id="header-bar">
            <router-link id="home" to="/" class="item">VeryAuth</router-link>
            <div v-if="getLoginStatus()" class="right menu">
                <router-link id="login" to="/login" class="item">Login</router-link>
                <router-link id="register" to="/register" class="item">Register</router-link>
            </div>
            <div v-else class="right menu">
                <router-link id="register" to="/user" class="item">{{ getUsername() }}</router-link>
                <a class="item" @click="logout"> Logout </a>
            </div>
        </div>
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        name: 'app',
        'prop': {
            title: "VeryAuth"
        },
        'methods': {
            getLoginStatus() {
                return sessionStorage.getItem("userName") == null
            },
            getUsername() {
                return sessionStorage.getItem("userName")
            },
            logout() {
                sessionStorage.removeItem("userName")
                sessionStorage.removeItem("accessToken")
                this.$router.push({ path: "/" })
            }
        }
    }

</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
    }
    
    #header-bar {
        border-radius: 0in;
    }
    
    @import './assets/semantic.min.css';
</style>