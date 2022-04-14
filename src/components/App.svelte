<script>
  import { extent } from "d3";
  import { LayerCake, Canvas, Svg } from "layercake";
  import { fade } from "svelte/transition";
  import { tweened } from "svelte/motion";
  import { cubicInOut } from "svelte/easing";
  import WIP from "$components/helpers/WIP.svelte";
  import Slider from "$components/helpers/Slider.svelte";
  import Slide from "$components/helpers/Slider.Slide.svelte";
  import Tap from "$components/helpers/Tap.svelte";
  import Scatter from "$components/charts/Scatter.svg.svelte";
  import Scatter2 from "$components/charts/Scatter.canvas.svelte";
  import data from "$data/bos.js";

  const position = "absolute";
  const x = "day";
  const y = "temp";
  const z = "rank";
  const fill = "rgba(255,255,255,0.25)";
  const highlight = "#6f9";
  const padding = 20;
  const xPadding = [padding, padding];
  const dayRecentExtent = extent(
    data.filter((d) => d.recent),
    (d) => d.day
  );
  const dayRecordsExtent = extent(
    data.filter((d) => d.rank !== undefined),
    (d) => d.day
  );
  const xExtent = tweened(dayRecentExtent);
  const yDomain = [0, null];
  const filterRecent = (d) => d.recent;
  const filterRecords = (d) => d.rank === 0;

  let slider = undefined;
  let activeSlide = 0;

  const onTap = ({ detail }) => {
    if (detail === "right") slider.next();
    else slider.prev();
  };

  $: xDomain = $xExtent;
  $: visible = activeSlide > 1;
  $: showDaily = activeSlide < 5 && activeSlide > 1;
  $: showRecord = activeSlide > 2;
  $: extentTarget = activeSlide < 5 ? dayRecentExtent : dayRecordsExtent;
  $: duration = activeSlide < 5 ? 0 : 2000;
  $: xExtent.set(extentTarget, { duration, easing: cubicInOut });
</script>

<!-- <WIP /> -->

<figure class:visible>
  <LayerCake {xDomain} {xPadding} {position} {x} {y} {z} {yDomain} {data}>
    {#if showDaily}
      <div transition:fade>
        <Canvas>
          <Scatter2 {fill} {highlight} filter={filterRecent} />
        </Canvas>
      </div>
    {/if}
    <!-- <Canvas>
      <Scatter2 {fill} {highlight} filter={filterRecords} />
    </Canvas> -->
    {#if showRecord}
      <div transition:fade>
        <Svg>
          <!-- <Scatter {fill} {highlight} filter={filterRecent} /> -->
          <Scatter fill={highlight} {highlight} filter={filterRecords} />
        </Svg>
      </div>
    {/if}
  </LayerCake>
</figure>

<article>
  <Slider bind:this={slider} bind:active={activeSlide} duration="0">
    <Slide>
      <p>
        <small
          >Was yesterday a heat record in <select
            ><option>Boston</option></select
          >?</small
        >
      </p>
    </Slide>
    <Slide>
      <p>
        Yesterday was not a heat record in <span>Boston</span>, but
        <span>four weeks ago</span>
        was one of the hottest days ever in <span>March</span>.
      </p>
      <p>
        <small
          >Let’s look at the last 30 days of daily temperatures highs in
          <span>Boston</span>.</small
        >
      </p>
    </Slide>
    <Slide>
      <!-- fade in non-records -->
      <!-- bonus: animate positions (tweened on values) -->
      <p>
        Each line represents a single day’s max temperature, going all the way
        back to <span>1887</span>.
      </p>
    </Slide>
    <Slide>
      <!-- highlight one day -->
      <!-- add annotation -->
      <p>
        Here was <span>last Wednesday</span>, a scorcher for a day in
        <span>March</span>!
      </p>
    </Slide>
    <Slide>
      <!-- highlight rank = 0 -->
      <!-- fade out daily -->
      <p>
        And these are the hottest recorded temperatures for each of the last 30
        days.
      </p>
    </Slide>
    <Slide>
      <!-- transition axis -->
      <p>
        Let’s zoom out. Each dot is the hottest temperature its ever been in <span
          >Boston</span
        >
        for each day of the year.
      </p>
    </Slide>
    <Slide>
      <!-- highlight -->
      <p>
        The most recent daily record was <span>February 2, 2007</span>, the
        hottest <span>Febuary 2nd</span> ever.
      </p>
    </Slide>
    <Slide>
      <!-- highlight -->
      <p>
        This record was set in <span>1933</span>, when it was the hottest it’s
        ever been,
        <span>109°F</span>.
      </p>
    </Slide>
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
    transform: translate(-50%, 0);
  }

  figure {
    opacity: 0;
    overflow: hidden;
  }

  figure.visible {
    opacity: 1;
  }

  :global(figure.hideDaily canvas) {
    /* opacity: 0; */
    /* transition: opacity 500ms ease-in-out; */
  }

  article {
    font-size: 2em;
  }

  span {
    color: yellow;
  }
</style>
