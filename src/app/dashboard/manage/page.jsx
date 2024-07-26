"use client"
import {
  TextField, Button, Card, CardContent, Typography, Box, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Grid, Container, CircularProgress,
  Tooltip, LinearProgress, Avatar
} from '@mui/material';
import { ethers } from "ethers";
import { toast, ToastContainer } from "react-toastify";
import {
  DownloadForOffline as DownloadIcon, Pause as PauseIcon, PlayArrow as PlayArrowIcon,
  Update as UpdateIcon, Event as EventIcon, Money as MoneyIcon
} from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import contractABI from "../../../resources/contractABI.json"

import "react-toastify/dist/ReactToastify.css";
import { contractAddress } from '../home/page';




export default function Page3() {

  const { signer } = useSelector((state) => state.signer);
  const { isOwner } = useSelector((state) => state.owner);
  const [price, setPrice] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [presalePhase, setPresalePhase] = useState("");
  const [newPhase, setNewPhase] = useState("");
  
  useEffect(() => {
    console.log("### MANAGE SIGNER: ", signer)
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
      {/* <div class="container relative flex flex-col justify-between h-full max-w-6xl px-10 mx-auto xl:px-0 mt-5">
        <h2 class="mb-1 text-3xl font-extrabold leading-tight text-gray-900">
          Manage
        </h2>

        <div class="w-full">
          <div class="flex flex-col w-full mb-10 sm:flex-row">
            <div class="w-full mb-10 sm:mb-0 sm:w-1/2">
              <div class="relative h-full ml-0 mr-0 sm:mr-10">
                <span class="absolute top-0 left-0 w-full h-full mt-1 ml-1 bg-gray-500 rounded-lg"></span>
                <div class="relative h-full p-5 bg-white border-2 border-gray-500 rounded-lg">
                  <div class="flex items-center -mt-1">
                    <h3 class="my-2 ml-3 text-lg font-bold text-gray-800">
                      SET TOKEN PRICE
                    </h3>
                  </div>
                  <p class="mt-3 mb-1 text-xs font-medium text-gray-500 uppercase">
                    ------------
                  </p>
                  <p class="mb-2 text-gray-600">
                    A decentralized application (dapp) is an application built
                    on a decentralized network that combines a smart contract
                    and a frontend user interface.
                  </p>
                </div>
              </div>
            </div>
            <div class="w-full sm:w-1/2">
              <div class="relative h-full ml-0 md:mr-10">
                <span class="absolute top-0 left-0 w-full h-full mt-1 ml-1 bg-gray-500 rounded-lg"></span>
                <div class="relative h-full p-5 bg-white border-2 border-gray-500 rounded-lg">
                  <div class="flex items-center -mt-1">
                    <h3 class="my-2 ml-3 text-lg font-bold text-gray-800">
                      Set Start Time
                    </h3>
                  </div>
                  <p class="mt-3 mb-1 text-xs font-medium text-gray-500 uppercase">
                    ------------
                  </p>
                  <p class="mb-2 text-gray-600">
                    Web 3.0 is the third generation of Internet services that
                    will focus on understanding and analyzing data to provide a
                    semantic web.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="flex flex-col w-full mb-5 sm:flex-row">
            <div class="w-full mb-10 sm:mb-0 sm:w-1/2">
              <div class="relative h-full ml-0 mr-0 sm:mr-10">
                <span class="absolute top-0 left-0 w-full h-full mt-1 ml-1 bg-gray-400 rounded-lg"></span>
                <div class="relative h-full p-5 bg-white border-2 border-gray-400 rounded-lg">
                  <div class="flex items-center -mt-1">
                    <h3 class="my-2 ml-3 text-lg font-bold text-gray-800">
                      Set End Time
                    </h3>
                  </div>
                  <p class="mt-3 mb-1 text-xs font-medium text-gray-400 uppercase">
                    ------------
                  </p>
                  <p class="mb-2 text-gray-600">
                    A Project Audit is a formal review of a project, which is
                    intended to assess the extent up to which project management
                    standards are being upheld.
                  </p>
                </div>
              </div>
            </div>
            <div class="w-full mb-10 sm:mb-0 sm:w-1/2">
              <div class="relative h-full ml-0 mr-0 sm:mr-10">
                <span class="absolute top-0 left-0 w-full h-full mt-1 ml-1 bg-gray-400 rounded-lg"></span>
                <div class="relative h-full p-5 bg-white border-2 border-gray-400 rounded-lg">
                  <div class="flex items-center -mt-1">
                    <h3 class="my-2 ml-3 text-lg font-bold text-gray-800">
                    Presale Control
                    </h3>
                  </div>
                  <p class="mt-3 mb-1 text-xs font-medium text-gray-400 uppercase">
                    ------------
                  </p>
                  <p class="mb-2 text-gray-600">
                    A security hacker is someone who explores methods for
                    breaching defenses and exploiting weaknesses in a computer
                    system or network.
                  </p>
                </div>
              </div>
            </div>
            <div class="w-full sm:w-1/2">
              <div class="relative h-full ml-0 md:mr-10">
                <span class="absolute top-0 left-0 w-full h-full mt-1 ml-1 bg-gray-400 rounded-lg"></span>
                <div class="relative h-full p-5 bg-white border-2 border-gray-400 rounded-lg">
                  <div class="flex items-center -mt-1">
                    <h3 class="my-2 ml-3 text-lg font-bold text-gray-800">
                    Current Presale Phase: 2
                    </h3>
                  </div>
                  <p class="mt-3 mb-1 text-xs font-medium text-gray-500 uppercase">
                    ------------
                  </p>
                  <p class="mb-2 text-gray-600">
                    Bot development frameworks were created as advanced software
                    tools that eliminate a large amount of manual work and
                    accelerate the development process.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      <Container maxWidth="lg" style={{ marginTop: '30px', paddingBottom: '20px' }}>
      <ToastContainer />
      <Box my={4}>
      <Grid container spacing={4}>
      <Grid item xs={12} md={4}>
            <Card style={{ background: '#f5f5f5', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Avatar style={{ backgroundColor: '#3f51b5', marginRight: '10px' }}>
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
                      style={{ marginTop: '10px' }}
                    >
                      Update
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card style={{ background: '#f5f5f5', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Avatar style={{ backgroundColor: '#3f51b5', marginRight: '10px' }}>
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
                      style={{ marginTop: '10px' }}
                    >
                      Set Start Time
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card style={{ background: '#f5f5f5', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Avatar style={{ backgroundColor: '#3f51b5', marginRight: '10px' }}>
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
                      style={{ marginTop: '10px' }}
                    >
                      Set End Time
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card style={{ background: '#e0f7fa', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}>
              <CardContent>
                <Typography variant="h6" style={{ color: '#00796b' }}>Presale Control</Typography>
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
            <Card style={{ background: '#e0f7fa', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}>
              <CardContent>
                <Typography variant="h6" style={{ color: '#00796b' }}>Current Presale Phase: {presalePhase}</Typography>
                <TextField
                  fullWidth
                  label="Set New Phase"
                  variant="outlined"
                  value={newPhase}
                  onChange={(e) => setNewPhase(e.target.value)}
                  margin="normal"
                  InputProps={{
                    endAdornment: <Tooltip title="Set the new presale phase."><UpdateIcon /></Tooltip>
                  }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={setPresalePhaseHandler}
                  startIcon={<UpdateIcon />}
                  style={{ marginTop: '10px' }}
                >
                  Update Phase
                </Button>
              </CardContent>
            </Card>
          </Grid>
          </Grid>
                  </Box>
      </Container>
    </>
  );
}
