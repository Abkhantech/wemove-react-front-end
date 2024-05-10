import {
  Alert,
  Backdrop,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  FormControl,
  FormGroup,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { City, State } from "country-state-city";
import usStates from "../../components/utils/USA-states";
import logoCube from "../../assets/logo/Group 15.png";
import logoWeMove from "../../assets/logo/WEMOVE.png";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerConsumer } from "../../redux/actions/consumer";
import { unwrapResult } from "@reduxjs/toolkit";
import ReviewDP1 from "../../assets/images/review-dp-1.svg";
import ReviewDP2 from "../../assets/images/review-dp-2.svg";
import ReviewDP3 from "../../assets/images/review-dp-3.svg";
import ReviewDP4 from "../../assets/images/review-dp-4.svg";
import ReviewDP5 from "../../assets/images/review-dp-5.svg";

const reviews = [
  {
    id: 1,
    text: "Moving with WeMove.ai was an absolute breeze! From getting a quick and accurate quote to booking our move, the process was seamless. The team was professional, efficient, and handled our belongings with care. WeMove.ai took the stress out of moving, and I highly recommend their services to anyone in need of a smooth relocation.",
    image: ReviewDP1,
    alt: "Customer review image 1",
  },
  {
    id: 2,
    text: "I can’t thank WeMove.ai enough for the exceptional moving experience they provided. The online quote system was straightforward and transparent, and the booking process was incredibly convenient. On moving day, the team arrived on time, worked diligently, and ensured that everything was transported safely to our new home. If you’re looking for a hassle-free move, look no further than WeMove.ai!",
    image: ReviewDP2,
    alt: "Customer review image 2",
  },
  {
    id: 3,
    text: "Choosing WeMove.ai for our recent move was one of the best decisions we made. From the moment we requested a quote to the completion of the move, the entire process was efficient and well-organized. The team was courteous, professional, and treated our belongings with the utmost care. WeMove.ai made our relocation stress-free and straightforward, and I wouldn’t hesitate to recommend them to anyone.",
    image: ReviewDP3,
    alt: "Customer review image 3",
  },
  {
    id: 4,
    text: "I was blown away by the level of service provided by WeMove.ai during our recent move. The online quote tool was user-friendly and provided an accurate estimate. The team handled our belongings with care, making the entire experience stress-free. I’m grateful to WeMove.ai for their outstanding service and would recommend them to anyone in need of a reliable moving company.",
    image: ReviewDP4,
    alt: "Customer review image 4",
  },
  {
    id: 5,
    text: "WeMove.ai exceeded all of our expectations for our recent move. From start to finish, the process was seamless and stress-free. On moving day, the team arrived on time, were friendly and professional, and worked efficiently to get the job done.i I highly recommend their services to anyone looking for a top-notch moving experience",
    image: ReviewDP5,
    alt: "Customer review image 5",
  },
];

