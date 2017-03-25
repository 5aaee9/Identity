<template>
    <div class="ui container">
        <h2 class="ui center aligned icon header"><i class="circular users icon"></i> Register </h2>
        <div class="ui three steps">
            <div class="active step">
                <i class="users icon"></i>
                <div class="content">
                    <div class="title">Register</div>
                </div>
            </div>
            <div class="disabled step">
                <i class="mail icon"></i>
                <div class="content">
                    <div class="title">Email Verify</div>
                </div>
            </div>
            <div class="disabled step">
                <i class="info icon"></i>
                <div class="content">
                    <div class="title">Registed</div>
                </div>
            </div>
        </div>
        <div class="ui center centered wireframe">
            <form class="ui form error">
                <h4 class="ui dividing header">Information</h4>
                <div class="field">
                    <div class="two fields">
                        <div class="field">
                            <label>Username</label>
                            <input type="text" v-model="username" v-model.trim="username" placeholder="Username">
                        </div>
                        <div class="field">
                            <label>Password</label>
                            <input type="password" v-model="password" v-model.trim="password" placeholder="Password">
                        </div>
                    </div>
                </div>
                <div class="field">
                    <label>Email Address</label>
                    <input type="text" v-model="email" v-model.trim="email" placeholder="Email Address">
                </div>
                <a class="fluid ui button" @click="subimtUser">Sign up now!</a>
                <div class="ui error message" id="form-errors"></div>
            </form>
        </div>
    </div>
</template>

<script>
    import semantic from "assets/semantic.js"
    import Vue from "vue"
    export default {
        name: "register",
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
            subimtUser() {
                // Cleanup old error
                this.errors = [];
                if (this.username.length < 3) {
                    this.errors.push("Username too low")
                }
                if (!/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(this.email)) {
                    this.errors.push("Error email")
                }
                if (this.password.length < 6) {
                    this.errors.push("Password too low")
                }
                if (this.errors.length > 0) {
                    this.setErrors(this.errors)
                } else {
                    this.$http.post("/api/auth", {
                        username: this.username,
                        password: this.password,
                        email: this.email
                    }).then(response => {
                        if (response.body.ok) {
                            this.$router.push({ path: "/send" })
                        } else {
                            this.setErrors([response.body.error])
                        }
                    }).catch(err => {
                        this.setErrors([err.body.error])
                    })
                }
            }
        }
    }

</script>

<style scoped>

</style>