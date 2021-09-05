import axios from 'axios';
import { createApp } from "vue";
import App from './app/App.vue';
import Border from "./app/interface/Border.vue";
import Button from './app/interface/Button.vue';
import Card from './app/interface/Card.vue';
import './assets/styles/styles.scss';
import { localizeText } from "./utils/functions";
import store from "./utils/store";

const app = createApp(App);

app.use(store);

app.config.globalProperties.$store = store;

app.config.globalProperties.$http = axios.create();

app.config.globalProperties.$filters = {
    localizeText
}

app.config.globalProperties.$http.get('client.texts.json').then((e) =>
{
    store.state.app.texts = e.data;
});

app.config.globalProperties.$http.get('ui-config.json').then((e) =>
{
    store.state.app.config = e.data;
});

app.component('Card', Card);
app.component('Border', Border)
app.component('Button', Button)

app.mount('#classic');
