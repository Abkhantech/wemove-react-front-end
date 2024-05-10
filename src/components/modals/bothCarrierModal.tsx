import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { State, City } from "country-state-city";
import { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import usStates from "../utils/USA-states";
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
import { useDispatch } from "react-redux";
import progress1Icon from "../../assets/Icons/Group 1171274813.svg";
import progress2Icon from "../../assets/Icons/Progress2.svg";
import progress3Icon from "../../assets/Icons/Progress3.svg";
import progress4Icon from "../../assets/Icons/Progress4.svg";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import VerifyOtpModal from "./verifyOtpModal";
import InfoLostAlertModal from "./infoLostAlertModal";
import { number } from "yup";
import { checkIfDeliveryCarrierExists } from "../../redux/actions/delivery-carrier";
import { unwrapResult } from "@reduxjs/toolkit";
import { checkIfPickupCarrierExists } from "../../redux/actions/pickup-carrier";

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

const BothCarriersModal = ({
  bothCarriersModalVisible,
  setBothCarriersModalVisible,
  handleCompleteRegistrationPickupCarrier,
  handleCompleteRegistrationDeliverypCarrier,
  setDoubleCarrierCreation,
  completeDoubleCreation,
  isVerifyOtpModal,
  setIsVerifyOtpModal,
  success,
  setSuccess,
  setIsLoading,
  isLoading,
  setOnboardingSuccessModalVisible,
}: any) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.only("xs"));
  useEffect(() => {
    setDoubleCarrierCreation(true);
  }, []);
  const [infoLostAlertModalVisible, setInfoLostAlertModalVisible] =
    useState(false);
  const handleInputAlertModal = () => setBothCarriersModalVisible(true);
  const handleClose = () => {
    setInfoLostAlertModalVisible(true);
  };
  const importedStates = usStates;

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
  const [mcNumber, setMcNumber] = useState("");
  const [movingCompanyOfficialLicense, setMovingCompanyOfficialLicense] =
    useState<any>(null);
  const [ownerDriverLicense, setOwnerDriverLicense] = useState<any>(null);
  const [w9Form, setW9Form] = useState<any>(null);
  const [ownerName, setOwnerName] = useState("");
  const [ownerLastName, setOwnerLastName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [ownerPhoneNumber, setOwnerPhoneNumber] = useState("");
  const [states, setStates] = useState<any>([]);
  const [cities, setCities] = useState<any>([]);
  const [selectedState, setSelectedState] = useState<any>(null);
  const [selectedCity, setSelectedCity] = useState<any>(null);
  const [haveTrailers, setHaveTrailers] = useState(false);
  let USAstates: any[] = [];
  const [yearsInBusiness, setYearsInBusiness] = useState<any>(null);
  const [trucksInOperation, setTrucksInOperation] = useState<any>(null);
  const [operatingStates, setOperatingStates] = useState<any>([]);
  const [finalOperatingStates, setFinalOperatingStates] = useState<any>([]);
  const [insuranceCompanyName, setInsuranceCompanyName] = useState("");
  const [insuranceCompanyPhoneNumber, setInsuranceCompanyPhoneNumber] =
    useState("");
  const [insuranceDocument, setInsuranceDocument] = useState<any>(null);
  const [arbitrationCounty, setArbitrationCounty] = useState("");
  const [arbitrationState, setArbitrationState] = useState("");
  const [role, setRole] = useState("pickup");
  const [
    daysRequiredFor0To500MilesInitialRange,
    setDaysRequiredFor0To500MilesInitialRange,
  ] = useState<any>("");
  const [
    daysRequiredFor0To500MilesFinalRange,
    setDaysRequiredFor0To500MilesFinalRange,
  ] = useState<any>("");
  const [
    daysRequiredFor501To1000MilesInitialRange,
    setDaysRequiredFor501To1000MilesInitialRange,
  ] = useState<any>("");
  const [
    daysRequiredFor501To1000MilesFinalRange,
    setDaysRequiredFor501To1000MilesFinalRange,
  ] = useState<any>("");
  const [
    daysRequiredFor1001To1500MilesInitialRange,
    setDaysRequiredFor1001To1500MilesInitialRange,
  ] = useState<any>("");
  const [
    daysRequiredFor1001To1500MilesFinalRange,
    setDaysRequiredFor1001To1500MilesFinalRange,
  ] = useState<any>("");
  const [
    daysRequiredFor1501To4000MilesInitialRange,
    setDaysRequiredFor1501To4000MilesInitialRange,
  ] = useState<any>("");
  const [
    daysRequiredFor1501To4000MilesFinalRange,
    setDaysRequiredFor1501To4000MilesFinalRange,
  ] = useState<any>("");
  const [agreedToTermsAndConditions, setAgreedToTermsAndConditions] =
    useState(false);
  const [isInfoMissing, setIsInfoMissing] = useState(false);
  const [emailError, setEmailError] = useState("");
  const handleCountyAndState = (event: any, setThis: any) => {
    const value = event.target.value.name.toString();
    setThis(value);
  };
  let theseStates: any[] = [];
  useEffect(() => {
    if (operatingStates.length !== 0) {
      operatingStates.map((state: any) => {
        const thisState = {
          pickup_service_state: state.name,
          point_of_contact_name: ownerName + " " + ownerLastName,
          point_of_contact_phone_number: "+1" + companyPhoneNumber,
          zip_codes: [],
        };
        theseStates.push(thisState);
      });
    }
    setFinalOperatingStates(theseStates);
  }, [operatingStates]);

  useEffect(() => {
    console.log(finalOperatingStates, ">>>");
  }, [finalOperatingStates]);
  const handleFileChange = (event: any, setFile: any) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setFile(file);
    } else {
      setFieldError("Please select a PDF file");
    }
    console.log("Selected file:", file);
  };
  useEffect(() => {
    setStates(State.getStatesOfCountry("US"));
  }, []);

  useEffect(() => {
    if (companyState !== null) {
      setCities(City.getCitiesOfState("US", companyState.isoCode));
    }
  }, [companyState]);
  const handleInputOperationalState = (state: any) => {
    if (operatingStates.includes(state)) {
      console.log("state already added");
    } else {
      setOperatingStates([...operatingStates, state]);
      console.log("state added");
    }
  };

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
            setFieldError("Please enter a valid email address.");
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
                  if (numberOfDrivers === null || numberOfDrivers < 0) {
                    setFieldError("Please enter valid number of drivers.");
                  } else {
                    checkIfDeliveryCarrierAccountExists();
                    // setStep(2);
                  }
                }
              }
            }
          }
        }
      }
    }
  };

  const handleStepTwo = () => {
    if (movingCompanyOfficialLicense === null) {
      setFieldError("Please upload Company License document in PDF format.");
    } else {
      if (movingCompanyOfficialLicense.type !== "application/pdf") {
        setFieldError("Please select a PDF file for Company Tariff document.");
      } else {
        if (movingCompanyOfficialLicense.size > 5000000) {
          setFieldError("Please select a Company Tariff PDF file under 5 MB.");
        } else {
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
                setFieldError(
                  "Please select Drivers License PDF file under 5 MB."
                );
              } else {
                if (ownerName === "") {
                  setFieldError("Please enter the Owner's First Name.");
                } else {
                  if (ownerLastName === "") {
                    setFieldError("Please enter the Owner's Last Name.");
                  } else {
                    if (!validateEmail(ownerEmail)) {
                      setFieldError("Please enter a valid email address.");
                    } else {
                      if (ownerPhoneNumber.length !== 10) {
                        setFieldError(
                          "Please enter at least 10-digits for Owner Phone Number."
                        );
                      } else {
                        if (w9Form === null) {
                          setFieldError(
                            "Please upload W9 Form document in PDF format."
                          );
                        } else {
                          if (w9Form.type !== "application/pdf") {
                            setFieldError(
                              "Please select a PDF file for W9 Form document"
                            );
                          } else {
                            if (w9Form.size > 5000000) {
                              setFieldError(
                                "Please select W9 Form PDF file under 5 MB."
                              );
                            } else {
                              checkIfDeliveryCarrierAccountExists();
                              // setStep(3);
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  };

  const handleStepThree = () => {
    if (finalOperatingStates.length === 0) {
      setFieldError("Please select the states you operate in.");
    } else {
      if (trucksInOperation === null || trucksInOperation < 0) {
        setFieldError("Please enter valid number of trucks in operation.");
      } else {
        if (yearsInBusiness === null || yearsInBusiness < 0) {
          setFieldError("Please enter valid number of years in business.");
        } else {
          if (insuranceCompanyName === "") {
            setFieldError("Please enter your Insurance Company's Name.");
          } else {
            if (insuranceCompanyPhoneNumber.length !== 10) {
              setFieldError(
                "Please enter at least 10-digits for Insurance Company Phone Number."
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
                    setStep(4);
                  }
                }
              }
            }
          }
        }
      }
    }
  };

  const handleStepFour = () => {
    if (arbitrationCounty === "") {
      setFieldError("Please select the Arbitration County.");
    } else {
      if (arbitrationState === "") {
        setFieldError("Please select the Arbitration State.");
      } else {
        if (
          daysRequiredFor0To500MilesInitialRange === "" ||
          daysRequiredFor0To500MilesFinalRange === ""
        ) {
          setFieldError("Please fill in the estimated days required.");
        } else {
          if (
            daysRequiredFor501To1000MilesInitialRange === "" ||
            Number(daysRequiredFor501To1000MilesInitialRange) < 2
          ) {
            setFieldError(
              "Days required to cover 501 - 1000 miles must be more than 1"
            );
          } else {
            if (
              daysRequiredFor501To1000MilesInitialRange === "" ||
              Number(daysRequiredFor501To1000MilesInitialRange) < 2 ||
              daysRequiredFor501To1000MilesFinalRange === "" ||
              Number(daysRequiredFor501To1000MilesFinalRange) < 2
            ) {
              setFieldError(
                "Days required to cover 501 - 1000 miles must be more than 1"
              );
            } else {
              if (
                daysRequiredFor1001To1500MilesInitialRange === "" ||
                Number(daysRequiredFor1001To1500MilesInitialRange) < 2 ||
                daysRequiredFor1001To1500MilesFinalRange === "" ||
                Number(daysRequiredFor1001To1500MilesFinalRange) < 2
              ) {
                setFieldError(
                  "Days required to cover 1000 - 1500 miles must be more than 1"
                );
              } else {
                if (
                  daysRequiredFor1501To4000MilesInitialRange === "" ||
                  Number(daysRequiredFor1501To4000MilesInitialRange) < 2 ||
                  daysRequiredFor1501To4000MilesFinalRange === "" ||
                  Number(daysRequiredFor1501To4000MilesFinalRange) < 2
                ) {
                  setFieldError(
                    "Days required to cover 1500 - 4000 miles must be more than 1"
                  );
                } else {
                  if (agreedToTermsAndConditions === false) {
                    setFieldError(
                      "Please acknowledge that you agree to the terms and conditions of WeMove."
                    );
                  } else {
                    createPickupRegisterCarrier();
                  }
                }
              }
            }
          }
        }
      }
    }
  };
  const dispatch = useDispatch();
  const [waitingMessage, setWaitingMessage] = useState("");
  const concatinateDays = (startDay: any, endDay: any) => {
    return startDay.toString() + "-" + endDay.toString();
  };
  const checkIfPickupCarrierAccountExists = () => {
    setIsLoading(true);
    const body = {
      phoneNumber: "+1" + ownerPhoneNumber,
      ownerOfficePhone: "+1" + companyPhoneNumber,
      email: ownerEmail,
    };
    dispatch<any>(checkIfPickupCarrierExists(body))
      .then(unwrapResult)
      .then((res: any) => {
        console.log(res);
        setIsLoading(false);
        if (res === true) {
          if (step === 1) {
            setFieldError(
              "Account with this Company Phone Number or Email already exists."
            );
          }
          if (step === 2) {
            setFieldError(
              "Account with this Email or Owner Phone Number already exists."
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
  const checkIfDeliveryCarrierAccountExists = () => {
    setIsLoading(true);
    const body = {
      phoneNumber: "+1" + ownerPhoneNumber,
      ownerOfficePhone: "+1" + companyPhoneNumber,
      email: companyEmail,
    };
    dispatch<any>(checkIfDeliveryCarrierExists(body))
      .then(unwrapResult)
      .then((res: any) => {
        console.log(res);
        setIsLoading(false);
        if (res === true) {
          if (step === 1) {
            setFieldError(
              "Account with this Company Phone Number or Email already exists."
            );
          }
          if (step === 2) {
            setFieldError(
              "Account with this Email or Owner Phone Number already exists."
            );
          }
        } else {
          checkIfPickupCarrierAccountExists();
        }
      })
      .catch((err: any) => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const [thisDeliveryCarrier, setThisDeliveryCarrier] = useState<any>(null);
  const [thisPickupCarrier, setThisPickupCarrier] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const createPickupRegisterCarrier = () => {
    setWaitingMessage("Onboarding you as a Pickup Carrier. Please wait...");
    // setLoading(true);
    const body = {
      company_name: companyName,
      doing_business_as_name:
        doingBusinessAsName !== "" ? doingBusinessAsName : companyName,
      street_address: companyAddress,
      state: companyState.name.toString(),
      city:
        cities.length !== 0
          ? companyCity.name.toString()
          : companyCity.toString(),
      zip_code: companyZipCode,
      dot_number: dotNumber.toString(),
      mc_number: mcNumber.toString(),
      owner_office_phone: "+1" + companyPhoneNumber,
      company_license: movingCompanyOfficialLicense,
      owner_driver_license: ownerDriverLicense,
      owner_name: ownerName + " " + ownerLastName,
      owner_email: ownerEmail,
      owner_phone_number: "+1" + ownerPhoneNumber,
      w9_form: w9Form,
      trucks_in_operatiion: Number(trucksInOperation),
      states: finalOperatingStates,
      years_in_business: Number(yearsInBusiness),
      insurances: [
        {
          insurance_company: insuranceCompanyName,
          phone_number: "+1" + insuranceCompanyPhoneNumber,
        },
      ],
      insurance_document: insuranceDocument,
      arbitrationCounty: arbitrationCounty,
      arbitrationState: arbitrationState,
      delivery_approximations: {
        estimation_0_to_500_miles: concatinateDays(
          daysRequiredFor0To500MilesInitialRange,
          daysRequiredFor0To500MilesFinalRange
        ),
        estimation_501_to_1000_miles: concatinateDays(
          daysRequiredFor501To1000MilesInitialRange,
          daysRequiredFor501To1000MilesFinalRange
        ),
        estimation_1001_to_1500_miles: concatinateDays(
          daysRequiredFor1001To1500MilesInitialRange,
          daysRequiredFor1001To1500MilesFinalRange
        ),
        estimation_1501_to_4000_miles: concatinateDays(
          daysRequiredFor1501To4000MilesInitialRange,
          daysRequiredFor1501To4000MilesFinalRange
        ),
      },
    };

    handleCompleteRegistrationPickupCarrier(body);
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
  const [HHGLicense, setHHGLicense] = useState(false);
  const [pointOfContactName, setPointOfContactName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [numberOfTrailers, setNumberOfTrailers] = useState<any>(0);
  const [numberOfDrivers, setNumberOfDrivers] = useState<any>(null);

  const createDeliveryCarrier = () => {
    setWaitingMessage("Onboarding you as a Delivery Carrier. Please wait...");
    const body = {
      company_name: companyName,
      doing_business_as_name:
        doingBusinessAsName !== "" ? doingBusinessAsName : companyName,
      // company_license: movingCompanyOfficialLicense,
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
      both: true,
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
  useEffect(() => {
    if (completeDoubleCreation === true) {
      createDeliveryCarrier();
    }
  }, [completeDoubleCreation]);
  return (
    <>
      <Modal
        open={bothCarriersModalVisible}
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
          <Stack direction={"row"} justifyContent={"space-between"}>
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
                Pickup Carrier
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                backgroundColor: "#08123B",
                width: 150,
                height: 40,
                borderTopLeftRadius: 20,
                borderBottomLeftRadius: 20,
              }}
            >
              <Typography textAlign={"end"} fontSize={14} color={"#FFFFFF"}>
                Delivery Carrier
              </Typography>
            </Box>
          </Stack>
          {infoLostAlertModalVisible && (
            <InfoLostAlertModal
              infoLostAlertModalVisible={infoLostAlertModalVisible}
              setInfoLostAlertModalVisible={setInfoLostAlertModalVisible}
              setAnyModal={setBothCarriersModalVisible}
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
          {/* {loading && (
            <Stack alignItems={"center"} alignSelf={"center"}>
              <CircularProgress />
            </Stack>
          )} */}
          {isVerifyOtpModal && (
            <VerifyOtpModal
              setOnboardingSuccessModalVisible={
                setOnboardingSuccessModalVisible
              }
              isVerifyOtpModal={isVerifyOtpModal}
              setIsVerifyOtpModal={setIsVerifyOtpModal}
              role={role}
              carrierPhoneNumber={"+1" + ownerPhoneNumber}
              setParentModal={setBothCarriersModalVisible}
            />
          )}
          {success && (
            <Alert severity="success">You have successfully registered!</Alert>
          )}
          {fieldError && <Alert severity="error">{fieldError}</Alert>}
          {/* form1 */}

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
                    type="text"
                    label="Company Email"
                    sx={{ width: 220 }}
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
                  <FormControl sx={{ minWidth: 120 }} size="small">
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
                    <FormControl sx={{ minWidth: 120 }} size="small">
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
                      sx={{ width: 220 }}
                      size="small"
                      required
                    />
                  )}

                  <TextField
                    variant="outlined"
                    type="text"
                    label="Zip Code"
                    value={companyZipCode}
                    // onInput={handleZipCodeInput}
                    onChange={(e) => {
                      handleZipCodeInput(e);
                      setFieldError("");
                    }}
                    inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                    sx={{ width: 220 }}
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
                        sx={{ width: 150, mt: isMobile ? 1 : 3.5 }}
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
                  <Stack marginLeft={isMobile ? 0 : 4}>
                    <Typography mt={2} fontWeight={600} fontSize={16}>
                      Number of Drivers?
                    </Typography>

                    <TextField
                      // label="Phone Number"
                      variant="outlined"
                      type="number"
                      size="small"
                      value={numberOfDrivers ? numberOfDrivers : ""}
                      sx={{ width: 150, mt: isMobile ? 1 : 3.5 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">#</InputAdornment>
                        ),
                      }}
                      onChange={(e) => {
                        setNumberOfDrivers(Number(e.target.value));
                        setFieldError("");
                      }}
                      required
                    />
                  </Stack>
                  <Stack marginLeft={isMobile ? 0 : 4}>
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
                <img width={isMobile ? 250 : 570} src={progress2Icon} alt="" />
              </Box>
              <Box component="form" p={3}>
                <Typography color={"#FF0000"} fontWeight={500} fontSize={14}>
                  If your files are larger than 5 MB please contact us at
                  carrier@wemove.ai
                </Typography>
                <Typography fontWeight={600} fontSize={16}>
                  Upload Company Tariff Document in PDF format. (5 MB maximum
                  file size)
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
                    handleFileChange(event, setMovingCompanyOfficialLicense);
                    setFieldError("");
                  }}
                />

                <Typography mt={2} fontWeight={600} fontSize={16}>
                  Upload Owner Drivers License Document in PDF format. (5 MB
                  maximum file size)
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
                    handleFileChange(event, setOwnerDriverLicense);
                    setFieldError("");
                  }}
                />

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

                  <TextField
                    variant="outlined"
                    type="email"
                    label="Owner contact email"
                    sx={{ width: 220 }}
                    size="small"
                    required
                    value={ownerEmail}
                    error={Boolean(emailError)}
                    helperText={emailError}
                    onChange={(e) => {
                      setOwnerEmail(e.target.value);
                      setFieldError("");
                    }}
                  />

                  <TextField
                    label="Owner contact Phone Number"
                    variant="outlined"
                    value={ownerPhoneNumber}
                    onChange={(event) => {
                      handleInputPhoneNumber(event, setOwnerPhoneNumber);
                      setFieldError("");
                    }}
                    type="text"
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
                </Stack>

                <Typography mt={2} fontWeight={600} fontSize={16}>
                  Upload W9 Form Document in PDF format. (5 MB maximum file
                  size)
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
                    handleFileChange(event, setW9Form);
                    setFieldError("");
                  }}
                />
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
                <img width={isMobile ? 250 : 570} src={progress3Icon} alt="" />
              </Box>
              <Box component="form" p={3}>
                <Stack
                  mt={1}
                  spacing={2}
                  direction={isMobile ? "column" : "row"}
                >
                  <Stack>
                    <Stack spacing={1}>
                      <Typography
                        color={"#808080"}
                        fontWeight={500}
                        fontSize={12}
                      >
                        Select all the states you operate in:
                      </Typography>
                      <FormControl sx={{ minWidth: 120 }} size="small">
                        <InputLabel id="demo-select-small-label">
                          States
                        </InputLabel>
                        <Select
                          labelId="demo-select-small-label"
                          id="demo-select-small"
                          value={selectedState || ""}
                          label="States"
                          onChange={(e) => {
                            handleInputOperationalState(e.target.value);
                            setFieldError("");
                          }}
                          required
                        >
                          {states &&
                            states.map((thisState: any) => {
                              if (importedStates.includes(thisState.name)) {
                                return (
                                  <MenuItem
                                    key={thisState.name}
                                    value={thisState}
                                  >
                                    {thisState.name}
                                  </MenuItem>
                                );
                              }
                            })}
                        </Select>
                      </FormControl>
                    </Stack>

                    <Typography fontSize={12} fontWeight={500}>
                      Selected states:
                    </Typography>
                    {operatingStates.length !== 0 &&
                      operatingStates.map((thisState: any) => {
                        return (
                          <Typography
                            fontWeight={600}
                            fontSize={12}
                            key={thisState.name}
                          >
                            {thisState.name}
                          </Typography>
                        );
                      })}
                  </Stack>
                  <Stack spacing={1}>
                    <Typography
                      color={"#808080"}
                      fontWeight={500}
                      fontSize={12}
                    >
                      How many trucks in operation?
                    </Typography>
                    <TextField
                      variant="outlined"
                      type="number"
                      label="Trucks in operation?"
                      sx={{ width: 220 }}
                      size="small"
                      required
                      value={trucksInOperation ? trucksInOperation : ""}
                      onChange={(e) => {
                        setTrucksInOperation(Number(e.target.value));
                        setFieldError("");
                      }}
                    />
                  </Stack>
                  <Stack spacing={1}>
                    <Typography
                      color={"#808080"}
                      fontWeight={500}
                      fontSize={12}
                    >
                      How many years in business?
                    </Typography>

                    <TextField
                      variant="outlined"
                      type="number"
                      label="Years in business?"
                      sx={{ width: 220 }}
                      size="small"
                      required
                      value={yearsInBusiness ? yearsInBusiness : ""}
                      onChange={(e) => {
                        setYearsInBusiness(Number(e.target.value));
                        setFieldError("");
                      }}
                    />
                  </Stack>
                </Stack>

                <Stack
                  mt={3}
                  spacing={2}
                  direction={isMobile ? "column" : "row"}
                >
                  <TextField
                    variant="outlined"
                    type="text"
                    label="Insurance company name"
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
                    value={insuranceCompanyPhoneNumber}
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
                      handleStepThree();
                    }}
                  >
                    Next →
                  </Button>
                </Box>
              </Box>
            </>
          )}

          {step === 4 && (
            <>
              <Button
                onClick={() => {
                  setStep(3);
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
                  PICKUP INFO
                </Typography>
                <Stack
                  mt={1}
                  justifyContent={isMobile ? "center" : "space-between"}
                  alignItems={isMobile ? "flex-start" : "center"}
                  spacing={isMobile ? 2 : 0}
                  direction={isMobile ? "column" : "row"}
                >
                  <Stack spacing={1}>
                    <Typography fontSize={13} color={"#71717A"}>
                      Arbitration State
                    </Typography>
                    <TextField
                      variant="outlined"
                      type="text"
                      label="Arbitration State Name"
                      sx={{ width: 240 }}
                      size="small"
                      required
                      value={arbitrationState}
                      onChange={(e) => {
                        setArbitrationState(e.target.value);
                        setFieldError("");
                      }}
                    />
                  </Stack>
                  <Stack spacing={1}>
                    <Typography fontSize={13} color={"#71717A"}>
                      Arbitration County
                    </Typography>
                    <TextField
                      variant="outlined"
                      type="text"
                      label="Arbitration County Name"
                      sx={{ width: 240 }}
                      size="small"
                      required
                      value={arbitrationCounty}
                      onChange={(e) => {
                        setArbitrationCounty(e.target.value);
                        setFieldError("");
                      }}
                    />
                  </Stack>
                </Stack>

                <Stack
                  spacing={isMobile ? 1 : 10}
                  alignItems={isMobile ? "flex-start" : "center"}
                  direction={isMobile ? "column" : "row"}
                  mt={3}
                >
                  <Stack>
                    <Typography fontSize={13} color={"#71717A"}>
                      Destination Delivery Days Estimate 0-500 Miles
                    </Typography>
                    <Stack alignItems={"center"} direction={"row"}>
                      <TextField
                        variant="outlined"
                        placeholder="0"
                        type="number"
                        sx={{ width: 100 }}
                        size="small"
                        required
                        value={daysRequiredFor0To500MilesInitialRange}
                        onChange={(event) => {
                          setDaysRequiredFor0To500MilesInitialRange(
                            event.target.value
                          );
                          setFieldError("");
                        }}
                      />
                      <Typography>{"\u00A0-\u00A0"}</Typography>

                      <TextField
                        variant="outlined"
                        placeholder="0"
                        type="number"
                        sx={{ width: 100 }}
                        size="small"
                        required
                        value={daysRequiredFor0To500MilesFinalRange}
                        onChange={(event) => {
                          setDaysRequiredFor0To500MilesFinalRange(
                            event.target.value
                          );
                          setFieldError("");
                        }}
                      />
                    </Stack>
                  </Stack>

                  <Stack>
                    <Typography fontSize={13} color={"#71717A"}>
                      Destination Delivery Days Estimate 501-1000 Miles
                    </Typography>
                    <Stack alignItems={"center"} direction={"row"}>
                      <TextField
                        variant="outlined"
                        placeholder="0"
                        type="number"
                        sx={{ width: 100 }}
                        size="small"
                        required
                        value={daysRequiredFor501To1000MilesInitialRange}
                        onChange={(event) => {
                          setDaysRequiredFor501To1000MilesInitialRange(
                            event.target.value
                          );
                          setFieldError("");
                        }}
                      />
                      <Typography>{"\u00A0-\u00A0"}</Typography>

                      <TextField
                        variant="outlined"
                        placeholder="0"
                        type="number"
                        sx={{ width: 100 }}
                        size="small"
                        required
                        value={daysRequiredFor501To1000MilesFinalRange}
                        onChange={(event) => {
                          setDaysRequiredFor501To1000MilesFinalRange(
                            event.target.value
                          );
                          setFieldError("");
                        }}
                      />
                    </Stack>
                  </Stack>
                </Stack>

                <Stack
                  spacing={isMobile ? 1 : 10}
                  alignItems={isMobile ? "flex-start" : "center"}
                  direction={isMobile ? "column" : "row"}
                  mt={3}
                  mb={2}
                >
                  <Stack>
                    <Typography fontSize={13} color={"#71717A"}>
                      Destination Delivery Days Estimate 1001-1500 Miles
                    </Typography>
                    <Stack alignItems={"center"} direction={"row"}>
                      <TextField
                        variant="outlined"
                        placeholder="0"
                        type="number"
                        sx={{ width: 100 }}
                        size="small"
                        required
                        value={daysRequiredFor1001To1500MilesInitialRange}
                        onChange={(event) => {
                          setDaysRequiredFor1001To1500MilesInitialRange(
                            event.target.value
                          );
                          setFieldError("");
                        }}
                      />
                      <Typography>{"\u00A0-\u00A0"}</Typography>

                      <TextField
                        variant="outlined"
                        placeholder="0"
                        type="number"
                        sx={{ width: 100 }}
                        size="small"
                        required
                        value={daysRequiredFor1001To1500MilesFinalRange}
                        onChange={(event) => {
                          setDaysRequiredFor1001To1500MilesFinalRange(
                            event.target.value
                          );
                          setFieldError("");
                        }}
                      />
                    </Stack>
                  </Stack>

                  <Stack>
                    <Typography fontSize={13} color={"#71717A"}>
                      Destination Delivery Days Estimate 1501-4000 Miles
                    </Typography>
                    <Stack alignItems={"center"} direction={"row"}>
                      <TextField
                        variant="outlined"
                        placeholder="0"
                        type="number"
                        sx={{ width: 100 }}
                        size="small"
                        required
                        value={daysRequiredFor1501To4000MilesInitialRange}
                        onChange={(event) => {
                          setDaysRequiredFor1501To4000MilesInitialRange(
                            event.target.value
                          );
                          setFieldError("");
                        }}
                      />
                      <Typography>{"\u00A0-\u00A0"}</Typography>

                      <TextField
                        variant="outlined"
                        placeholder="0"
                        type="number"
                        sx={{ width: 100 }}
                        size="small"
                        required
                        value={daysRequiredFor1501To4000MilesFinalRange}
                        onChange={(event) => {
                          setDaysRequiredFor1501To4000MilesFinalRange(
                            event.target.value
                          );
                          setFieldError("");
                        }}
                      />
                    </Stack>
                  </Stack>
                </Stack>
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
                      handleStepFour();
                    }}
                    disabled={loading}
                    variant="contained"
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

export default BothCarriersModal;
