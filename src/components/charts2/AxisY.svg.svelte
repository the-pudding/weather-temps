<script>
  import { getContext } from "svelte";

  const { padding, xRange, yScale } = getContext("LayerCake");

  export let gridlines = true;
  export let tickMarks = false;
  export let formatTick = (d) => d;
  export let ticks = 4;
  export let xTick = 0;
  export let yTick = 0;
  export let dxTick = 0;
  export let dyTick = -4;
  export let textAnchor = "start";

  $: tickVals = Array.isArray(ticks)
    ? ticks
    : typeof ticks === "function"
    ? ticks($yScale.ticks())
    : $yScale.ticks(ticks);
</script>

<g class="axis y-axis" transform="translate({-$padding.left}, 0)">
  {#each tickVals as tick}
    {@const x = $xRange[0]}
    {@const y = $yScale(tick)}
    <g class="tick tick-{tick}" transform="translate({x}, {y})">
      {#if gridlines !== false}
        <line class="gridline" x2="100%" y1={yTick} y2={yTick} />
      {/if}
      {#if tickMarks === true}
        <line class="tick-mark" x1="0" x2={6} y1={yTick} y2={yTick} />
      {/if}
      <text
        x={xTick}
        y={yTick}
        dx={dxTick}
        dy={dyTick}
        style="text-anchor:{textAnchor};">{formatTick(tick)}</text
      >
    </g>
  {/each}
</g>

<style>
  .tick {
    font-size: 0.725em;
    font-weight: 200;
  }

  .tick line {
    stroke: var(--color-fg);
  }
  .tick .gridline {
    stroke-dasharray: 2;
  }

  .tick text {
    fill: var(--color-fg);
  }

  .tick.tick-0 line {
    stroke-dasharray: 0;
  }
</style>
