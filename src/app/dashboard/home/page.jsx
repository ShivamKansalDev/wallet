"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ethers } from "ethers";

import contractABI from "../../../resources/contractABI.json";
import tokenABI from "../../../resources/tokenABI.json";
import { Card, CardContent, CircularProgress, LinearProgress, Typography } from "@mui/material";
import { ownerActions } from "@/lib/features/slice/ownerSlice";

export const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
export const tokenContractAddress = process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS;

export default function Page2() {
  const dispatch = useDispatch();
  const { signer } = useSelector((state) => state.signer);
  const { isOwner } = useSelector((state) => state.owner);

  const [contractTokenBalance, setContractTokenBalance] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokensSold, setTokensSold] = useState("");
  const [raisedAmount, setRaisedAmount] = useState("");
  const [tokenPriceInUSD, setTokenPriceInUSD] = useState("");

  useEffect(() => {
    console.log("^^^ SIGNER: ", signer)
    fetchTokenPriceInUSD();
  }, [signer]);

  useEffect(() => {
    if (signer) {
      fetchContractTokenBalance();
      checkOwner();
    }
  }, [signer]);

  useEffect(() => {
    if (tokenPriceInUSD && tokensSold) {
      calculateRaisedAmount();
    }
  }, [tokenPriceInUSD, tokensSold]);

  const fetchTokenPriceInUSD = async () => {
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    try {
      const priceInUSD = await contract.tokenPriceInUSD();
      setTokenPriceInUSD(priceInUSD.toString());
    } catch (err) {
      console.error("Error fetching token price in USD:", err);
    }
  };

  const fetchContractTokenBalance = async () => {
    // console.log("@@@ ENV: ", contractAddress, tokenContractAddress)
    const tokenContract = new ethers.Contract(
      tokenContractAddress,
      tokenABI,
      signer
    );
    try {
      const balance = await tokenContract.balanceOf(contractAddress);
      setContractTokenBalance(ethers.utils.formatUnits(balance, "ether"));
    } catch (err) {
      console.error("Error fetching contract's token balance:", err);
    }
  };

  const checkOwner = async () => {
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    try {
      const ownerAddress = await contract.owner();
      const userAddress = await signer.getAddress();
      const isValid = ownerAddress.toLowerCase() === userAddress.toLowerCase()
      console.log("@@@ ISVALID: ", ownerAddress.toLowerCase(), " === ", userAddress.toLowerCase(), " = ", isValid)
      dispatch(ownerActions.setIsOwner(isValid));
      fetchTokensSold(contract);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTokensSold = async (contract) => {
    try {
      const tokens = await contract.getTokensSold();
      setTokensSold(tokens.toString());
    } catch (err) {
      console.error("Error fetching tokens sold:", err);
    }
  };

  const calculateRaisedAmount = () => {
    const tokensSoldInMainUnit = ethers.utils.formatUnits(tokensSold, 18);
    const pricePerTokenInUSD = parseFloat(tokenPriceInUSD) / 100;
    const raisedAmountUSD =
      parseFloat(tokensSoldInMainUnit) * pricePerTokenInUSD;
    setRaisedAmount(raisedAmountUSD.toFixed(2));
  };

  return (
    <>
      <section className="text-gray-700 body-font bg-white rounded-[16px] h-screen ">
        <div className="container mx-auto mt-5 ">
          <div className=" flex flex-wrap -m-4 text-center justify-center">
            <div className="flex-wrap flex gap-10 mt-20">
              <Card
                style={{
                  background: "#e0f7fa",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                }}
              >
                <CardContent>
                  <Typography variant="h6" style={{ color: "#00796b" }}>
                    Tokens Left for Sale
                  </Typography>
                  <Typography variant="body1">
                    {contractTokenBalance ? (
                      parseFloat(contractTokenBalance).toFixed(0)
                    ) : (
                      <CircularProgress size={20} />
                    )}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={
                      (contractTokenBalance /
                        (parseFloat(contractTokenBalance) +
                          parseFloat(tokensSold))) *
                      100
                    }
                  />
                </CardContent>
              </Card>
              <Card
                style={{
                  background: "#e0f7fa",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                }}
              >
                <CardContent>
                  <Typography variant="h6" style={{ color: "#00796b" }}>
                    Tokens Sold
                  </Typography>
                  <Typography variant="body1">
                    {tokensSold ? (
                      `${parseFloat(
                        ethers.utils.formatUnits(
                          ethers.BigNumber.from(tokensSold),
                          18
                        )
                      ).toFixed(0)}`
                    ) : (
                      <CircularProgress size={20} />
                    )}
                  </Typography>
                </CardContent>
              </Card>
              <Card
                style={{
                  background: "#e0f7fa",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                }}
              >
                <CardContent>
                  <Typography variant="h6" style={{ color: "#00796b" }}>
                    Raised Amount (USD)
                  </Typography>
                  <Typography variant="body1">{
                    (raisedAmount)? (
                      `$${raisedAmount}`
                    )
                    :
                    (
                      <CircularProgress size={20} />
                    )
                  }</Typography>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
