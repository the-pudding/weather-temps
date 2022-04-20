<script>
  import { getContext } from "svelte";

  const { padding, xPadding, xRange, yScale } = getContext("LayerCake");

  export let gridlines = true;
  export let tickMarks = false;
  export let xTick = 0;
  export let yTick = 0;
  export let dxTick = 0;
  export let dyTick = 4;
  export let textAnchor = "end";
  export let formatTick = (d) => `${d}°F`;
  export let ticks = 4;
  /** If this is a number, it passes that along to the [d3Scale.ticks](https://github.com/d3/d3-scale) function. If this is an array, hardcodes the ticks to those values. If it's a function, passes along the default tick values and expects an array of tick values in return. */

  $: tickVals = Array.isArray(ticks)
    ? ticks
    : typeof ticks === "function"
    ? ticks($yScale.ticks())
    : $yScale.ticks(ticks);
</script>

<g class="axis y-axis" transform="translate(0, 0)">
  {#each tickVals as tick, i}
    <g
      class="tick tick-{tick}"
      transform="translate({$xRange[0]}, {$yScale(tick)})"
    >
      {#if gridlines !== false}
        <line
          class="gridline"
          x1={$xPadding[0] / 2}
          x2={$xRange[1] - $xPadding[1] / 2}
          y1={yTick}
          y2={yTick}
        />
      {/if}
      {#if tickMarks === true}
        <line class="tick-mark" x1="0" x2={6} y1={yTick} y2={yTick} />
      {/if}
      <text
        x={$xRange[1]}
        y={yTick}
        dx={dxTick}
        dy={dyTick}
        style="text-anchor:{textAnchor};"
        >{i === tickVals.length - 1 ? formatTick(tick) : tick}</text
      >
      <text
        x={$xRange[1]}
        y={yTick}
        dx={dxTick}
        dy={dyTick}
        style="text-anchor:{textAnchor};"
        >{i === tickVals.length - 1 ? formatTick(tick) : tick}</text
      >
    </g>
  {/each}
</g>

<style>
  .tick {
    font-size: 0.725em;
    font-weight: 200;
  }

  .tick:first-of-type {
    /* display: none; */
  }

  .tick line {
    stroke: var(--color-fg);
    stroke-opacity: 0.33;
  }

  .tick text:first-of-type {
    stroke: var(--color-bg);
    stroke-width: 4px;
  }

  .tick text:last-of-type {
    fill: var(--color-fg);
  }
</style>
