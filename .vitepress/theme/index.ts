import DefaultTheme from "vitepress/theme";
import Layout from "./Layout.vue";
import InstallCommand from "./components/InstallCommand.vue";
import UpdateBar from "./components/UpdateBar.vue";
import StatsRow from "./components/StatsRow.vue";
import TechStack from "./components/TechStack.vue";
import LogList from "./components/LogList.vue";
import HomeCta from "./components/HomeCta.vue";
// 字体自托管（fontsource，不走 Google CDN）
import "@fontsource-variable/inter";
import "@fontsource-variable/space-grotesk";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/600.css";
import "@fontsource/ibm-plex-mono/700.css";
import "./custom.css";

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }: { app: any }) {
    app.component("InstallCommand", InstallCommand);
    app.component("UpdateBar", UpdateBar);
    app.component("StatsRow", StatsRow);
    app.component("TechStack", TechStack);
    app.component("LogList", LogList);
    app.component("HomeCta", HomeCta);
  },
};
