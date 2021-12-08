<script lang="typescript">
  import { onMount } from 'svelte';
  import Connect from 'svelte-marina-button';
  import {
    AddressInterface,
    detectProvider,
    MarinaProvider,
  } from 'marina-provider';

  let marina: MarinaProvider | undefined;
  let address: AddressInterface | undefined;

  onMount(async () => {
    const promise = detectProvider('marina');
    marina = await promise;
    address = await marina.getNextAddress();
    console.log(address);
  });
</script>

<section class="hero has-background-black-bis is-fullheight">
  {#if marina}
    <div class="hero-head">
      <div class="container is-max-desktop has-text-right mt-3 mr-3">
        <Connect />
      </div>
    </div>
  {:else}
    <!-- <p>Detecting provider...</p> -->
    <p style="color: red">Please install the Marina browser extension</p>
     -->
  {/if}

  <!-- Hero head: will stick at the top -->

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
