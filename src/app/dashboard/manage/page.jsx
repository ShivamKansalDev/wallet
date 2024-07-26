"use client";
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
import { ethers } from "ethers";
import { toast, ToastContainer } from "react-toastify";
import {
  DownloadForOffline as DownloadIcon,
  Pause as PauseIcon,
  PlayArrow as PlayArrowIcon,
  Update as UpdateIcon,
  Event as EventIcon,
  Money as MoneyIcon,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import contractABI from "../../../resources/contractABI.json";

import "react-toastify/dist/ReactToastify.css";
import { contractAddress } from "../home/page";

export default function Page3() {
  const { signer } = useSelector((state) => state.signer);
  const { isOwner } = useSelector((state) => state.owner);
  const [price, setPrice] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [presalePhase, setPresalePhase] = useState("");
  const [newPhase, setNewPhase] = useState("");

  useEffect(() => {
    console.log("### MANAGE SIGNER: ", signer);
    if (signer) {
      fetchPresalePhase();
    }
  }, [signer]);

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

  return (
    <>
      <div className="text-gray-700 body-font bg-white rounded-[16px] sm:h-full md:h-full lg:h-full xl:h-screen shadow-lg border">
        <Container
          maxWidth="lg"
          style={{ marginTop: "30px", paddingBottom: "20px" }}
        >
          <ToastContainer />
          <Box my={4}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <div className="relative">
                  <Card
                    style={{
                      background: "#fffff",
                     boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
                      borderRadius: "16px",
                    }}
                  >
                    <CardContent>
                      <Box display="flex" alignItems="center">
                        <Avatar
                          style={{
                            backgroundColor: "#dca413",
                            marginRight: "10px",
                            position: "absolute",
                            right: "20px",
                            top: "-20px",
                            width: "60px",
                            height: "60px",
                          }}
                        >
                          <MoneyIcon />
                        </Avatar>
                        <Box>
                          <Typography
                            variant="h6"
                            style={{
                              fontWeight: 600,
                              fontSize: "16px",
                              marginTop: "16px",
                            }}
                          >
                            Set Token Price
                          </Typography>
                          <TextField
                            fullWidth
                            label="New Token Price (in cents)"
                            variant="outlined"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            margin="dense" 
                          />
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={setPriceHandler}
                            startIcon={<UpdateIcon />}
                            style={{
                              marginTop: "10px",
                              backgroundColor: "#0841cf",
                              borderRadius: "100px",
                              fontSize: "12px",
                              fontWeight: 800,
                               padding:'12px 14px'
                            }}
                          >
                            Update
                          </Button>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </div>
              </Grid>
              <Grid item xs={12} md={4}>
                <div className="relative">
                  <Card
                    style={{
                      background: "#fffff",
                      boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
                      borderRadius: "16px",
                    }}
                  >
                    <CardContent>
                      <Box display="flex" alignItems="center">
                        <Avatar
                          style={{
                            backgroundColor: "#11c169",
                            marginRight: "10px",
                            position: "absolute",
                            right: "20px",
                            top: "-20px",
                            width: "60px",
                            height: "60px",
                          }}
                        >
                          <EventIcon />
                        </Avatar>
                        <Box>
                          <Typography
                            variant="h6"
                            style={{
                              fontWeight: 600,
                              fontSize: "16px",
                              marginTop: "16px",
 
                            }}
                          >
                            Set Start Time
                          </Typography>
                          <TextField
                            fullWidth
                            type="datetime-local"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            margin="dense"
                          />
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={setPresalePeriodHandler}
                            startIcon={<UpdateIcon />}
                            style={{
                              marginTop: "10px",
                              backgroundColor: "#0841cf",
                              borderRadius: "100px",
                              fontSize: "12px",
                              fontWeight: 800,
                               padding:'12px 14px'
                            }}
                          >
                            Set Start Time
                          </Button>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </div>
              </Grid>
              <Grid item xs={12} md={4}>
                <div className="relative">
                  <Card
                    style={{
                      background: "#fffff",
                      boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
                      borderRadius: "16px",
                    }}
                  >
                    <CardContent>
                      <Box display="flex" alignItems="center">
                        <Avatar
                          style={{
                            backgroundColor: "#cc1f47",
                            marginRight: "10px",
                            position: "absolute",
                            right: "20px",
                            top: "-20px",
                            width: "60px",
                            height: "60px",
                          }}
                        >
                          <EventIcon />
                        </Avatar>
                        <Box>
                          <Typography
                            variant="h6"
                            style={{
                              fontWeight: 600,
                              fontSize: "16px",
                              marginTop: "16px", 
                            }}
                          >
                            Set End Time
                          </Typography>
                          <TextField
                            fullWidth
                            type="datetime-local"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            margin="dense"
                          />
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={setEndTimeHandler}
                            startIcon={<UpdateIcon />}
                            style={{
                              marginTop: "10px",
                              backgroundColor: "#0841cf",
                              borderRadius: "100px",
                              fontSize: "12px",
                              fontWeight: 800,
                               padding:'12px 14px'
                            }}
                          >
                            Set End Time
                          </Button>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </div>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card
                  style={{
                    background: "#fffff",
                    boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
                    borderRadius: "16px",
                    
                  }}
                  className="md:h-[218px]"
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      style={{
                        fontWeight: 600,
                        fontSize: "16px",
                        marginTop: "16px", 
                      }}
                    >
                      Presale Control
                    </Typography>
                    <Box  gap={1} mt={2}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={pausePresaleHandler}
                        startIcon={<PauseIcon />}
                        style={{
                          marginTop: "10px",
                          backgroundColor: "red",
                          borderRadius: "100px",
                          fontSize: "12px",
                          fontWeight: 800,
                           padding:'12px 14px',
                           marginRight:'10px'
                        }}
                      >
                        Pause Sale
                      </Button>

                      <Button
                        variant="contained"
                        color="primary"
                        onClick={unpausePresaleHandler}
                        startIcon={<PauseIcon />}
                        style={{
                          marginTop: "10px",
                          backgroundColor: "green",
                          borderRadius: "100px",
                          fontSize: "12px",
                          fontWeight: 800,
                           padding:'12px 14px'
                        }}
                      >
                        Resume Sale
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card
                  style={{
                    background: "#ffffff",
                    boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
                    borderRadius: "16px",
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      style={{
                        fontWeight: 600,
                        fontSize: "16px",
                        marginTop: "16px", 
                      }}
                    >
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
                      style={{
                        marginTop: "10px",
                        backgroundColor: "#0841cf",
                        borderRadius: "100px",
                        fontSize: "12px",
                        fontWeight: 800,
                        padding:'12px 14px'
                      }}
                    >
                      Update Phase
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </div>
    </>
  );
}
