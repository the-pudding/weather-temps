<script>
  import { getContext } from "svelte";

  const { padding, xPadding, xRange, yScale } = getContext("LayerCake");

  export let location;
  export let gridlines = true;
  export let tickMarks = false;
  export let xTick = 0;
  export let yTick = 0;
  export let dxTick = 0;
  export let dyTick = 4;
  export let textAnchor = "start";
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
          x1={$xRange[1] - $xPadding[1] / 1.25}
          x2={$xRange[1] - $xPadding[1] / 1.5}
          y1={yTick}
          y2={yTick}
        />
        <!-- <line
          class="gridline"
          x1={i === 0 ? $xRange[0] : $xRange[1] - $xPadding[1] / 1.25}
          x2={$xRange[1] - $xPadding[1] / 1.5}
          y1={yTick}
          y2={yTick}
        /> -->
      {/if}
      {#if tickMarks === true}
        <line class="tick-mark" x1="0" x2={6} y1={yTick} y2={yTick} />
      {/if}
      <text
        x={$xRange[1] - $xPadding[1] / 1.75}
        y={yTick}
        dx={dxTick}
        dy={dyTick}
        style="text-anchor:{textAnchor};">{formatTick(tick)}</text
      >
      <text
        x={$xRange[1] - $xPadding[1] / 1.75}
        y={yTick}
        dx={dxTick}
        dy={dyTick}
        style="text-anchor:{textAnchor};">{formatTick(tick)}</text
      >
    </g>
  {/each}
  <!-- {#if location}
    <text
      x={$xRange[0]}
      y={$yScale(tickVals[tickVals.length - 1])}
      dx={0}
      dy={dyTick * 1.5}
      class="location-bg">{location}</text
    >
    <text
      x={$xRange[0]}
      y={$yScale(tickVals[tickVals.length - 1])}
      dx={0}
      dy={dyTick * 1.5}
      class="location">{location}</text
    >
  {/if} -->
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

  .tick text {
    font-size: 14px;
  }

  .tick text:first-of-type {
    stroke: var(--color-bg);
    stroke-width: 4px;
  }

  .tick text:last-of-type {
    fill: var(--color-fg);
  }

  .location-bg {
    stroke: var(--color-bg);
    fill: none;
    font-size: 16px;
  }

  .location {
    fill: var(--color-fg-alt);
    font-size: 16px;
  }
</style>
