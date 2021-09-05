<script lang="ts">
import axios from "axios";
import { Nitro } from "@nitrots/nitro-renderer";
import { AppListener } from "../../AppListener";
export default {
    data() {
        return {
            loginForm: {
                username: "",
                password: ""
            }
        };
    },
    methods: {
        login: async function() {
            await this.$http
                .post(
                    this.$store.state.app.config["authenticate"]["api.login"],
                    this.loginForm
                )
                .then(res => {
                    console.log(res.data);
                    if (res.data.sso) {
                        // @ts-ignore
                        NitroConfig.sso = res.data.sso;
                        AppListener.getInstance();
                    }
                });
        }
    }
};
</script>

<template>
    <div class="lstr-classic-authenticate" v-if="$store.state.app.login">
        <div class="lstr-classic-frame w-100 align-self-center position-relative mb-3" skin="0">
            <div class="lstr-classic-frame-content">
                <span
                    class="lstr-classic-frame-sub-title"
                >{{$filters.localizeText('authenticate.new.1')}}</span>
                <div class="lstr-classic-frame-body text-center p-3">
                    <b class="d-block">{{$filters.localizeText('authenticate.new.2')}}</b>
                    <b>
                        <u class="fs-bold d-block">{{$filters.localizeText('authenticate.new.3')}}</u>
                    </b>
                </div>
            </div>
        </div>
        <div class="lstr-classic-frame w-100 align-self-center position-relative" skin="0">
            <div class="lstr-classic-frame-content">
                <span
                    class="lstr-classic-frame-sub-title"
                >{{$filters.localizeText('authenticate.login.1')}}</span>
                <div class="lstr-classic-frame-body text-center p-3">
                    <form
                        method="POST"
                        class="mb-2"
                        @submit.prevent="login()"
                        @keyup.enter="login()"
                    >
                        <label>{{$filters.localizeText('authenticate.login.2')}}</label>
                        <input type="text" class="scale-2 w-100 mb-1" v-model="loginForm.username" />
                        <label>{{$filters.localizeText('authenticate.login.3')}}</label>
                        <input type="password" class="scale-2 w-100" v-model="loginForm.password" />
                    </form>
                    <Button
                        :text="$filters.localizeText('authenticate.generic.ok')"
                        @clicked="login()"
                        skin="2"
                    />
                </div>
            </div>
        </div>
    </div>
</template>