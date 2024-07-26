"use client";
import {
  createWeb3Modal,
  defaultConfig,
  useWeb3Modal,
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers5/react";
import { ethers } from "ethers";
import { redirect, usePathname } from "next/navigation";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled, { keyframes } from "styled-components";

import { signerActions } from "@/lib/features/slice/signerSlice";

const projectId = "faf641330f6b3ce2811bb5eb411267df";

// Set chains
const chains = [
  // {
  //   chainId: 56,
  //   name: "BNB Smart Chain Mainnet",
  //   currency: "BNB",
  //   explorerUrl: "https://bscscan.com",
  //   rpcUrl: "https://bsc-dataseed1.binance.org/",
  // },
  {
    chainId: 11155111,
    name: "Sepolia",
    currency: "ETH",
    explorerUrl: "https://sepolia.etherscan.io",
    rpcUrl: "https://sepolia.infura.io/v3/",
  },
];

const ethersConfig = defaultConfig({
  metadata: {
    name: "Web3Modal",
    description: "Web3Modal Laboratory",
    url: "https://web3modal.com",
    icons: ["https://avatars.githubusercontent.com/u/37784886"],
  },
  defaultChainId: 1,
  rpcUrl: "https://cloudflare-eth.com",
});

// Create modal
createWeb3Modal({
  ethersConfig,
  chains,
  projectId,
  enableAnalytics: true,
  themeMode: "dark",
});

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const Button = styled.button`
  background-color: #007bff;
  border: none;
  border-radius: 50px;
  padding: 10px 30px;
  color: white;
  font-size: 16px;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  &:hover {
    background-color: #0056b3;
    transform: translateY(-2px);
    box-shadow: 0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08);
  }
  &:active {
    background-color: #004085;
    transform: translateY(1px);
  }
  &:focus {
    outline: none;
  }
`;

const Icon = styled.img`
  height: 20px;
  margin-right: 10px;
  animation: ${rotate} 2s linear infinite;
  display: inline-block;
`;

const Address = styled.div`
  margin-top: 10px;
  color: #333;
  font-family: "Courier New", Courier, monospace;
`;

export function ConnectWallet({navigate = () => {}}) {
  const { signer } = useSelector((state) => state.signer);
  const { open } = useWeb3Modal();
  const { address, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const dispatch = useDispatch();
  const pathName = usePathname();
  // const router = useRouter();

  useEffect(() => {
    if (address && isConnected) {
      const provider = new ethers.providers.Web3Provider(walletProvider);
      const signer = provider.getSigner();
      dispatch(signerActions.setSigner(signer));
      if(pathName === "/"){
        // router.push("/dashboard/home");
        redirect("/dashboard/home");
      }
      // setSigner(signer);
    }else{
      console.log("@@@@@ HOME")
      navigate();
    }
  }, [address, isConnected, walletProvider]);

  const buttonContent = isConnected ? (
    <>
      Address:{" "}
      {address
        ? `${address.slice(0, 4)}...${address.slice(-4)}`
        : "Wallet Connected"}
    </>
  ) : (
    <>Connect Wallet</>
  );

  return (
    <div>
      <Button 
        onClick={() => open()}
        style={{backgroundColor:'#0841cf'}}
      >
          {buttonContent}
      </Button>
    </div>
  );
}
