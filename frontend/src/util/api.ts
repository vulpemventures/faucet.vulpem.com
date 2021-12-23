export type FaucetRequest = {
  to: string;
  asset: string;
};

export type FaucetResponse = { txid: string };



export async function requestAsset(
  req: FaucetRequest
): Promise<FaucetResponse> {
  const res = await fetch('https://b9vpauuk04.execute-api.eu-west-1.amazonaws.com/prod/liquid-faucet-testnet-resource', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(req),
  });
  const result = await res.json();
  if (!res.ok) {
    throw new Error(result.message);
  }
  return result;
}
