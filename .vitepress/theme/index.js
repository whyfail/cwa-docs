// .vitepress/theme/index.js
import DefaultTheme from "vitepress/theme"
import "./custom.css"
import YouTubeVideo from "./components/YouTubeVideo.vue"

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component("YouTubeVideo", YouTubeVideo)
  },
}
