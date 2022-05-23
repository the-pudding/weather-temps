<script>
  import { getContext } from "svelte";
  const { width, height, xScale, yRange, xRange, xDomain, xPadding, padding } =
    getContext("LayerCake");

  export let yTick = 8;
  export let formatTick = (d) => d;
  export let showFirst = true;
  export let w = 0;

  const isVisible = (i) => {
    // if () return true;
    // if () return true;
    // if () return true;
    // return false;
  };

  $: ticks = $xDomain[1] - $xDomain[0];
  $: tickVals = $xScale
    .ticks(ticks)
    .filter((d) => d >= $xDomain[0] && d <= $xDomain[1]);
  $: len = tickVals.length;
</script>

<g class="axis x-axis">
  {#each tickVals as tick, i}
    {@const visible =
      (i === 1 && showFirst) ||
      i === tickVals.length - 1 ||
      (len >= 90 && i === Math.floor(len / 2))}
    {@const j = i === 1 ? 0 : i === len - 1 ? 1 : 0.5}
    {#if visible}
      <g
        class="tick tick-{i}"
        transform="translate({j === 0
          ? $padding.left + w / 2
          : j === 1
          ? $width - $xPadding[1] - w / 2
          : $width / 2}, {$yRange[0] + $padding.top})"
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
