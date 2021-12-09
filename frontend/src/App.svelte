<script lang="typescript">
  import { onMount } from 'svelte';
  import Connect from 'svelte-marina-button';
  import {
    AddressInterface,
    detectProvider,
    MarinaProvider,
  } from 'marina-provider';
  import assets from './assets';

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

    <div class="hero-body">
      <div class="container is-max-desktop">
        <div class="select is-primary">
          <select>
            {#each assets as { name, id }}
              <option value={id}>{name}</option>
            {/each}
          </select>
        </div>
      </div>
    </div>
  {:else}
    <!-- <p>Detecting provider...</p> -->
    <p style="color: red">Please install the Marina browser extension</p>
  {/if}

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
