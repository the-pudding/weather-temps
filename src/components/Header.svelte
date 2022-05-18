<script>
  import wordmark from "$svg/wordmark.svg";
</script>

<header>
  <div class="wordmark">
    <a href="https://pudding.cool" aria-label="The Pudding">{@html wordmark}</a>
  </div>
</header>

<style>
  header {
    position: fixed;
    top: 0;
    right: 2rem;
    z-index: var(--z-overlay);
    width: 100%;
    padding: 1rem 0;
    pointer-events: none;
  }

  .wordmark {
    width: 100%;
    text-align: right;
  }

  .wordmark a {
    display: inline-block;
    max-width: 8rem;
    width: 100%;
    border: none;
    color: var(--color-fg);
    pointer-events: auto;
  }

  .wordmark a:hover {
    background-color: transparent;
  }

  :global(.wordmark svg) {
    display: block;
    width: 100%;
  }

  :global(.wordmark svg path) {
    fill: currentColor;
  }

  @media only screen and (min-width: 640px) {
    .wordmark a {
      max-width: 10rem;
    }
  }
</style>
