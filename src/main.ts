import { createApp } from "vue";
import { Nitro } from "../../nitro-renderer/src";
import App from './app/App.vue';
import Border from "./app/interface/Border.vue";
import Card from './app/interface/Card.vue';
import './assets/styles/styles.scss';
import store from "./utils/store";


const app = createApp(App);

app.use(store);

app.config.globalProperties.$store = store;

app.config.globalProperties.$filters = {
    localizeText(val: string)
    {
        return Nitro.instance.localization.getValue(val);
    }
}

app.component('Card', Card);
app.component('Border', Border)

app.mount('#classic');
