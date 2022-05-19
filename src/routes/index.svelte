<script>
  import { browser } from "$app/env";
  import Meta from "$components/Meta.svelte";
  import App from "$components/App.svelte";
  if (browser) console.log("svelte-starter version", __VERSION__);
  import { title, description, url, keywords } from "$data/doc.json";

  const preloadFont = [
    "https://pudding.cool/assets/fonts/inter/Inter-Regular.woff2",
    "https://pudding.cool/assets/fonts/inter/Inter-SemiBold.woff2",
    "https://pudding.cool/assets/fonts/lyon/LyonDisplay-Regular-Web.woff2"
  ];
</script>

<Meta {title} {description} {url} {keywords} {preloadFont} />
<App />
