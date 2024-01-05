"use client";
import {
  contractAddress,
  etherscanContractAddress,
} from "@/src/constants/global-constants";
import Web3 from "web3";
import contractABI from "../../../../../build/contracts/Vote.json";
import { toast } from "react-toastify";
import { IComment } from "@/src/types/comment";

let web3 = typeof window !== "undefined" && new Web3(window.ethereum);
// @ts-ignore
let contract =
  web3 &&
  (new web3.eth.Contract(
    contractABI.abi,
    process.env.NODE_ENV === "development"
      ? contractAddress
      : etherscanContractAddress
  ) as any);

export const connectToLocalNetwork = () => {
  process.env.NODE_ENV === "development" &&
    contract.setProvider("http://127.0.0.1:8545");
};

export const getTimeLeftForVoting = async () => {
  try {
    const res = await contract.methods.timeLeftForVoting().call();
    const result = Number(res) * 1000;
    return result;
  } catch (error) {
    toast.error(
      `Error on getting time left for voting: ${(error as Error).message}`
    );
    return 0;
  }
};

export const getVotes = async (): Promise<number[]> => {
  try {
    const result = await contract.methods.getVotes().call();
    return result as number[];
  } catch (error) {
    toast.error(`Error on getting votes: ${(error as Error).message}`);
    return [0, 0];
  }
};

export const getAllComments = async (): Promise<IComment[] | []> => {
  try {
    const result = await contract.methods.getAllComments().call();

    return result as IComment[];
  } catch (error) {
    toast.error(`Error on getting votes: ${(error as Error).message}`);
    return [];
  }
};

export const submitVote = async (
  isForNextJs: boolean,
  walletAddress: string
) => {
  try {
    // @ts-ignore
    await contract.methods.vote(isForNextJs).send({ from: walletAddress });
    getVotes();
  } catch (error) {
    toast.error(`User rejected request: ${(error as Error).message}`);
  }
};

export const createComment = async (comment: string, walletAddress: string) => {
  try {
    const estimatedGas = await contract.methods
      // @ts-ignore
      .createComment(comment)
      .estimateGas({ from: walletAddress });

    await contract.methods
      // @ts-ignore
      .createComment(comment)
      .send({ from: walletAddress, gas: Number(estimatedGas).toString() });
    getAllComments();
  } catch (error) {
    console.log(error);

    toast.error(`Commenting request error: ${(error as Error).message}`);
  }
};
