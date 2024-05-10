import {
  Grid,
  Paper,
  Typography,
  Box,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Rating,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { unwrapResult } from '@reduxjs/toolkit';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import { getDeliveryCarrierAgainstId } from '../../redux/actions/delivery-carrier';
import { getLoadrequestAgainstDc } from '../../redux/actions/load-request';

const dummyData = {
  monthlyRevenue: '$10,000',
  loadedJobs: 35,
  completedDeliveries: 28,
  numberOfTrucks: 10,
  canceledLoads: 5,
  drivers: [
    { name: 'Driver 1', status: 'Available' },
    { name: 'Driver 2', status: 'Busy' },
    { name: 'Driver 3', status: 'Available' },
  ],
  todos: ['Task 1', 'Task 2', 'Task 3'],
  companyRating: { stars: 4.5, reviews: 50 },
};
const datePickerStyle = {
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderWidth: 1.5,
      borderColor: "#5A7BFC33",
      borderRadius: "8px",
    },
  },
};

const DeliveryCarrierDashboard = () => {
  const { canonicalId } = useParams();
  const [selectedDate, setSelectedDate] = useState<any>();
  const [dC, setDc] = useState<any>(null); //DC mean delivery carrier 
  const [loadRequest, setLoadRequest] = useState<any>([]);
  const [notCompletedloadRequest, setNotCompletedloadRequest] = useState<any>([]);
  const [completedLoadRequest, setCompletedLoadRequest] = useState<any>([]);
  const dispatch = useDispatch();

  const dateFormatter = (date: any) => {
    const dateStringFromBackend = date;
    const dateObject = new Date(dateStringFromBackend);
    const day = dateObject.getUTCDate();
    const month = dateObject.getUTCMonth() + 1;
    const year = dateObject.getUTCFullYear();
    const formattedDate = `${day.toString().padStart(2, '0')}-${month.toString().padStart(2, '0')}-${year}`;
    return formattedDate;
  }
  const fetchLoadrequestAgainstDc = () => {
    let complete: [];
    let notComplete: [];
    dispatch<any>(getDeliveryCarrierAgainstId(canonicalId))
      .then(unwrapResult)
      .then((DC: any) => {
        setDc(DC);
        const payload = { deliveryCarrierId: Number(DC.id), date: selectedDate };
        dispatch<any>(getLoadrequestAgainstDc((payload)))
          .then(unwrapResult)
          .then((LR: any) => {
            setLoadRequest(LR);
            console.log(LR, 'in fetch');
            complete = LR.filter((lr: any) => lr.delivery_status === 'Completed');
            notComplete = LR.filter((lr: any) => lr.delivery_status !== 'Completed');
            setCompletedLoadRequest(complete);
            setNotCompletedloadRequest(notComplete);
          })
          .catch((err: any) => {
            console.log(err);
          });
      })

  };
  useEffect(() => {
    fetchLoadrequestAgainstDc();
  }, [selectedDate]);
  const formatMonth = (date: any) => {
    if (!date) return '';
    let formattedDate = date;
    if (!(date instanceof Date)) {
      formattedDate = new Date(date);
    }
    if (isNaN(formattedDate)) return 'Invalid date';
    const options = { month: 'long' };
    return formattedDate.toLocaleDateString('en-US', options);
  };
  return (
    <Box padding={'2%'}>
      <Typography variant="h4" gutterBottom>
        Delivery Carrier Dashboard
      </Typography>
      <Box>
        <DemoContainer
          sx={{
            padding: 3,
            mb: 5

          }}
          components={["DatePicker", "DesktopDatePicker", "MobileDatePicker"]}
        >
          <Typography fontSize={16} color={"#797979"} textAlign={"start"}>
            Select a date to see load request
          </Typography>
          <DatePicker
            value={selectedDate}
            onChange={(newValue) => setSelectedDate(newValue)}
            slotProps={{ textField: { size: "small" } }}
            sx={datePickerStyle}
          />
          <Typography fontSize={16} color={selectedDate ? "#5858E0" : "#797979"} textAlign={"start"}>
            {selectedDate ? `Selected Month: ${formatMonth(selectedDate)}` : "No month selected"}
          </Typography>
        </DemoContainer>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3}>
            <Box p={2}>
              <Typography variant="h6">Monthly Revenue</Typography>
              <Typography variant="h4" style={{ color: '#5858E0' }}>
                ${0}
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3}>
            <Box p={2}>
              <Typography variant="h6">Loaded Jobs</Typography>
              <Typography variant="h4" style={{ color: '#5858E0' }}>
                {loadRequest?.length}
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3}>
            <Box p={2}>
              <Typography variant="h6">Completed Deliveries</Typography>
              <Typography variant="h4" style={{ color: '#5858E0' }}>
                {completedLoadRequest?.length}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3} style={{ marginTop: '20px' }}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3}>
            <Box p={2}>
              <Typography variant="h6">Number of Trucks</Typography>
              <Typography variant="h4" style={{ color: '#5858E0' }}>
                {dC ? dC.count_of_53_foot_trailers : 0}
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3}>
            <Box p={2}>
              <Typography variant="h6">Canceled Loads</Typography>
              <Typography variant="h4" style={{ color: '#5858E0' }}>
                {0}
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3}>
            <Box p={2}>
              <Typography variant="h6">Company Rating</Typography>
              <Rating
                name="company-rating"
                value={dummyData.companyRating.stars}
                precision={0.5}
                readOnly
              />
              <Typography variant="subtitle1">
                ({dummyData.companyRating.reviews} Reviews)
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3} style={{ marginTop: '20px' }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3}>
            <Box p={2}>
              <Typography variant="h6">List of Drivers</Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>First Name</TableCell>
                      <TableCell>Last Name</TableCell>
                      <TableCell>Phone number</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dC?.drivers?.map((driver: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{driver.first_name}</TableCell>
                        <TableCell>{driver.last_name}</TableCell>
                        <TableCell>{driver.phone_number}</TableCell>
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
              <Typography variant="h6">All To-Do's</Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Id</TableCell>
                      <TableCell>Delivery State</TableCell>
                      <TableCell>Delivery Zip Code</TableCell>
                      <TableCell>Delivery Status</TableCell>
                      <TableCell>First Available Date Of Delivery</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {notCompletedloadRequest?.map((lr: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{lr.id}</TableCell>
                        <TableCell>{lr.delivery_state}</TableCell>
                        <TableCell>{lr.delivery_zip_code}</TableCell>
                        <TableCell>{lr.delivery_status}</TableCell>
                        <TableCell>{dateFormatter(lr.first_available_date_of_delivery)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Paper>
        </Grid>

      </Grid>
    </Box>
  );
};

export default DeliveryCarrierDashboard;
