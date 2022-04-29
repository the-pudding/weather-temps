<script>
  import { ascending, max, extent, timeFormat } from "d3";
  import { LayerCake, Canvas, Svg } from "layercake";
  import { tweened } from "svelte/motion";
  import { cubicInOut } from "svelte/easing";
  import { fade } from "svelte/transition";
  import AxisX from "$components/charts/AxisX.svg.svelte";
  import AxisY from "$components/charts/AxisY.svg.svelte";
  import ScatterSvg from "$components/charts/Scatter.svg.svelte";
  import ScatterCanvas from "$components/charts/Scatter.canvas.svelte";
  import { activeSlide } from "$stores/misc.js";

  export let rawData;
  export let fill;
  export let primary;
  export let secondary;
  export let pad;
  export let padding;
  export let width;

  const position = "absolute";
  const x = "daysSinceNowFake";
  const y = "temp";
  const z = "rank";
  const maxTemp = max(rawData, (d) => d.temp);
  const yDomain = [0, maxTemp + 1];
  const extentDay = extent(rawData, (d) => d[x]);
  const tweenExtentDay = tweened(extentDay);

  const formatTick = (d) => {
    const match = data.find((e) => e[x] === d);
    if (!match) return "";
    return timeFormat("%b %d")(match.date);
  };

  let targetExtentDay = extentDay;

  $: duration = 2000;
  $: {
    targetExtentDay =
      $activeSlide < 2 ? [extentDay[1] - 5, extentDay[1]] : extentDay;
  }
  $: tweenExtentDay.set(targetExtentDay, { duration, easing: cubicInOut });
  $: xDomain = $tweenExtentDay;
  $: bar = Math.floor(width / (xDomain[1] - xDomain[0]));
  $: console.log(bar);
  $: xPadding = [bar, bar];
  $: data = rawData.filter((d) =>
    $activeSlide < 2 ? d.daysSinceNowFake === extentDay[1] : true
  );
</script>

<LayerCake
  {xDomain}
  {padding}
  {position}
  {x}
  {y}
  {z}
  {yDomain}
  {data}
  {xPadding}
>
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
        <ScatterCanvas {fill} />
      </Canvas>
    </div>
  {/if}
</LayerCake>
