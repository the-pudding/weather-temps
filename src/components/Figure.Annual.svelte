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
  import Annotation from "$components/Annotation.Annual.svelte";
  import { activeSlide, dir } from "$stores/misc.js";
  import getExtentOverlay from "$utils/getExtentOverlay.js";

  export let width;
  export let height;

  const {
    custom,
    rawData,
    threshold,
    minDays,
    color,
    pad,
    padding,
    position,
    yDomain,
    dur
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
  const heightAdjustment = 0.5;
  const widthAdustment = 1;

  const exampleData = rawData.filter((d) => d.exampleDay);
  const extentAnnual = extent(rawData, (d) => d[x]);
  const extentFakeMap = getExtentOverlay(rawData);
  const extentExample = extent(exampleData, (d) => d[x]);

  const tweenExtentDay = tweened();
  // const tweenOpacity = tweened();

  const formatTick = (d) => {
    const match = rawData.find((e) => e[x] === d);
    if (!match) return "";
    return timeFormat("%b %d")(match.date);
  };

  let highlight;
  let targetExtentDay = extentAnnual;
  let tempHide;
  let tempHideTimer;

  $: showAxis = $activeSlide > 3 && $activeSlide < 7;
  $: duration = $dir === "right" ? $dur : 0;
  $: delay = $dir === "right" && $activeSlide === 4 ? 1000 : 0;
  $: {
    if (delay) {
      tempHide = true;
      tempHideTimer = setTimeout(() => {
        tempHide = false;
      }, delay);
    } else {
      clearTimeout(tempHideTimer);
      tempHide = false;
    }
  }
  $: {
    targetExtentDay =
      $activeSlide < 4
        ? extentFakeMap
        : $activeSlide < 7
        ? extentAnnual
        : [extentExample[1] - minDays, extentExample[1]];
  }
  $: tweenExtentDay.set([targetExtentDay[0] - 1, targetExtentDay[1]], {
    duration,
    delay,
    easing: cubicInOut
  });
  $: xDomain = $tweenExtentDay;

  $: daysInView = xDomain[1] - xDomain[0];
  $: m = daysInView > threshold ? 0 : 2;
  $: margin = daysInView * m * 2;
  $: sidePad = pad * 4;
  $: realW = width - padding.left - padding.right - sidePad;
  $: w = Math.max(realW / daysInView - widthAdustment, 2);
  $: h =
    $activeSlide === 3
      ? Math.max(2, Math.floor(height * 0.00625)) - heightAdjustment
      : 3 - heightAdjustment;
  $: xPadding = [pad, pad * 3];

  $: {
    if ($activeSlide === 4)
      highlight = rawData.filter((d) => d.highlight === "alltime");
    else if ($activeSlide === 5)
      highlight = [
        rawData.find((d) => d.highlight === "record5" && d.annotation)
      ];
    else if ($activeSlide === 6)
      highlight = rawData.filter((d) => d.highlight === "record5");
    else highlight = undefined;
  }
  $: data = rankData.filter((d) =>
    $activeSlide === 3 || tempHide
      ? d[x] >= extentFakeMap[0] && d[x] <= extentFakeMap[1]
      : $activeSlide < 7 && $activeSlide > 3
      ? true
      : d[x] === extentExample[1]
  );
</script>

{#if width}
  <LayerCake {xDomain} {padding} {position} {x} {y} {yDomain} {data} {xPadding}>
    <div>
      <Svg>
        {#if showAxis}
          <AxisX {formatTick} {w} />
          <AxisY location={custom.location} />
        {/if}
      </Svg>
    </div>
    <div>
      <Canvas>
        <ScatterCanvas {w} {h} />
      </Canvas>
      {#if highlight}
        <Html>
          <Annotation data={highlight} {w} {m} />
        </Html>
      {/if}
    </div>
  </LayerCake>
{/if}
