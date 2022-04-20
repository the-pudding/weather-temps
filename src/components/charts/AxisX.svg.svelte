<script>
  import { getContext } from "svelte";
  const { width, height, xScale, yRange, xRange, xDomain, padding } =
    getContext("LayerCake");

  export let gridlines = true;
  export let tickMarks = true;
  export let baseline = true;
  export let snapTicks = false;
  export let yTick = 16;
  export let formatTick = (d) => d;
  /** If this is a number, it passes that along to the [d3Scale.ticks](https://github.com/d3/d3-scale) function. If this is an array, hardcodes the ticks to those values. If it's a function, passes along the default tick values and expects an array of tick values in return. If nothing, it uses the default ticks supplied by the D3 function. */

  $: ticks = $xDomain[1] - $xDomain[0];
  $: tickVals = $xScale
    .ticks(ticks)
    .filter((d) => d >= $xDomain[0] && d <= $xDomain[1]);

  const textAnchor = (i) => {
    if (snapTicks === true) {
      if (i === 0) {
        return "start";
      }
      if (i === tickVals.length - 1) {
        return "end";
      }
    }
    return "middle";
  };
</script>

<g class="axis x-axis">
  {#each tickVals as tick, i}
    {@const visible = i === 0 || i === tickVals.length - 1}
    {@const j = i === 0 ? 0 : 1}
    {#if visible}
      <g
        class="tick tick-{i}"
        transform="translate({$xRange[j]},{$yRange[0] + $padding.top})"
      >
        <text x={0} y={yTick} dx="" dy="" text-anchor={textAnchor(i)}
          >{formatTick(tick)}</text
        >
      </g>
    {/if}
  {/each}
</g>

<style>
  .tick {
    font-size: 0.725em;
    font-weight: 200;
  }

  .tick.hack:first-of-type {
    /* display: none; */
  }

  .tick.hack {
    /* display: none; */
  }

  .tick text {
    fill: var(--color-fg);
  }

  .axis.snapTicks .tick:last-child text {
    transform: translateX(3px);
  }
  .axis.snapTicks .tick.tick-0 text {
    transform: translateX(-3px);
  }
</style>
