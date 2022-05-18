<script>
  import { onMount } from "svelte";
  import Slide from "$components/helpers/Slider.Slide.svelte";

  export let active;

  const v = Date.now();
  const url = `https://pudding.cool/assets/data/stories.json?v=${v}`;

  let localURL;
  let stories = [];

  onMount(async () => {
    localURL = window.location.href;
    const response = await fetch(url);
    const data = await response.json();
    stories = data.filter((d) => !localURL.includes(d.url)).slice(0, 4);
  });
</script>

<section class:active class="outro">
  <Slide>
    <div class="stories">
      <p class="subtext">Check out some other stories from The Pudding:</p>
      {#each stories as { hed, url, image }}
        <div class="story">
          <a href="https://pudding.cool/{url}">
            <img
              src="https://pudding.cool/common/assets/thumbnails/640/{image}.jpg"
              alt="thumbnail"
            />
            <span>{hed}</span>
          </a>
        </div>
      {/each}
    </div>
  </Slide>
</section>

<style>
  section {
    opacity: 0;
  }

  .subtext {
    text-align: center;
  }

  section.active {
    opacity: 1;
  }

  :global(.outro a) {
    cursor: pointer;
    pointer-events: all;
  }

  a {
    line-height: 1.4;
    text-align: center;
    margin: 0 auto;
  }

  .story a {
    display: flex;
    text-align: left;
    justify-content: flex-start;
    margin-bottom: 2rem;
  }

  .story a span {
    align-self: center;
  }

  .story img {
    width: 10rem;
    margin-right: 1rem;
  }

  @media only screen and (max-width: 640px) {
    .story img {
      display: none;
    }

    .story a span {
      align-self: center;
      text-align: center;
    }

    .story a {
      display: flex;
      justify-content: center;
    }

    .subtext {
      font-size: 18px;
    }
  }

  @media only screen and (max-width: 475px) {
    .text {
      font-size: 28px;
      line-height: 1.4;
    }
  }

  @media only screen and (max-width: 424px) {
    .text {
      font-size: 26px;
    }
  }

  @media only screen and (max-width: 374px) {
    .text {
      font-size: 24px;
    }
  }
</style>
