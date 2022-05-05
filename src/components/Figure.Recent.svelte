<script>
  import { getContext } from "svelte";
  import { extent, timeFormat, range } from "d3";
  import { LayerCake, Canvas, Svg, Html } from "layercake";
  import { tweened } from "svelte/motion";
  import { cubicInOut } from "svelte/easing";
  import { fade } from "svelte/transition";
  import AxisX from "$components/charts/AxisX.svg.svelte";
  import AxisY from "$components/charts/AxisY.svg.svelte";
  import ScatterCanvas from "$components/charts/Scatter.canvas.svelte";
  import Column from "$components/Column.svelte";
  import Annotation from "$components/Annotation.Recent.svelte";
  import { activeSlide, dir } from "$stores/misc.js";

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

  const recentData = rawData.filter((d) => d.recentDay);
  const exampleData = rawData.filter((d) => d.exampleDay);
  const x = "day";
  const y = "temp";
  const xReverse = true;
  const extentDay = extent(recentData, (d) => d[x]);
  const extentExample = extent(exampleData, (d) => d[x]);
  const tweenExtentDay = tweened();
  const tweenDaysInView = tweened();

  const formatTick = (d) => {
    const match = rawData.find((e) => e[x] === d);
    if (!match) return "";
    return timeFormat("%b %d")(match.date);
  };

  const getFill = (d) => {
    // if (d.rank === 0 && d[x] === 0) return "yellow";
    if (d.highlight === "latest" && $activeSlide < 3) return color.tertiary;
    if (d.highlight === "hot" && $activeSlide >= 2 && $activeSlide < 4)
      return color.secondary;
    if (d.highlight === "top" && $activeSlide >= 3) return color.primary;
    return color.default;
  };

  let highlight;

  $: duration = $dir === "right" ? 2000 : 0;

  $: targetExtentDay =
    $activeSlide < 2
      ? [extentDay[1] - minDays, extentDay[1]]
      : $activeSlide < 7
      ? [extentDay[0], extentDay[1]]
      : [extentExample[1] - minDays, extentExample[1]];
  $: tweenExtentDay.set(targetExtentDay, { duration, easing: cubicInOut });
  $: xDomain = $tweenExtentDay;

  $: daysInView = xDomain[1] - xDomain[0];
  $: m = daysInView > threshold ? 0 : 2;
  $: margin = daysInView * m * 2;
  $: sidePad = pad * 4;
  $: realW = width - padding.left - padding.right - sidePad;
  $: w = realW / daysInView;
  $: h = Math.max(2, Math.floor(height * 0.0075));
  $: xPadding = [pad, pad * 3];

  $: {
    if ($activeSlide < 2)
      highlight = { ...rawData.find((d) => d.highlight === "latest") };
    else if ($activeSlide === 2)
      highlight = { ...rawData.find((d) => d.highlight === "hot") };
    else if ($activeSlide === 3)
      highlight = { ...rawData.find((d) => d.highlight === "top") };
    else highlight = undefined;
  }

  $: data = rawData
    .filter((d) =>
      $activeSlide < 2
        ? d[x] === extentDay[1]
        : $activeSlide < 6
        ? d[x] > extentDay[0] && d[x] <= extentDay[1]
        : d[x] === extentExample[1]
    )
    .map((d) => ({
      ...d,
      fill: getFill(d)
    }));
</script>

{#if width}
  <LayerCake {xDomain} {padding} {position} {x} {y} {yDomain} {data} {xPadding}>
    {#if true}
      <div transition:fade>
        <Svg>
          <AxisX {formatTick} />
          <AxisY />
        </Svg>
        <Html>
          {#if highlight}
            <Column d={highlight} {w} {m} />
          {/if}
        </Html>
      </div>
    {/if}
    {#if true}
      <div transition:fade>
        <Canvas>
          <ScatterCanvas {w} {h} />
        </Canvas>
        {#if highlight}
          <Html>
            <Annotation d={highlight} {w} {m} />
          </Html>
        {/if}
      </div>
    {/if}
  </LayerCake>
{/if}
