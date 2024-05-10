import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { createLoadRequest } from '../../redux/actions/load-request';
import { unwrapResult } from '@reduxjs/toolkit';
import { getAllMoveRequest } from '../../redux/actions/pickup-carrier';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { State } from "country-state-city";
import { io } from 'socket.io-client';
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useParams } from 'react-router-dom';
const thisUrl = process.env.REACT_APP_API_URL || '';
const PickupCarrierDashboard = () => {
  const [loadModalOpen, setLoadModalOpen] = useState(false);
  const {canonicalId} = useParams();
  const [status, setstatus] = useState(false);
  const [moveRequests, setmoveRequests] = useState<any>([]);
  const [moveRequest, setmoveRequest] = useState<any>();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [moveRequestId, setMoveRequestId] = useState<number>();
  const [isLoading, setIsLoading] = useState(false);
  const [states, setStates] = useState<any>([]);
  const dispatch = useDispatch();
  const [loadRequestData, setLoadRequestData] = useState<any>({
    delivery_status: '',
    loading_zip_code: '',
    delivery_zip_code: '',
    cubic_feet: 0,
    balance_at_delivery: 0,
    price_per_cubic_feet: 0,
    first_available_date_of_delivery: '',
  });
  const [loading_state, setLoading_state] = useState<any>();
  const [delivery_state, setDelivery_state] = useState<any>();
  const [errors, setErrors] = useState({
    delivery_status: false,
    loading_state: false,
    delivery_state: false,
    loading_zip_code: false,
    delivery_zip_code: false,
    cubic_feet: false,
    balance_at_delivery: false,
    price_per_cubic_feet: false,
    first_available_date_of_delivery: false,
  });

  const validateForm = () => {
    const newErrors = {
      delivery_status: !loadRequestData.delivery_status,
      loading_zip_code: !loadRequestData.loading_zip_code,
      delivery_zip_code: !loadRequestData.delivery_zip_code,
      cubic_feet: !loadRequestData.cubic_feet,
      balance_at_delivery: !loadRequestData.balance_at_delivery,
      price_per_cubic_feet: !loadRequestData.price_per_cubic_feet,
      first_available_date_of_delivery: !loadRequestData.first_available_date_of_delivery,
      loading_state: !loading_state,
      delivery_state: !delivery_state

    };

    setErrors(newErrors);
    return Object.values(newErrors).every(field => field === false);
  };

  const handleOpenLoadModal = (id: number) => {
    setMoveRequestId(id);
    setLoadModalOpen(true);
  };

  const handleCloseLoadModal = () => {
    setLoadModalOpen(false);
  };

  const handleLoadRequestDataChange = (e: any) => {
    const { name, value } = e.target;
    setLoadRequestData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));

  };
  const handleSubmitLoadRequest = () => {
    if (!validateForm()) {
      return;
    }
    const payload = {
      delivery_status: loadRequestData.delivery_status,
      loading_zip_code: loadRequestData.loading_zip_code,
      delivery_zip_code: loadRequestData.delivery_zip_code,
      cubic_feet: Number(loadRequestData.cubic_feet),
      balance_at_delivery: Number(loadRequestData.balance_at_delivery),
      price_per_cubic_feet: Number(loadRequestData.price_per_cubic_feet),
      first_available_date_of_delivery: loadRequestData.first_available_date_of_delivery,
      delivery_state: delivery_state.name,
      loading_state: loading_state.name,
      pickup_crrier_id: canonicalId,
      move_request_id: moveRequestId
    }
    console.log(payload);
    dispatch<any>(createLoadRequest(payload))
      .then(unwrapResult)
      .then((loadRequest: any) => {
        setLoadRequestData({
          delivery_status: '',
          loading_zip_code: '',
          delivery_zip_code: '',
          cubic_feet: 0,
          balance_at_delivery: 0,
          price_per_cubic_feet: 0,
          first_available_date_of_delivery: '',

        })
        setLoading_state('');
        setDelivery_state('');
        console.log(loadRequest);
        setstatus((prev) => !prev);
        setLoadModalOpen(false);
      })
      .catch((err: any) => {
        console.log(err);
      });
  };
  useEffect(() => {
    dispatch<any>(getAllMoveRequest(canonicalId))
      .then(unwrapResult)
      .then((moveReq: any) => {
        console.log(moveReq);
        setmoveRequests(moveReq);
      })
      .catch((err: any) => {
        console.log(err);
      });
  }, [moveRequest, status]);



  useEffect(() => {
    const socket = io(thisUrl);

    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socket.on('connect_error', error => {
      console.error('WebSocket connection error:', error);
    });

    socket.on('newMoveRequest', requestData => {
      setmoveRequest(requestData);

    });

    return () => {
      socket.disconnect();
    };
  }, []);
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    if (moveRequest) {
      setSnackbarOpen(true);
    }
  }, [moveRequest]);

  useEffect(() => {
    setStates(State.getStatesOfCountry("US"));
  }, []);
  function convertDateToDDMMYYYY(dateString:any) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
    const year = date.getFullYear();
  
    return `${day}/${month}/${year}`;
  }
  return (
    <Box padding={'2%'}>
      <Typography variant="h4" gutterBottom>
        Pickup Carrier Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Dialog open={loadModalOpen} onClose={handleCloseLoadModal}>
          <DialogTitle>Create Load Request</DialogTitle>
          <DialogContent>
            <FormControl fullWidth variant="outlined" required margin="normal" error={errors.delivery_status}>
              <InputLabel id="delivery-status-label">Delivery Status</InputLabel>
              <Select
                labelId="delivery-status-label"
                label="Delivery Status"
                name="delivery_status"
                value={loadRequestData.delivery_status}
                onChange={handleLoadRequestDataChange}
              >
                <MenuItem value="Not Started">Not Started</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
              </Select>
              {errors.delivery_status && <FormHelperText>Delivery Status is required</FormHelperText>}
            </FormControl>
            <FormControl fullWidth variant="outlined" margin="normal" error={errors.loading_state}>
              <InputLabel id="loading-state-label">Loading State</InputLabel>
              <Select
                labelId="loading-state-label"
                label="Loading State"
                name="loading_state"
                value={loading_state}
                onChange={(e) => {
                  setLoading_state(e.target.value)
                }}
              >
                {states &&
                  states.map((thisState: any) => {
                    return (
                      <MenuItem key={thisState.name} value={thisState}>
                        {thisState.name}
                      </MenuItem>
                    );
                  })}
              </Select>
              {errors.loading_state && <FormHelperText>Loading State is required</FormHelperText>}
            </FormControl>
            <TextField
              error={errors.loading_zip_code}
              helperText={errors.loading_zip_code && "Loading Zip Code is required"}
              label="Loading Zip Code"
              name="loading_zip_code"
              fullWidth
              variant="outlined"
              margin="normal"
              value={loadRequestData.loading_zip_code}
              onChange={handleLoadRequestDataChange}
              required
            />
            <FormControl fullWidth variant="outlined" margin="normal" error={errors.delivery_state}>
              <InputLabel id="delivery-state-label">Delivery State</InputLabel>
              <Select
                labelId="delivery-state-label"
                label="Delivery State"
                name="delivery_state"
                value={delivery_state}
                onChange={(e) => {
                  setDelivery_state(e.target.value)
                }}
              >
                {states &&
                  states.map((thisState: any) => {
                    return (
                      <MenuItem key={thisState.name} value={thisState}>
                        {thisState.name}
                      </MenuItem>
                    );
                  })}
              </Select>
              {errors.delivery_state && <FormHelperText>Delivery State is required</FormHelperText>}
            </FormControl>
            <TextField
              error={errors.delivery_zip_code}
              helperText={errors.delivery_zip_code && "Delivery Zip Code is required"}
              label="Delivery Zip Code"
              name="delivery_zip_code"
              fullWidth
              variant="outlined"
              margin="normal"
              value={loadRequestData.delivery_zip_code}
              onChange={handleLoadRequestDataChange}
              required
            />
            <TextField
              error={errors.cubic_feet}
              helperText={errors.cubic_feet && "Cubic Feet is required"}
              label="Cubic Feet"
              name="cubic_feet"
              fullWidth
              variant="outlined"
              margin="normal"
              type='number'
              value={!!loadRequestData.cubic_feet && loadRequestData.cubic_feet || ""}
              onChange={handleLoadRequestDataChange}
              required
            />
            <TextField
              error={errors.balance_at_delivery}
              helperText={errors.balance_at_delivery && "Balance at Delivery is required"}
              label="Balance at Delivery"
              name="balance_at_delivery"
              fullWidth
              variant="outlined"
              margin="normal"
              type='number'
              value={!!loadRequestData.balance_at_delivery && loadRequestData.balance_at_delivery || ""}
              onChange={handleLoadRequestDataChange}
              required
            />
            <TextField
              error={errors.price_per_cubic_feet}
              helperText={errors.price_per_cubic_feet && "Price Per Cubic Feet is required"}
              label="Price Per Cubic Feet"
              name="price_per_cubic_feet"
              type='number'
              fullWidth
              variant="outlined"
              margin="normal"
              value={!!loadRequestData.price_per_cubic_feet && loadRequestData.price_per_cubic_feet || ""}
              onChange={handleLoadRequestDataChange}
              required
            />
            <TextField
              error={errors.first_available_date_of_delivery}
              helperText={errors.first_available_date_of_delivery && "First Available Date Of Delivery is required"}
              label="First Available Date Of Delivery"
              name="first_available_date_of_delivery"
              type="date"
              fullWidth
              variant="outlined"
              margin="normal"
              value={loadRequestData.first_available_date_of_delivery}
              onChange={handleLoadRequestDataChange}
              InputLabelProps={{ shrink: true }}
              required
            />


            <Button variant="contained" color="primary" onClick={handleSubmitLoadRequest} sx={{ marginTop: '4%' }}>
              Submit Load Request
            </Button>
          </DialogContent>
        </Dialog>
        <Grid item xs={12} md={6}>
          <Paper elevation={3}>
            <Box p={2}>
              <Typography variant="h6" style={{ color: '#5858E0' }}>Assigned Service Requests</Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ fontWeight: 'bold' }}>Push To Load Board</TableCell>
                      <TableCell style={{ fontWeight: 'bold' }}>Customer Name</TableCell>
                      <TableCell style={{ fontWeight: 'bold' }}>Customer Phone Number</TableCell>
                      <TableCell style={{ fontWeight: 'bold' }}>Location Type</TableCell>
                      <TableCell style={{ fontWeight: 'bold' }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {moveRequests?.map((request: any) => (
                      <TableRow key={request?.id}>
                        <TableCell> <Button variant="outlined" disabled={!!request.loadRequest} onClick={() => { handleOpenLoadModal(request?.id) }}>
                          {!request.loadRequest ? 'Load Request' : 'Job pushed to Loadboard'}
                        </Button></TableCell>
                        <TableCell>{request?.user.first_name + " " + request.user.last_name}</TableCell>
                        <TableCell>{request?.user.phone_number}</TableCell>
                        <TableCell>{request?.location_type}</TableCell>
                        <TableCell>{request?.move_status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3}>
            <Box p={2}>
              <Typography variant="h6" style={{ color: '#5858E0' }}>Load Board</Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ fontWeight: 'bold' }}>Created At</TableCell>
                      <TableCell style={{ fontWeight: 'bold' }}>Delivery Status</TableCell>
                      <TableCell style={{ fontWeight: 'bold' }}>Loading State</TableCell>
                      <TableCell style={{ fontWeight: 'bold' }}>Loading Zip Code</TableCell>
                      <TableCell style={{ fontWeight: 'bold' }}>Delivery State</TableCell>
                      <TableCell style={{ fontWeight: 'bold' }}>Delivery Zip Code</TableCell>
                      <TableCell style={{ fontWeight: 'bold' }}>Balance At Delivery</TableCell>
                      <TableCell style={{ fontWeight: 'bold' }}>Cubic Feet</TableCell>
                      <TableCell style={{ fontWeight: 'bold' }}>Price Per Cubic Feet</TableCell>
                      <TableCell style={{ fontWeight: 'bold' }}>First Available Date Of Delivery</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {moveRequests?.map((request: any) => (
                      <TableRow key={request?.id}>
                        <TableCell>{convertDateToDDMMYYYY(request?.loadRequest?.created_at)}</TableCell>
                        <TableCell>{request?.loadRequest?.delivery_status}</TableCell>
                        <TableCell>{request?.loadRequest?.loading_state}</TableCell>
                        <TableCell>{request?.loadRequest?.loading_zip_code}</TableCell>
                        <TableCell>{request?.loadRequest?.delivery_state}</TableCell>
                        <TableCell>{request?.loadRequest?.delivery_zip_code}</TableCell>
                        <TableCell>{request?.loadRequest?.balance_at_delivery}</TableCell>
                        <TableCell>{request?.loadRequest?.cubic_feet}</TableCell>
                        <TableCell>{request?.loadRequest?.price_per_cubic_feet}</TableCell>
                        <TableCell>{convertDateToDDMMYYYY(request?.loadRequest?.first_available_date_of_delivery)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3} style={{ marginTop: '20px' }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3}>
            <Box p={2}>
              <Typography variant="h6" style={{ color: '#5858E0' }}>Canceled Pickup Requests</Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ fontWeight: 'bold' }}>Customer Name</TableCell>
                      <TableCell style={{ fontWeight: 'bold' }}>Customer Phone Number</TableCell>
                      <TableCell style={{ fontWeight: 'bold' }}>Location Type</TableCell>
                      <TableCell style={{ fontWeight: 'bold' }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {[]?.map((request: any) => (
                      <TableRow key={request?.id}>
                        <TableCell>{request?.user.first_name + " " + request.user.last_name}</TableCell>
                        <TableCell>{request?.user.phone_number}</TableCell>
                        <TableCell>{request?.location_type}</TableCell>
                        <TableCell>{request?.move_status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3}>
            <Box p={2}>
              <Typography variant="h6" style={{ color: '#5858E0' }}>Completed Pickup Requests</Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ fontWeight: 'bold' }}>Customer Name</TableCell>
                      <TableCell style={{ fontWeight: 'bold' }}>Customer Phone Number</TableCell>
                      <TableCell style={{ fontWeight: 'bold' }}>Location Type</TableCell>
                      <TableCell style={{ fontWeight: 'bold' }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {[]?.map((request: any) => (
                      <TableRow key={request?.id}>
                        <TableCell>{request?.user.first_name + " " + request.user.last_name}</TableCell>
                        <TableCell>{request?.user.phone_number}</TableCell>
                        <TableCell>{request?.location_type}</TableCell>
                        <TableCell>{request?.move_status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      <Snackbar
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        message="New move request has been assigned to you!"
        action={
          <React.Fragment>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleSnackbarClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
      {isLoading && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isLoading}
          onClick={() => {
            setIsLoading(true);
          }}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
    </Box>
  );
};

export default PickupCarrierDashboard;
