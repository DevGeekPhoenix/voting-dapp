"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import NuxtJsImage from "../public/asset/img/nuxtJs.png";
import NextJsImage from "../public/asset/img/nextJs.png";
import UserImage from "../public/asset/img/user.png";
import { IComment } from "@/src/types/comment";
import { connectWallet } from "@/src/utils/methods/connectWallet";
import useCountdown from "@/src/utils/hooks/useCountdown";
import {
  connectToLocalNetwork,
  createComment,
  getAllComments,
  getTimeLeftForVoting,
  getVotes,
  submitVote,
} from "@/src/utils/methods/contract-methods/vote-methods";
import MetaMaskSVG from "@/public/asset/svg/MetaMaskSVG";
import { shortAddress } from "@/src/utils/methods/shortAddress";

export default function Home() {
  /**
   * External Hooks
   * ______________________________________________________________________________
   */

  const [countDownTimer, { start: startCountdown, render: renderCountdown }] =
    useCountdown(0, 1000, "hours");

  /**
   * States and Effects
   * _______________________________________________________________________________
   */

  const [wallet, setWallet] = useState<{
    address?: string;
    balance?: string;
  }>({
    address: undefined,
    balance: undefined,
  });

  const [votes, setVotes] = useState<number[]>([]);
  const [commentValue, setCommentValue] = useState<string>("");
  const [allComments, setAllComments] = useState<IComment[]>([]);

  useEffect(() => {
    const MetaMaskAnimation =
      !wallet.address && import("../public/asset/MetaMaskAnimation" as any);
  }, [wallet]);

  useEffect(() => {
    connectToLocalNetwork();
    getTimeLeftForVoting().then((time) => startCountdown(time));
    getVotes().then((votes) => setVotes(votes));
    getAllComments().then((comments) => setAllComments(comments));
  }, []);

  /**
   * Methods
   * _______________________________________________________________________________
   */

  const handleConnectWallet = async () => {
    const connectedWallet = await connectWallet();

    setWallet({
      address: connectedWallet?.address,
      balance: connectedWallet?.balance as string,
    });
  };

  const handleCreateComment = async () => {
    await createComment(commentValue, wallet.address as string);
    setCommentValue("");
    getAllComments().then((comments) => setAllComments(comments));
  };

  const handleSubmitVote = async (isForNextJs: boolean) => {
    await submitVote(isForNextJs, wallet.address as string);
    getVotes().then((votes) => setVotes(votes));
  };

  /**
   * Template
   * _______________________________________________________________________________
   */

  return (
    <>
      <main className="flex min-h-screen w-full flex-col items-center justify-center px-8 py-24 lg:p-24 bg-gradient-to-tr from-gray-900 to-orange-900">
        {!wallet.address ? (
          <div className="flex flex-col items-center justify-center p-24">
            <div className="h-[250px] w-[250px]" id="logo-container"></div>
            <button
              className="bg-orange-700 hover:bg-orange-600 py-2 px-2 rounded-md text-"
              onClick={() => handleConnectWallet()}
            >
              Connect your MetaMask wallet
            </button>
          </div>
        ) : (
          <>
            <div className="absolute w-full py-4 text-center font-medium top-0 bg-gradient-to-tr from-gray-900 to-orange-900">
              <p>
                {renderCountdown("").length === 0
                  ? "Voting time is over !!!"
                  : `Time Left For Voting! ${renderCountdown("")}`}
              </p>
            </div>
            <div className="w-full h-full flex flex-col items-center justify-evenly gap-6 relative lg:flex-row">
              <div className="flex flex-col items-center justify-center gap-6 w-full  lg:w-1/2">
                <MetaMaskSVG />
                <div>
                  <p>Wallet: {shortAddress(wallet.address || "")}</p>
                  <p>Balance: {wallet.balance || "0"} ETH</p>
                </div>
                <div className="flex flex-row items-center justify-center gap-6">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <Image
                      src={NextJsImage}
                      alt={"NextJs"}
                      width={100}
                      height={100}
                      className="bg-gradient-to-bl from-gray-100 to-gray-800 rounded-lg object-cover p-2"
                    />
                    <button
                      className="bg-gradient-to-l from-orange-700 to-orange-700 hover:bg-gradient-to-l hover:from-orange-700 hover:to-orange-900 py-2 px-2 rounded-md"
                      onClick={() => handleSubmitVote(true)}
                    >
                      Vote for NextJs
                    </button>
                    <div className="flex gap-1">
                      <p>Votes:</p>
                      <h3>{Number(votes[0]) ?? "-"}</h3>
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-3">
                    <Image
                      src={NuxtJsImage}
                      alt={"NuxtJs"}
                      className="bg-gradient-to-bl from-green-600 to-slate-800 rounded-lg object-contain w-[100px] h-[100px] p-2"
                    />
                    <button
                      className="bg-gradient-to-l from-orange-700 to-orange-700 hover:bg-gradient-to-l hover:from-orange-700 hover:to-orange-900 py-2 px-2 rounded-md"
                      onClick={() => handleSubmitVote(false)}
                    >
                      Vote for NuxtJs
                    </button>
                    <div className="flex gap-1">
                      <p>Votes:</p>
                      <h3>{Number(votes[1]) ?? "-"}</h3>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-rows-2 h-[534px] w-full lg:w-1/2 gap-2">
                <div className="flex flex-col gap-2 overflow-y-auto h-[440px]">
                  {allComments.map((comment) => (
                    <div
                      className={`flex flex-col md:flex-row flex-nowrap gap-4 md:gap-0 justify-between items-start md:items-center rounded-lg bg-gradient-to-r from-orange-900 to-gray-800 py-1.5 px-3 ${
                        comment.author === wallet.address
                          ? "border-[1px] border-orange-500"
                          : ""
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Image
                          src={UserImage}
                          alt={"User"}
                          className="bg-gradient-to-tr from-gray-500 to-orange-500 rounded-full object-contain w-[50px] h-[50px] p-1"
                        />
                        <div className="flex flex-col gap-1">
                          <p className="text-sm">
                            {shortAddress(comment.author)}
                          </p>
                          <p className="text-xs text-gray-300">
                            Voted for{" "}
                            {comment.isForNextJs ? "Next Js" : "Nuxt Js"}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1  md:max-w-[calc(100%-164px)]">
                        <p className="font-bold md:text-end ">
                          {comment.content}
                        </p>
                        <p className="text-xs md:text-end text-gray-300">
                          {new Date(
                            Number(comment.timestamp) * 1000
                          ).toDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="w-full h-[initial] flex flex-nowrap place-self-end">
                  <textarea
                    value={commentValue}
                    onChange={(e) => setCommentValue(e.target.value)}
                    maxLength={100}
                    placeholder="Left Your Comment Here"
                    className="h-[80px] px-2 resize-none outline-none focus:border-2 text-sm border-orange-700 w-full text-slate-700 rounded-bl-md rounded-tl-md"
                  />
                  <button
                    className="bg-gradient-to-l from-orange-700 to-orange-700 hover:bg-gradient-to-l hover:from-orange-700 hover:to-orange-900 px-2 rounded-ee-md rounded-tr-md"
                    onClick={() => handleCreateComment()}
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </>
  );
}
