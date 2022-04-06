<script>
  import { getContext } from "svelte";
  import { timeFormat } from "d3";

  const { data, z, xGet, yGet } = getContext("LayerCake");

  const colors = ["#f00", "#c11", "#a22", "#833"];

  export let r = 5;
  export let fill = "#ccc";
  export let stroke = "#fff";
  export let strokeWidth = 1;
  export let showText;
</script>

<g>
  {#each $data as d, i (i)}
    {@const cx = $xGet(d)}
    {@const cy = $yGet(d)}
    {@const fillv = colors[d.rank]}
    {@const highlight = d.highlight}

    <circle
      class:highlight
      data-id={i}
      {cx}
      {cy}
      r={d.highlight ? 10 : r}
      fill={d.highlight ? fillv : "#888"}
      {stroke}
      stroke-width={d.highlight ? 4 : strokeWidth}
    />
    {#if d.highlight && showText}
      <text text-anchor="middle" x={cx} y={cy} dy="-24">{timeFormat("%B %d, %Y")(d.date)}</text>
      <text text-anchor="middle" x={cx} y={cy} dy="-24">{timeFormat("%B %d, %Y")(d.date)}</text>
    {/if}
  {/each}
</g>

<style>
  circle {
    opacity: 0.25;
  }

  circle.highlight {
    opacity: 1;
  }

  text {
    font-size: 24px;
    font-family: var(--sans);
  }

  text:first-of-type {
    fill: none;
    stroke: white;
    stroke-width: 8px;
  }
</style>
