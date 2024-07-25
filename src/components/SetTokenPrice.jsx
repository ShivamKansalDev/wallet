import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import contractABI from "../resources/contractABI.json";
import tokenABI from "../resources/tokenABI.json";
import { toast, ToastContainer } from "react-toastify";
import Pagination from "@mui/material/Pagination";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Container,
  CircularProgress,
  Tooltip,
  LinearProgress,
  Avatar,
} from "@mui/material";
import {
  DownloadForOffline as DownloadIcon,
  Pause as PauseIcon,
  PlayArrow as PlayArrowIcon,
  Update as UpdateIcon,
  Event as EventIcon,
  Money as MoneyIcon,
} from "@mui/icons-material";
import "react-toastify/dist/ReactToastify.css";

const contractAddress = "0xE01d7F54EdD78439f4d453F84208e04c0a7B5Bfa";
const tokenContractAddress = "0x21A04489B7616eB08479ed3C688374316Da8c46f";

const SetTokenPrice = ({ signer }) => {
  const [price, setPrice] = useState("");
  const [endTime, setEndTime] = useState("");
  const [contractTokenBalance, setContractTokenBalance] = useState("");
  const [tokensSold, setTokensSold] = useState("");
  const [startTime, setStartTime] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const [tokenPriceInUSD, setTokenPriceInUSD] = useState("");
  const [raisedAmount, setRaisedAmount] = useState("");
  const [presalePhase, setPresalePhase] = useState("");
  const [newPhase, setNewPhase] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);

  const indexOfLastTransaction = currentPage * itemsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - itemsPerPage;
  const currentTransactions = transactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  useEffect(() => {
    if (signer) {
      fetchContractTokenBalance();
      // checkOwner();
    }
  }, [signer]);

  useEffect(() => {
    fetchTokenPriceInUSD();
  }, [signer]);

  useEffect(() => {
    if (tokenPriceInUSD && tokensSold) {
      calculateRaisedAmount();
    }
  }, [tokenPriceInUSD, tokensSold]);

  useEffect(() => {
    if (signer) {
      fetchPresalePhase();
    }
  }, [signer]);

  useEffect(() => {
    fetchTransactionHistory();
  }, []);

  const fetchContractTokenBalance = async () => {
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
      setIsOwner(ownerAddress.toLowerCase() === userAddress.toLowerCase());
      fetchTokensSold(contract);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTokenPriceInUSD = async () => {
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    try {
      const priceInUSD = await contract.tokenPriceInUSD();
      setTokenPriceInUSD(priceInUSD.toString());
    } catch (err) {
      console.error("Error fetching token price in USD:", err);
    }
  };

  const calculateRaisedAmount = () => {
    const tokensSoldInMainUnit = ethers.utils.formatUnits(tokensSold, 18);
    const pricePerTokenInUSD = parseFloat(tokenPriceInUSD) / 100;
    const raisedAmountUSD =
      parseFloat(tokensSoldInMainUnit) * pricePerTokenInUSD;
    setRaisedAmount(raisedAmountUSD.toFixed(2));
  };

  const fetchPresalePhase = async () => {
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    try {
      const phase = await contract.currentPhase();
      setPresalePhase(phase.toString());
    } catch (err) {
      console.error("Error fetching presale phase:", err);
    }
  };

  const setPresalePhaseHandler = async () => {
    if (!isOwner) {
      toast.error("You are not the owner.");
      return;
    }

    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    try {
      const transaction = await contract.setPresalePhase(
        ethers.BigNumber.from(newPhase)
      );
      await transaction.wait();
      toast.success("Presale phase updated successfully.");
      fetchPresalePhase();
    } catch (err) {
      console.error("Error:", err);
      toast.error("Failed to update presale phase.");
    }
  };

  const fetchTransactionHistory = () => {
    fetch(
      "https://ap-south-1.aws.data.mongodb-api.com/app/application-0-alxio/endpoint/api/transactions"
    )
      .then((response) => response.json())
      .then((data) => {
        setTransactions(data);
      })
      .catch((error) => {
        console.error("Error fetching transaction history:", error);
      });
  };

  const pageCount = Math.ceil(transactions.length / itemsPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
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

  const setPriceHandler = async () => {
    if (!isOwner) {
      toast.error("You are not the owner.", {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    try {
      const transaction = await contract.setTokenPrice(
        ethers.utils.parseUnits(price, "wei")
      );
      await transaction.wait();
      toast.success("Token price updated successfully.");
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const pausePresaleHandler = async () => {
    if (!isOwner) {
      toast.error("You are not the owner.");
      return;
    }

    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    try {
      const transaction = await contract.pausePresale();
      await transaction.wait();
      toast.success("Presale paused successfully.");
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const unpausePresaleHandler = async () => {
    if (!isOwner) {
      toast.error("You are not the owner.");
      return;
    }

    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    try {
      const transaction = await contract.unpausePresale();
      await transaction.wait();
      toast.success("Presale unpaused successfully.");
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const setEndTimeHandler = async () => {
    if (!isOwner) {
      toast.error("You are not the owner.");
      return;
    }

    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    try {
      const endDate = new Date(endTime);
      const endTimestamp = Math.floor(endDate.getTime() / 1000);
      const endTimestampBigNumber = ethers.BigNumber.from(
        endTimestamp.toString()
      );
      const transaction = await contract.setEndTime(endTimestampBigNumber);
      await transaction.wait();
      toast.success("Presale end time updated successfully.");
    } catch (err) {
      console.error("Error:", err);
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

  const setPresalePeriodHandler = async () => {
    if (!isOwner) {
      toast.error("You are not the owner.");
      return;
    }

    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    try {
      const startTimestamp = Math.floor(new Date(startTime).getTime() / 1000);
      let transaction = await contract.setStartTime(
        ethers.BigNumber.from(startTimestamp.toString())
      );
      await transaction.wait();
      toast.success("Presale start time updated successfully.");
    } catch (err) {
      console.error("Error:", err);
      toast.error("Failed to update presale period.");
    }
  };

  if (loading) {
    return (
      <Container
        maxWidth="lg"
        style={{ marginTop: "30px", paddingBottom: "20px" }}
      >
        <CircularProgress style={{ display: "block", margin: "auto" }} />
      </Container>
    );
  }

  if (!isOwner) {
    return (
      <Container
        maxWidth="lg"
        style={{ marginTop: "30px", paddingBottom: "20px" }}
      >
        <Typography
          variant="h4"
          gutterBottom
          style={{
            textAlign: "center",
            marginBottom: "20px",
            color: "#f44336",
          }}
        >
          Access Denied
        </Typography>
        <Typography
          variant="h6"
          style={{ textAlign: "center", marginBottom: "20px" }}
        >
          Please connect with the owners wallet.
        </Typography>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="lg"
      style={{ marginTop: "30px", paddingBottom: "20px" }}
    >
      <ToastContainer />
      {loading && (
        <CircularProgress
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            zIndex: 1000,
          }}
        />
      )}
      <Box my={4}>
        <Typography
          variant="h4"
          gutterBottom
          style={{
            textAlign: "center",
            marginBottom: "20px",
            color: "#3f51b5",
          }}
        >
          Presale Dashboard
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card
              style={{
                background: "#f5f5f5",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Avatar
                    style={{ backgroundColor: "#3f51b5", marginRight: "10px" }}
                  >
                    <MoneyIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">Set Token Price</Typography>
                    <TextField
                      fullWidth
                      label="New Token Price (in cents)"
                      variant="outlined"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      margin="normal"
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={setPriceHandler}
                      startIcon={<UpdateIcon />}
                      style={{ marginTop: "10px" }}
                    >
                      Update
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card
              style={{
                background: "#f5f5f5",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Avatar
                    style={{ backgroundColor: "#3f51b5", marginRight: "10px" }}
                  >
                    <EventIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">Set Start Time</Typography>
                    <TextField
                      fullWidth
                      type="datetime-local"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      margin="normal"
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={setPresalePeriodHandler}
                      startIcon={<UpdateIcon />}
                      style={{ marginTop: "10px" }}
                    >
                      Set Start Time
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card
              style={{
                background: "#f5f5f5",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Avatar
                    style={{ backgroundColor: "#3f51b5", marginRight: "10px" }}
                  >
                    <EventIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">Set End Time</Typography>
                    <TextField
                      fullWidth
                      type="datetime-local"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      margin="normal"
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={setEndTimeHandler}
                      startIcon={<UpdateIcon />}
                      style={{ marginTop: "10px" }}
                    >
                      Set End Time
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card
              style={{
                background: "#e0f7fa",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              }}
            >
              <CardContent>
                <Typography variant="h6" style={{ color: "#00796b" }}>
                  Presale Control
                </Typography>
                <Box display="flex" gap={2} mt={2}>
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<PauseIcon />}
                    onClick={pausePresaleHandler}
                  >
                    Pause Sale
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<PlayArrowIcon />}
                    onClick={unpausePresaleHandler}
                  >
                    Resume Sale
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card
              style={{
                background: "#e0f7fa",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              }}
            >
              <CardContent>
                <Typography variant="h6" style={{ color: "#00796b" }}>
                  Current Presale Phase: {presalePhase}
                </Typography>
                <TextField
                  fullWidth
                  label="Set New Phase"
                  variant="outlined"
                  value={newPhase}
                  onChange={(e) => setNewPhase(e.target.value)}
                  margin="normal"
                  InputProps={{
                    endAdornment: (
                      <Tooltip title="Set the new presale phase.">
                        <UpdateIcon />
                      </Tooltip>
                    ),
                  }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={setPresalePhaseHandler}
                  startIcon={<UpdateIcon />}
                  style={{ marginTop: "10px" }}
                >
                  Update Phase
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
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
          </Grid>
          <Grid item xs={12} md={6}>
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
          </Grid>
          <Grid item xs={12} md={6}>
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
                <Typography variant="body1">${raisedAmount}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card
              style={{
                background: "#e0f7fa",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  style={{ color: "#00796b" }}
                >
                  Transaction History
                </Typography>
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
                <TableContainer component={Paper} style={{ maxHeight: 400 }}>
                  <Table aria-label="transaction history">
                    <TableHead>
                      <TableRow>
                        <TableCell>Buyer</TableCell>
                        <TableCell align="right">Currency</TableCell>
                        <TableCell align="right">Money Amount</TableCell>
                        <TableCell align="right">Tokens Bought</TableCell>
                        <TableCell align="right">Transaction Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {currentTransactions.map((transaction) => (
                        <TableRow key={transaction.transactionHash}>
                          <TableCell component="th" scope="row">
                            {transaction.buyer}
                          </TableCell>
                          <TableCell align="right">
                            {transaction.currency}
                          </TableCell>
                          <TableCell align="right">
                            {transaction.amount}
                          </TableCell>
                          <TableCell align="right">
                            {transaction.amountOfTokens
                              ? `${parseFloat(
                                  transaction.amountOfTokens
                                ).toFixed(2)}`
                              : "N/A"}
                          </TableCell>
                          <TableCell align="right">
                            {new Date(
                              transaction.createdAt
                            ).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Box display="flex" justifyContent="center" mt={2}>
                  <Pagination
                    count={pageCount}
                    page={currentPage}
                    onChange={handlePageChange}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" color="textSecondary" align="center">
              Presale Smart Contract Address: {contractAddress}
            </Typography>
            <Typography variant="body2" color="textSecondary" align="center">
              Token Address: {tokenContractAddress}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default SetTokenPrice;
