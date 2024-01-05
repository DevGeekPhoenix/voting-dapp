import { contractOwnerAddress } from "@/src/constants/global-constants";
import { toast } from "react-toastify";
import Web3 from "web3";

declare global {
  interface Window {
    ethereum: any;
  }
}

export const connectWallet = async () => {
  if (process.env.NODE_ENV === "development") {
    const web3 = new Web3("http://127.0.0.1:8545");
    const balance = await web3.eth.getBalance(contractOwnerAddress);

    return {
      address: contractOwnerAddress,
      balance: web3.utils.fromWei(balance, "ether"),
    };
  } else {
    if (window !== undefined && window.ethereum) {
      const web3 = new Web3(window.ethereum);

      const accounts = await window.ethereum
        .request({ method: "eth_requestAccounts" })
        .catch((err: any) => {
          if (err.code === 4001) {
            toast.warning("Please connect to MetaMask.");
          } else {
            toast.error(err);
          }
        });

      if (Array.isArray(accounts) && accounts[0]) {
        toast.success("MetaMask connected successfully");
        const balance = await web3.eth.getBalance(accounts[0]);
        return {
          address: accounts[0],
          balance: web3.utils.fromWei(balance, "ether"),
        };
      }
    } else {
      toast.error("No web3 provider detected");
    }
  }
};
