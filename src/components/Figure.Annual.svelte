<script>
  import { getContext } from "svelte";
  import { extent, timeFormat, range } from "d3";
  import { LayerCake, Canvas, Svg } from "layercake";
  import { tweened } from "svelte/motion";
  import { cubicInOut } from "svelte/easing";
  import { fade } from "svelte/transition";
  import AxisX from "$components/charts/AxisX.svg.svelte";
  import AxisY from "$components/charts/AxisY.svg.svelte";
  import ScatterCanvas from "$components/charts/Scatter.canvas.svelte";
  import { activeSlide, dir } from "$stores/misc.js";
  import getExtentOverlay from "$utils/getExtentOverlay.js";

  export let width;
  export let height;
  const {
    rawData,
    threshold,
    minDays,
    color,
    pad,
    padding,
    position,
    yDomain
  } = getContext("App");

  const rankData = rawData
    .filter((d) => d.rank === 0)
    .map((d) => ({
      ...d,
      fill: color.primary
    }));

  // add fake dupe negatives
  range(-180, 0).forEach((i) => {
    const wrap = 366 - i;
    const match = rankData.find((d) => d.day === i);
    rankData.push({
      ...match,
      day: i
    });
  });

  const x = "day";
  const y = "temp";

  const extentDay = extent(rawData, (d) => d[x]);
  const extentDayRecent = getExtentOverlay(rawData);
  const tweenExtentDay = tweened();
  const tweenDaysInView = tweened();

  const formatTick = (d) => {
    const match = rawData.find((e) => e[x] === d);
    if (!match) return "";
    return timeFormat("%b %d")(match.date);
  };

  let targetExtentDay = extentDay;

  $: duration = $dir === "right" ? 2000 : 0;

  $: {
    targetExtentDay = $activeSlide < 4 ? extentDayRecent : extentDay;
  }
  $: tweenExtentDay.set(targetExtentDay, { duration, easing: cubicInOut });
  $: xDomain = $tweenExtentDay;

  $: daysInView = xDomain[1] - xDomain[0];
  $: m = daysInView > threshold ? 0 : 2;
  $: margin = daysInView * m * 2;
  $: sidePad = pad * 4;
  $: realW = width - padding.left - padding.right - sidePad;
  $: w = Math.max(3, realW / daysInView);
  $: h = $activeSlide === 3 ? Math.max(2, Math.floor(height * 0.0075)) : 3;
  $: xPadding = [pad, pad * 3];

  $: data = rankData.filter((d) =>
    $activeSlide > 3
      ? true
      : d[x] >= extentDayRecent[0] && d[x] <= extentDayRecent[1]
  );
</script>

{#if width}
  <LayerCake {xDomain} {padding} {position} {x} {y} {yDomain} {data} {xPadding}>
    {#if true}
      <div transition:fade>
        <Svg>
          <AxisX {formatTick} />
          <AxisY />
        </Svg>
      </div>
    {/if}
    {#if true}
      <div transition:fade>
        <Canvas>
          <ScatterCanvas {w} {h} />
        </Canvas>
      </div>
    {/if}
  </LayerCake>
{/if}
