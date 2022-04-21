<script>
  import { ascending, max, extent, timeFormat } from "d3";
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
  import ScatterSvg from "$components/charts/Scatter.svg.svelte";
  import ScatterCanvas from "$components/charts/Scatter.canvas.svelte";
  import ArticleSlide from "$components/ArticleSlide.svelte";
  import rawData from "$data/bos.js";
  import rawTest from "$data/test.js";
  import copy from "$data/doc.json";
  import { color } from "$data/variables.json";

  const position = "absolute";
  const x = "day";
  const y = "temp";
  const z = "rank";
  const fill = "rgba(255,255,255,0.25)";
  const primary = "green";
  const secondary = "pink";
  const pad = 32;
  const padding = { top: pad, right: pad, bottom: pad * 6, left: pad };
  const maxTemp = max(rawData, (d) => d.temp);
  const yDomain = [0, maxTemp + 1];
  const extentDayRecent = extent(
    rawData.filter((d) => d.recent),
    (d) => d.day
  );
  const extentDayRecords = extent(rawData, (d) => d.day);

  const tweenExtentDay = tweened(extentDayRecent);

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
  $: showRecent = activeSlide < 5 && activeSlide > 0;
  $: showAll = activeSlide > 4;
  $: filterTemps = (d) => (showAll ? d.rank === 0 : d.recent);
  $: targetExtentDay = activeSlide < 5 ? extentDayRecent : extentDayRecords;
  $: duration = activeSlide < 5 ? 0 : 2000;
  $: tweenExtentDay.set(targetExtentDay, { duration, easing: cubicInOut });
  $: xDomain = $tweenExtentDay;
  $: halfBar = Math.floor(figureWidth / (xDomain[1] - xDomain[0]));
  $: xPadding = [halfBar, halfBar];
  $: formatTick = activeSlide > 4 ? formatMonth : formatDay;
  $: padding.bottom = figureWidth * 0.2;
  $: {
    // update color
    let p = [];
    let s = [];

    if (activeSlide > 3) {
      data.forEach((d, i) => {
        if (d.rank === 0) p.push(i);
      });
    }

    if (activeSlide === 3) s.push(data.findIndex((d) => d.rank !== undefined));

    data.forEach((d, i) => {
      d.fill = p.includes(i)
        ? color[primary]
        : s.includes(i)
        ? color[secondary]
        : undefined;
    });

    data = [...data];
  }

  onMount(() => {
    mounted = true;
  });
</script>

<!-- <WIP /> -->

<p>slide: {activeSlide}</p>
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
    {#if showRecent || showAll}
      <div transition:fade>
        <Svg>
          <AxisX {formatTick} />
          <AxisY />
        </Svg>
      </div>
    {/if}
    {#if showRecent || showAll}
      <div transition:fade>
        <Canvas>
          <ScatterCanvas {fill} filter={filterTemps} />
        </Canvas>
      </div>
    {/if}
    <!-- {#if showAll}
      <div transition:fade>
        <Svg>
          <ScatterSvg {fill} filter={filterRecords} />
        </Svg>
      </div>
    {/if} -->
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
  p {
    position: absolute;
    top: 0;
    left: 1rem;
    z-index: 111111111;
    color: white;
  }

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
    max-width: 80rem;
    font-size: clamp(20px, 2vw, 36px);
  }

  article.mounted {
    visibility: visible;
  }
</style>
