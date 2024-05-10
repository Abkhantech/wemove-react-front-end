import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import logoWeMoveWhite from "../../assets/logo/wemove-white.svg";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  createCheckoutSession,
  getMoveRequestById,
  updateMoveRequestById,
} from "../../redux/actions/move-request";
import { unwrapResult } from "@reduxjs/toolkit";
import theme from "../../theme/theme";
import { loadStripe } from "@stripe/stripe-js";

// const stripe = new Stripe('pk_test_51O80iGCLryiG8vjCX2ZNIZRuDn7WrC2sKSQiLhYc0o3LgfhQCaJhcTNR2edeGCodvfUwZNg3Y98Z7EVsvNiHcgnx00ymdPPtnC', {
//   apiVersion: '2023-10-16',
// });

const notSeelectedButtonStyle = {
  width: 130,
  height: 40,
  color: "#5859DF",
  backgroundColor: "#FFFFFF !important",
  fontSize: 12,
  fontWeight: 550,
  border: "1px solid #6552FF",
};

const selectedButtonStyle = {
  width: 130,
  height: 40,
  color: "#FDFCFD",
  backgroundColor: "#46A577 !important",
  fontSize: 12,
  fontWeight: 550,
  border: "1px solid #6552FF",
};

const MoveSummary = () => {
  const isMobile = useMediaQuery(theme.breakpoints.only("xs"));
  const dispatch = useDispatch();

  const { moveRequestId } = useParams();
  const [thisMoveRequestId, setThisMoveRequestId] = useState(null);
  const [moveRequest, setMoveRequest] = useState<any>(null);

  const [isPageLoading, setIsPageLoading] = useState(false);

  const [totalCubicFeet, setTotalCubicFeet] = useState(0.0);
  const [totalMovePrice, setTotalMovePrice] = useState(0.0);
  const [weMoveCommision, setWeMoveCommission] = useState(0.0);
  const [pickupCharges, setPickupCharges] = useState(0);
  const [priceOfItemsOnly, setPriceOfItemsOnly] = useState(0.0);

  const getDate = () => {
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const date = today.getDate();
    return `${month}/${date}/${year}`;
  };

  const fetchMoveRequestById = (moveRequestId: any) => {
    dispatch<any>(getMoveRequestById(moveRequestId))
      .then(unwrapResult)
      .then((thisMoveRequest: any) => {
        setMoveRequest(thisMoveRequest);
        setTotalCubicFeet(Math.ceil(Number(thisMoveRequest.total_cubic_feet)));
        setThisMoveRequestId(thisMoveRequest.id);
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  const checkFromAddress = (moveReq: any) => {
    if (moveReq?.home_address !== null) {
      return moveReq.home_address;
    }

    if (moveReq?.apartment !== null) {
      return moveReq.apartment?.apt_address;
    }

    if (moveReq?.storage !== null) {
      return moveReq.storage?.address;
    }

    if (moveReq?.combo_home_storage !== null) {
      return (
        moveReq.combo_home_storage?.home_address.toString() +
        "/" +
        moveReq.combo_home_storage.storage?.address.toString()
      );
    }

    if (moveReq?.combo_apartment_storage !== null) {
      return (
        moveReq.combo_apartment_storage?.apartment?.apt_address.toString() +
        "/" +
        moveReq.combo_apartment_storage?.storage?.address.toString()
      );
    }
    return "---";
  };

  const formatDate = (date: Date) => {
    const isoString: string = date.toString();
    const datePart: string = isoString.split("T")[0];

    return datePart;
  };

  const chargesForPickupLocation = (move: any) => {
    let finalPickupCharges = 0;

    if (move.apartment !== null) {
      if (move.apartment.is_elevator_available === true) {
        setPickupCharges((charges) => charges + 75);
        finalPickupCharges += 75;
        return finalPickupCharges;
      } else {
        if (
          move.apartment.is_elevator_available === false &&
          move.apartment.floor_no > 2
        ) {
          const additionalFloors = Number(move.apartment.floor_no) - 2;
          const stairCharges = additionalFloors * 75;

          setPickupCharges((charges) => charges + stairCharges);
          finalPickupCharges += stairCharges;
          return finalPickupCharges;
        }
      }
    }

    if (move.storage !== null) {
      if (move.storage.is_elevator_available === true) {
        finalPickupCharges += 75;

        return finalPickupCharges;
      } else {
        if (
          move.storage.is_elevator_available === false &&
          move.storage.are_stairs_present === true
        ) {
          const additionalFloors = Number(move.storage.floor_no) - 2;
          const stairCharges = additionalFloors * 75;

          setPickupCharges((charges) => charges + stairCharges);
          finalPickupCharges += stairCharges;
          return finalPickupCharges;
        }
      }
    }

    if (move.combo_apartment_storage !== null) {
      if (
        move.combo_apartment_storage.apartment.is_elevator_available === true
      ) {
        finalPickupCharges += 75;
      } else {
        if (
          move.combo_apartment_storage.apartment.is_elevator_available ===
            false &&
          move.combo_apartment_storage.apartment.floor_no > 2
        ) {
          const additionalFloors =
            Number(move.combo_apartment_storage.apartment.floor_no) - 2;
          const stairCharges = additionalFloors * 75;

          setPickupCharges((charges) => charges + stairCharges);
          finalPickupCharges += stairCharges;
        }
      }

      if (move.combo_apartment_storage.storage.is_elevator_available === true) {
        finalPickupCharges += 75;
      } else {
        if (
          move.combo_apartment_storage.storage.is_elevator_available ===
            false &&
          move.combo_apartment_storage.storage.are_stairs_present === true
        ) {
          const additionalFloors =
            Number(move.combo_apartment_storage.storage.floor_no) - 2;
          const stairCharges = additionalFloors * 75;

          setPickupCharges((charges) => charges + stairCharges);
          finalPickupCharges += stairCharges;
        }
      }
      return finalPickupCharges;
    }

    if (move.combo_home_storage !== null) {
      if (move.combo_home_storage.storage.is_elevator_available === true) {
        finalPickupCharges += 75;
        return finalPickupCharges;
      } else {
        if (
          move.combo_home_storage.storage.is_elevator_available === false &&
          move.combo_home_storage.storage.are_stairs_present === true
        ) {
          const additionalFloors =
            Number(move.combo_home_storage.storage.floor_no) - 2;
          const stairCharges = additionalFloors * 75;
          setPickupCharges((charges) => charges + stairCharges);
          finalPickupCharges += stairCharges;
          return finalPickupCharges;
        }
      }
    }
  };

  const pricingModel = () => {
    if (
      Number(moveRequest.move_distance) > 0 &&
      Number(moveRequest.move_distance) <= 50
    ) {
      const price_per_cubic_feet = 1.53;
      const price = totalCubicFeet * price_per_cubic_feet * 1.1;
      setPriceOfItemsOnly((total) => total + price);
      setTotalMovePrice((thisPrice) => thisPrice + price);
      if (
        moveRequest.delivery_details.delivery_addresses[0]
          .delivery_location_type !== "Home"
      ) {
        if (
          moveRequest.delivery_details.delivery_addresses[0]
            .is_elevator_accessible
        ) {
          // const price_after_delivery_side_elevator = price + 75;
          setTotalMovePrice((total) => total + 75);
        } else {
          if (
            moveRequest.delivery_details.delivery_addresses[0].stiars_present
          ) {
            if (
              moveRequest.delivery_details.delivery_addresses[0].floor_no > 2
            ) {
              const additionalFloors =
                Number(
                  moveRequest.delivery_details.delivery_addresses[0].floor_no
                ) - 2;
              const flight_fee = additionalFloors * 75;
              setTotalMovePrice((total) => total + flight_fee);
            }
          }
        }
      }

      if (
        moveRequest.delivery_details.packagaing_required === true &&
        moveRequest.delivery_details.packaging !== null
      ) {
        setTotalMovePrice(
          (total) =>
            total +
            Number(moveRequest.delivery_details.packaging.packaging_payment)
        );
      }

      if (
        moveRequest.apartment !== null ||
        moveRequest.storage !== null ||
        moveRequest.combo_apartment_storage !== null ||
        moveRequest.combo_home_storage !== null
      ) {
        const charges = chargesForPickupLocation(moveRequest);
        setTotalMovePrice((total) => total + Number(charges));
      }
      setWeMoveCommission((commission) => commission + 0.129 * price);
    }

    if (
      Number(moveRequest.move_distance) > 50 &&
      Number(moveRequest.move_distance) <= 100
    ) {
      const price_per_cubic_feet = 2.82;
      const price = totalCubicFeet * price_per_cubic_feet * 1.1;
      setPriceOfItemsOnly((total) => total + price);
      setTotalMovePrice((thisPrice) => thisPrice + price);
      if (
        moveRequest.delivery_details.delivery_addresses[0]
          .delivery_location_type !== "Home"
      ) {
        if (
          moveRequest.delivery_details.delivery_addresses[0]
            .is_elevator_accessible
        ) {
          // const price_after_delivery_side_elevator = price + 75;
          setTotalMovePrice((total) => total + 75);
        } else {
          if (
            moveRequest.delivery_details.delivery_addresses[0].stiars_present
          ) {
            if (
              moveRequest.delivery_details.delivery_addresses[0].floor_no > 2
            ) {
              const additionalFloors =
                Number(
                  moveRequest.delivery_details.delivery_addresses[0].floor_no
                ) - 2;
              const flight_fee = additionalFloors * 75;
              setTotalMovePrice((total) => total + flight_fee);
            }
          }
        }
      }

      if (
        moveRequest.delivery_details.packagaing_required === true &&
        moveRequest.delivery_details.packaging !== null
      ) {
        setTotalMovePrice(
          (total) =>
            total +
            Number(moveRequest.delivery_details.packaging.packaging_payment)
        );
      }

      if (
        moveRequest.apartment !== null ||
        moveRequest.storage !== null ||
        moveRequest.combo_apartment_storage !== null ||
        moveRequest.combo_home_storage !== null
      ) {
        const charges = chargesForPickupLocation(moveRequest);
        setTotalMovePrice((total) => total + Number(charges));
      }
      setWeMoveCommission((commission) => commission + 0.129 * price);
    }

    if (
      Number(moveRequest.move_distance) > 100 &&
      Number(moveRequest.move_distance) <= 250
    ) {
      const price_per_cubic_feet = 5.12;
      const price = totalCubicFeet * price_per_cubic_feet * 1.1;
      setPriceOfItemsOnly((total) => total + price);
      setTotalMovePrice((thisPrice) => thisPrice + price);
      if (
        moveRequest.delivery_details.delivery_addresses[0]
          .delivery_location_type !== "Home"
      ) {
        if (
          moveRequest.delivery_details.delivery_addresses[0]
            .is_elevator_accessible
        ) {
          // const price_after_delivery_side_elevator = price + 75;
          setTotalMovePrice((total) => total + 75);
        } else {
          if (
            moveRequest.delivery_details.delivery_addresses[0].stiars_present
          ) {
            if (
              moveRequest.delivery_details.delivery_addresses[0].floor_no > 2
            ) {
              const additionalFloors =
                Number(
                  moveRequest.delivery_details.delivery_addresses[0].floor_no
                ) - 2;
              const flight_fee = additionalFloors * 75;
              setTotalMovePrice((total) => total + flight_fee);
            }
          }
        }
      }
      if (
        moveRequest.delivery_details.packagaing_required === true &&
        moveRequest.delivery_details.packaging !== null
      ) {
        setTotalMovePrice(
          (total) =>
            total +
            Number(moveRequest.delivery_details.packaging.packaging_payment)
        );
      }

      if (
        moveRequest.apartment !== null ||
        moveRequest.storage !== null ||
        moveRequest.combo_apartment_storage !== null ||
        moveRequest.combo_home_storage !== null
      ) {
        const charges = chargesForPickupLocation(moveRequest);
        setTotalMovePrice((total) => total + Number(charges));
      }
      setWeMoveCommission((commission) => commission + 0.279 * price);
    }

    if (
      Number(moveRequest.move_distance) > 250 &&
      Number(moveRequest.move_distance) <= 500
    ) {
      const price_per_cubic_feet = 6.4;
      const price = totalCubicFeet * price_per_cubic_feet * 1.1;
      setPriceOfItemsOnly((total) => total + price);
      setTotalMovePrice((thisPrice) => thisPrice + price);
      if (
        moveRequest.delivery_details.delivery_addresses[0]
          .delivery_location_type !== "Home"
      ) {
        if (
          moveRequest.delivery_details.delivery_addresses[0]
            .is_elevator_accessible
        ) {
          // const price_after_delivery_side_elevator = price + 75;
          setTotalMovePrice((total) => total + 75);
        } else {
          if (
            moveRequest.delivery_details.delivery_addresses[0].stiars_present
          ) {
            if (
              moveRequest.delivery_details.delivery_addresses[0].floor_no > 2
            ) {
              const additionalFloors =
                Number(
                  moveRequest.delivery_details.delivery_addresses[0].floor_no
                ) - 2;
              const flight_fee = additionalFloors * 75;
              setTotalMovePrice((total) => total + flight_fee);
            }
          }
        }
      }
      if (
        moveRequest.delivery_details.packagaing_required === true &&
        moveRequest.delivery_details.packaging !== null
      ) {
        setTotalMovePrice(
          (total) =>
            total +
            Number(moveRequest.delivery_details.packaging.packaging_payment)
        );
      }

      if (
        moveRequest.apartment !== null ||
        moveRequest.storage !== null ||
        moveRequest.combo_apartment_storage !== null ||
        moveRequest.combo_home_storage !== null
      ) {
        const charges = chargesForPickupLocation(moveRequest);
        setTotalMovePrice((total) => total + Number(charges));
      }
      setWeMoveCommission((commission) => commission + 0.279 * price);
    }

    if (
      Number(moveRequest.move_distance) > 500 &&
      Number(moveRequest.move_distance) <= 1500
    ) {
      const price_per_cubic_feet = 7.67;
      const price = totalCubicFeet * price_per_cubic_feet * 1.1;
      setPriceOfItemsOnly((total) => total + price);
      setTotalMovePrice((thisPrice) => thisPrice + price);
      if (
        moveRequest.delivery_details.delivery_addresses[0]
          .delivery_location_type !== "Home"
      ) {
        if (
          moveRequest.delivery_details.delivery_addresses[0]
            .is_elevator_accessible
        ) {
          // const price_after_delivery_side_elevator = price + 75;
          setTotalMovePrice((total) => total + 75);
        } else {
          if (
            moveRequest.delivery_details.delivery_addresses[0].stiars_present
          ) {
            if (
              moveRequest.delivery_details.delivery_addresses[0].floor_no > 2
            ) {
              const additionalFloors =
                Number(
                  moveRequest.delivery_details.delivery_addresses[0].floor_no
                ) - 2;
              const flight_fee = additionalFloors * 75;
              setTotalMovePrice((total) => total + flight_fee);
            }
          }
        }
      }

      if (
        moveRequest.delivery_details.packagaing_required === true &&
        moveRequest.delivery_details.packaging !== null
      ) {
        setTotalMovePrice(
          (total) =>
            total +
            Number(moveRequest.delivery_details.packaging.packaging_payment)
        );
      }
      if (
        moveRequest.apartment !== null ||
        moveRequest.storage !== null ||
        moveRequest.combo_apartment_storage !== null ||
        moveRequest.combo_home_storage !== null
      ) {
        const charges = chargesForPickupLocation(moveRequest);
        setTotalMovePrice((total) => total + Number(charges));
      }
      setWeMoveCommission((commission) => commission + 0.279 * price);
    }

    if (
      Number(moveRequest.move_distance) > 1500 &&
      Number(moveRequest.move_distance) <= 2250
    ) {
      const price_per_cubic_feet = 8.95;
      const price = totalCubicFeet * price_per_cubic_feet * 1.1;
      setPriceOfItemsOnly((total) => total + price);
      setTotalMovePrice((thisPrice) => thisPrice + price);
      if (
        moveRequest.delivery_details.delivery_addresses[0]
          .delivery_location_type !== "Home"
      ) {
        if (
          moveRequest.delivery_details.delivery_addresses[0]
            .is_elevator_accessible
        ) {
          // const price_after_delivery_side_elevator = price + 75;
          setTotalMovePrice((total) => total + 75);
        } else {
          if (
            moveRequest.delivery_details.delivery_addresses[0].stiars_present
          ) {
            if (
              moveRequest.delivery_details.delivery_addresses[0].floor_no > 2
            ) {
              const additionalFloors =
                Number(
                  moveRequest.delivery_details.delivery_addresses[0].floor_no
                ) - 2;
              const flight_fee = additionalFloors * 75;
              setTotalMovePrice((total) => total + flight_fee);
            }
          }
        }
      }
      if (
        moveRequest.delivery_details.packagaing_required === true &&
        moveRequest.delivery_details.packaging !== null
      ) {
        setTotalMovePrice(
          (total) =>
            total +
            Number(moveRequest.delivery_details.packaging.packaging_payment)
        );
      }
      if (
        moveRequest.apartment !== null ||
        moveRequest.storage !== null ||
        moveRequest.combo_apartment_storage !== null ||
        moveRequest.combo_home_storage !== null
      ) {
        const charges = chargesForPickupLocation(moveRequest);
        setTotalMovePrice((total) => total + Number(charges));
      }
      setWeMoveCommission((commission) => commission + 0.279 * price);
    }

    if (
      Number(moveRequest.move_distance) > 2250 &&
      Number(moveRequest.move_distance) <= 3500
    ) {
      const price_per_cubic_feet = 10.23;
      const price = totalCubicFeet * price_per_cubic_feet * 1.1;
      setPriceOfItemsOnly((total) => total + price);
      setTotalMovePrice((thisPrice) => thisPrice + price);
      if (
        moveRequest.delivery_details.delivery_addresses[0]
          .delivery_location_type !== "Home"
      ) {
        if (
          moveRequest.delivery_details.delivery_addresses[0]
            .is_elevator_accessible
        ) {
          // const price_after_delivery_side_elevator = price + 75;
          setTotalMovePrice((total) => total + 75);
        } else {
          if (
            moveRequest.delivery_details.delivery_addresses[0].stiars_present
          ) {
            if (
              moveRequest.delivery_details.delivery_addresses[0].floor_no > 2
            ) {
              const additionalFloors =
                Number(
                  moveRequest.delivery_details.delivery_addresses[0].floor_no
                ) - 2;
              const flight_fee = additionalFloors * 75;
              setTotalMovePrice((total) => total + flight_fee);
            }
          }
        }
      }
      if (
        moveRequest.delivery_details.packagaing_required === true &&
        moveRequest.delivery_details.packaging !== null
      ) {
        setTotalMovePrice(
          (total) =>
            total +
            Number(moveRequest.delivery_details.packaging.packaging_payment)
        );
      }

      if (
        moveRequest.apartment !== null ||
        moveRequest.storage !== null ||
        moveRequest.combo_apartment_storage !== null ||
        moveRequest.combo_home_storage !== null
      ) {
        const charges = chargesForPickupLocation(moveRequest);
        setTotalMovePrice((total) => total + Number(charges));
      }
      setWeMoveCommission((commission) => commission + 0.279 * price);
    }
  };

  const updateThisMoveRequest = async (params: any) => {
    const stripe = await loadStripe(
      "pk_test_51O80iGCLryiG8vjCX2ZNIZRuDn7WrC2sKSQiLhYc0o3LgfhQCaJhcTNR2edeGCodvfUwZNg3Y98Z7EVsvNiHcgnx00ymdPPtnC"
    );

    setIsPageLoading(true);
    const valueToSend = Math.ceil(weMoveCommision) * 100;

    const body = {
      price: valueToSend,
      canonical_id: moveRequestId,
    };

    const finalParams = {
      id: thisMoveRequestId,
      ...params,
    };

    dispatch<any>(updateMoveRequestById(finalParams))
      .then(unwrapResult)
      .then((res: any) => {
        setMoveRequest(res);
        dispatch<any>(createCheckoutSession(body))
          .then(unwrapResult)
          .then((responseSession: any) => {
            stripe?.redirectToCheckout({
              sessionId: responseSession.sessionId,
            });
            setTimeout(() => {
              setIsPageLoading(false);
            }, 1300);
          })
          .catch((err: any) => {
            console.log(err);
            setTimeout(() => {
              setIsPageLoading(false);
            }, 1300);
          });
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (totalCubicFeet !== 0.0 && totalMovePrice === 0.0) {
      pricingModel();
    }
  }, [totalCubicFeet]);

  useEffect(() => {
    setIsPageLoading(true);
    fetchMoveRequestById(moveRequestId);
    setTimeout(() => {
      setIsPageLoading(false);
    }, 1300);
  }, []);

  return (
    <>
      <Grid
        sx={{
          background: "#5858E0 !important",
        }}
        container
        mb={2}
        p={1}
      >
        <Grid item xs={12} md={8} p={2} marginX={"auto"}>
          <Box
            display={isMobile ? "block" : "flex"}
            justifyContent={"space-between"}
          >
            <Stack>
              <Stack alignItems={"center"} direction={"row"}>
                <img src={logoWeMoveWhite} width={175} alt="" />
              </Stack>
              <Typography
                fontSize={14}
                fontWeight={600}
                mt={2}
                ml={0.5}
                color={"#FFFFFF"}
              >
                {getDate()}
              </Typography>
            </Stack>

            <Typography fontSize={28} fontWeight={700} color={"#FFFFFF"}>
              Summary of the Move
            </Typography>
          </Box>

          {moveRequest && (
            <>
              <Stack mt={5} spacing={1.5}>
                <Box
                  sx={{
                    p: 0.5,
                    borderBottom: "0.5px solid #D9D9D9",
                    background: "#F4F1DE",
                  }}
                >
                  <Typography
                    fontSize={16}
                    fontWeight={600}
                    ml={1}
                    color={"#797979"}
                  >
                    Including Service
                  </Typography>
                </Box>

                <Stack direction={"row"} justifyContent={"space-between"}>
                  <Typography fontSize={16} fontWeight={600} color={"#FFFFFF"}>
                    Move Type
                  </Typography>
                  <Typography fontSize={14} fontWeight={600} color={"#FFFFFF"}>
                    {moveRequest?.move_type}
                  </Typography>
                </Stack>

                <Divider />

                <Stack direction={"row"} justifyContent={"space-between"}>
                  <Typography fontSize={16} fontWeight={600} color={"#FFFFFF"}>
                    Pickup Location Address
                  </Typography>
                  <Typography fontSize={14} fontWeight={600} color={"#FFFFFF"}>
                    {checkFromAddress(moveRequest)}
                  </Typography>
                </Stack>

                <Divider />

                <Stack direction={"row"} justifyContent={"space-between"}>
                  <Typography fontSize={16} fontWeight={600} color={"#FFFFFF"}>
                    Delivery Location Address
                  </Typography>
                  {moveRequest?.delivery_details?.delivery_addresses.map(
                    (item: any) => (
                      <Typography
                        key={item.id}
                        fontSize={14}
                        fontWeight={600}
                        color={"#FFFFFF"}
                      >
                        {item?.complete_address}
                      </Typography>
                    )
                  )}
                </Stack>

                <Divider />

                <Stack direction={"row"} justifyContent={"space-between"}>
                  <Typography fontSize={16} fontWeight={600} color={"#FFFFFF"}>
                    Move Distance
                  </Typography>
                  <Typography fontSize={14} fontWeight={600} color={"#FFFFFF"}>
                    {moveRequest?.move_distance}
                    {" miles"}
                  </Typography>
                </Stack>

                <Divider />

                <Stack direction={"row"} justifyContent={"space-between"}>
                  <Typography fontSize={16} fontWeight={600} color={"#FFFFFF"}>
                    Shuttle Required
                  </Typography>
                  <Typography fontSize={14} fontWeight={600} color={"#FFFFFF"}>
                    {moveRequest?.delivery_details.shuttle_required==='YES'
                      ? "YES": moveRequest?.delivery_details.shuttle_required==='NO'? 'NO'
                      : "UNSURE"}
                  </Typography>
                </Stack>

                <Divider />

                <Stack direction={"row"} justifyContent={"space-between"}>
                  <Typography fontSize={16} fontWeight={600} color={"#FFFFFF"}>
                    Can we get a truck in front of your location?
                  </Typography>
                  <Typography fontSize={14} fontWeight={600} color={"#FFFFFF"}>
                    {moveRequest?.delivery_details.open_location==='YES' ? "YES" :
                    moveRequest?.delivery_details.open_location==='NO'? 'NO':
                    "UNSURE"}
                  </Typography>
                </Stack>

                <Divider />

                <Stack direction={"row"} justifyContent={"space-between"}>
                  <Typography fontSize={16} fontWeight={600} color={"#FFFFFF"}>
                    FADD (First Available Date of Delivery)
                  </Typography>
                  <Typography fontSize={14} fontWeight={600} color={"#FFFFFF"}>
                    {moveRequest?.first_available_date_of_delivery
                      ? formatDate(
                          moveRequest?.first_available_date_of_delivery
                        )
                      : "-"}
                  </Typography>
                </Stack>

                <Divider />

                <Stack direction={"row"} justifyContent={"space-between"}>
                  <Typography fontSize={16} fontWeight={600} color={"#FFFFFF"}>
                    Total Price of the Items to be moved
                  </Typography>
                  <Typography fontSize={14} fontWeight={600} color={"#FFFFFF"}>
                    ${Math.ceil(priceOfItemsOnly)}
                  </Typography>
                </Stack>

                <Divider />

                <Stack direction={"row"} justifyContent={"space-between"}>
                  <Typography fontSize={16} fontWeight={600} color={"#FFFFFF"}>
                    Packaging Required
                  </Typography>
                  <Typography fontSize={14} fontWeight={600} color={"#FFFFFF"}>
                    {moveRequest?.delivery_details?.packagaing_required
                      ? "YES"
                      : "NO"}
                  </Typography>
                </Stack>

                <Divider />

                <Stack direction={"row"} justifyContent={"space-between"}>
                  <Typography fontSize={16} fontWeight={600} color={"#FFFFFF"}>
                    Packaging Type Selected by Consumer
                  </Typography>
                  <Typography fontSize={14} fontWeight={600} color={"#FFFFFF"}>
                    {moveRequest?.delivery_details?.packaging?.packaging_type ||
                      "-"}
                  </Typography>
                </Stack>

                <Divider />

                <Stack direction={"row"} justifyContent={"space-between"}>
                  <Typography fontSize={16} fontWeight={600} color={"#FFFFFF"}>
                    Total Price of Packaging Consumer has to pay
                  </Typography>
                  <Typography fontSize={14} fontWeight={600} color={"#FFFFFF"}>
                    {moveRequest?.delivery_details?.packaging?.packaging_payment
                      ? "$" +
                        moveRequest?.delivery_details?.packaging
                          ?.packaging_payment
                      : "-"}
                  </Typography>
                </Stack>

                <Divider />

                <Stack direction={"row"} justifyContent={"space-between"}>
                  <Typography fontSize={16} fontWeight={600} color={"#FFFFFF"}>
                    Total Price of the move
                  </Typography>
                  <Typography fontSize={14} fontWeight={600} color={"#FFFFFF"}>
                    ${Math.ceil(totalMovePrice)}
                  </Typography>
                </Stack>

                <Divider />

                <Stack direction={"row"} justifyContent={"space-between"}>
                  <Typography fontSize={16} fontWeight={600} color={"#FFFFFF"}>
                    Payment to confirm the move
                  </Typography>
                  <Typography fontSize={14} fontWeight={600} color={"#FFFFFF"}>
                    $ {Math.ceil(weMoveCommision)}
                  </Typography>
                </Stack>

                <Divider />

                <Typography fontSize={16} fontWeight={600} color={"#FFFFFF"}>
                  List of Items Consumer is moving
                </Typography>

                {moveRequest.roomDetails ? (
                  moveRequest?.roomDetails?.map((room: any) => {
                    return (
                      <Typography
                        key={room.id}
                        fontSize={14}
                        fontWeight={600}
                        color={"#FFFFFF"}
                      >
                        {room.title
                          ? room.title + ":"
                          : "No name given to room:"}
                        {room.items.map((item: any) => {
                          return (
                            <Typography
                              key={item.id}
                              fontSize={14}
                              fontWeight={600}
                              color={"#FFFFFF"}
                            >
                              {item.item_name}
                            </Typography>
                          );
                        })}
                      </Typography>
                    );
                  })
                ) : (
                  <Typography>-</Typography>
                )}

                <Divider />
              </Stack>
            </>
          )}

          <Box mt={4}>
            <Typography
              fontSize={18}
              fontWeight={700}
              color={"#FFFFFF"}
              textAlign={"center"}
            >
              Do you want to Proceed?
            </Typography>

            <Stack direction="row" mt={2} spacing={2} justifyContent={"center"}>
              <Button
                size="large"
                sx={notSeelectedButtonStyle}
                onClick={() => {
                  console.log(weMoveCommision);
                }}
              >
                No
              </Button>

              <Button
                size="large"
                onClick={() => {
                  updateThisMoveRequest({
                    move_payment: Math.ceil(Number(totalMovePrice)),
                  });
                }}
                sx={selectedButtonStyle}
              >
                Yes
              </Button>
            </Stack>
          </Box>

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

export default MoveSummary;
