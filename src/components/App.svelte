<script>
  import { max } from "d3";
  import { setContext } from "svelte";
  import { fade } from "svelte/transition";
  import Slider from "$components/helpers/Slider.svelte";
  import Tap from "$components/helpers/Tap.svelte";
  import FigureRecent from "$components/Figure.Recent.svelte";
  import FigureAnnual from "$components/Figure.Annual.svelte";
  import IntroSlide from "$components/IntroSlide.svelte";
  import ArticleSlide from "$components/ArticleSlide.svelte";
  import rawData from "$data/bos.js";
  import copy from "$data/doc.json";
  import { color } from "$data/variables.json";
  import { activeSlide } from "$stores/misc.js";

  const position = "absolute";
  const pad = 16;
  const padding = { top: pad, right: pad, bottom: pad * 3, left: pad };
  const yDomain = [0, max(rawData, (d) => d.temp) + 1];
  const highlightDelay = 3000;

  let slider = undefined;
  let width = 0;

  setContext("App", {
    rawData,
    position,
    pad,
    padding,
    yDomain,
    color: {
      primary: color.green,
      secondary: color.blue,
      tertiary: color.pink,
      default: color.transparent,
      primaryT: color["green-transparent"],
      secondaryT: color["blue-transparent"],
      tertiaryT: color["pink-transparent"]
    }
  });

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
</script>

<p>slide: {$activeSlide}</p>
<figure class:tease bind:clientWidth={width}>
  {#if $activeSlide < 4}
    <div out:fade={{ duration: 100 }}>
      <FigureRecent {width} />
    </div>
  {/if}
  {#if $activeSlide >= 3}
    <div in:fade={{ delay: highlightDelay }}>
      <FigureAnnual {width} />
    </div>
  {/if}
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
    /* max-width: 80rem; */
    width: 1000px;
    height: 70%;
    top: 15%;
    overflow: hidden;
    transition: transform 1s ease-in-out, filter 0.5s 1s;
    /* outline: 2px dashed red; */
  }

  figure.tease {
    filter: blur(4px);
    transform: translate3d(-50%, 50%, 0);
  }

  figure div {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  article {
    max-width: 60rem;
  }
</style>
