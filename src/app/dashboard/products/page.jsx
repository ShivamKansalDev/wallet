"use client";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";

export default function Page() {
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setData(rows);
    }, 500);
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      setLoading(false);
    }
  }, [data]);

  const rows = [
    {
      products: "Smartphone X Pro",
      status: "active",
      price: "$999.00",
      totalSales: "150",
      createdAt: "23/06/2024",
    },
    {
      products: "Wireless Earbuds Ultra",
      status: "active",
      price: "$799.00",
      totalSales: "250",
      createdAt: "22/09/2024",
    },
    {
      products: "Smart Home Hub",
      status: "active",
      price: "$149.00",
      totalSales: "180",
      createdAt: "21/08/2024",
    },
  ];
  let columns = [
    {
      name: "Products",
      selector: (row) => row.products,
    },
    {
      name: "Status",
      selector: (row) => (
        <div>
          <button className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground capitalize">
            {row.status}
          </button>
        </div>
      ),
    },
    {
      name: "Price",
      selector: (row) => row.price,
    },
    {
      name: "Total Sales",
      selector: (row) => row.totalSales,
    },
    {
      name: "Created at",
      selector: (row) => row.createdAt,
    },
    {
      name: "",
      selector: (row) => <div>-</div>,
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
      {/* <DataTable
        tableColumns={invoiceTableColumns}
        inputProps={{
          title: "Products",
          columns: columns,
          data: rows,
          progressPending: loading,
          fixedHeader: true,
          pagination: true,
          customStyles: customStyles,
          highlightOnHover: true,
          pointerOnHover: true,
        }}
      /> */}
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
    </>
  );
}