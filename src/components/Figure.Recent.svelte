<script>
  import { getContext } from "svelte";
  import { extent, timeFormat, max } from "d3";
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

  let highlight;
  let x = "fakeDay";
  const y = "temp";

  const widthAdustment = 1;
  const heightAdjustment = 0.5;

  const recentData = rawData.filter((d) => d.recentDay);
  const exampleData = rawData.filter((d) => d.exampleDay);

  const extentFake = extent(recentData, (d) => d[x]);
  const extentExample = extent(exampleData, (d) => d.day);
  const extentAnnual = extent(rawData, (d) => d.day);

  const tweenExtentDay = tweened($activeSlide === 0 ? null : extentAnnual);

  const formatTick = (d) => {
    const match = rawData.find((e) => e[x] === d);
    if (!match) return "";
    return timeFormat("%b %d")(match.date);
  };

  const getFill = (d) => {
    // if (d.rank === 0 && d[x] === 0) return "yellow";
    if (d.highlight && $activeSlide < 2) {
      if (d.annotation.color) return color.tertiary;
      return color.default;
    }
    if (d.recent && $activeSlide === 2) return color.secondary;
    if (d.highlight === "hot" && $activeSlide === 3) return color.secondary;
    if (d.highlight === "top" && $activeSlide >= 3) return color.primary;
    // if ($activeSlide === 3 && d.rank === 0) return color.primary;
    if ($activeSlide === 8 && d.rank === 1) return color.secondary;
    return color.default;
  };

  const getColumn = (highlight) => {
    if (!highlight) return;
    const { day } = highlight[0];
    const match = rawData.find((d) => d.day === day && d.rank === 0);
    return match.temp;
  };

  $: showAxis = $activeSlide < 4 || $activeSlide > 6;
  $: showFirst = $activeSlide > 1 && $activeSlide < 6;
  $: duration = $dir === "right" && showAxis ? $dur : 0;
  $: delay = $dir === "right" && $activeSlide === 4 ? 1000 : 0;

  $: x = $activeSlide < 5 ? "fakeDay" : "day";
  $: targetExtentDay =
    $activeSlide < 2
      ? [extentFake[1] - minDays, extentFake[1]]
      : $activeSlide < 5
      ? [extentFake[0], extentFake[1]]
      : $activeSlide < 7
      ? extentAnnual
      : [extentExample[1] - minDays, extentExample[1]];
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
  $: w = realW / daysInView - widthAdustment;
  $: h = Math.max(2, Math.floor(height * 0.00625)) - heightAdjustment;
  $: xPadding = [pad, pad * 3];
  $: hideCanvas = $activeSlide > 3 && $activeSlide < 7;

  $: {
    if ($activeSlide < 2)
      highlight = rawData.filter((d) => d.highlight === "latest");
    else if ($activeSlide === 2)
      highlight = [{ ...rawData.find((d) => d.highlight === "hot") }];
    else if ($activeSlide === 7)
      highlight = [{ ...rawData.find((d) => d.highlightAlt === "example1") }];
    else if ($activeSlide === 8)
      highlight = [
        {
          ...rawData.find(
            (d) =>
              (d.highlightAlt === "example1" && !d.annotation.same) ||
              d.highlightAlt === "example2"
          )
        }
      ];
    else highlight = undefined;
  }

  $: data = rawData
    .filter((d) =>
      $activeSlide < 2
        ? d[x] === extentFake[1]
        : $activeSlide < 7
        ? d[x] >= extentFake[0] && d[x] <= extentFake[1]
        : d.day === extentExample[1]
    )
    .map((d) => ({
      ...d,
      fill: getFill(d)
    }));

  $: columnTemp = getColumn(highlight);
</script>

{#if width}
  <LayerCake {xDomain} {padding} {position} {x} {y} {yDomain} {data} {xPadding}>
    <div>
      <Svg>
        {#if showAxis}
          <AxisX {formatTick} {showFirst} {w} />
          <AxisY location={custom.location} />
        {/if}
      </Svg>
      <Html>
        {#if highlight}
          <Column temp={columnTemp} d={highlight[0]} {w} {m} />
        {/if}
      </Html>
    </div>

    <div class="scatter" class:hideCanvas>
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

<style>
  .scatter {
    opacity: 1;
    transition: opacity 1s ease-in-out;
  }

  .hideCanvas {
    opacity: 0;
  }
</style>
