<script>
  import Meta from "$components/Meta.svelte";
  import App from "$components/App.svelte";
  import version from "$utils/version.js";
  import { title, description, url, keywords } from "$data/doc.json";

  const preloadFont = [
    "https://pudding.cool/assets/fonts/inter/Inter-Regular.woff2",
    "https://pudding.cool/assets/fonts/inter/Inter-SemiBold.woff2",
    "https://pudding.cool/assets/fonts/lyon/LyonDisplay-Regular-Web.woff2"
  ];

  version();
</script>

<Meta {title} {description} {url} {keywords} {preloadFont} />
<App />
