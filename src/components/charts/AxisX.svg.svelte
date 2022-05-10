<script>
  import { getContext } from "svelte";
  const { width, height, xScale, yRange, xRange, xDomain, xPadding, padding } =
    getContext("LayerCake");

  export let city;
  export let yTick = 16;
  export let formatTick = (d) => d;
  export let showFirst = true;
  export let w = 0;

  $: ticks = $xDomain[1] - $xDomain[0];
  $: tickVals = $xScale
    .ticks(ticks)
    .filter((d) => d >= $xDomain[0] && d <= $xDomain[1]);
</script>

<g class="axis x-axis">
  {#each tickVals as tick, i}
    {@const visible = (i === 1 && showFirst) || i === tickVals.length - 1}
    {@const j = i === 1 ? 0 : 1}
    {#if visible}
      <g
        class="tick tick-{i}"
        transform="translate({j === 0
          ? $padding.left + w / 2
          : $width - $xPadding[1] - w / 2},{$yRange[0] + $padding.top})"
      >
        <text
          x={0}
          y={yTick}
          dx=""
          dy=""
          text-anchor={j === 0 ? "middle" : "middle"}>{formatTick(tick)}</text
        >
      </g>
    {/if}
  {/each}
</g>

<style>
  .tick text {
    font-size: 14px;
    fill: var(--color-fg);
  }

  @media only screen and (min-width: 640px) {
    .tick text {
      font-size: 16px;
    }
  }
</style>
