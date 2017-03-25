<template>
    <div class="ui container">
        <h2 class="ui center aligned icon header">
            <img :src="user_img"
                 class="circular users icon">
            </img>
            Hello, {{ userinfo.username }}
        </h2>
        <table class="ui teal celled striped table">
            <thead>
                <tr><th colspan="4">Your last 10 times activity</th>
                <tr>
                    <th class="six wide">Status</th>
                    <th class="three wide">Time</th>
                    <th class="four wide">IP Address</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in user_logs">
                    <td>{{ item.log }}</td>
                    <td>{{ getTime(item.date) }}</td>
                    <td>{{ item.ip ? item.ip : "Not record" }}</td>
                </tr>
            </tbody>
        </table>

    </div>
</template>

<script>
    export default {
        name: 'member',
        data() {
            return {
                userinfo: {

                },
                user_img: "",
                user_logs: []
            }
        },
        methods: {
            getUserInfo(cb) {
                $.get("/api/view/info?token=" + sessionStorage.getItem("accessToken"), (data, status) => {
                    cb(data)
                })
            },
            updateUserImage() {
                this.user_img = "https://www.gravatar.com/avatar/" + $.md5(this.userinfo.email) + "?40"
            },
            updateOnStart() {
                this.getUserInfo(doc => {
                    this.userinfo = doc
                    this.updateUserImage()
                    this.updateUserLog()
                })
            },
            updateUserLog(){
                $.get("/api/view/log?token=" + sessionStorage.getItem("accessToken") + "&user=" + this.userinfo._id, (data, status) => {
                    this.user_logs = data
                })
            },
            getTime(time){
                return moment(time).fromNow()
            }
        },
        mounted: function() {
            this.updateOnStart()
        }
    }
   
</script>