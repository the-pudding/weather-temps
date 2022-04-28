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
    <div>
      <p class="text">
        {@html text}
      </p>
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
    transition: opacity 1s 0.5s ease-in-out;
  }

  section.active {
    opacity: 1;
  }

  p {
    position: absolute;
    top: 2rem;
    left: 50%;
    width: 100%;
    padding: 1rem;
    max-width: 65rem;
    margin: 0 auto;
    transform: translate(-50%, 0);
  }

  p:last-of-type {
    top: 75%;
  }
</style>
