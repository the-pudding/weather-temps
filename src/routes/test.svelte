<script>
  import { browser } from "$app/env";
  import Meta from "$components/Meta.svelte";
  import App from "$components/App.Test.svelte";
  if (browser) console.log("svelte-starter version", __VERSION__);
</script>

<Meta />
<App />
