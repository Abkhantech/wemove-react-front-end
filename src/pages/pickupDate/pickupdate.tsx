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
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import dayjs from "dayjs";
import VerticalBarIcon from "../../assets/Icons/verticalBarIcon.png";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import InfoIcon from "@mui/icons-material/Info";
import {
  getMoveRequestById,
  updateMoveRequestById,
} from "../../redux/actions/move-request";
import { unwrapResult } from "@reduxjs/toolkit";
import TwoDaysAlertModal from "../../components/modals/twoDaysAlertModal";
import ProgressBar from "../../components/progressBar/progressBar";
import NavBar from "../../components/navbar/navBar";

const datePickerStyle = {
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderWidth: 1.5,
      borderColor: "#5A7BFC33",
      borderRadius: "8px",
    },
  },
};

const Pickupdate = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { moveRequestId } = useParams();
  const [thisMoveRequestId, setThisMoveRequestId] = useState(null);

  const [isTwoDaysAlertModal, setIsTwoDaysAlertModal] = useState(false);

  const [fromDate, setFromDate] = useState<any>(dayjs(""));
  const [toDate, setToDate] = useState<any>(dayjs(""));
  const [deliveryDate, setDeliveryDate] = useState<any>(dayjs(""));

  const [formError, setFormError] = useState("");
  const [isPageLoading, setIsPageLoading] = useState(false);

  const handleDateChange = (newValue: any, targetDate: string) => {
    if (newValue) {
      if (targetDate === "fromDate") {
        const newFromDate = dayjs(newValue).startOf("day");
        const newToDate = newFromDate.add(2, "day");

        setFromDate(newFromDate);
        setToDate(newToDate);
      } else if (targetDate === "deliveryDate") {
        const newDeliveryDate = dayjs(newValue).startOf("day");
        setDeliveryDate(newDeliveryDate);
      }
    }
  };

  const navigateToLastLeft = (moveRequest: any) => {
    if (!moveRequest.delivery_details) {
      navigate(`/AddressInfo/${moveRequest.canonical_id}`);
    } else {
      if (moveRequest.delivery_details?.delivery_addresses?.length === 0) {
        navigate(`/AddressInfo/${moveRequest.canonical_id}`);
      } else {
        if (
          moveRequest.delivery_details?.delivery_addresses[0].delivery_location_type === null
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
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  const updateThisMoveRequest = (body: any) => {
    const params = {
      id: thisMoveRequestId,
      ...body,
    };

    setFormError("");
    if (fromDate.isValid() ) {
      if(deliveryDate!==""&&deliveryDate.isValid()){
        if (deliveryDate.isAfter(toDate)) {
          setIsPageLoading(true);
  
          dispatch<any>(updateMoveRequestById(params))
            .then(unwrapResult)
            .then((thisMoveRequest: any) => {
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
        } else {
          setIsPageLoading(false);
          setFormError("Delivery Date should be after Pickup date.");
        }
      }else{
        setIsPageLoading(true);
        dispatch<any>(updateMoveRequestById(params))
        .then(unwrapResult)
        .then((thisMoveRequest: any) => {
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
      }
    } else {
      setFormError("Please fill in the required info.");
    }
  };

  useEffect(() => {
    fetchMoveRequestById(moveRequestId);
  }, []);

  return (
    <>
      <NavBar moveRequestId={moveRequestId} />
      <Grid container>
        <Grid item xs={12} sm={6} md={4} p={2} marginX="auto">
          {isTwoDaysAlertModal && (
            <TwoDaysAlertModal
              isTwoDaysAlertModal={isTwoDaysAlertModal}
              setIsTwoDaysAlertModal={setIsTwoDaysAlertModal}
            />
          )}

          <ProgressBar value={60} />

          <Stack mt={2} alignItems={"center"} direction={"row"}>
            <Typography
              fontSize={18}
              fontWeight={700}
              color={"#262626"}
              textAlign={"start"}
            >
              What is your pickup date?
            </Typography>
            <Box alignItems={"center"} alignSelf={"center"}>
              <Button
                onClick={() => {
                  setIsTwoDaysAlertModal(true);
                }}
              >
                <InfoIcon
                  sx={{
                    color: "#5859DF",
                    fontSize: 30,
                    "&:hover": {
                      color: "#000000",
                      fontSize: 30,
                    },
                  }}
                />
              </Button>
            </Box>
          </Stack>

          <DemoContainer
            sx={{
              padding: 3,
            }}
            components={["DatePicker", "DesktopDatePicker", "MobileDatePicker"]}
          >
            <Typography fontSize={16} color={"#797979"} textAlign={"start"}>
              From
            </Typography>
            <DatePicker
              value={fromDate}
              onChange={(newValue) => handleDateChange(newValue, "fromDate")}
              slotProps={{ textField: { size: "small" } }}
              sx={datePickerStyle}
            />

            <Box display={"flex"} justifyContent={"start"}>
              <img src={VerticalBarIcon} width={2} alt="" />
            </Box>

            <Typography fontSize={16} color={"#797979"} textAlign={"start"}>
              To
            </Typography>
            <DatePicker
              value={toDate}
              readOnly
              slotProps={{ textField: { size: "small" } }}
              sx={datePickerStyle}
            />

            <Typography
              mt={3}
              fontSize={16}
              fontWeight={700}
              color={"#262626"}
              textAlign={"start"}
            >
              First available date of delivery? (optional)
            </Typography>
            <DatePicker
              value={deliveryDate}
              onChange={(newValue) =>
                handleDateChange(newValue, "deliveryDate")
              }
              slotProps={{ textField: { size: "small" } }}
              sx={datePickerStyle}
            />
          </DemoContainer>

          <Box p={3}>
            {formError && <Alert severity="error">{formError}</Alert>}
          </Box>

          <Stack
            direction="row"
            mt={3}
            justifyContent={"flex-end"}
            alignSelf={"flex-end"}
          >
            <Button
              onClick={() => {
                updateThisMoveRequest({
                  first_available_date_of_delivery: deliveryDate.isValid()
                    ? deliveryDate.format("YYYY-MM-DD")
                    : null,
                  pickup_date_from: fromDate.format("YYYY-MM-DD"),
                  pickup_date_to: toDate.format("YYYY-MM-DD"),
                });
              }}
              size="medium"
              sx={{
                width: 130,
                height: 50,
                backgroundColor: "#5858E0 !important",
                color: "#FFFFFF",
                fontSize: 12,
                fontWeight: 550,
                border: "1px solid #6552FF",
              }}
            >
              Save and Proceed
            </Button>
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

export default Pickupdate;
