<script>
  import { browser } from "$app/env";
  import Meta from "$components/Meta.svelte";
  import App from "$components/App.svelte";
  if (browser) console.log("svelte-starter version", __VERSION__);
  import { title, description, url, keywords } from "$data/doc.json";
</script>

<Meta {title} {description} {url} {keywords} />
<App />
