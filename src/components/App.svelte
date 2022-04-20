<script>
  import { ascending, extent, timeFormat } from "d3";
  import { LayerCake, Canvas, Svg } from "layercake";
  import { fade } from "svelte/transition";
  import { tweened } from "svelte/motion";
  import { onMount } from "svelte";
  import { cubicInOut, cubicOut } from "svelte/easing";
  import WIP from "$components/helpers/WIP.svelte";
  import Slider from "$components/helpers/Slider.svelte";
  import Tap from "$components/helpers/Tap.svelte";
  import AxisX from "$components/charts/AxisX.svg.svelte";
  import AxisY from "$components/charts/AxisY.svg.svelte";
  import Scatter from "$components/charts/Scatter.svg.svelte";
  import Scatter2 from "$components/charts/Scatter.canvas.svelte";
  import ArticleSlide from "$components/ArticleSlide.svelte";
  import rawData from "$data/bos.js";
  import copy from "$data/doc.json";

  const position = "absolute";
  const x = "day";
  const y = "temp";
  const z = "rank";
  const fill = "rgba(255,255,255,0.25)";
  const primary = "#6f9";
  const secondary = "#f69";
  const pad = 32;
  const padding = { top: pad, right: pad, bottom: pad * 6, left: pad };
  const yDomain = [0, null];
  const extentDayRecent = extent(
    rawData.filter((d) => d.recent),
    (d) => d.day
  );
  const extentDayRecords = extent(
    rawData.filter((d) => d.rank !== undefined),
    (d) => d.day
  );

  const tweenExtentDay = tweened(extentDayRecent);

  const filterRecent = (d) => d.recent;

  const justRecords = rawData.filter((d) => d.rank === 0);
  justRecords.sort((a, b) => ascending(a.day, b.day));

  let data = [...rawData];
  let slider = undefined;
  let activeSlide = 0;
  let figureWidth = 0;
  let mounted;

  const formatDay = (d) => {
    const match = justRecords.find((j) => j.day === d);
    if (!match) return "";
    return timeFormat("%b %d")(match.date);
  };

  const formatMonth = (d) => {
    const match = justRecords.find((j) => j.day === d);
    if (!match) return "";
    return timeFormat("%b")(match.date);
  };

  const onTap = ({ detail }) => {
    if (detail === "right") slider.next();
    else slider.prev();
  };

  $: visible = activeSlide > 0;
  $: tease = activeSlide < 2;
  $: showDaily = activeSlide < 5 && activeSlide > 0;
  $: showRecord = activeSlide > 2;
  $: filterRecords = (d) =>
    d.rank !== undefined && showDaily
      ? d.day >= xDomain[0] && d.day <= xDomain[1]
      : true;
  $: targetExtentDay = activeSlide < 5 ? extentDayRecent : extentDayRecords;
  $: duration = activeSlide < 5 ? 0 : 2000;
  $: tweenExtentDay.set(targetExtentDay, { duration, easing: cubicInOut });
  $: xDomain = $tweenExtentDay;
  $: halfBar = Math.floor(figureWidth / (xDomain[1] - xDomain[0]));
  $: xPadding = [halfBar, halfBar];
  $: formatTick = activeSlide > 4 ? formatMonth : formatDay;
  $: padding.bottom = figureWidth * 0.2;
  $: {
    if (activeSlide === 3) {
      const index = data.findIndex((d) => d.rank !== undefined);
      data.forEach((d, i) => (d.class = i === index ? "secondary" : ""));
    } else if (activeSlide > 3) {
      data.forEach((d, i) => (d.class = d.rank === 0 ? "primary" : ""));
    }
    data = [...data];
  }

  onMount(() => {
    mounted = true;
  });
</script>

<!-- <WIP /> -->

<figure class:visible class:tease bind:clientWidth={figureWidth}>
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
    {#if showDaily || showRecord}
      <div transition:fade>
        <Svg>
          <AxisX {formatTick} />
          <AxisY />
        </Svg>
      </div>
    {/if}
    {#if showDaily}
      <div transition:fade>
        <Canvas>
          <Scatter2 {fill} {primary} {secondary} filter={filterRecent} />
        </Canvas>
      </div>
    {/if}
    {#if showRecord}
      <div transition:fade>
        <Svg>
          <Scatter {fill} {primary} {secondary} filter={filterRecords} />
        </Svg>
      </div>
    {/if}
  </LayerCake>
</figure>

<article class:mounted>
  <Slider bind:this={slider} bind:active={activeSlide} duration="0">
    {#each copy.slides as { text, subtext, center, color }, i}
      <ArticleSlide
        active={activeSlide === i}
        {i}
        {text}
        {subtext}
        {center}
        {color}
      />
    {/each}
  </Slider>
</article>
<Tap
  debug={false}
  full={true}
  size="50%"
  enableKeyboard={true}
  on:tap={onTap}
/>

<style>
  article,
  figure {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 50%;
    transform: translate3d(-50%, 0, 0);
  }

  figure {
    max-width: 80rem;
    opacity: 0;
    overflow: hidden;
    transition: transform 1s ease-in-out, filter 0.5s 1s;
  }

  figure.visible {
    opacity: 1;
  }

  figure.tease {
    filter: blur(4px);
    transform: translate3d(-50%, 50%, 0);
  }

  article {
    visibility: hidden;
    max-width: 65rem;
    font-size: clamp(20px, 2vw, 36px);
  }

  article.mounted {
    visibility: visible;
  }
</style>
