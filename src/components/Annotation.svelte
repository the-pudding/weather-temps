<script>
  import { getContext } from "svelte";

  const { data, xGet, yGet, xScale, yScale } = getContext("LayerCake");

  export let text;
</script>

<p>{text}</p>
