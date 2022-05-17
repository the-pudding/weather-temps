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
  }

  section.active {
    opacity: 1;
  }

  div {
    position: absolute;
    left: 50%;
    width: 100%;
    max-width: 65rem;
    top: calc(60%);
    height: calc(40%);
    transform: translate(-50%, 0);
    opacity: 0;
    transition: opacity 1s 0.25s ease-in-out;
  }

  p {
    margin: 0 auto;
    padding: 1rem 0;
    padding-bottom: 0.5rem;
  }

  .active div {
    opacity: 1;
  }

  @media only screen and (min-width: 640px) {
    div {
      height: calc(30%);
      top: calc(70%);
    }
  }
</style>
