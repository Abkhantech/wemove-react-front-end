import {
  Button,
  IconButton,
  Paper,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { activateLocalCarrier } from "../../redux/actions/local-carrier";
import { unwrapResult } from "@reduxjs/toolkit";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

const LocalCarrierTable = ({ localCarriers, getLocalCarriers }: any) => {
  const dispatch = useDispatch();
  const [isSnackBar, setIsSnackBar] = useState(false);
  const [snackbarText, setSnackbarText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setIsSnackBar(false);
  };

  const action = (
    <IconButton
      size="small"
      aria-label="close"
      color="inherit"
      onClick={handleClose}
    >
      <CloseIcon fontSize="small" />
    </IconButton>
  );

  const handleLocalCarrierActivation = (id: any, activation_status: any) => {
    setIsLoading(true);
    const body = {
      id: id,
      activation_status: activation_status,
    };

    dispatch<any>(activateLocalCarrier(body))
      .then(unwrapResult)
      .then((res: any) => {
        console.log("res", res);
        getLocalCarriers();
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
        setIsSnackBar(true);
        res.activation_status
          ? setSnackbarText("Account Activated Successfully!")
          : setSnackbarText("Account Deactivated Successfully!");
      })
      .catch((error: any) => {
        console.log("error", error);
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      });
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ backgroundColor: "#5858E0" }}>
            <TableRow>
              <TableCell align="center">Activation Status</TableCell>
              <TableCell align="center">ID</TableCell>
              <TableCell align="center">Company Name</TableCell>
              <TableCell align="center">DBA</TableCell>
              <TableCell align="center">Owner Name</TableCell>
              <TableCell align="center">Owner Phone Number</TableCell>
              <TableCell align="center">Owner Email</TableCell>
              <TableCell align="center">Company Phone Number</TableCell>
              <TableCell align="center">Company Tariff</TableCell>
              <TableCell align="center">Owner Driver License</TableCell>
              <TableCell align="center">W9 Form</TableCell>
              <TableCell align="center">DOT Number</TableCell>
              <TableCell align="center">MC Number</TableCell>
              <TableCell align="center">Street Address</TableCell>
              <TableCell align="center">City</TableCell>
              <TableCell align="center">State</TableCell>
              <TableCell align="center">Zip-Code</TableCell>
              <TableCell align="center">phone-verified</TableCell>
              <TableCell align="center">email-verified</TableCell>
              {/* <TableCell align="center">otp</TableCell> */}
              <TableCell align="center">Trucks in Operatiion</TableCell>
              <TableCell align="center">Arbitration County</TableCell>
              <TableCell align="center">Arbitration State</TableCell>
              <TableCell align="center">Years in Business</TableCell>
              <TableCell align="center">created_at</TableCell>
              <TableCell align="center">updated_at</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {localCarriers.length !== 0 ?
              localCarriers.map((carrier: any) => (
                <TableRow
                  key={carrier.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="center">
                    {carrier.activation_status ? (
                      <Stack>
                        <Typography
                          color={"#228B22"}
                          fontSize={12}
                          fontWeight={600}
                        >
                          ACTIVE NOW
                        </Typography>
                        <Button
                          variant="contained"
                          size="small"
                          sx={{ width: 90 }}
                          disabled={isLoading}
                          onClick={() => {
                            handleLocalCarrierActivation(carrier.id, false);
                          }}
                        >
                          Deactivate
                        </Button>
                      </Stack>
                    ) : (
                      <Stack>
                        <Typography
                          color={"#FF0000"}
                          fontSize={12}
                          fontWeight={600}
                        >
                          INACTIVE NOW
                        </Typography>
                        <Button
                          variant="contained"
                          size="small"
                          sx={{ width: 90 }}
                          disabled={isLoading}
                          onClick={() => {
                            handleLocalCarrierActivation(carrier.id, true);
                          }}
                        >
                          Activate
                        </Button>
                      </Stack>
                    )}
                  </TableCell>
                  <TableCell align="center">{carrier.id}</TableCell>
                  <TableCell align="center">{carrier.company_name}</TableCell>
                  <TableCell align="center">{carrier.doing_business_as_name}</TableCell>
                  <TableCell align="center">{carrier.owner_name}</TableCell>
                  <TableCell align="center">
                    {carrier.owner_phone_number}
                  </TableCell>
                  <TableCell align="center">{carrier.owner_email}</TableCell>
                  <TableCell align="center">
                    {carrier.owner_office_phone}
                  </TableCell>
                  <TableCell align="center">
                    <a
                      href={carrier.company_license}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Show Company Tariff
                    </a>
                  </TableCell>
                  <TableCell align="center">
                    <a
                      href={carrier.owner_driver_license}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Show Driver License
                    </a>
                  </TableCell>
                  <TableCell align="center">
                    <a
                      href={carrier.w9_form}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Show W9 form
                    </a>
                  </TableCell>
                  <TableCell align="center">
                    {carrier.dot_number === "" || carrier.dot_number === "0"
                      ? "-"
                      : carrier.dot_number}
                  </TableCell>
                  <TableCell align="center">
                    {carrier.mc_number === "" || carrier.mc_number === "0"
                      ? "-"
                      : carrier.mc_number}
                  </TableCell>
                  <TableCell align="center">{carrier.street_address}</TableCell>
                  <TableCell align="center">{carrier.city}</TableCell>
                  <TableCell align="center">{carrier.state}</TableCell>
                  <TableCell align="center">{carrier.zip_code}</TableCell>

                  <TableCell align="center">
                    {carrier.phone_verified ? "true" : "false"}
                  </TableCell>
                  <TableCell align="center">
                    {carrier.email_verified ? "true" : "false"}
                  </TableCell>
                  {/* <TableCell align="center">{carrier.otp}</TableCell> */}
                  <TableCell align="center">
                    {carrier.trucks_in_operatiion}
                  </TableCell>
                  <TableCell align="center">
                    {carrier.arbitrationCounty}
                  </TableCell>
                  <TableCell align="center">
                    {carrier.arbitrationState}
                  </TableCell>
                  <TableCell align="center">
                    {carrier.years_in_business}
                  </TableCell>
                  <TableCell align="center">{carrier.created_at}</TableCell>
                  <TableCell align="center">{carrier.updated_at}</TableCell>
                </TableRow>
              )):(
                <Stack alignSelf={'center'} alignItems={'center'}>
                </Stack>
              )}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar
        open={isSnackBar}
        autoHideDuration={6000}
        onClose={handleClose}
        message={snackbarText}
        action={action}
      />
    </>
  );
};

export default LocalCarrierTable;