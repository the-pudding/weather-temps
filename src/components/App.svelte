<script>
  import { fade } from "svelte/transition";
  import Slider from "$components/helpers/Slider.svelte";
  import Tap from "$components/helpers/Tap.svelte";
  import FigureRecent from "$components/Figure.Recent.svelte";
  // import FigureAnnual from "$components/Figure.Annual.svelte";
  import IntroSlide from "$components/IntroSlide.svelte";
  import ArticleSlide from "$components/ArticleSlide.svelte";
  import rawData from "$data/bos.js";
  import copy from "$data/doc.json";
  import { color } from "$data/variables.json";
  import { activeSlide } from "$stores/misc.js";

  const fill = "rgba(255,255,255,0.25)";
  const primary = "green";
  const secondary = "blue";
  const tertiary = "pink";
  const pad = 32;
  const padding = { top: pad, right: pad, bottom: pad, left: pad };

  let slider = undefined;
  let width = 0;

  // const formatMonth = (d) => {
  //   const match = justRecords.find((j) => j.day === d);
  //   if (!match) return "";
  //   return timeFormat("%b")(match.date);
  // };

  const onTap = ({ detail }) => {
    if (detail === "right") slider.next();
    else slider.prev();
  };

  $: tease = $activeSlide === 0;
  // $: showRecent = $activeSlide < 5;
  // $: showAll = $activeSlide > 4;
  // $: filterTemps = (d) => (showAll ? d.rank === 0 : d.recentDay);
  // $: duration = $activeSlide < 5 ? 0 : 2000;

  // $: formatTick = $activeSlide > 4 ? formatMonth : formatDay;
  // $: {
  //   // update domains
  //   if ($activeSlide <= 1) {
  //     targetExtentDay = extentDayRecent;
  //   } else if ($activeSlide <= 3) {
  //   } else if ($activeSlide <= 6) {
  //   } else if ($activeSlide <= 8) {
  //   }
  // }
  // $: {
  //   // update highlights
  //   let p = [];
  //   let s = [];

  //   if ($activeSlide > 3) {
  //     data.forEach((d, i) => {
  //       if (d.rank === 0) p.push(i);
  //     });
  //   }

  //   if ($activeSlide === 3) s.push(data.findIndex((d) => d.rank !== undefined));

  //   data.forEach((d, i) => {
  //     d.fill = p.includes(i)
  //       ? color[primary]
  //       : s.includes(i)
  //       ? color[secondary]
  //       : undefined;
  //   });

  //   data = [...data];
  // }
</script>

<p>slide: {$activeSlide}</p>
<figure class:tease bind:clientWidth={width}>
  <FigureRecent
    {rawData}
    {fill}
    {primary}
    {secondary}
    {tertiary}
    {pad}
    {padding}
    {width}
  />
  <!-- <FigureAnnual /> -->
</figure>

<article>
  <Slider bind:this={slider} bind:active={$activeSlide} duration="0">
    <IntroSlide {...copy.intro} active={$activeSlide === 0} />

    {#each copy.slides as { slide, text, subtext, color }}
      {@const active = $activeSlide === +slide}
      <ArticleSlide {active} {text} {subtext} {color} />
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
    top: 0;
    transform: translate3d(-50%, 0, 0);
  }

  figure {
    max-width: 80rem;
    height: 70%;
    top: 15%;
    overflow: hidden;
    transition: transform 1s ease-in-out, filter 0.5s 1s;
  }

  figure.tease {
    filter: blur(4px);
    transform: translate3d(-50%, 50%, 0);
  }

  article {
    max-width: 60rem;
  }
</style>
