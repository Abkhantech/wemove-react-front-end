import {
  Alert,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  getMoveRequestById,
  updateMoveRequestById,
} from "../../redux/actions/move-request";
import { unwrapResult } from "@reduxjs/toolkit";
import ProgressBar from "../../components/progressBar/progressBar";
import NavBar from "../../components/navbar/navBar";
import { setKey, setLanguage, geocode, RequestType } from "react-geocode";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import placesApiKey from "../../components/utils/Google-Places-API-Key";
import { getMoveDistance } from "../../redux/actions/consumer";
import axios from "axios";

setKey("AIzaSyAk8hBHGztX6M9UX2MdZlRQS3HbdqINzp8");
setLanguage("en");
const PLACES_API_KEY = placesApiKey;

const acceptButton = {
  width: 150,
  height: 50,
  backgroundColor: "#5858E0 !important",
  color: "#FFFFFF",
  fontSize: 12,
  fontWeight: 550,
  border: "1px solid #6552FF",
};

const buttonContainer = {
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  margin: "auto",
  textAlign: "center",
  display: "flex",
  justifyContent: "center",
  marginBottom: 2,
};

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

const AddressInfo = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { moveRequestId } = useParams();
  const [moveRequest, setMoveRequest] = useState(null);
  const [thisMoveRequestId, setThisMoveRequestId] = useState(null);

  const [isAdditionalStops, setIsAdditionalStops] = useState(false);
  const [allAddresses, setAllAddresses] = useState<any>([]);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [additionalStops, setAdditionalStops] = useState([""]);
  const [pickupAddress, setPickupAddress] = useState("");
  const [isPageLoading, setIsPageLoading] = useState(false);

  const [formError, setFormError] = useState("");

  const handleAddMore = () => {
    if (additionalStops[additionalStops.length - 1] !== "") {
      setAdditionalStops([...additionalStops, ""]);
    }
  };

  const handleChange = async (index: any, event: any) => {
    const newStops = [...additionalStops];
    newStops[index] = event.value.description;
    const zip = await fetchZipCodeForAddress(event.value.description);
    const completeAddress = event.value.description.toString() + ", " + zip;
    setAdditionalStops(newStops);
    const addressObject = {
      complete_address: completeAddress,
      stiars_present: null,
      is_elevator_accessible: null,
      no_of_flights: 0,
      floor_no: 0,
    };
    setAllAddresses((prevAdd: any) => [...prevAdd, addressObject]);
  };

  const navigateToLastLeft = (moveRequest: any) => {
    if (!moveRequest.delivery_details) {
      navigate(`/AddressInfo/${moveRequest.canonical_id}`);
    } else {
      if (moveRequest.delivery_details?.delivery_addresses?.length === 0) {
        navigate(`/AddressInfo/${moveRequest.canonical_id}`);
      } else {
        if (
          moveRequest.delivery_details?.delivery_addresses[0].stiars_present ===
            null ||
          moveRequest.delivery_details?.delivery_addresses[0]
            .is_elevator_accessible === null
        ) {
          navigate(`/DeliveryLocationInfo/${moveRequest.canonical_id}`);
        } else {
          if (
            moveRequest.pickup_date_from === null &&
            moveRequest.pickup_date_to === null
          ) {
            navigate(`/PickupDate/${moveRequest.canonical_id}`);
          } else {
            if (moveRequest.delivery_details.open_location === null) {
              navigate(`/TruckInfo/${moveRequest.canonical_id}`);
            } else {
              if (moveRequest.items?.length === 0) {
                navigate(`/itemsInfo/${moveRequest.canonical_id}`);
              } else {
                if (
                  moveRequest.delivery_details?.packagaing_required === null
                ) {
                  navigate(`/packages/${moveRequest.canonical_id}`);
                } else {
                  navigate(`/move-summary/${moveRequest.canonical_id}`);
                }
              }
            }
          }
        }
      }
    }
  };

  const fetchMoveRequestById = (moveRequestId: any) => {
    dispatch<any>(getMoveRequestById(moveRequestId))
      .then(unwrapResult)
      .then((thisMoveRequest: any) => {
        setThisMoveRequestId(thisMoveRequest.id);
        setMoveRequest(thisMoveRequest);
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  const updateThisMoveRequest = (body: any) => {
    setIsPageLoading(true);
    const params = {
      id: thisMoveRequestId,
      ...body,
    };
    dispatch<any>(updateMoveRequestById(params))
      .then(unwrapResult)
      .then((thisMoveRequest: any) => {
        setMoveRequest(thisMoveRequest);
        setTimeout(() => {
          setIsPageLoading(false);
          navigateToLastLeft(thisMoveRequest);
        }, 1300);
      })
      .catch((err: any) => {
        console.log(err);
        setTimeout(() => {
          setIsPageLoading(false);
        }, 1300);
      });
  };

  const fetchZipCodeForAddress = async (add: string) => {
    const apiKey = "AIzaSyAk8hBHGztX6M9UX2MdZlRQS3HbdqINzp8";
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${add}&key=${apiKey}`;

    try {
      const response = await axios.get(url);
      const results = response.data.results;
      const zipCode = results[0].address_components?.find((component: any) =>
        component.types.includes("postal_code")
      )?.long_name;
      if (zipCode) {
        return zipCode.toString();
      } else {
        return "";
      }
    } catch (error) {
      console.error("Error fetching ZIP code:", error);
      throw error;
    }
  };

  const handleAddress = async (add: any) => {
    const zip = await fetchZipCodeForAddress(add.value.description);
    const completeAddress = add.value.description.toString() + ", " + zip;
    setDeliveryAddress(completeAddress);
    const firstAddressObject = {
      complete_address: completeAddress,
      stiars_present: null,
      is_elevator_accessible: null,
      no_of_flights: 0,
      floor_no: 0,
    };
    setAllAddresses((prevAdd: any) => [...prevAdd, firstAddressObject]);
  };

  const calculateMoveDistance = () => {
    const body = {
      pickup_address: pickupAddress,
      delivery_address: deliveryAddress,
      moveRequestId: thisMoveRequestId,
    };
    dispatch<any>(getMoveDistance(body))
      .then(unwrapResult)
      .then((res: any) => {})
      .catch((err: any) => {
        console.log(err);
      });
  };

  const checkFromAddress = (moveReq: any) => {
    if (moveReq.home_address !== null) {
      setPickupAddress(moveReq.home_address);
    }
    if (moveReq.apartment !== null) {
      setPickupAddress(moveReq.apartment?.apt_address);
    }
    if (moveReq.storage !== null) {
      setPickupAddress(moveReq.storage?.address);
    }
    if (moveReq.combo_home_storage !== null) {
      setPickupAddress(moveReq.combo_home_storage?.home_address.toString());
    }
    if (moveReq.combo_apartment_storage !== null) {
      setPickupAddress(
        moveReq.combo_apartment_storage?.apartment?.apt_address.toString()
      );
    }
  };

  useEffect(() => {
    fetchMoveRequestById(moveRequestId);
  }, []);

  useEffect(() => {
    if (moveRequest) {
      checkFromAddress(moveRequest);
    }
  }, [moveRequest]);

  return (
    <>
      <NavBar moveRequestId={moveRequestId} />
      <Grid container>
        <Grid item xs={12} md={5} p={2} marginX={"auto"}>
          <ProgressBar value={20} />
          <Stack mt={2}>
            <Typography fontSize="16px" fontWeight={700} color={"#262626"}>
              While Your Quote is being generated, Lets get your
              move-to-location?
            </Typography>

            <Typography
              mt={3}
              fontSize="14px"
              fontWeight={600}
              color={"#797979"}
            >
              Add Address
            </Typography>

            <GooglePlacesAutocomplete
              apiOptions={{
                language: "en",
              }}
              minLengthAutocomplete={1}
              apiKey={PLACES_API_KEY}
              debounce={500}
              selectProps={{
                styles: {
                  input: (provided) => ({
                    ...provided,
                    color: "#000000",
                    height: "100%",
                    borderRadius: "8px",
                  }),
                  option: (provided) => ({
                    ...provided,
                    color: "#808080",
                  }),
                  singleValue: (provided) => ({
                    ...provided,
                    color: "#808080",
                  }),
                },
                onChange: handleAddress,
                placeholder: "Enter Address",
              }}
            />

            <Typography
              mt={3}
              fontSize="14px"
              fontWeight={600}
              color={"#797979"}
            >
              Do you have any additional Stops?
            </Typography>
            <Typography
              mt={1}
              fontSize="12px"
              fontStyle={"italic"}
              fontWeight={600}
              color={"#46A577"}
            >
              A fee of 75$/per stop will be charged after 2 stops.
            </Typography>

            <Stack direction="row" mt={2} spacing={2} justifyContent={"center"}>
              <Button
                size="large"
                sx={
                  !isAdditionalStops
                    ? selectedButtonStyle
                    : notSeelectedButtonStyle
                }
                onClick={() => {
                  setIsAdditionalStops(false);
                }}
              >
                No
              </Button>
              <Button
                size="large"
                onClick={() => {
                  if (deliveryAddress !== "") {
                    setIsAdditionalStops(true);
                  }
                }}
                sx={
                  isAdditionalStops
                    ? selectedButtonStyle
                    : notSeelectedButtonStyle
                }
              >
                Yes
              </Button>
            </Stack>

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

                    <GooglePlacesAutocomplete
                      apiOptions={{
                        language: "en",
                      }}
                      minLengthAutocomplete={1}
                      apiKey={PLACES_API_KEY}
                      debounce={1000}
                      selectProps={{
                        styles: {
                          input: (provided) => ({
                            ...provided,
                            color: "#000000",
                            height: "100%",
                            borderRadius: "8px",
                          }),
                          option: (provided) => ({
                            ...provided,
                            color: "#808080",
                          }),
                          singleValue: (provided) => ({
                            ...provided,
                            color: "#808080",
                          }),
                        },
                        onChange: (event) => {
                          handleChange(index, event);
                        },
                        placeholder: "Enter Address",
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

            <Box p={3}>
              {formError && <Alert severity="error">{formError}</Alert>}
            </Box>

            <Box sx={buttonContainer}>
              <Button
                onClick={() => {
                  if (allAddresses.length !== 0) {
                    calculateMoveDistance();
                    updateThisMoveRequest({
                      delivery_details: {
                        determined_delivery_address: true,
                        additional_stops: isAdditionalStops,
                        packagaing_required: null,
                        open_location: null,
                        delivery_addresses: allAddresses,
                      },
                    });
                  } else {
                    setFormError("Please fill in the required info.");
                  }
                }}
                size="medium"
                sx={acceptButton}
              >
                Save & Proceed
              </Button>
            </Box>
          </Stack>

          {isPageLoading && (
            <Backdrop
              sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={isPageLoading}
              onClick={() => {
                setIsPageLoading(true);
              }}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default AddressInfo;
