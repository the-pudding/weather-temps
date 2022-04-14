<script>
  import { max, extent } from "d3";
  import { LayerCake, Canvas, Svg } from "layercake";
  import { tweened } from "svelte/motion";
  import { cubicInOut } from "svelte/easing";
  import WIP from "$components/helpers/WIP.svelte";
  import Slider from "$components/helpers/Slider.svelte";
  import Slide from "$components/helpers/Slider.Slide.svelte";
  import Tap from "$components/helpers/Tap.svelte";
  import Scatter from "$components/charts/Scatter.canvas.svelte";
  // import Scatter from "$components/charts/Scatter.svg.svelte";
  import bosData from "$data/bos.js";

  const { records, recent } = bosData;

  const position = "absolute";
  const x = "day";
  const y = "temp";
  const z = "rank";
  const fill = "rgba(255,255,255,0.25)";
  const highlight = "#6f9";
  const padding = 20;
  const xPadding = [padding, padding];
  const tempMax = max(records, (d) => d.temp);
  const dayRecentExtent = extent(recent, (d) => d.day);
  const dayRecordsExtent = extent(records, (d) => d.day);
  const xExtent = tweened(dayRecentExtent);
  const yDomain = [0, tempMax];
  let data = recent;

  let slider = undefined;
  let activeSlide = 0;

  const onTap = ({ detail }) => {
    const easing = cubicInOut;
    let target;
    let duration;

    if (detail === "right") {
      slider.next();
      target = dayRecordsExtent;
      duration = 2000;
    } else {
      slider.prev();
      target = dayRecentExtent;
      duration = 0;
    }
    xExtent.set(target, { duration, easing });
  };

  $: xDomain = $xExtent;
  // $: console.table(data);
</script>

<!-- <WIP /> -->

<figure>
  <LayerCake {xDomain} {xPadding} {data} {position} {x} {y} {z} {yDomain}>
    <!-- <Svg>
      <Scatter {fill} {highlight} />
    </Svg> -->
    <Canvas>
      <Scatter {fill} {highlight} />
    </Canvas>
  </LayerCake>
</figure>

<article>
  <Slider bind:this={slider} bind:active={activeSlide}>
    <Slide><p>Tk text slide 1.</p></Slide>
    <Slide><p>Tk text slide 2.</p></Slide>
  </Slider>
</article>
<Tap debug={false} full={true} size="50%" on:tap={onTap} />

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
</style>
