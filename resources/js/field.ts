import IndexField from "./components/IndexField.vue";
import DetailField from "./components/DetailField.vue";
import FormField from "./components/FormField.vue";

import VueKonva from "vue-konva";
import { createPinia } from "pinia";

Nova.booting((app) => {
    const pinia = createPinia();
    app.use(pinia);

    app.use(VueKonva);

    app.component("index-image-markup", IndexField);
    app.component("detail-image-markup", DetailField);
    app.component("form-image-markup", FormField);
});
