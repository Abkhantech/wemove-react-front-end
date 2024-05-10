import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormGroup,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { City, State } from "country-state-city";
import { useEffect, useState } from "react";
import usStates from "../utils/USA-states";
import { useDispatch } from "react-redux";
import { MLS } from "../../redux/actions/reapi";
import { unwrapResult } from "@reduxjs/toolkit";

const notSeelectedButtonStyle = {
  width: 130,
  height: 40,
  color: "#5859DF",
  fontSize: 12,
  fontWeight: 550,
  border: "1px solid #6552FF",
};

const selectedButtonStyle = {
  width: 130,
  height: 40,
  backgroundColor: "#5858E0 !important",
  color: "#FDFCFD",
  fontSize: 12,
  fontWeight: 550,
  border: "1px solid #6552FF",
};

const Mls = () => {
  const dispatch = useDispatch();

  const importedStates = usStates;
  const [formError, setFormError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [cities, setCities] = useState<any>([]);
  const [states, setStates] = useState<any>([]);

  const [isMlsActive, setIsMlsActive] = useState(true);
  const [isMlsPending, setIsMlsPending] = useState(false);
  const [isMlsCity, setIsMlsCity] = useState(false);
  const [isMlsState, setIsMlsState] = useState(true);
  const [mlsCity, setMlsCity] = useState<any>(null);
  const [mlsState, setMlsState] = useState<any>(null);
  const [mlsListingPriceMin, setMlsListingPriceMin] = useState("");
  const [selectedCity, setSelectedCity] = useState<any>(null);
  const [numberOfRecords, setNumberOfRecords] = useState<any>("");
  const handleZipCodeChange = (event: any) => {
    let inputValue = event.target.value.replace(/[^0-9]/g, "");
    const maxLength = 20;
    if (inputValue.length > maxLength) {
      inputValue = inputValue.substring(0, maxLength);
    }
    setMlsListingPriceMin(inputValue);
    event.target.value = inputValue;
  };
  const [errorMessage, setErrorMessage] = useState("")
  const handleNumberOfRecords = (event: any) => {
    let inputValue = event.target.value.replace(/[^0-9]/g, "");
    const maxLength = 3;
    if (inputValue.length > maxLength) {
      inputValue = inputValue.substring(0, maxLength);
    }
    setNumberOfRecords(inputValue);
    event.target.value = inputValue;
  };
  const [successMessage, setSuccessMessage] = useState("")
  const [minBeds, setMinBeds] = useState("")
  const handleMinBeds = (event: any) => {
    let inputValue = event.target.value.replace(/[^0-9]/g, "");
    const maxLength = 1;
    if (inputValue.length > maxLength) {
      inputValue = inputValue.substring(0, maxLength);
    }
    setMinBeds(inputValue);
    event.target.value = inputValue;
  };

  const [resultIndex, setResultIndex] = useState("")
  const handleResultIndex = (event: any) => {
    let inputValue = event.target.value.replace(/[^0-9]/g, "");
    const maxLength = 4;
    if (inputValue.length > maxLength) {
      inputValue = inputValue.substring(0, maxLength);
    }
    setResultIndex(inputValue);
    event.target.value = inputValue;
  };
  const handleFormSubmit = (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError("");
    setErrorMessage("")
    setSuccessMessage("")

    const body: any = {};

    if (isMlsActive) {
      body.mls_active = isMlsActive;
    } else {
      body.mls_pending = isMlsPending;
    }

    if (mlsState) {
      body.state = mlsState.name.toString();
    }

    if (mlsCity) {
      body.city = mlsCity.name.toString();
    }

    if (mlsListingPriceMin.trim() !== "") {
      body.mls_listing_min = parseInt(mlsListingPriceMin);
    }
    if(minBeds!==""){
      body.beds_min = Number(minBeds)
    }
    if(resultIndex!==""){
      body.result_index = Number(resultIndex)
    }
    body.no_of_records = Number(numberOfRecords)
    console.log("Body:", body);
    if(mlsState!==null){
      dispatch<any>(MLS(body))
        .then(unwrapResult)
        .then((response: any) => {
          console.log("Response:", response);
          setIsLoading(false);
          if(response===true){
            setSuccessMessage("Data fetched successfully. Please switch to MLS Data Results Tab.")
          }else{
            setErrorMessage("Could not find records")
          }
        })
        .catch((err: any) => {
          setIsLoading(false);
          setFormError("Interal Server Error");
          setErrorMessage("Could not find records")
          console.log("API Error:", err);
        });
    }else{
      setFormError("Please select the state")
    }
  };

  useEffect(() => {
    if (mlsState !== null) {
      setCities(City.getCitiesOfState("US", mlsState.isoCode));
      setMlsCity(null);
    }
  }, [mlsState]);

  useEffect(() => {
    setStates(State.getStatesOfCountry("US"));
  }, []);

  return (
    <>
      <Grid container>
        <Grid item xs={12} sm={8} md={5} p={2} marginX={"auto"}>
          {errorMessage && (
            <Alert sx={{ mt: 1 }} severity="error">
              {errorMessage}
            </Alert>
          )}
          {successMessage && (
            <Alert sx={{ mt: 1 }} severity="success">
              {successMessage}
            </Alert>
          )}
          <form onSubmit={handleFormSubmit} autoComplete="off">
            <FormGroup>
              <FormControl fullWidth sx={{ mt: 2 }}>
                <Stack
                  direction="row"
                  mt={2}
                  spacing={2}
                  justifyContent={"center"}
                >
                  <Button
                    size="large"
                    sx={
                      isMlsActive
                        ? selectedButtonStyle
                        : notSeelectedButtonStyle
                    }
                    onClick={() => {
                      setIsMlsActive(true);
                      setIsMlsPending(false);
                    }}
                  >
                    MLS Active
                  </Button>
                  <Button
                    size="large"
                    onClick={() => {
                      setIsMlsPending(true);
                      setIsMlsActive(false);
                    }}
                    sx={
                      isMlsPending
                        ? selectedButtonStyle
                        : notSeelectedButtonStyle
                    }
                  >
                    MLS Pending
                  </Button>
                </Stack>

                <Typography
                  mt={2}
                  fontSize={14}
                  fontWeight={600}
                  textAlign={"center"}
                >
                  Search by:
                </Typography>
                <Stack
                  direction="row"
                  mt={1}
                  spacing={2}
                  justifyContent={"center"}
                >
                  <Button
                    size="large"
                    sx={
                      isMlsState ? selectedButtonStyle : notSeelectedButtonStyle
                    }
                    onClick={() => {
                      setIsMlsState(true);
                      setIsMlsCity(false);
                      setMlsCity(null);
                    }}
                  >
                    State
                  </Button>
                  <Button
                    size="large"
                    onClick={() => {
                      setIsMlsCity(true);
                      setIsMlsState(false);
                    }}
                    sx={
                      isMlsCity ? selectedButtonStyle : notSeelectedButtonStyle
                    }
                  >
                    City
                  </Button>
                </Stack>

                {states.length !== 0 && (
                  <FormControl fullWidth sx={{ mt: 2 }} size="small">
                    <InputLabel>
                      {mlsState ? mlsState.name : "State"}
                    </InputLabel>
                    <Select
                      label="States"
                      value={""}
                      onChange={(e) => {
                        setMlsState(e.target.value);
                      }}
                    >
                      {states &&
                        states.map((thisState: any) => {
                          if (importedStates.includes(thisState.name)) {
                            return (
                              <MenuItem key={thisState.name} value={thisState}>
                                {thisState.name}
                              </MenuItem>
                            );
                          }
                        })}
                    </Select>
                  </FormControl>
                )}

                {cities.length !== 0 && isMlsCity && (
                  <FormControl sx={{ minWidth: 150, mt: 2 }} size="small">
                    <InputLabel id="demo-select-small-label">
                      {mlsCity ? mlsCity.name : "City"}
                    </InputLabel>
                    <Select
                      labelId="demo-select-small-label"
                      id="demo-select-small"
                      value={""}
                      label="Cities"
                      onChange={(e) => {
                        setMlsCity(e.target.value);
                      }}
                    >
                      {cities &&
                        cities.map((thisCity: any) => {
                          return (
                            <MenuItem key={thisCity.name} value={thisCity}>
                              {thisCity.name}
                            </MenuItem>
                          );
                        })}
                    </Select>
                  </FormControl>
                )}

                <Typography mt={2} mb={1} fontSize={14} fontWeight={500}>
                  (Optional)
                </Typography>
                <TextField
                  label="MLS Listing Price Minimum"
                  variant="outlined"
                  type="text"
                  value={mlsListingPriceMin}
                  fullWidth
                  size="small"
                  onChange={(e) => {
                    handleZipCodeChange(e);
                  }}
                  inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                />
                <Typography mt={2} mb={1} fontSize={14} fontWeight={500}>
                  Minimum Number of Bedrooms
                </Typography>
                <TextField
                  label="Number of Minimum Bedrooms"
                  variant="outlined"
                  type="text"
                  value={minBeds}
                  fullWidth
                  size="small"
                  onChange={(e) => {
                    handleMinBeds(e)
                  }}
                  inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                />
                <Typography mt={2} mb={1} fontSize={14} fontWeight={500}>
                  Number of Records to Fetch
                </Typography>
                <TextField
                  label="Number of Records"
                  variant="outlined"
                  type="text"
                  required
                  value={numberOfRecords}
                  fullWidth
                  size="small"
                  onChange={(e) => {
                    handleNumberOfRecords(e);
                  }}
                  inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                />
                <Typography mt={2} mb={1} fontSize={14} fontWeight={500}>
                Number of Recrods Already fetched with above criteria
                </Typography>
                <TextField
                  label="Number of records already fetched"
                  variant="outlined"
                  type="text"
                  value={resultIndex}
                  fullWidth
                  size="small"
                  onChange={(e) => {
                    handleResultIndex(e);
                  }}
                  inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                />
              {/* {successMessage&&(
                <Typography fontWeight={600}
                fontSize={14} color={"#008000"} textAlign={'center'}>
                  {successMessage}
                </Typography>
              )} */}
              {/* {errorMessage&&(
                <Typography fontWeight={600}
                fontSize={14} color={"#FF0000"} textAlign={'center'}>
                  {errorMessage}
                </Typography>
              )} */}
                <Stack>
                  {isLoading ? (
                    <Box marginX={"auto"}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <Button
                      variant="contained"
                      type="submit"
                      sx={{
                        marginTop: 2,
                        height: 50,
                        backgroundColor: "#5858E0",
                        color: "#FFFFFF",
                        borderColor: "#6552FF",
                        fontSize: 12,
                        fontWeight: 550,
                      }}
                    >
                      Submit
                    </Button>
                  )}
                </Stack>
              </FormControl>
            </FormGroup>
          </form>
        </Grid>
      </Grid>
    </>
  );
};

export default Mls;