const ConsumerLogin = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.only("xs"));
  const isMobileOrTab = useMediaQuery(theme.breakpoints.down("md"));

  const dispatch = useDispatch();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [email, setEmail] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [consumerState, setConsumerState] = useState<any>(null);
  const [consumerCity, setConsumerCity] = useState<any>(null);
  const [zipCode, setZipCode] = useState("");

  const importedStates = usStates;
  const [states, setStates] = useState<any>([]);
  const [cities, setCities] = useState<any>([]);
  const [selectedState, setSelectedState] = useState<any>(null);
  const [selectedCity, setSelectedCity] = useState<any>(null);

  const [phoneNoError, setPhoneNoError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [formError, setFormError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const navigate = useNavigate();
  const validateName = (name: any) => /^[a-zA-Z ]+$/.test(name);

  const validatePhoneNumber = (phoneNumber: any) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phoneNumber);
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

  const handlePhoneNoChange = (e: any) => {
    let inputValue = e.target.value;
    inputValue = inputValue.replace(/\D/g, "");
    const maxLength = 10;

    if (inputValue.length > maxLength) {
      inputValue = inputValue.substring(0, maxLength);
    }

    setPhoneNo(inputValue);

    if (inputValue.length !== maxLength) {
      setPhoneNoError("Please enter a valid 10-digit phone number");
    } else {
      setPhoneNoError("");
    }
  };

  const handleEmailChange = (e: any) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    if (!validateEmail(newEmail)) {
      setEmailError("Invalid Email");
    } else {
      setEmailError("");
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

  const handleFormSubmit = (e: any) => {
    e.preventDefault();
    setFormError("");
    if (!validateName(firstName) || !validateName(lastName)) {
      setFormError("Name should not be empty");
    } else if (!validateEmail(email)) {
      setFormError("Invalid Email");
    } else if (!validatePhoneNumber(phoneNo)) {
      setFormError("Invalid Phone Number");
    } else {
      setIsLoading(true);

      const body = {
        email: email,
        first_name: firstName,
        last_name: lastName,
        phone_number: "+1" + phoneNo,
        // addresses: [
        //   {
        //     street_address: streetAddress,
        //     city: consumerCity.name.toString(),
        //     state: consumerState.name.toString(),
        //     zip_code: zipCode,
        //   },
        // ],
      };

      dispatch<any>(registerConsumer(body))
        .then(unwrapResult)
        .then((res: any) => {
          console.log("res", res);
          localStorage.setItem("consumerPhoneNo", res.phone_number);
          setIsLoading(false);
          navigate("/Login");
        })
        .catch((err: any) => {
          setIsLoading(false);
          setFormError(
            "Account with this email or phone number already exists"
          );
        });
    }
  };

  useEffect(() => {
    setStates(State.getStatesOfCountry("US"));
    setIsPageLoading(true);
    setTimeout(() => {
      setIsPageLoading(false);
    }, 1300);
  }, []);

  useEffect(() => {
    if (consumerState !== null) {
      setCities(City.getCitiesOfState("US", consumerState.isoCode));
      setSelectedCity(null);
    }
  }, [consumerState]);

  return (
    <>
      <Grid
        container
        spacing={1}
        p={3}
        height={isMobileOrTab ? "100%" : "101vh"}
        sx={{
          background:
            "linear-gradient(170deg, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)",
        }}
      >
        <Grid
          item
          xs={12}
          sm={8}
          md={5.7}
          marginX={"auto"}
          sx={{
            background: "#FFFFFF",
            borderTop: "4px solid #5858E0",
            borderRadius: 4,
          }}
        >
          <Box p={isMobile ? 2 : 5}>
            <Stack
              alignItems={"center"}
              justifyContent={"start"}
              direction={"row"}
              mt={3}
            >
              <img src={logoCube} width={30} height={30} alt="" />
              <img src={logoWeMove} width={110} height={18} alt="" />
            </Stack>

            <Typography mt={5} fontSize="18px" fontWeight={600}>
              Sign Up to start your first move!
            </Typography>
            <Typography
              mt={1}
              fontSize="14px"
              fontWeight={400}
              color={"#71717A"}
            >
              Fill below details to get a call back
            </Typography>

            {formError && (
              <Alert sx={{ mt: 1 }} severity="error">
                {formError}
              </Alert>
            )}

            <form onSubmit={handleFormSubmit} autoComplete="off">
              <FormGroup>
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <Stack
                    direction={"row"}
                    justifyContent={"space-between"}
                    spacing={1}
                  >
                    <TextField
                      label="First Name"
                      variant="outlined"
                      type="text"
                      fullWidth
                      margin="normal"
                      size="small"
                      value={firstName}
                      onChange={(e) => {
                        setFirstName(e.target.value);
                      }}
                    />

                    <TextField
                      label="Last Name"
                      variant="outlined"
                      type="text"
                      value={lastName}
                      fullWidth
                      margin="normal"
                      size="small"
                      onChange={(e) => {
                        setLastName(e.target.value);
                      }}
                    />
                  </Stack>

                  <TextField
                    label="Email Address"
                    variant="outlined"
                    type="email"
                    value={email}
                    fullWidth
                    margin="normal"
                    size="small"
                    onChange={handleEmailChange}
                    error={Boolean(emailError)}
                    helperText={emailError}
                  />

                  <TextField
                    label="Phone Number"
                    variant="outlined"
                    type="text"
                    value={phoneNo}
                    fullWidth
                    margin="normal"
                    size="small"
                    onChange={handlePhoneNoChange}
                    error={Boolean(phoneNoError)}
                    helperText={phoneNoError}
                    inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">+1</InputAdornment>
                      ),
                    }}
                  />

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
                          border: "2px solid #CCCCFF",
                          fontSize: 12,
                          fontWeight: 600,
                          borderRadius: 3,
                          width: 200,
                          alignSelf: "center",
                        }}
                      >
                        Start for free today
                      </Button>
                    )}
                    <Button
                      onClick={() => {
                        navigate("/Login");
                      }}
                      sx={{ alignSelf: "flex-end" }}
                    >
                      <Typography mt={4} fontSize={12} color={"#5858E0"}>
                        Already have an account? Log In
                      </Typography>
                    </Button>
                  </Stack>
                </FormControl>
              </FormGroup>
            </form>
            {isPageLoading && (
              <Backdrop
                sx={{
                  color: "#fff",
                  zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={isPageLoading}
                onClick={() => {
                  setIsPageLoading(true);
                }}
              >
                <CircularProgress color="inherit" />
              </Backdrop>
            )}
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          sm={8}
          md={5.7}
          mt={isMobileOrTab ? 2 : undefined}
          marginX={"auto"}
          sx={{
            borderRadius: 4,
            backgroundColor: "#8BC6EC",
            backgroundImage:
              "linear-gradient(100deg, #f5f7fa 0%, #c3cfe2 100%)",
          }}
        >
          <Box height={"88vh"} pl={2} pr={2} sx={{ overflow: "auto" }}>
            {reviews.map((review) => (
              <Card
                key={review.id}
                sx={{
                  display: "flex",
                  flexDirection: isMobile ? "column-reverse" : "row",
                  alignItems: "center",
                  pr: 2,
                  mb: 2,
                  border: "1px solid #5858E0",
                }}
              >
                <Box>
                  <CardContent sx={{ flex: "1 0 auto" }}>
                    <Typography
                      fontSize="12px"
                      textAlign={"center"}
                      fontWeight={500}
                    >
                      {review.text}
                    </Typography>
                  </CardContent>
                </Box>
                <CardMedia
                  component="img"
                  sx={{ width: 180 }}
                  image={review.image}
                  alt={review.alt}
                />
              </Card>
            ))}
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default ConsumerLogin;
