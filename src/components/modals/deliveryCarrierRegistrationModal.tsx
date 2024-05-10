import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { State, City } from "country-state-city";
import { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  styled,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import progress1Icon from "../../assets/Icons/Group 1171274813.svg";
import progress3Icon from "../../assets/Icons/Progress3.svg";
import progress4Icon from "../../assets/Icons/Progress4.svg";
import { unwrapResult } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import {
  checkIfDeliveryCarrierExists,
  registerDeliveryCarrier,
} from "../../redux/actions/delivery-carrier";
import VerifyOtpModal from "./verifyOtpModal";
import InfoLostAlertModal from "./infoLostAlertModal";
import usStates from "../utils/USA-states";
const StyledFileInput = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#5A7BFC59",
      borderWidth: "1",
      borderRadius: "8px",
    },
  },
  "& input": {
    color: "#71717A",
    background: "#5A7BFC14",
    borderRadius: "8px",
  },
}));

const notSeelectedButtonStyle = {
  width: 90,
  height: 40,
  color: "#5859DF",
  fontSize: 12,
  fontWeight: 550,
  border: "1px solid #6552FF",
};

const selectedButtonStyle = {
  width: 90,
  height: 40,
  backgroundColor: "#5858E0 !important",
  color: "#FDFCFD",
  fontSize: 12,
  fontWeight: 550,
  border: "1px solid #6552FF",
};

