<script>
  import Slide from "$components/helpers/Slider.Slide.svelte";

  export let active;
  export let text;
  export let subtext;
  export let color;

  $: c = color ? `color-${color}` : "";
</script>

<section class={c} class:active>
  <Slide>
    <div class="above">
      <p class="text">
        {@html text}
      </p>
    </div>
    <div class="below">
      {#if subtext}
        <p class="subtext">
          {@html subtext}
        </p>
      {/if}
    </div>
  </Slide>
</section>

<style>
  section {
    opacity: 0;
  }

  section.active {
    opacity: 1;
  }

  .above,
  .below {
    position: absolute;
    left: 50%;
    width: 100%;
    max-width: 65rem;
    height: 15%;
    transform: translate(-50%, 0);
    opacity: 0;
  }

  .above p,
  .below p {
    margin: 0 auto;
    padding: 2rem 1rem;
  }

  .above {
    top: 0;
    transition: opacity 1s 0.25s ease-in-out;
  }

  .below {
    top: 85%;
    transition: opacity 1s 1.5s ease-in-out;
  }

  .text {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .active .above,
  .active .below {
    opacity: 1;
  }
</style>
