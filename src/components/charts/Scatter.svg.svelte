<script>
  import { getContext } from "svelte";

  const { data, xGet, yGet, z, width, height, xDomain } =
    getContext("LayerCake");

  export let stroke = "#000";
  export let strokeWidth = 0;
  export let filter = () => true;

  $: daysInView = $xDomain[1] - $xDomain[0] + 1;
  $: margin = daysInView <= 30 ? 2 : 0;
  $: w = Math.max(3, Math.floor($width / daysInView - margin));
  $: h = 3;

  $: renderData = $data.filter(filter);
</script>

<g>
  {#each renderData as d (d.daysSinceNow)}
    {@const x = $xGet(d) - w / 2}
    {@const y = $yGet(d) - h / 2}
    <rect
      class={d.class}
      {x}
      {y}
      width={w}
      height={h}
      style:stroke
      style:stroke-width={strokeWidth}
    />
  {/each}
</g>

<style>
  rect {
    display: none;
    fill: rgba(255, 255, 255, 0.25);
  }

  rect.primary {
    display: block;
    fill: #6f9;
  }

  rect.secondary {
    display: block;
    fill: #f69;
  }
</style>
