import {
  Backdrop,
  Button,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  createThieMoveRequest,
  getAllMoveRequestsByConsumerID,
} from "../../redux/actions/move-request";
import { unwrapResult } from "@reduxjs/toolkit";
import { getConsumerById } from "../../redux/actions/consumer";
import ServiceSelectionModal from "../modals/serviceSelectionModal";
import OutOfStateMoveModal from "../modals/outOfStateMoveModal";
import ApartmentOnlyModal from "../modals/apartmentOnlyModal";
import ComboApartmentStorageModal from "../modals/comboApartmentStorageModal";
import HomeStorageCombo from "../modals/homeStorageCombo";
import HomeOrTownOnlyModal from "../modals/homeOrTownOnlyModal";
import StorageOnlyModal from "../modals/storageOnlyModal";
import MoveRequestDetail from "../moveRequestDetail/moveRequestDetail";

const ConsumerDashboard = ({ consumerId }: any) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.only("xs"));

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);

  const [consumer, setConsumer] = useState<any>();
  const [allMoveRequests, setAllMoveRequests] = useState<any>([]);
  const [thisMoveRequest, setThisMoveRequest] = useState<any>(null);

  const [moveType, setMoveType] = useState("");

  const [isShowAllMoveRequests, setIsShowAllMoveRequests] = useState(true);
  const [isMoveRequestDetail, setIsMoveRequestDetail] = useState<any>(null);

  const [isServiceSelectionModal, setIsServiceSelectionModal] = useState(false);
  const [isApartmenOnlyModal, setIsApartmenOnlyModal] = useState(false);
  const [isHomeStorageComboModal, setIsHomeStorageComboModal] = useState(false);
  const [homeOnlyModalVisible, setHomeOnlyModalVisible] = useState(false);
  const [storageOnlyModalVisible, setStorageOnlyModalVisible] = useState(false);
  const [outOfStateMoveModalVisible, setOutOfStateMoveModalVisible] =
    useState(false);
  const [isBackTrue, setIsBackTrue] = useState(false);
  const [
    comboApartmentStorageModalVisible,
    setComboApartmentStorageModalVisible,
  ] = useState(false);

  const fetchAllMoveReuqests = () => {
    dispatch<any>(getAllMoveRequestsByConsumerID(Number(consumerId)))
      .then(unwrapResult)
      .then((moveRequests: any) => {
        setAllMoveRequests(moveRequests);
      });
  };

  const fetchThisConsumer = () => {
    dispatch<any>(getConsumerById(Number(consumerId)))
      .then(unwrapResult)
      .then((consumer: any) => {
        setConsumer(consumer);
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  const checkFromAddress = (moveReq: any) => {
    if (moveReq.home_address !== null) {
      return moveReq.home_address;
    }
    if (moveReq.apartment !== null) {
      return moveReq.apartment?.apt_address;
    }
    if (moveReq.storage !== null) {
      return moveReq.storage?.address;
    }
    if (moveReq.combo_home_storage !== null) {
      return (
        moveReq.combo_home_storage?.home_address.toString() +
        "/" +
        moveReq.combo_home_storage.storage?.address.toString()
      );
    }
    if (moveReq.combo_apartment_storage !== null) {
      return (
        moveReq.combo_apartment_storage?.apartment?.apt_address.toString() +
        "/" +
        moveReq.combo_apartment_storage?.storage?.address.toString()
      );
    }
  };

  const navigateToLastLeft = (moveRequest: any) => {
    console.log(moveRequest.canonical_id);
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
          if (moveRequest.delivery_details?.packagaing_required === null) {
            navigate(`/packages/${moveRequest.canonical_id}`);
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
                }
              }
            }
          }
        }
      }
    }
  };

  const createMoveRequest = (body: any) => {
    setIsLoading(true);
    const params = {
      consumerId: consumer.id,
      body: body,
    };
    console.log('THE BODY--->',params)
    dispatch<any>(createThieMoveRequest(params))
      .then(unwrapResult)
      .then((res: any) => {
        setThisMoveRequest(res);
        setIsLoading(false);
        console.log(res, "created new");
        if (isServiceSelectionModal === true) {
          setOutOfStateMoveModalVisible(true);
          setIsServiceSelectionModal(false);
        } else {
          if (
            outOfStateMoveModalVisible === true &&
            moveType === "apartment-only"
          ) {
            setOutOfStateMoveModalVisible(false);
            setIsApartmenOnlyModal(true);
          } else {
            if (
              outOfStateMoveModalVisible === true &&
              moveType === "combo-apartment-storage"
            ) {
              setOutOfStateMoveModalVisible(false);
              setComboApartmentStorageModalVisible(true);
            } else {
              if (
                outOfStateMoveModalVisible === true &&
                moveType === "combo-home-storage"
              ) {
                setOutOfStateMoveModalVisible(false);
                setIsHomeStorageComboModal(true);
              } else {
                if (
                  outOfStateMoveModalVisible === true &&
                  moveType === "home-only"
                ) {
                  setOutOfStateMoveModalVisible(false);
                  setHomeOnlyModalVisible(true);
                } else {
                  if (
                    outOfStateMoveModalVisible === true &&
                    moveType === "storage-only"
                  ) {
                    setOutOfStateMoveModalVisible(false);
                    setStorageOnlyModalVisible(true);
                  } else {
                    if (res.location_type === "storage-only") {
                      navigate(`/addressInfo/${thisMoveRequest.canonical_id}`);
                    } else {
                      navigate(
                        `/video-guidelines/${thisMoveRequest.canonical_id}`
                      );
                    }
                  }
                }
              }
            }
          }
        }
      })
      .catch((err: any) => {
        setIsLoading(false);
      });
  };

  const handleMoveRequestDetail = (moveRequest: any) => {
    setIsShowAllMoveRequests(false);
    setIsMoveRequestDetail(moveRequest);
  };

  useEffect(() => {
    setIsLoading(true);
    fetchThisConsumer();
    fetchAllMoveReuqests();
    setTimeout(() => {
      setIsLoading(false);
    }, 1300);
  }, []);

  return (
    <>
      {isMoveRequestDetail !== null && (
        <MoveRequestDetail
          moveRequest={isMoveRequestDetail}
          setIsMoveRequestDetail={setIsMoveRequestDetail}
          setIsShowAllMoveRequests={setIsShowAllMoveRequests}
        />
      )}
      {isServiceSelectionModal && (
        <ServiceSelectionModal
          isServiceSelectionModal={isServiceSelectionModal}
          setIsServiceSelectionModal={setIsServiceSelectionModal}
          createMoveRequest={createMoveRequest}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          thisMoveRequest={thisMoveRequest}
        />
      )}
      {outOfStateMoveModalVisible && (
        <OutOfStateMoveModal
          outOfStateMoveModalVisible={outOfStateMoveModalVisible}
          setOutOfStateMoveModalVisible={setOutOfStateMoveModalVisible}
          createMoveRequest={createMoveRequest}
          thisMoveRequest={thisMoveRequest}
          moveType={moveType}
          setMoveType={setMoveType}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setIsServiceSelectionModal={setIsServiceSelectionModal}
        />
      )}
      {isApartmenOnlyModal && (
        <ApartmentOnlyModal
          isApartmenOnlyModal={isApartmenOnlyModal}
          setIsApartmenOnlyModal={setIsApartmenOnlyModal}
          createMoveRequest={createMoveRequest}
          thisMoveRequest={thisMoveRequest}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      )}
      {comboApartmentStorageModalVisible && (
        <ComboApartmentStorageModal
          comboApartmentStorageModalVisible={comboApartmentStorageModalVisible}
          setComboApartmentStorageModalVisible={
            setComboApartmentStorageModalVisible
          }
          createMoveRequest={createMoveRequest}
          thisMoveRequest={thisMoveRequest}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      )}
      {isHomeStorageComboModal && (
        <HomeStorageCombo
          isHomeStorageComboModal={isHomeStorageComboModal}
          setIsHomeStorageComboModal={setIsHomeStorageComboModal}
          createMoveRequest={createMoveRequest}
          thisMoveRequest={thisMoveRequest}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      )}
      {homeOnlyModalVisible && (
        <HomeOrTownOnlyModal
          homeOnlyModalVisible={homeOnlyModalVisible}
          setHomeOnlyModalVisible={setHomeOnlyModalVisible}
          createMoveRequest={createMoveRequest}
          thisMoveRequest={thisMoveRequest}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      )}
      {storageOnlyModalVisible && (
        <StorageOnlyModal
          storageOnlyModalVisible={storageOnlyModalVisible}
          setStorageOnlyModalVisible={setStorageOnlyModalVisible}
          createMoveRequest={createMoveRequest}
          thisMoveRequest={thisMoveRequest}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      )}
      {isShowAllMoveRequests && (
        <Grid mt={2} item xs={12} md={6}>
          <Stack
            display={"flex"}
            justifyContent={"center"}
            direction={"row"}
            spacing={2}
            alignItems={"center"}
            marginBottom={2}
            marginX={1}
          >
            <Typography fontWeight={500} fontSize={16}>
              ARE YOU READY TO MAKE A MOVE? LET'S GO!
            </Typography>
            <Button
              onClick={() => {
                setIsServiceSelectionModal(true);
              }}
              sx={{
                borderColor: "#5858E0",
                bgcolor: "#5858E0",
                color: "#FFFFFF",
                "&:hover": {
                  backgroundColor: "#FFFFFF",
                  color: "#5858E0",
                },
              }}
              variant="outlined"
            >
              Start a new Move
            </Button>
          </Stack>
          <Divider />
          <Stack>
            <Typography
              sx={{ textDecoration: "underline" }}
              fontWeight={"600"}
              fontSize={20}
              mt={1}
              mb={1}
              alignSelf={"center"}
            >
              MOVE REQUESTS
            </Typography>

            <TableContainer
              sx={{ width: isMobile ? "85vw" : "100%" }}
              component={Paper}
            >
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead sx={{ backgroundColor: "#5858E0" }}>
                  <TableRow>
                    <TableCell
                      align="center"
                      sx={{ fontWeight: "600", fontSize: 12 }}
                    >
                      Move Order #
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ fontWeight: "600", fontSize: 12 }}
                    >
                      Move Details
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ fontWeight: "600", fontSize: 12 }}
                    >
                      From Address
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ fontWeight: "600", fontSize: 12 }}
                    >
                      To Address
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ fontWeight: "600", fontSize: 12 }}
                    >
                      Pick-up Date
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ fontWeight: "600", fontSize: 12 }}
                    >
                      FADD
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ fontWeight: "600", fontSize: 12 }}
                    >
                      Total cubic-feet
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ fontWeight: "600", fontSize: 12 }}
                    >
                      Total Payment
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ fontWeight: "600", fontSize: 12 }}
                    >
                      Total Deposit Paid
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ fontWeight: "600", fontSize: 12 }}
                    >
                      Balance Due
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ fontWeight: "600", fontSize: 12 }}
                    >
                      Carrier Name
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ fontWeight: "600", fontSize: 12 }}
                    >
                      Carrier Phone
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ fontWeight: "600", fontSize: 12 }}
                    >
                      Info Status
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {allMoveRequests.map((thisRequest: any) => (
                    <TableRow
                      key={thisRequest.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell sx={{ fontWeight: "600" }} align="center">
                        {thisRequest.move_order_number}
                      </TableCell>
                      <TableCell sx={{ fontWeight: "600" }} align="center">
                        <Button
                          onClick={() => {
                            handleMoveRequestDetail(thisRequest);
                          }}
                        >
                          View Details
                        </Button>
                      </TableCell>
                      <TableCell align="center">
                        {checkFromAddress(thisRequest)}
                      </TableCell>
                      <TableCell align="center">
                        {thisRequest.delivery_details?.delivery_addresses
                          ?.length
                          ? thisRequest.delivery_details.delivery_addresses[0]
                              .complete_address
                          : "NaN"}
                      </TableCell>
                      <TableCell align="center">
                        {thisRequest.pickup_date_from
                          ? new Date(
                              thisRequest.pickup_date_from
                            ).toLocaleDateString("en-US", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })
                          : "NaN"}{" "}
                        -{" "}
                        {thisRequest.pickup_date_to
                          ? new Date(
                              thisRequest.pickup_date_to
                            ).toLocaleDateString("en-US", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })
                          : "NaN"}
                      </TableCell>
                      <TableCell align="center">
                        {thisRequest.first_available_date_of_delivery
                          ? new Date(
                              thisRequest.first_available_date_of_delivery
                            ).toLocaleDateString("en-US", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })
                          : "NaN"}
                      </TableCell>
                      <TableCell align="center">
                        {thisRequest.total_cubic_feet
                          ? thisRequest.total_cubic_feet
                          : "NaN"}
                      </TableCell>
                      <TableCell align="center">
                        {thisRequest.move_payment
                          ? thisRequest.move_payment
                          : "NaN"}
                      </TableCell>
                      <TableCell align="center">30%</TableCell>
                      <TableCell align="center">70%</TableCell>
                      <TableCell align="center">
                        {thisRequest.pickup_carrier
                          ? thisRequest.pickup_carrier?.company_name
                          : "Not Assigned"}
                      </TableCell>
                      <TableCell align="center">
                        {thisRequest.pickup_carrier
                          ? thisRequest.pickup_carrier?.owner_phone_number
                          : "-"}
                      </TableCell>
                      <TableCell sx={{ fontWeight: "600", fontSize: 12 }}>
                        {thisRequest.delivery_details === null ||
                        thisRequest.delivery_details?.delivery_addresses
                          ?.length === 0 ||
                        thisRequest.delivery_details?.packagaing_required ===
                          null ||
                        thisRequest.pickup_date_from === null ||
                        thisRequest.pickup_date_to === null ||
                        thisRequest.delivery_details?.open_location === null ||
                        thisRequest.items?.length === 0 ? (
                          <Button
                            onClick={() => {
                              navigateToLastLeft(thisRequest);
                            }}
                            sx={{
                              borderColor: "#5858E0",
                              bgcolor: "#5858E0",
                              color: "#FFFFFF",
                              fontSize: 10,
                              "&:hover": {
                                backgroundColor: "#000000",
                                color: "#FFFFFF",
                                fontSize: 10,
                              },
                            }}
                            variant="outlined"
                          >
                            Complete Move
                          </Button>
                        ) : (
                          <Typography fontSize={12}>Completed</Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Stack>
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
        </Grid>
      )}
    </>
  );
};

export default ConsumerDashboard;
