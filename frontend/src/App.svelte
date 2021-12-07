<script>
  import Connect from 'svelte-marina-button';
</script>

<section class="hero has-background-black-bis is-fullheight">
  <!-- Hero head: will stick at the top -->
  <div class="hero-head">
    <div class="container is-max-desktop has-text-right mt-3 mr-3">
      <Connect />
    </div>
  </div>

  <div class="hero-body">
    <div class="container is-max-desktop">
      <div class="columns">
        <div class="column is-half is-offset-one-quarter" />
      </div>
    </div>
  </div>

  <div class="hero-foot">
    <div class="container is-max-desktop">
      <div class="columns is-mobile is-half is-offset-one-third">
        <div class="column has-text-centered">
          Made with ❤️ at Vulpem Ventures
        </div>
      </div>
    </div>
  </div>
</section>

<style src="./scss/main.scss" lang="scss" global></style>
