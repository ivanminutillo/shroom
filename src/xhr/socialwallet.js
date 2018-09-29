import { resolve } from "path";

const url = "http://fairchains.xicnet.com:3197/wallet/v1/"
export const getTxs = "transactions/list"
export const newTx = "transactions/new"
export const getTx = "transactions/get"
export const balance = "balance"

let request = (body, endpoint) => new Request(url + endpoint, {
  method: "POST",
  headers: new Headers({
    "Content-Type": "application/json",
    "Accept": "application/json"
  }),
  body: JSON.stringify(body)
});


export default (body, endpoint) => fetch(request(body, endpoint))