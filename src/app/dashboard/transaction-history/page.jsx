"use client";
import moment from "moment";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";

export default function Page() {
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

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
          setData(data);
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

  return (
    <>
      <div className="border rounded-[16px]">
        <DataTable
          columns={columns}
          data={data}
          customStyles={tableCustomStyles}
          fixedHeader
          title="Transaction History"
          highlightOnHover
          pointerOnHover
          pagination={true}
          paginationTotalRows={data.length}
          progressPending={loading}
        />
      </div>
    </>
  );
}
