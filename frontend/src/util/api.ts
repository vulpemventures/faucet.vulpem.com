export type FaucetRequest = {
  to: string;
  asset: string;
};

export type FaucetResponse = { txid: string };

const BACKEND_URL = "https://faucet-liquid.herokuapp.com"
//const BACKEND_URL = "http://localhost:8000"


export async function requestAsset(
  req: FaucetRequest
): Promise<FaucetResponse> {
  const res = await fetch(`${BACKEND_URL}/api/send`, {
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
