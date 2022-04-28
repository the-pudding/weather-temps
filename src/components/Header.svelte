<script>
  import wordmark from "$svg/wordmark.svg";
</script>

<header>
  <div class="wordmark">
    <a href="https://pudding.cool" aria-label="The Pudding">{@html wordmark}</a>
  </div>
</header>

<style>
  .wordmark {
    padding: 1rem 1.5rem;
    text-align: right;
    position: absolute;
    top: 0;
    right: 0;
    z-index: var(--z-top);
  }

  .wordmark a {
    display: inline-block;
    max-width: 10rem;
    width: 100%;
    border: none;
    color: var(--color-fg);
  }

  .wordmark a:hover {
    background-color: transparent;
  }

  :global(.wordmark svg path) {
    fill: currentColor;
  }
</style>
