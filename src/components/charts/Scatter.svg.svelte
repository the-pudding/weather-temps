<script>
  import { getContext } from "svelte";

  const { data, xGet, yGet, z, width, height, xPadding, xDomain } =
    getContext("LayerCake");

  export let fill = "#ccc";
  export let highlight = "#ccc";
  export let stroke = "#000";
  export let strokeWidth = 0;

  $: daysInView = $xDomain[1] - $xDomain[0];
  $: margin = daysInView <= 30 ? 2 : 0;
  $: paddedWidth = $width - $xPadding[0] - $xPadding[1];
  $: w = Math.floor(paddedWidth / daysInView - margin);
  $: h = 3;
</script>

<g>
  {#each $data as d}
    {@const x = $xGet(d) - w / 2}
    {@const y = $yGet(d) - h / 2}
    {@const f = $z(d) === 0 ? highlight : fill}
    <rect
      {x}
      {y}
      width={w}
      height={h}
      style:stroke
      style:fill={f}
      style:stroke-width={strokeWidth}
    />
  {/each}
</g>

<style>
  /* rect {
    stroke: "#000";
  } */
</style>
