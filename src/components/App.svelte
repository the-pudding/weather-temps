<script>
  import { extent } from "d3";
  import { LayerCake, Canvas, Svg } from "layercake";
  import { fade } from "svelte/transition";
  import { tweened } from "svelte/motion";
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
  const secondary = "#f96";
  const padding = 24;
  const xPadding = [padding * 2, padding * 2];
  const yPadding = [padding, padding];
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
  const filterRecords = (d) => d.rank !== undefined;

  let data = [...rawData];
  let slider = undefined;
  let activeSlide = 0;

  const onTap = ({ detail }) => {
    if (detail === "right") slider.next();
    else slider.prev();
  };

  $: visible = activeSlide > 0;
  $: tease = activeSlide < 2;
  $: showDaily = activeSlide < 5 && activeSlide > 0;
  $: showRecord = activeSlide > 2;
  $: targetExtentDay = activeSlide < 5 ? extentDayRecent : extentDayRecords;
  $: duration = activeSlide < 5 ? 0 : 2000;
  $: tweenExtentDay.set(targetExtentDay, { duration, easing: cubicInOut });
  $: xDomain = $tweenExtentDay;
  $: {
    if (activeSlide === 3) {
      const index = data.findIndex((d) => d.rank !== undefined);
      data.forEach((d, i) => (d.class = i === index ? "secondary" : ""));
    } else if (activeSlide > 3) {
      data.forEach((d, i) => (d.class = d.rank === 0 ? "primary" : ""));
    }
    data = [...data];
  }
</script>

<!-- <WIP /> -->

<figure class:visible class:tease>
  <LayerCake
    {xDomain}
    {xPadding}
    {yPadding}
    {position}
    {x}
    {y}
    {z}
    {yDomain}
    {data}
  >
    {#if showDaily}
      <div transition:fade>
        <Svg>
          <AxisX />
          <AxisY />
        </Svg>
        <Canvas>
          <Scatter2 {fill} {primary} {secondary} filter={filterRecent} />
        </Canvas>
      </div>
    {/if}
    <!-- <Canvas>
      <Scatter2 {fill} {highlight} filter={filterRecords} />
    </Canvas> -->
    {#if showRecord}
      <div transition:fade>
        <Svg>
          <Scatter {fill} {primary} {secondary} filter={filterRecords} />
        </Svg>
      </div>
    {/if}
  </LayerCake>
</figure>

<article>
  <Slider bind:this={slider} bind:active={activeSlide} duration="0">
    {#each copy.slides as { text, subtext, center }, i}
      <ArticleSlide active={activeSlide === i} {text} {subtext} {center} {i} />
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
    max-width: 80rem;
    height: 100%;
    left: 50%;
    transform: translate3d(-50%, 0, 0);
  }

  figure {
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
    font-size: clamp(20px, 2vw, 36px);
  }
</style>