const DeliveryCarrierRegistrationModal = ({
  deliveryCarrierRegistrationModalVisible,
  setDeliveryCarrierRegistrationModalVisible,
  handleCompleteRegistrationDeliverypCarrier,
  setIsVerifyOtpModal,
  isVerifyOtpModal,
  setSuccess,
  success,
  isLoading,
  setIsLoading,
  setOnboardingSuccessModalVisible,
}: any) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.only("xs"));
  const importedStates = usStates;
  const handleInputAlertModal = () =>
    setDeliveryCarrierRegistrationModalVisible(true);
  const [infoLostAlertModalVisible, setInfoLostAlertModalVisible] =
    useState(false);
  const handleClose = () => {
    setInfoLostAlertModalVisible(true);
    // setDeliveryCarrierRegistrationModalVisible(false)
  };

  const handleInputPhoneNumber = (event: any, setPhoneNumber: any) => {
    let inputValue = event.target.value.replace(/[^0-9]/g, "");
    const maxLength = 10;
    if (inputValue.length > maxLength) {
      inputValue = inputValue.substring(0, maxLength);
    }
    setPhoneNumber(inputValue);
    event.target.value = inputValue;
  };

  const handleZipCodeInput = (event: any) => {
    let inputValue = event.target.value.replace(/[^0-9]/g, "");
    const maxLength = 5;
    if (inputValue.length > maxLength) {
      inputValue = inputValue.substring(0, maxLength);
    }
    setCompanyZipCode(inputValue);
    event.target.value = inputValue;
  };

  const [step, setStep] = useState(1);
  const [companyName, setCompanyName] = useState("");
  const [doingBusinessAsName, setDoingBusinessAsName] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyPhoneNumber, setCompanyPhoneNumber] = useState("");
  const [companyState, setCompanyState] = useState<any>(null);
  const [companyCity, setCompanyCity] = useState<any>(null);
  const [companyZipCode, setCompanyZipCode] = useState("");
  const [dotNumber, setDotNumber] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [mcNumber, setMcNumber] = useState("");
  const [ownerDriverLicense, setOwnerDriverLicense] = useState<any>(null);
  const [movingCompanyOfficialLicense, setMovingCompanyOfficialLicense] =
    useState<any>(null);
  const [ownerName, setOwnerName] = useState("");
  const [ownerLastName, setOwnerLastName] = useState("");
  const [ownerPhoneNumber, setOwnerPhoneNumber] = useState("");
  const [states, setStates] = useState<any>([]);
  const [cities, setCities] = useState<any>([]);
  const [selectedState, setSelectedState] = useState<any>(null);
  const [selectedCity, setSelectedCity] = useState<any>(null);
  const [haveTrailers, setHaveTrailers] = useState(false);
  const [numberOfDrivers, setNumberOfDrivers] = useState<any>(null);
  const [pointOfContactName, setPointOfContactName] = useState("");
  const [pointOfContactPhoneNumber, setPointOfContactPhoneNumber] =
    useState("");
  const [agreedToTermsAndConditions, setAgreedToTermsAndConditions] =
    useState(false);
  const [numberOfTrailers, setNumberOfTrailers] = useState<any>(0);
  const [insuranceCompanyName, setInsuranceCompanyName] = useState("");
  const [insuranceCompanyPhoneNumber, setInsuranceCompanyPhoneNumber] =
    useState("");
  const [HHGLicense, setHHGLicense] = useState(false);
  const [insuranceDocument, setInsuranceDocument] = useState<any>(null);
  let USAstates: any[] = [];
  const [operatingStates, setOperatingStates] = useState<any>([]);
  const [isInfoMissing, setIsInfoMissing] = useState(false);
  const [role, setRole] = useState("delivery");
  const [emailError, setEmailError] = useState("");

  const validateEmail = (email: any) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email || !emailRegex.test(email)) {
      setEmailError("Invalid Email");
      return false;
    } else {
      setEmailError("");
      return true;
    }
  };
  const [fieldError, setFieldError] = useState("");
  const handleStepOne = () => {
    if (companyName === "") {
      setFieldError("Please enter the Company Name.");
    } else {
      if (companyAddress === "") {
        setFieldError("Please enter the Company Address.");
      } else {
        if (companyPhoneNumber.length !== 10) {
          setFieldError(
            "Please enter at least 10-digits for Company Phone Number."
          );
        } else {
          if (!validateEmail(companyEmail)) {
            setFieldError("Please enter a valid Company email.");
          } else {
            if (companyState === null) {
              setFieldError("Please select the Company State.");
            } else {
              if (companyCity === null) {
                setFieldError("Please select or enter the Company City.");
              } else {
                if (companyZipCode.length !== 5) {
                  setFieldError(
                    "Please enter at least 5-digits for Company Phone Zip Code."
                  );
                } else {
                  checkIfAccountExists();
                  // setStep(2);
                }
              }
            }
          }
        }
      }
    }
  };

  const handleStepTwo = () => {
    if (ownerDriverLicense === null) {
      setFieldError(
        "Please upload Owner Drivers license document in PDF format."
      );
    } else {
      if (ownerDriverLicense.type !== "application/pdf") {
        setFieldError(
          "Please select a PDF file for Owner Drivers License document."
        );
      } else {
        if (ownerDriverLicense.size > 5000000) {
          setFieldError("Please select Drivers License PDF file under 5 MB.");
        } else {
          if (ownerName === "") {
            setFieldError("Please enter the Owner's First Name.");
          } else {
            if (ownerLastName === "") {
              setFieldError("Please enter the Owner's Last Name.");
            } else {
              if (ownerPhoneNumber.length !== 10) {
                setFieldError(
                  "Please enter at least 10-digit Owner Phone Number."
                );
              } else {
                checkIfAccountExists();
                // setStep(3);
              }
            }
          }
        }
      }
    }
  };
  const handleInputDOTandMCnumber = (event: any, setNumber: any) => {
    let inputValue = event.target.value.replace(/[^0-9]/g, "");
    const maxLength = 7;
    if (inputValue.length > maxLength) {
      inputValue = inputValue.substring(0, maxLength);
    }
    setNumber(inputValue);
    event.target.value = inputValue;
  };

  const handleStepThree = () => {
    if (pointOfContactName === "") {
      setFieldError("Please enter the primary point of contact name.");
    } else {
      if (
        numberOfDrivers === null ||
        numberOfDrivers < 0 ||
        numberOfDrivers === ""
      ) {
        setFieldError("Please enter valid number of drivers.");
      } else {
        if (insuranceCompanyName === "") {
          setFieldError("Please enter your Insurance Company's Name.");
        } else {
          if (insuranceCompanyPhoneNumber.length !== 10) {
            setFieldError(
              "Please enter at least 10-digit Insurance Company's Phone Number."
            );
          } else {
            if (insuranceDocument === null) {
              setFieldError(
                "Please upload Proof of Insurance document in PDF format."
              );
            } else {
              if (insuranceDocument.type !== "application/pdf") {
                setFieldError(
                  "Please select a PDF file for Insurance document."
                );
              } else {
                if (insuranceDocument.size > 5000000) {
                  setFieldError(
                    "Please select Insurance document PDF file under 5 MB."
                  );
                } else {
                  if (agreedToTermsAndConditions === false) {
                    setFieldError(
                      "Please acknowledge that you agree to the terms and conditions of WeMove."
                    );
                  } else {
                    createDeliveryCarrier();
                  }
                }
              }
            }
          }
        }
      }
    }
  };
  useEffect(() => {
    setStates(State.getStatesOfCountry("US"));
  }, []);

  useEffect(() => {
    if (companyState !== null) {
      setCities(City.getCitiesOfState("US", companyState.isoCode));
    }
  }, [companyState]);

  useEffect(() => {
    console.log(operatingStates, "-------->>>>>");
  }, [operatingStates]);
  const handleInputOperationalState = (state: any) => {
    if (operatingStates.includes(state)) {
      console.log("state already added");
    } else {
      setOperatingStates([...operatingStates, state]);
      console.log("state added");
    }
  };

  const [loading, setLoading] = useState(false);
  const handleFileChange = (event: any, setFile: any) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setFile(file);
    } else {
      setFieldError("Please select a PDF file");
    }
    console.log("Selected file:", file);
  };
  const [waitingMessage, setWaitingMessage] = useState("");

  const dispatch = useDispatch();
  const checkIfAccountExists = () => {
    setIsLoading(true);
    const body = {
      phoneNumber: "+1" + ownerPhoneNumber,
      ownerOfficePhone: "+1" + companyPhoneNumber,
      email: companyEmail,
    };
    dispatch<any>(checkIfDeliveryCarrierExists(body))
      .then(unwrapResult)
      .then((res: any) => {
        setIsLoading(false);
        console.log(res);
        if (res === true) {
          if (step === 1) {
            setFieldError(
              "Account with this Company Phone Number or Email already exists."
            );
          }
          if (step === 2) {
            setFieldError(
              "Account with this Owner Phone Number already exists."
            );
          }
        } else {
          if (step === 1) {
            setStep(2);
          }
          if (step === 2) {
            setStep(3);
          }
        }
      })
      .catch((err: any) => {
        setIsLoading(false);
        console.log(err);
      });
  };
  const createDeliveryCarrier = () => {
    setWaitingMessage("Onboarding you as a Delivery Carrier. Please wait...");
    // setLoading(true)
    const body = {
      company_name: companyName,
      doing_business_as_name:
        doingBusinessAsName !== "" ? doingBusinessAsName : companyName,
      // company_license: "",
      street_address: companyAddress,
      city:
        cities.length !== 0
          ? companyCity.name.toString()
          : companyCity.toString(),
      state: companyState.name.toString(),
      zip_code: companyZipCode,
      dot_number: dotNumber.toString(),
      mc_number: mcNumber.toString(),
      hhg_license: HHGLicense,
      owner_name: ownerName + " " + ownerLastName,
      both: false,
      owner_driver_license: ownerDriverLicense,
      primary_contact: pointOfContactName,
      owner_phone_number: "+1" + ownerPhoneNumber,
      company_email: companyEmail,
      company_phone_number: "+1" + companyPhoneNumber,
      count_of_53_foot_trailers: Number(numberOfTrailers),
      count_of_drivers: Number(numberOfDrivers),
      insurances: [
        {
          insurance_company: insuranceCompanyName,
          phone_number: "+1" + insuranceCompanyPhoneNumber,
        },
      ],
      insurance_document: insuranceDocument,
    };
    handleCompleteRegistrationDeliverypCarrier(body);
  };
  return (
    <>
      <Modal
        open={deliveryCarrierRegistrationModalVisible}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute" as "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: isMobile ? "90vw" : "75vw",
            height: isMobile ? "90vh" : undefined,
            overflow: "auto",
            bgcolor: "background.paper",
            borderRadius: "8px",
            boxShadow: 24,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              backgroundColor: "#08123B",
              width: 150,
              height: 40,
              borderTopRightRadius: 20,
              borderBottomRightRadius: 20,
            }}
          >
            <Typography fontSize={14} color={"#FFFFFF"}>
              Delivery Carrier
            </Typography>
          </Box>
          {infoLostAlertModalVisible && (
            <InfoLostAlertModal
              infoLostAlertModalVisible={infoLostAlertModalVisible}
              setInfoLostAlertModalVisible={setInfoLostAlertModalVisible}
              setAnyModal={setDeliveryCarrierRegistrationModalVisible}
            />
          )}
          {isLoading && (
            <Backdrop
              sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={isLoading}
              onClick={() => {
                setIsLoading(true);
              }}
            >
              <Stack
                spacing={2}
                alignItems={"center"}
                justifyContent={"center"}
              >
                {waitingMessage && (
                  <Stack
                    justifyContent={"center"}
                    sx={{
                      padding: 1,
                      backgroundColor: "#5858E0",
                      borderRadius: isMobile ? 8 : 16,
                    }}
                    alignItems={"center"}
                  >
                    <Typography
                      textAlign={isMobile ? "center" : "start"}
                      fontWeight={600}
                      color={"#FFFFFF"}
                    >
                      {waitingMessage}
                    </Typography>
                  </Stack>
                )}
                <CircularProgress color="inherit" />
              </Stack>
            </Backdrop>
          )}
          {loading && (
            <Stack alignItems={"center"} alignSelf={"center"}>
              <CircularProgress />
            </Stack>
          )}
          {isVerifyOtpModal && (
            <VerifyOtpModal
              setOnboardingSuccessModalVisible={
                setOnboardingSuccessModalVisible
              }
              isVerifyOtpModal={isVerifyOtpModal}
              setIsVerifyOtpModal={setIsVerifyOtpModal}
              role={role}
              carrierPhoneNumber={"+1" + ownerPhoneNumber}
              setParentModal={setDeliveryCarrierRegistrationModalVisible}
            />
          )}
          {success && (
            <Alert severity="success">You have successfully registered!</Alert>
          )}
          {fieldError && <Alert severity="error">{fieldError}</Alert>}

          {/* form1 */}
          {/* <Box marginTop={3} display={"flex"} justifyContent={"center"}>
            <img width={isMobile ? 250 : 570} src={progress1Icon} alt="" />
          </Box> */}

          {step === 1 && (
            <>
              <Box marginTop={3} display={"flex"} justifyContent={"center"}>
                <img width={isMobile ? 250 : 570} src={progress1Icon} alt="" />
              </Box>
              <Box component="form" p={3}>
                <Typography fontWeight={600} fontSize={16}>
                  COMPANY INFO
                </Typography>

                <Stack
                  mt={2}
                  spacing={2}
                  direction={isMobile ? "column" : "row"}
                >
                  <TextField
                    variant="outlined"
                    type="text"
                    label="Legal Name"
                    sx={{ width: 220 }}
                    size="small"
                    required
                    value={companyName}
                    onChange={(e) => {
                      setCompanyName(e.target.value);
                      setFieldError("");
                    }}
                  />
                  <TextField
                    variant="outlined"
                    type="text"
                    label="DBA Name (optional)"
                    sx={{ width: 220 }}
                    size="small"
                    value={doingBusinessAsName}
                    onChange={(e) => {
                      setDoingBusinessAsName(e.target.value);
                      setFieldError("");
                    }}
                  />

                  <TextField
                    variant="outlined"
                    type="text"
                    label="Street Address"
                    sx={{ width: 240 }}
                    size="small"
                    required
                    value={companyAddress}
                    onChange={(e) => {
                      setCompanyAddress(e.target.value);
                      setFieldError("");
                    }}
                  />

                  <TextField
                    label="Phone Number"
                    variant="outlined"
                    onChange={(event) => {
                      handleInputPhoneNumber(event, setCompanyPhoneNumber);
                      setFieldError("");
                    }}
                    type="text"
                    inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                    sx={{ width: 220 }}
                    size="small"
                    required
                    value={companyPhoneNumber}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">+1</InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    variant="outlined"
                    type="email"
                    label="Company Email"
                    sx={{ width: 240 }}
                    size="small"
                    required
                    value={companyEmail}
                    error={Boolean(emailError)}
                    helperText={emailError}
                    onChange={(e) => {
                      setCompanyEmail(e.target.value);
                      setFieldError("");
                    }}
                  />
                </Stack>

                <Typography fontWeight={600} mt={3} fontSize={16}>
                  ENTER LOCATION
                </Typography>
                <Stack
                  mt={1}
                  justifyContent={isMobile ? "center" : "space-between"}
                  alignItems={isMobile ? "flex-start" : "center"}
                  spacing={isMobile ? 2 : 0}
                  direction={isMobile ? "column" : "row"}
                >
                  <FormControl sx={{ minWidth: 150 }} size="small">
                    <InputLabel id="demo-select-small-label">
                      {companyState ? companyState.name : "State"}
                    </InputLabel>
                    <Select
                      labelId="demo-select-small-label"
                      id="demo-select-small"
                      value={selectedState || ""}
                      label="States"
                      onChange={(e) => {
                        setCompanyState(e.target.value);
                        setFieldError("");
                      }}
                      required
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
                    <FormControl sx={{ minWidth: 150 }} size="small">
                      <InputLabel id="demo-select-small-label">
                        {companyCity ? companyCity.name : "City"}
                      </InputLabel>
                      <Select
                        labelId="demo-select-small-label"
                        id="demo-select-small"
                        value={selectedCity || ""}
                        label="Cities"
                        onChange={(e) => {
                          setCompanyCity(e.target.value);
                          setFieldError("");
                        }}
                        required
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
                      variant="outlined"
                      type="text"
                      label="City"
                      value={companyCity ? companyCity : ""}
                      onChange={(e) => {
                        setCompanyCity(e.target.value);
                        setFieldError("");
                      }}
                      sx={{ width: 150 }}
                      size="small"
                      required
                    />
                  )}

                  <TextField
                    variant="outlined"
                    type="text"
                    label="Zip Code"
                    // onInput={handleZipCodeInput}
                    onChange={(e) => {
                      handleZipCodeInput(e);
                      setFieldError("");
                    }}
                    value={companyZipCode}
                    inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                    sx={{ width: 150 }}
                    size="small"
                    required
                  />
                </Stack>

                <Stack
                  width={"90%"}
                  spacing={isMobile ? 1 : 10}
                  alignItems={isMobile ? "flex-start" : "center"}
                  direction={isMobile ? "column" : "row"}
                  mt={3}
                >
                  <TextField
                    label="DOT Number"
                    variant="outlined"
                    type="text"
                    sx={{ width: 220 }}
                    size="small"
                    required
                    inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                    value={dotNumber ? dotNumber : ""}
                    onChange={(event) => {
                      handleInputDOTandMCnumber(event, setDotNumber);
                      setFieldError("");
                    }}
                  />

                  <TextField
                    label="MC Number"
                    variant="outlined"
                    type="text"
                    sx={{ width: 220 }}
                    size="small"
                    inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                    required
                    value={mcNumber ? mcNumber : ""}
                    onChange={(event) => {
                      handleInputDOTandMCnumber(event, setMcNumber);
                      setFieldError("");
                    }}
                  />
                </Stack>

                <Box mt={3} display={"flex"} justifyContent={"end"}>
                  <Button
                    variant="contained"
                    sx={{
                      width: 200,
                      borderColor: "#5858E0",
                      bgcolor: "#5858E0",
                      color: "#FFFFFF",
                    }}
                    onClick={() => {
                      handleStepOne();
                    }}
                  >
                    Next →
                  </Button>
                </Box>
              </Box>
            </>
          )}

          {step === 2 && (
            <>
              <Button
                onClick={() => {
                  setStep(1);
                }}
                sx={{ marginTop: 1, marginLeft: 1 }}
              >
                <ArrowBackIcon sx={{ color: "#5858E0" }} fontSize="large" />
              </Button>
              <Box marginTop={1} display={"flex"} justifyContent={"center"}>
                <img width={isMobile ? 250 : 570} src={progress3Icon} alt="" />
              </Box>
              <Box component="form" p={3}>
                <Typography color={"#FF0000"} fontWeight={500} fontSize={14}>
                  If your files are larger than 5 MB please contact us at
                  carrier@wemove.ai
                </Typography>
                <Typography fontWeight={600} fontSize={16}>
                  Upload Owner Drivers License Document in PDF format. (5 MB
                  maximum file size)
                </Typography>

                <StyledFileInput
                  // label="Upload PDF"
                  type="file"
                  variant="outlined"
                  size="small"
                  required
                  inputProps={{
                    accept: "application/pdf",
                  }}
                  onChange={(event) => {
                    handleFileChange(event, setOwnerDriverLicense);
                    setFieldError("");
                  }}
                />

                {/* <Typography mt={2} fontWeight={600} fontSize={16}>
                  Upload Company Tariff Document in PDF format.
                </Typography>

                <StyledFileInput
                  type="file"
                  variant="outlined"
                  size="small"
                  required
                  inputProps={{
                    accept: "application/pdf",
                  }}
                  onChange={(event) => {
                    handleFileChange(event, setMovingCompanyOfficialLicense);
                    setFieldError("");
                  }}
                /> */}

                <Typography mt={2} fontWeight={600} fontSize={16}>
                  Owner Info
                </Typography>

                <Stack
                  mt={1}
                  spacing={2}
                  direction={isMobile ? "column" : "row"}
                >
                  <Stack direction={"row"} spacing={1}>
                    <TextField
                      variant="outlined"
                      type="text"
                      label="First Name"
                      sx={{ width: 160 }}
                      size="small"
                      required
                      value={ownerName}
                      onChange={(e) => {
                        setOwnerName(e.target.value);
                        setFieldError("");
                      }}
                    />
                    <TextField
                      variant="outlined"
                      type="text"
                      label="Last Name"
                      sx={{ width: 160 }}
                      size="small"
                      required
                      value={ownerLastName}
                      onChange={(e) => {
                        setOwnerLastName(e.target.value);
                        setFieldError("");
                      }}
                    />
                  </Stack>

                  {/* <TextField
                    variant="outlined"
                    type="email"
                    label="Owner contact email"
                    sx={{ width: 220 }}
                    size="small"
                    required
                    onChange={(e) => setOwnerEmail(e.target.value)}
                  /> */}

                  <TextField
                    label="Owner Phone Number"
                    variant="outlined"
                    onChange={(event) => {
                      handleInputPhoneNumber(event, setOwnerPhoneNumber);
                      setFieldError("");
                    }}
                    type="text"
                    inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                    sx={{ width: 220 }}
                    size="small"
                    required
                    value={ownerPhoneNumber}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">+1</InputAdornment>
                      ),
                    }}
                  />
                </Stack>

                <Box display={isMobile ? "block" : "flex"}>
                  <Stack>
                    <Typography mt={2} fontWeight={600} fontSize={16}>
                      Do you have 53 foot trailers?
                    </Typography>

                    <Typography
                      fontWeight={400}
                      fontSize={14}
                      sx={{ fontStyle: "italic" }}
                    >
                      Choose one
                    </Typography>

                    <Stack mt={1} direction="row" spacing={1}>
                      <Button
                        sx={
                          !haveTrailers
                            ? selectedButtonStyle
                            : notSeelectedButtonStyle
                        }
                        onClick={() => {
                          setHaveTrailers(false);
                        }}
                      >
                        No
                      </Button>
                      <Button
                        onClick={() => {
                          setHaveTrailers(true);
                        }}
                        sx={
                          haveTrailers
                            ? selectedButtonStyle
                            : notSeelectedButtonStyle
                        }
                      >
                        Yes
                      </Button>
                    </Stack>
                  </Stack>

                  {haveTrailers && (
                    <Stack marginLeft={isMobile ? 0 : 4}>
                      <Typography mt={2} fontWeight={600} fontSize={16}>
                        IF Yes - How many?
                      </Typography>

                      <TextField
                        // label="Phone Number"
                        variant="outlined"
                        type="number"
                        size="small"
                        value={numberOfTrailers ? numberOfTrailers : ""}
                        sx={{ width: 220, mt: isMobile ? 1 : 3.5 }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">#</InputAdornment>
                          ),
                        }}
                        onChange={(e) =>
                          setNumberOfTrailers(Number(e.target.value))
                        }
                        required
                      />
                    </Stack>
                  )}
                  <Stack marginLeft={4}>
                    <Typography mt={2} fontWeight={600} fontSize={16}>
                      Do you have HHG License?
                    </Typography>

                    <Typography
                      fontWeight={400}
                      fontSize={14}
                      sx={{ fontStyle: "italic" }}
                    >
                      Choose one
                    </Typography>

                    <Stack mt={1} direction="row" spacing={1}>
                      <Button
                        sx={
                          !HHGLicense
                            ? selectedButtonStyle
                            : notSeelectedButtonStyle
                        }
                        onClick={() => {
                          setHHGLicense(false);
                        }}
                      >
                        No
                      </Button>
                      <Button
                        onClick={() => {
                          setHHGLicense(true);
                        }}
                        sx={
                          HHGLicense
                            ? selectedButtonStyle
                            : notSeelectedButtonStyle
                        }
                      >
                        Yes
                      </Button>
                    </Stack>
                  </Stack>
                </Box>

                <Box mt={3} display={"flex"} justifyContent={"end"}>
                  <Button
                    variant="contained"
                    sx={{
                      width: 200,
                      borderColor: "#5858E0",
                      bgcolor: "#5858E0",
                      color: "#FFFFFF",
                    }}
                    onClick={() => {
                      handleStepTwo();
                    }}
                  >
                    Next →
                  </Button>
                </Box>
              </Box>
            </>
          )}

          {step === 3 && (
            <>
              <Button
                onClick={() => {
                  setStep(2);
                }}
                sx={{ marginTop: 1, marginLeft: 1 }}
              >
                <ArrowBackIcon sx={{ color: "#5858E0" }} fontSize="large" />
              </Button>
              <Box marginTop={1} display={"flex"} justifyContent={"center"}>
                <img width={isMobile ? 250 : 570} src={progress4Icon} alt="" />
              </Box>
              <Box component="form" p={3}>
                <Typography fontWeight={600} mt={3} fontSize={16}>
                  Delivery Info
                </Typography>
                <Stack
                  spacing={isMobile ? 1 : 10}
                  alignItems={isMobile ? "flex-start" : "center"}
                  direction={isMobile ? "column" : "row"}
                  mt={3}
                >
                  <TextField
                    variant="outlined"
                    type="text"
                    label="Point of Contact PRIMARY (Owner)"
                    sx={{ width: 240 }}
                    size="small"
                    value={pointOfContactName}
                    onChange={(e) => {
                      setPointOfContactName(e.target.value);
                      setFieldError("");
                    }}
                    required
                  />
                  {/* <Stack paddingBottom={4} spacing={1}>

                  <Typography fontSize={12}>
            If not added, owner phone number will be set by default.
                  </Typography>
                  <TextField
                    label="Main Phone Number"
                    variant="outlined"
                    type="text"
                    onChange={(e) =>{
                      handleInputPhoneNumber(e, setPointOfContactPhoneNumber);setFieldError("")
                    }}
                    inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                    sx={{ width: 220 }}
                    size="small"
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">+1</InputAdornment>
                        ),
                      }}
                      />
                      </Stack> */}
                </Stack>

                <Stack
                  spacing={isMobile ? 1 : 10}
                  alignItems={isMobile ? "flex-start" : "center"}
                  direction={isMobile ? "column" : "row"}
                  mt={3}
                  mb={2}
                >
                  <TextField
                    label="Number of drivers?"
                    variant="outlined"
                    type="number"
                    sx={{ width: 220 }}
                    size="small"
                    required
                    value={numberOfDrivers ? numberOfDrivers : ""}
                    onChange={(event) => {
                      setNumberOfDrivers(parseInt(event.target.value));
                      setFieldError("");
                    }}
                  />
                </Stack>
                <Stack
                  mt={3}
                  spacing={2}
                  direction={isMobile ? "column" : "row"}
                >
                  <TextField
                    variant="outlined"
                    type="text"
                    label="Insurance Company Name"
                    sx={{ width: 240 }}
                    size="small"
                    required
                    value={insuranceCompanyName}
                    onChange={(e) => {
                      setInsuranceCompanyName(e.target.value);
                      setFieldError("");
                    }}
                  />

                  <TextField
                    label="Phone of Insurance Company"
                    variant="outlined"
                    onChange={(event) => {
                      handleInputPhoneNumber(
                        event,
                        setInsuranceCompanyPhoneNumber
                      );
                      setFieldError("");
                    }}
                    type="text"
                    inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                    sx={{ width: 220 }}
                    size="small"
                    required
                    value={insuranceCompanyPhoneNumber}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">+1</InputAdornment>
                      ),
                    }}
                  />
                </Stack>
                <Typography
                  mt={2}
                  color={"#FF0000"}
                  fontWeight={500}
                  fontSize={14}
                >
                  If your file is larger than 5 MB please contact us at
                  carrier@wemove.ai
                </Typography>
                <Typography fontWeight={600} fontSize={16}>
                  Upload Proof of Insurance Document in PDF format. (5 MB
                  maximum file size. )
                </Typography>

                <StyledFileInput
                  type="file"
                  variant="outlined"
                  onChange={(event) => {
                    handleFileChange(event, setInsuranceDocument);
                    setFieldError("");
                  }}
                  size="small"
                  required
                  inputProps={{
                    accept: "application/pdf",
                  }}
                />

                <Typography fontWeight={600} color={"#5858E0"}>
                  <a
                    href="https://we-move-staging.s3.amazonaws.com/CARRIER%20TERMS%20OF%20SERVICE.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Terms of Service
                  </a>
                </Typography>
                <FormGroup>
                  <FormControlLabel
                    required
                    control={
                      <Checkbox
                        checked={agreedToTermsAndConditions}
                        onChange={(event) => {
                          setAgreedToTermsAndConditions(event.target.checked);
                          setFieldError("");
                        }}
                      />
                    }
                    label="I agree to the terms and conditions of WeMove."
                  />
                </FormGroup>

                <Box mt={3} display={"flex"} justifyContent={"end"}>
                  <Button
                    onClick={() => {
                      handleStepThree();
                    }}
                    variant="contained"
                    disabled={loading}
                    sx={{
                      width: 200,
                      borderColor: "#5858E0",
                      bgcolor: "#5858E0",
                      color: "#FFFFFF",
                    }}
                  >
                    Next →
                  </Button>
                </Box>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default DeliveryCarrierRegistrationModal;
