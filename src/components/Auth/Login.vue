<template>
    <div class="ui container">
        <h2 class="ui center aligned icon header"><i class="circular users icon"></i> Login </h2>

        <div class="ui center centered wireframe">
            <form class="ui form error">
                <h4 class="ui dividing header">Information</h4>
                <div class="field">
                    <label>Username</label>
                    <input type="text" v-model="username" v-model.trim="username" placeholder="Username">
                </div>
                <div class="field">
                    <label>Password</label>
                    <input type="password" v-model="password" v-model.trim="password" placeholder="Password">
                </div>
                <a class="fluid ui button" @click="login">Login</a>
                <div class="ui error message" id="form-errors"></div>
            </form>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'login',
        data() {
            return {
                username: "",
                password: "",
                email: "",
                errors: []
            }
        },
        methods: {
            setErrors(errors) {
                let messages = "<ul class=\"list\">"
                for (let item in errors) {
                    messages += ("<li>" + errors[item] + "</li>")
                }
                messages += "</ul>"
                console.log(messages)
                $("#form-errors").html(messages)
            },
            login() {
                this.errors = [];
                if (this.username.length < 3) {
                    this.errors.push("Username too low")
                }
                if (this.password.length < 6) {
                    this.errors.push("Password too low")
                }
                if (this.errors.length > 0) {
                    this.setErrors(this.errors)
                } else {
                    this.$http.post("/api/auth/login", {
                        username: this.username,
                        password: this.password
                    }).then(res => {
                        if (res.body.ok){
                            console.log(res.body)
                            sessionStorage.setItem('accessToken', res.body.token)
                            sessionStorage.setItem('userName', res.body.username)
                            this.$router.push({ path: "/" })
                        } else {
                            this.setErrors([res.body.error])
                        }
                    }).catch(err => {
                        console.log(err)
                        this.setErrors([err.body.error])
                    })
                }
            }
        }
    }

</script>