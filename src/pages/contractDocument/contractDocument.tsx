import { Backdrop, Box, Grid, LinearProgress, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getMoveRequestById } from "../../redux/actions/move-request";
import { unwrapResult } from "@reduxjs/toolkit";
import { io } from "socket.io-client";

const ContractDocument = () => {
  const thisUrl = process.env.REACT_APP_API_URL || "";

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { moveRequestId } = useParams();

  const [moveRequest, setMoveRequest] = useState<any>(null);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [isConformationModal, setIsConformationModal] = useState(false);

  const [sessionId, setSessionId] = useState("");

  const getDate = () => {
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const date = today.getDate();
    return `${year}-${month}-${date}`;
  };

  const formatDate = (dateString: any) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
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
      return moveReq.combo_home_storage?.home_address.toString();
    }
    if (moveReq?.combo_apartment_storage !== null) {
      return moveReq.combo_apartment_storage?.apartment?.apt_address.toString();
    }
    return "---";
  };

  const splitAddressCity = (address: string, arg: string) => {
    const parts = address.split(",").map((part: string) => part.trim());
    const zip = parts[parts.length - 1];
    const country = parts.length >= 2 ? parts[parts.length - 2] : undefined;
    const state = parts.length >= 3 ? parts[parts.length - 3] : undefined;
    const city = parts.length >= 4 ? parts[parts.length - 4] : undefined;

    if (arg === "city") {
      return city;
    } else if (arg === "state") {
      return state;
    } else if (arg === "zip") {
      return zip;
    } else if (arg === "country") {
      return country;
    }
  };

  const elevatorOrStairsCharges = (move: any, climbType: string) => {
    let elevatorPayment = 0;
    let stairsPayment = 0;

    if (
      move.delivery_details?.delivery_addresses[0]?.is_elevator_accessible ===
      true
    ) {
      elevatorPayment = +75;
    } else {
      if (
        move.delivery_details?.delivery_addresses[0]?.is_elevator_accessible ===
          false &&
        move.delivery_details?.delivery_addresses[0]?.stiars_present === true
      ) {
        const floors = move.delivery_details.delivery_addresses[0].floor_no - 2;
        const stairCharges = floors * 75;
        stairsPayment += stairCharges;
      }
    }

    if (move.apartment !== null) {
      if (move.apartment.is_elevator_available === true) {
        elevatorPayment = +75;
      } else {
        if (
          move.apartment.is_elevator_accessible === false &&
          move.apartment.floor_no > 2
        ) {
          const additionalFloors = Number(move.apartment.floor_no) - 2;
          const stairCharges = additionalFloors * 75;

          stairsPayment += stairCharges;
        }
      }
    }

    if (move.storage !== null) {
      if (move.storage.is_elevator_available === true) {
        elevatorPayment = +75;
      } else {
        if (
          move.storage.is_elevator_available === false &&
          move.storage.are_stairs_present === true
        ) {
          const additionalFloors = Number(move.storage.floor_no) - 2;
          const stairCharges = additionalFloors * 75;

          stairsPayment += stairCharges;
        }
      }
    }

    if (move.combo_apartment_storage !== null) {
      if (
        move.combo_apartment_storage.apartment.is_elevator_available === true
      ) {
        elevatorPayment = +75;
      } else {
        if (
          move.combo_apartment_storage.apartment.is_elevator_available ===
            false &&
          move.combo_apartment_storage.apartment.floor_no > 2
        ) {
          const additionalFloors =
            Number(move.combo_apartment_storage.apartment.floor_no) - 2;
          const stairCharges = additionalFloors * 75;

          stairsPayment += stairCharges;
        }
      }

      if (move.combo_apartment_storage.storage.is_elevator_available === true) {
        elevatorPayment = +75;
      } else {
        if (
          move.combo_apartment_storage.storage.is_elevator_available ===
            false &&
          move.combo_apartment_storage.storage.are_stairs_present === true
        ) {
          const additionalFloors =
            Number(move.combo_apartment_storage.storage.floor_no) - 2;
          const stairCharges = additionalFloors * 75;

          stairsPayment += stairCharges;
        }
      }
    }

    if (move.combo_home_storage !== null) {
      if (move.combo_home_storage.storage.is_elevator_available === true) {
        elevatorPayment = +75;
      } else {
        if (
          move.combo_home_storage.storage.is_elevator_available === false &&
          move.combo_home_storage.storage.are_stairs_present === true
        ) {
          const additionalFloors =
            Number(move.combo_home_storage.storage.floor_no) - 2;
          const stairCharges = additionalFloors * 75;
          stairsPayment += stairCharges;
        }
      }
    }

    if (climbType === "elevator") {
      return elevatorPayment;
    } else {
      if (climbType === "stairs") {
        return stairsPayment;
      }
    }
  };

  const fetchMoveRequestById = (moveRequestId: any) => {
    dispatch<any>(getMoveRequestById(moveRequestId))
      .then(unwrapResult)
      .then((thisMoveRequest: any) => {
        setMoveRequest(thisMoveRequest);
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  const createDocumentFromTemplate = async () => {
    const documentCreateUrl = "https://api.pandadoc.com/public/v1/documents";
    const apiKey = "05735913dff0d6e9c0e8ea74e6de503cb0b37df4";
    const templateId = "4CeycrVBAL9sVqNKUq8hqZ";
    const recipientEmail = moveRequest.user.email;

    const data = {
      name: "WeMove Document Template",
      template_uuid: templateId,
      
      recipients: [
        {
          email: moveRequest.user.email,
          first_name: moveRequest.user.first_name,
          last_name: moveRequest.user.last_name,
          role: "Client",
        },
      ],

      tokens: [
        //Section 1
        {
          name: "form1Title",
          value: "BILL OF LADING",
        },
        {
          name: "form2Title",
          value: "MOVE ESTIMATE",
        },
        {
          name: "companyName",
          value: "WeMove Carrier Network",
        },
        {
          name: "companyAddress",
          value: "254 Chapman Road, Suite 209",
        },
        {
          name: "companyCity",
          value: "Newark",
        },
        {
          name: "companyPhone",
          value: "754-249-2015",
        },
        {
          name: "companyZip",
          value: "19702",
        },
        {
          name: "companyState",
          value: "DE",
        },

        //Customer Details Column 1
        {
          name: "customerName",
          value:
            moveRequest?.user?.first_name + " " + moveRequest?.user?.last_name,
        },
        {
          name: "pickupAddress",
          value: checkFromAddress(moveRequest),
        },
        {
          name: "pickupCityState",
          value:
            splitAddressCity(checkFromAddress(moveRequest), "city") +
            ", " +
            splitAddressCity(checkFromAddress(moveRequest), "state"),
        },
        {
          name: "pickupZip",
          value: splitAddressCity(checkFromAddress(moveRequest), "zip"),
        },
        {
          name: "moveDate",
          value:
            formatDate(moveRequest?.pickup_date_from) +
            " to " +
            formatDate(moveRequest?.pickup_date_to),
        },
        {
          name: "paymentType",
          value: "Stripe Checkout",
        },
        {
          name: "estimatedCost",
          value: `$ ${moveRequest?.move_payment}` || "-",
        },
        {
          name: "packingAndMaterials",
          value: `${
            moveRequest?.delivery_details?.packaging?.packaging_payment
              ? "$ " +
                moveRequest?.delivery_details?.packaging?.packaging_payment
              : "-"
          }`,
        },
        {
          name: "balanceOfMove",
          value:
            `$ ${moveRequest?.move_payment - moveRequest?.initial_deposit}` ||
            "-",
        },

        //Column 2
        {
          name: "customerPhone",
          value: moveRequest?.user?.phone_number,
        },
        {
          name: "destinationAddress",
          value:
            moveRequest?.delivery_details?.delivery_addresses[0]
              ?.complete_address,
        },
        {
          name: "destinationCityState",
          value:
            splitAddressCity(
              moveRequest.delivery_details.delivery_addresses[0]
                .complete_address,
              "city"
            ) +
            ", " +
            splitAddressCity(
              moveRequest.delivery_details.delivery_addresses[0]
                .complete_address,
              "state"
            ),
        },
        {
          name: "destinationZip",
          value: splitAddressCity(
            moveRequest.delivery_details.delivery_addresses[0].complete_address,
            "zip"
          ),
        },
        {
          name: "elevatorFee",
          value: `${
            elevatorOrStairsCharges(moveRequest, "elevator") !== 0
              ? "$ " + elevatorOrStairsCharges(moveRequest, "elevator")
              : "-"
          }`,
        },
        {
          name: "excessStairsFee",
          value: `${
            elevatorOrStairsCharges(moveRequest, "stairs") !== 0
              ? "$ " + elevatorOrStairsCharges(moveRequest, "stairs")
              : "-"
          }`,
        },
        {
          name: "longCarryFee",
          value: moveRequest.delivery_details.open_location ? "Yes" : "No",
        },
        {
          name: "shuttleFee",
          value: moveRequest.delivery_details.shuttle_required ? "Yes" : "No",
        },

        {
          name: "inventoryListCaptured",
          value: moveRequest.roomDetails?.map((room: any) => {
            const items = room.items.map((item: any) => item.item_name).join(', ');
            return `${room.title.toString()}: ${items}`;
        }).join(', ')
        },
        {
          name: "customerSignDate",
          value: getDate(),
        },

        {
          name: "customerEmail",
          value: moveRequest?.user?.email,
        },

        {
          name: "jobReferenceNo",
          value: moveRequest?.move_order_number,
        },
        {
          name: "FADP",
          value: `${formatDate(moveRequest?.pickup_date_from)} - ${formatDate(
            moveRequest?.pickup_date_to
          )}`,
        },
        {
          name: "estimatedCost",
          value: `$ ${moveRequest?.move_payment}` || "-",
        },
      ],
      metadata: {
        my_favorite_pet: "Panda",
      },
      tags: ["created_via_api", "test_document"],
    };

    try {
      //Create the Documentƒ
      const createResponse = await axios.post(documentCreateUrl, data, {
        headers: {
          Authorization: `API-Key ${apiKey}`,
          "Content-Type": "application/json",
        },
      });

      const document_id = createResponse.data.id;

      // Check document status
      const documentStatusURL = `https://api.pandadoc.com/public/v1/documents/${document_id}`;
      const statusResponse = await axios.get(documentStatusURL, {
        headers: {
          Authorization: `API-Key ${apiKey}`,
          "Content-Type": "application/json",
        },
      });

      //   setTimeout(() => {}, 5000);

      // Send the document
      const sentdata = {
        message: "Hello! This document was sent from WEMOVE.",
        silent: true,
      };

      const documentSendUrl = `https://api.pandadoc.com/public/v1/documents/${document_id}/send`;
      const sendResponse = await axios.post(documentSendUrl, sentdata, {
        headers: {
          Authorization: `API-Key ${apiKey}`,
          "Content-Type": "application/json",
        },
      });

      //Embedded session
      const embeddedSessionUrl = `https://api.pandadoc.com/public/v1/documents/${document_id}/session`;
      const sessionResponse = await axios.post(
        embeddedSessionUrl,
        { recipient: recipientEmail },
        {
          headers: {
            Authorization: `API-Key ${apiKey}`,
            accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      setSessionId(sessionResponse.data.id);
      setIsPageLoading(false);
    } catch (error) {
      console.error("Error creating PandaDoc document:", error);
      setIsPageLoading(false);
    }
  };

  useEffect(() => {
    setIsPageLoading(true);
    fetchMoveRequestById(moveRequestId);
  }, []);

  useEffect(() => {
    const socket = io(thisUrl);

    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    socket.on("connect_error", (error) => {
      console.error("WebSocket connection error:", error);
    });

    socket.on("notifyContractCompletion", (requestData) => {
      console.log(requestData, "-----8788787898767876------------");
      setIsConformationModal(true);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (isConformationModal === true) {
      navigate(`/move-success/${moveRequest.canonical_id}`);
    }
  }, [isConformationModal]);

  useEffect(() => {
    if (moveRequest !== null) {
      createDocumentFromTemplate();
    }
  }, [moveRequest]);

  return (
    <>
      <Grid container mt={2} mb={2} p={1}>
        <Grid item xs={12} mb={2} display="flex" justifyContent={"center"}>
          {sessionId && (
            <iframe
              src={`https://app.pandadoc.com/s/${sessionId}/`}
              width="800"
              height="800"
              style={{ border: "none" }}
            ></iframe>
          )}

          {isPageLoading && (
            <Backdrop
              sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={isPageLoading}
              onClick={() => {
                setIsPageLoading(true);
              }}
            >
              <Box sx={{ width: "50%" }}>
                <LinearProgress />
                <Typography
                  fontSize={16}
                  fontWeight={500}
                  textAlign="center"
                  mt={1}
                >
                  Getting the document ready!
                </Typography>
              </Box>
            </Backdrop>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default ContractDocument;
