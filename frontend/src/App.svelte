<script lang="typescript">
  import { onDestroy } from 'svelte';
  import Connect, { marinaStore, MarinaStore } from 'svelte-marina-button';
  import type { MarinaProvider } from 'marina-provider';
  import Field from './components/Field.svelte';
  import assets from './util/assets';
  import { requestAsset } from './util/api';
  import type { FaucetResponse } from './util/api';
  import loader from './util/loader';

  enum ButtonMessage {
    INSTALL = "Marina is not installed",
    ENABLE = "Connect with Marina wallet",
    WRONG_NETWORK = "Wrong network, switch to the Testnet",
    REQUEST = "Request",
  }

 
  let address: string;
  let asset: string;

  $: installed = false;
  $: enabled = false;
  $: network = undefined;

  let addressFetcherLoading = false;
  let faucetLoading = false;
  let faucetPromise: Promise<FaucetResponse>;


  function isTestnet() {
    return network === 'testnet'
  }

  function canRequestAddress() {
    return installed && enabled && isTestnet()
  } 

  function handleClick() {
    faucetPromise = loader(requestAsset({ to: address, asset }), (loading) => {
      faucetLoading = loading;
    });
  }

  const unsubscribe = marinaStore.subscribe(async (s: MarinaStore) => {
    installed = s.installed;
    enabled = s.enabled;
    network = s.network;

    if (addressFetcherLoading || (address && address.length > 0)) return;

    if (canRequestAddress()) {
      addressFetcherLoading = true;
      const marina: MarinaProvider = window.marina;
      address = (await marina.getNextAddress()).confidentialAddress;
      addressFetcherLoading = false;
    }
  });

  $: buttonMessage = 
    !installed ? 
    ButtonMessage.INSTALL : 
    (!enabled ? 
      ButtonMessage.ENABLE : 
      ( !isTestnet() ? 
        ButtonMessage.WRONG_NETWORK : 
        ButtonMessage.REQUEST
      )
    ); 

  onDestroy(() => {
    unsubscribe();
  });
</script>

<section class="hero has-background-black-bis is-fullheight">
  <div class="hero-head">
    <div class="container is-max-desktop has-text-right mt-3 mr-3">
      <Connect />
    </div>
  </div>

    <div class="hero-body">
      <div class="container is-max-desktop has-text-centered">
        <div class="mb-6">
          <h1 class="title has-text-white">🚰 Faucet</h1>
          <p class="subtitle is-6">Liquid Network Testnet</p>
        </div>

        {#if buttonMessage === ButtonMessage.REQUEST}
          <div class="field is-grouped is-grouped-centered">
            <Field labelFor="asset" label="Asset">
              <div class="select is-primary">
                <select id="asset" bind:value={asset}>
                  {#each assets as { name, id }}
                    <option value={id}>{name}</option>
                  {/each}
                </select>
              </div>
            </Field>  

            <Field labelFor="address" label="Marina address">
              <input
                disabled
                id="address"
                type="text"
                bind:value={address}
                placeholder="Liquid testnet address"
                class="input is-primary"
              />
            </Field>
          </div>
          
          <button
            on:click={handleClick}
            class:is-loading={faucetLoading}
            disabled={address === ''}
            class="button is-primary"
          >
            {buttonMessage}
          </button>

          {#if (address && address.length > 0)}
          <div class="mt-3">
            <a href={"http://twitter.com/intent/tweet?text=Requesting%20%40Liquid_BTC%20testnet%20funds%20to%20my%20%40MarinaWallet%20address%20%0A"+address} target="_blank" rel="noreferrer">
              <p class="has-text-white is-link">
                Do you need huge amount? 🐥 Tweet at @vulpemventures
              </p>
            </a>
          </div>
         
          {/if}

          {#if faucetPromise}
            {#await faucetPromise then { txid }}
              <div class="mt-2">
                <p class="has-text-white">
                  Transaction ID:
                  <a
                    href="https://blockstream.info/liquidtestnet/tx/{txid}"
                    target="_blank"
                    rel="noreferrer"
                    class="is-family-code"
                  >
                    {txid}
                  </a>
                </p>
              </div>
            {:catch error}
              <p class="has-text-danger mt-2">
                {error?.message ?? 'Unknown Error'}
              </p>
            {/await}
          {/if}
        {:else}
          <p class="has-text-white">
            {buttonMessage}
          </p>
        {/if}
        
      </div>
    </div>


  <div class="hero-foot">
    <div class="container is-max-desktop">
      <div class="columns is-mobile is-half is-offset-one-third">
        <div class="column has-text-centered">
          <p class="has-text-white">Made with ❤️ at Vulpem Ventures</p>
        </div>
      </div>
    </div>
  </div>
</section>

<style src="./scss/main.scss" lang="scss" global></style>