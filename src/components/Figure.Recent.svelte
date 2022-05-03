<script>
  import { getContext } from "svelte";
  import { extent, timeFormat } from "d3";
  import { LayerCake, Canvas, Svg } from "layercake";
  import { tweened } from "svelte/motion";
  import { cubicInOut } from "svelte/easing";
  import { fade } from "svelte/transition";
  import AxisX from "$components/charts/AxisX.svg.svelte";
  import AxisY from "$components/charts/AxisY.svg.svelte";
  import ScatterSvg from "$components/charts/Scatter.svg.svelte";
  import ScatterCanvas from "$components/charts/Scatter.canvas.svelte";
  import { activeSlide } from "$stores/misc.js";

  export let width;

  const { rawData, color, pad, padding, position, yDomain } = getContext("App");

  const MIN_DAYS = 5;

  const x = "daysSinceNowFake";
  const y = "temp";
  const extentDay = extent(rawData, (d) => d[x]);
  const tweenExtentDay = tweened();

  const formatTick = (d) => {
    const match = rawData.find((e) => e[x] === d);
    if (!match) return "";
    return timeFormat("%b %d")(match.date);
  };

  const getFill = ({ rank, highlight }) => {
    if (highlight === "latest" && $activeSlide < 3) return color.tertiary;
    if (highlight === "hot" && $activeSlide >= 2 && $activeSlide < 4)
      return color.secondary;
    if (highlight === "top" && $activeSlide >= 3) return color.primary;
    return color.default;
  };

  let targetExtentDay = extentDay;
  let highlightTop = false;

  $: duration = 2000;
  $: {
    targetExtentDay =
      $activeSlide < 2 ? [extentDay[1] - MIN_DAYS, extentDay[1]] : extentDay;
  }
  $: tweenExtentDay.set(targetExtentDay, { duration, easing: cubicInOut });
  $: xDomain = $tweenExtentDay;
  $: daysInView = xDomain[1] - xDomain[0];
  $: m = daysInView <= 90 ? 2 : 0;
  $: margin = daysInView * m * 2;
  $: sidePadding = pad * 2;
  $: w = (width - sidePadding * 2) / daysInView - m;
  $: half = Math.floor(w / 2);
  $: h = 3;
  $: xPadding = [0, sidePadding];
  $: data = rawData
    .filter((d) =>
      $activeSlide < 2
        ? d[x] === extentDay[1]
        : d[x] >= extentDay[0] && d[x] <= extentDay[1]
    )
    .map((d) => ({
      ...d,
      fill: getFill(d)
    }));
</script>

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
