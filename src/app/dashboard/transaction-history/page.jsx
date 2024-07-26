"use client";

import { Button, Box } from "@mui/material";
import { DownloadForOffline as DownloadIcon } from "@mui/icons-material";
import moment from "moment";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { ethers } from "ethers";
import { toast, ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import contractABI from "../../../resources/contractABI.json";
import "react-toastify/dist/ReactToastify.css";
import { contractAddress } from "../home/page";

export default function Page() {
  const { signer } = useSelector((state) => state.signer);
  const { isOwner } = useSelector((state) => state.owner);

  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    console.log("### MANAGE SIGNER: ", signer);
  }, [signer]);
  useEffect(() => {
    setLoading(true);
    fetch(
      "https://ap-south-1.aws.data.mongodb-api.com/app/application-0-alxio/endpoint/api/transactions"
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.length > 0) {
          setTransactions(data);
          setLoading(false);
        }
      });
  }, []);
  let columns = [
    {
      name: "Buyer",
      selector: (row) => row.buyer,
    },
    {
      name: "Currency",
      selector: (row) => row.currency,
    },
    {
      name: "Money Amount",
      selector: (row) => row.amount,
    },
    {
      name: "Tokens Bought",
      selector: (row) => parseInt(row.amountOfTokens),
    },
    {
      name: "Transaction Data",
      selector: (row) => moment(row.createdAt).format("MM/DD/YYYY"),
    },
  ];
  let tableCustomStyles = {
    headRow: {
      style: {
        border: "none",
      },
    },
    headCells: {
      style: {
        color: "#202124",
        fontSize: "14px",
      },
    },
    rows: {
      highlightOnHoverStyle: {
        backgroundColor: "rgb(230, 244, 244)",
        borderBottomColor: "#FFFFFF",
        borderRadius: "25px",
        outline: "1px solid #FFFFFF",
      },
    },
    pagination: {
      style: {
        border: "none",
      },
    },
  };

  const withdrawTokensHandler = async () => {
    if (!isOwner) {
      toast.error("You are not the owner.");
      return;
    }

    try {
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      const transaction = await contract.withdrawTokens();
      await transaction.wait();
      toast.success("Tokens withdrawn successfully.");
    } catch (err) {
      console.error("Error withdrawing tokens:", err);
      toast.error("Failed to withdraw tokens.");
    }
  };

  const exportToCsv = () => {
    const csvHeaders =
      "Buyer,Currency,Money Amount,Tokens Bought,Transaction Hash,Transaction Date\n";
    const csvRows = transactions.map((transaction) => {
      const buyer = transaction.buyer;
      const currency = transaction.currency || "N/A";
      const amount = transaction.amount || "N/A";
      const tokensBought = transaction.amountOfTokens || "N/A";
      const transactionHash = transaction.transactionHash || "N/A";
      const transactionDate = transaction.createdAt
        ? new Date(transaction.createdAt).toLocaleDateString()
        : "N/A";
      return [
        buyer,
        currency,
        amount,
        tokensBought,
        transactionHash,
        transactionDate,
      ].join(",");
    });
    const csvString = [csvHeaders, ...csvRows].join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "TransactionHistory.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  return (
    <>
      <ToastContainer />
      <div className="border rounded-[16px] relative">
        <div className="absolute z-10 top-[10px] right-[10px]">
          <Box display="flex" justifyContent="flex-end" mb={2}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<DownloadIcon />}
              onClick={exportToCsv}
              style={{ marginRight: "10px" }}
            >
              Export to CSV
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={withdrawTokensHandler}
              startIcon={<DownloadIcon />}
            >
              Withdraw Tokens
            </Button>
          </Box>
        </div>
        <DataTable
          columns={columns}
          data={transactions}
          customStyles={tableCustomStyles}
          fixedHeader
          title="Transaction History"
          highlightOnHover
          pointerOnHover
          pagination={true}
          paginationTotalRows={transactions.length}
          progressPending={loading}
        />
      </div>
    </>
  );
}
