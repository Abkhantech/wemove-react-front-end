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
import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import usStates from "../utils/USA-states";
import { City, State } from "country-state-city";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { skipTrace } from "../../redux/actions/reapi";
import YesNoButtons from "../buttons/yesnoButtons";

const SkipTrace = () => {
  const dispatch = useDispatch();
  const importedStates = usStates;
  const [states, setStates] = useState<any>([]);
  const [cities, setCities] = useState<any>([]);

  const [formError, setFormError] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [consumerCity, setConsumerCity] = useState<any>(null);
  const [consumerState, setConsumerState] = useState<any>(null);
  const [selectedCity, setSelectedCity] = useState<any>(null);
  const [selectedState, setSelectedState] = useState<any>(null);
  const [streetAddress, setStreetAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [successMessage, setSuccessMessage] = useState("")
  const [additionalStops, setAdditionalStops] = useState([""]);
  const handleAddMore = () => {
    if (additionalStops[additionalStops.length - 1] !== "") {
      setAdditionalStops([...additionalStops, ""]);
    }
  };
  const handleZipCodeChange = (event: any) => {
    let inputValue = event.target.value.replace(/[^0-9]/g, "");
    const maxLength = 5;
    if (inputValue.length > maxLength) {
      inputValue = inputValue.substring(0, maxLength);
    }
    setZipCode(inputValue);
    event.target.value = inputValue;
  };
  const [errorMessage, setErrorMessage] = useState("")
  const [isAdditionalStops, setIsAdditionalStops] = useState(true);

  const handleFormSubmit = (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError("");
    setErrorMessage("")
    setSuccessMessage("")

    if (streetAddress && consumerState && consumerCity && zipCode) {
      const body = {
        address: streetAddress,
        city: consumerCity.name.toString(),
        state: consumerState.isoCode.toString(),
        zip: zipCode,
      };

      console.log("Form Body:", body);

      dispatch<any>(skipTrace(body))
        .then(unwrapResult)
        .then((response: any) => {
          setIsLoading(false);
          console.log("Response:", response);
          setSuccessMessage("Data fetched successfully. Please switch to Skip Trace Data Results Tab.")
        })
        .catch((err: any) => {
          setIsLoading(false);
          setFormError("Interal Server Error");
          setErrorMessage("Record not found.")
          console.log("API Error:", err);
        });
    } else {
      setFormError("Complete all fields");
      console.log("Form error");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setStates(State.getStatesOfCountry("US"));
  }, []);

  useEffect(() => {
    if (consumerState !== null) {
      setCities(City.getCitiesOfState("US", consumerState.isoCode));
      setSelectedCity(null);
    }
  }, [consumerState]);
  const handleChange = (index: any, value: any) => {
    const newStops = [...additionalStops];
    newStops[index] = value;
    setAdditionalStops(newStops);
  };
  useEffect(()=>{
    console.log(additionalStops)
  },[additionalStops])
  let fetchedCount = 0;
  const separateAddressAttributes = (e:any) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError("");
    setErrorMessage("")
    setSuccessMessage("")
    const addressObjects = additionalStops.map((address:any) => {
      const [addressPart, cityPart, stateZipPart] = address.split(',').map((part:any) => part.trim());
      const [state, zip] = stateZipPart.split(' ');
    
      return {
        address: address,
        city: cityPart,
        state,
        zip
      };
    });
    // console.log(addressObjects)
    if(addressObjects.length!==0){
      setIsLoading(true)
      addressObjects.map((obj:any)=>{
        dispatch<any>(skipTrace(obj))
        .then(unwrapResult)
        .then((response: any) => {
          setIsLoading(false);
          fetchedCount = fetchedCount +1;
          console.log("Response:", response);
          // setSuccessMessage("Data fetched successfully. Please switch to Skip Trace Data Results Tab.")
        })
        .catch((err: any) => {
          setIsLoading(false);
          // setFormError("Interal Server Error");
          // setErrorMessage("Record not found.")
          // console.log("API Error:", err);
        });
      })
      setIsLoading(false)
      setSuccessMessage("Data fetched successfully. Please switch to Skip Trace Data Results Tab.")
    }
  }
  return (
    <>
      <Grid container>
        <Grid item xs={12} sm={8} md={5} p={2} marginX={"auto"}>
          {/* {formError && (
            <Alert sx={{ mt: 1 }} severity="error">
              {formError}
            </Alert>
          )} */}
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
          <form onSubmit={separateAddressAttributes} autoComplete="off">
            <FormGroup>
              <FormControl fullWidth sx={{ mt: 2 }}>
              {/* <Typography
              mt={3}
              fontSize="14px"
              fontWeight={600}
              color={"#797979"}
            >
              Do you have any additional Stops?
            </Typography>
            <YesNoButtons
              isTrue={isAdditionalStops}
              setIsTrue={setIsAdditionalStops}
            /> */}
            {isAdditionalStops && (
              <>
                {additionalStops.map((stop, index) => (
                  <Box mt={3} key={index}>
                    <Typography
                      fontSize="14px"
                      fontWeight={600}
                      color="#797979"
                    >
                      {`Add Address ${index + 1}`}
                    </Typography>
                    <TextField
                      variant="outlined"
                      size="small"
                      fullWidth
                      placeholder="Address"
                      value={stop}
                      onChange={(event) =>
                        handleChange(index, event.target.value)
                      }
                      inputProps={{
                        style: {
                          background: "#5A7BFC14",
                          borderRadius: "8px",
                        },
                      }}
                      sx={{
                        marginTop: 1,
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "#5A7BFC59",
                            borderWidth: "1.43",
                            borderRadius: "8px",
                          },
                        },
                      }}
                    />
                  </Box>
                ))}
                <Box mt={3} display="flex" justifyContent="center">
                  <Button
                    size="medium"
                    onClick={handleAddMore}
                    sx={{
                      width: 90,
                      color: "#5858E0",
                      border: "1px solid #5858E0",
                      whiteSpace: "nowrap",
                      fontSize: 12,
                    }}
                  >
                    <Stack alignItems="center">
                      <AddIcon fontSize="small" />
                      Add More
                    </Stack>
                  </Button>
                </Box>
              </>
            )}
                {/* <TextField
                  label="Street Address"
                  variant="outlined"
                  type="text"
                  value={streetAddress}
                  fullWidth
                  margin="normal"
                  size="small"
                  onChange={(e) => {
                    setStreetAddress(e.target.value);
                  }}
                />

                <Stack
                  direction={"row"}
                  justifyContent={"space-between"}
                  mt={2}
                  spacing={1}
                >
                  <FormControl fullWidth size="small">
                    <InputLabel>
                      {consumerState ? consumerState.name : "State"}
                    </InputLabel>
                    <Select
                      label="States"
                      value={selectedState || ""}
                      onChange={(e) => {
                        setConsumerState(e.target.value);
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

                  {cities.length !== 0 ? (
                    <FormControl fullWidth size="small">
                      <InputLabel>
                        {consumerCity ? consumerCity.name : "City"}
                      </InputLabel>
                      <Select
                        label="Cities"
                        value={selectedCity || ""}
                        onChange={(e) => {
                          setConsumerCity(e.target.value);
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
                  ) : (
                    <TextField
                      label="City"
                      variant="outlined"
                      type="text"
                      value={consumerCity ? consumerCity : ""}
                      fullWidth
                      size="small"
                      onChange={(e) => {
                        setConsumerCity(e.target.value);
                      }}
                    />
                  )}
                </Stack>

                <TextField
                  label="Zip Code"
                  variant="outlined"
                  type="text"
                  value={zipCode}
                  fullWidth
                  margin="normal"
                  size="small"
                  onChange={(e) => {
                    handleZipCodeChange(e);
                  }}
                  inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                /> */}
                {/* {successMessage&&(
                <Typography fontWeight={600}
                fontSize={14} color={"#008000"} textAlign={'center'}>
                  {successMessage}
                </Typography>)} */}
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
                  {/* <Button
                    onClick={() => {
                      setIsLoading(true)
                    }}
                    sx={{ alignSelf: "flex-end" }}
                  >ABC</Button> */}
                </Stack>
              </FormControl>
            </FormGroup>
          </form>
        </Grid>
      </Grid>
    </>
  );
};

export default SkipTrace;
