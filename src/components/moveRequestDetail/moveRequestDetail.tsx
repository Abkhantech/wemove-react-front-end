import {
  Box,
  Button,
  Grid,
  IconButton,
  InputLabel,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const notSeelectedButtonStyle = {
  color: "#5859DF",
  fontSize: 12,
  fontWeight: 550,
  border: "1px solid #6552FF",
};

const selectedButtonStyle = {
  backgroundColor: "#5858E0 !important",
  color: "#FDFCFD",
  fontSize: 12,
  fontWeight: 550,
  border: "1px solid #6552FF",
};

const priceInfoBox = {
  p: 1.3,
  width: 240,
  borderRadius: 2,
};

const MoveRequestDetail = ({
  moveRequest,
  setIsMoveRequestDetail,
  setIsShowAllMoveRequests,
}: any) => {
  const theme = useTheme();
  const isMobileOrTab = useMediaQuery(theme.breakpoints.down("md"));

  const formatDate = (dateString: any) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
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

  const handleBack = () => {
    setIsMoveRequestDetail(null);
    setIsShowAllMoveRequests(true);
  };

  return (
    <>
      <Grid container justifyContent={"space-between"}>
        <Stack direction={"row"} alignItems={"center"}>
          <IconButton
            onClick={() => {
              handleBack();
            }}
            sx={{
              backgroundColor: "#5858E0 !important",
              color: "#FDFCFD",
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography ml={2} fontWeight={700} fontSize={14} color={"#374145"}>
            Hello _
          </Typography>
          <Typography fontWeight={700} fontSize={14} ml={1} color={"#374145"}>
            {moveRequest?.user?.first_name ? moveRequest?.user?.first_name : ""}{" "}
            {moveRequest?.user?.last_name ? moveRequest?.user?.last_name : ""}
          </Typography>
          <Typography fontWeight={400} fontSize={12} ml={1} color={"#374145"}>
            here's what's happening
          </Typography>
        </Stack>

        <Grid
          item
          xs={12}
          mt={2}
          p={2}
          sx={{
            background: "#FFFFFF",
            borderTop: "1.5px solid #5858E0",
            borderRadius: 2,
          }}
        >
          <Typography fontWeight={550} fontSize={16} color={"#5858E0"}>
            Personal Information
          </Typography>

          <Box
            mt={2}
            display={isMobileOrTab ? "block" : "flex"}
            justifyContent={"space-between"}
          >
            <Stack>
              <InputLabel
                sx={{
                  fontSize: 14,
                }}
                htmlFor="name"
              >
                Name
              </InputLabel>

              <TextField
                id="name"
                variant="outlined"
                margin="dense"
                size="small"
                value={
                  moveRequest?.user?.first_name +
                  " " +
                  moveRequest?.user?.last_name
                }
                sx={{
                  width: 300,
                }}
              />
            </Stack>

            <Stack>
              <InputLabel
                sx={{
                  fontSize: 14,
                }}
                htmlFor="phoneNo"
              >
                Phone No.
              </InputLabel>

              <TextField
                id="phoneNo"
                variant="outlined"
                margin="dense"
                size="small"
                value={moveRequest?.user?.phone_number}
                sx={{
                  width: 300,
                }}
              />
            </Stack>

            <Stack>
              <InputLabel
                sx={{
                  fontSize: 14,
                }}
                htmlFor="email"
              >
                Email ID
              </InputLabel>
              <TextField
                id="email"
                variant="outlined"
                margin="dense"
                size="small"
                value={moveRequest?.user?.email}
                sx={{
                  width: 300,
                }}
              />
            </Stack>
          </Box>
        </Grid>

        <Grid
          item
          xs={12}
          md={5.9}
          mt={2}
          p={2}
          sx={{
            background: "#FFFFFF",
            borderTop: "1.5px solid #5858E0",
            borderRadius: 2,
          }}
        >
          <Typography fontWeight={550} fontSize={16} color={"#5858E0"}>
            More Information
          </Typography>

          <InputLabel
            sx={{
              fontSize: 14,
            }}
            htmlFor="referenceNo"
          >
            Reference Number
          </InputLabel>

          <TextField
            id="referenceNo"
            variant="outlined"
            margin="dense"
            size="small"
            value={moveRequest?.move_order_number}
            sx={{
              width: 300,
            }}
          />

          <Typography
            fontWeight={400}
            fontSize={14}
            mt={2}
            color={"rgba(0, 0, 0, 0.6)"}
          >
            Move Type
          </Typography>
          <Stack direction="row" mt={1} spacing={2}>
            <Button
              size="large"
              sx={
                moveRequest?.move_type === "In-State Move"
                  ? selectedButtonStyle
                  : notSeelectedButtonStyle
              }
            >
              Local Move
            </Button>
            <Button
              size="large"
              sx={
                moveRequest?.move_type === "Out-of-State Move"
                  ? selectedButtonStyle
                  : notSeelectedButtonStyle
              }
            >
              Long Distance Move
            </Button>
          </Stack>

          <InputLabel
            sx={{
              fontSize: 14,
              mt: 2,
            }}
            htmlFor="pickupAddress"
          >
            Pickup Address
          </InputLabel>

          <TextField
            id="pickupAddress"
            variant="outlined"
            margin="dense"
            size="small"
            value={checkFromAddress(moveRequest)}
            sx={{
              width: 300,
            }}
          />

          <InputLabel
            sx={{
              fontSize: 14,
              mt: 2,
            }}
            htmlFor="deliveryAddress"
          >
            Delivery Address
          </InputLabel>

          <TextField
            id="deliveryAddress"
            defaultValue={"1234555DFC67"}
            variant="outlined"
            margin="dense"
            size="small"
            value={
              moveRequest.delivery_details?.delivery_addresses?.length
                ? moveRequest.delivery_details.delivery_addresses[0]
                    .complete_address
                : "-"
            }
            sx={{
              width: 300,
            }}
          />

          <InputLabel
            sx={{
              fontSize: 14,
              mt: 2,
            }}
            htmlFor="totalDistance"
          >
            Total Distance
          </InputLabel>

          <TextField
            id="totalDistance"
            defaultValue={"1234"}
            variant="outlined"
            margin="dense"
            size="small"
            value={
              moveRequest?.move_distance ? `${moveRequest.move_distance}` : "-"
            }
            sx={{
              width: 300,
            }}
          />

          <Typography
            fontWeight={400}
            fontSize={14}
            mt={2}
            color={"rgba(0, 0, 0, 0.6)"}
          >
            Shuttle Required
          </Typography>
          {moveRequest?.delivery_details !== null &&
          moveRequest?.delivery_details?.shuttle_required !== null ? (
            <Stack direction="row" mt={1} spacing={2}>
              <Button
                size="large"
                sx={
                  moveRequest?.delivery_details.shuttle_required
                    ? selectedButtonStyle
                    : notSeelectedButtonStyle
                }
              >
                Yes
              </Button>
              <Button
                size="large"
                sx={
                  !moveRequest?.delivery_details.shuttle_required
                    ? selectedButtonStyle
                    : notSeelectedButtonStyle
                }
              >
                No
              </Button>
            </Stack>
          ) : (
            <Typography
              fontWeight={400}
              fontSize={12}
              mt={1}
              color={"rgba(0, 0, 0, 0.6)"}
            >
              Not yet selected
            </Typography>
          )}

          <InputLabel
            sx={{
              fontSize: 14,
              mt: 2,
            }}
            htmlFor="fdd"
          >
            First Available Date of Delivery
          </InputLabel>

          <TextField
            id="fdd"
            variant="outlined"
            margin="dense"
            size="small"
            value={formatDate(moveRequest?.first_available_date_of_delivery)}
            sx={{
              width: 300,
            }}
          />
        </Grid>

        <Grid
          item
          xs={12}
          md={5.9}
          mt={2}
          p={2}
          sx={{
            background: "#FFFFFF",
            borderTop: "1.5px solid #5858E0",
            borderRadius: 2,
          }}
        >
          <Box>
            <Typography fontWeight={550} fontSize={16} color={"#5858E0"}>
              Packing Information
            </Typography>

            <Typography
              fontWeight={400}
              fontSize={14}
              mt={2}
              color={"rgba(0, 0, 0, 0.6)"}
            >
              Packing Service
            </Typography>
            {moveRequest?.delivery_details !== null &&
            moveRequest?.delivery_details?.packagaing_required !== null ? (
              <Stack direction="row" mt={1} spacing={2}>
                <Button
                  size="large"
                  sx={
                    moveRequest?.delivery_details.packagaing_required
                      ? selectedButtonStyle
                      : notSeelectedButtonStyle
                  }
                >
                  Yes
                </Button>
                <Button
                  size="large"
                  sx={
                    !moveRequest?.delivery_details.packagaing_required
                      ? selectedButtonStyle
                      : notSeelectedButtonStyle
                  }
                >
                  No
                </Button>
              </Stack>
            ) : (
              <Typography
                fontWeight={400}
                fontSize={12}
                mt={1}
                color={"rgba(0, 0, 0, 0.6)"}
              >
                Not yet selected
              </Typography>
            )}

            <Typography
              fontWeight={400}
              fontSize={14}
              mt={2}
              color={"rgba(0, 0, 0, 0.6)"}
            >
              Type of Packing Service
            </Typography>
            {moveRequest?.delivery_details !== null &&
            moveRequest?.delivery_details?.packaging !== null ? (
              <Stack direction="row" mt={1} spacing={2}>
                <Button
                  size="large"
                  sx={
                    moveRequest?.delivery_details.packaging.packaging_type ===
                    "Full Package"
                      ? selectedButtonStyle
                      : notSeelectedButtonStyle
                  }
                >
                  Full
                </Button>
                <Button
                  size="large"
                  sx={
                    moveRequest?.delivery_details.packaging.packaging_type !==
                    "Full Package"
                      ? selectedButtonStyle
                      : notSeelectedButtonStyle
                  }
                >
                  Partial
                </Button>
              </Stack>
            ) : (
              <Typography
                fontWeight={400}
                fontSize={12}
                mt={1}
                color={"rgba(0, 0, 0, 0.6)"}
              >
                Not yet selected.
              </Typography>
            )}
          </Box>
          <Box mt={2}>
            <Typography fontWeight={550} fontSize={16} color={"#5858E0"}>
              Pricing Information
            </Typography>

            <Box mt={2} display={isMobileOrTab ? "block" : "flex"}>
              <Stack gap={1} p={1}>
                <Box sx={{ ...priceInfoBox, backgroundColor: "#F0F0FC" }}>
                  <Typography fontWeight={550} fontSize={14} color={"#374145"}>
                    Packing Service Cost
                  </Typography>
                  <Typography fontWeight={600} fontSize={22} color={"#374145"}>
                    {moveRequest?.delivery_details?.packaging?.packaging_payment
                      ? `$${moveRequest.delivery_details.packaging.packaging_payment}`
                      : "-"}
                  </Typography>
                </Box>
                <Box sx={{ ...priceInfoBox, backgroundColor: "#E9FFEF" }}>
                  <Typography fontWeight={550} fontSize={14} color={"#374145"}>
                    Confirmation Payment
                  </Typography>
                  <Typography fontWeight={600} fontSize={22} color={"#374145"}>
                    {moveRequest?.initial_deposit
                      ? `$${moveRequest.initial_deposit}`
                      : "-"}
                  </Typography>
                </Box>
              </Stack>
              <Stack gap={1} p={1}>
                <Box sx={{ ...priceInfoBox, backgroundColor: "#E4F2FF" }}>
                  <Typography fontWeight={550} fontSize={14} color={"#374145"}>
                    Total Cost of Move
                  </Typography>
                  <Typography fontWeight={600} fontSize={22} color={"#374145"}>
                    {moveRequest?.move_payment
                      ? `$${moveRequest.move_payment}`
                      : "-"}
                  </Typography>
                </Box>
                <Box sx={{ ...priceInfoBox, backgroundColor: "#F4FFDE" }}>
                  <Typography fontWeight={550} fontSize={14} color={"#374145"}>
                    Balance Owed to Carrier
                  </Typography>
                  <Typography fontWeight={600} fontSize={22} color={"#374145"}>
                    {moveRequest?.move_payment && moveRequest?.initial_deposit
                      ? `$${
                          moveRequest.move_payment - moveRequest.initial_deposit
                        }`
                      : "-"}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Box>
        </Grid>

        <Grid
          item
          xs={12}
          mt={2}
          p={2}
          sx={{
            background: "#FFFFFF",
            borderTop: "1.5px solid #5858E0",
            borderRadius: 2,
          }}
        >
          <Typography fontWeight={550} fontSize={16} color={"#5858E0"}>
            Carrier Information
          </Typography>

          <Box
            mt={2}
            display={isMobileOrTab ? "block" : "flex"}
            justifyContent={"space-between"}
          >
            <Stack>
              <InputLabel
                sx={{
                  fontSize: 14,
                }}
                htmlFor="carrierName"
              >
                Carrier Name
              </InputLabel>

              <TextField
                id="carrierName"
                variant="outlined"
                margin="dense"
                size="small"
                value={"WeMove Carrier Network"}
                sx={{
                  width: 300,
                }}
              />
            </Stack>

            <Stack>
              <InputLabel
                sx={{
                  fontSize: 14,
                }}
                htmlFor="phoneNo"
              >
                Phone No.
              </InputLabel>

              <TextField
                id="phoneNo"
                variant="outlined"
                margin="dense"
                size="small"
                value={"754-249-2015"}
                sx={{
                  width: 300,
                }}
              />
            </Stack>

            <Stack>
              <InputLabel
                sx={{
                  fontSize: 14,
                }}
                htmlFor="carrierAddress"
              >
                Carrier Address
              </InputLabel>
              <TextField
                id="carrierAddress"
                variant="outlined"
                margin="dense"
                size="small"
                value={"254 Chapman Road, Suite 209"}
                sx={{
                  width: 300,
                }}
              />
            </Stack>
          </Box>
        </Grid>

        {/* <Grid
          item
          xs={12}
          mt={2}
          p={2}
          sx={{
            background: "#FFFFFF",
            borderTop: "1.5px solid #5858E0",
            borderRadius: 2,
          }}
        >
          <Typography fontWeight={550} fontSize={16} color={"#5858E0"}>
            More Information
          </Typography>

          <Box
            mt={2}
            display={isMobile ? "block" : "flex"}
            justifyContent={"space-between"}
            alignContent={"center"}
            alignItems={"center"}
          >
            <Box>
              <Typography
                fontWeight={400}
                fontSize={14}
                color={"rgba(0, 0, 0, 0.6)"}
              >
                Do You need Auto Transport
              </Typography>
              <Stack direction="row" mt={0.3} spacing={2}>
                <Button
                  size="large"
                  sx={
                    autoTransport
                      ? selectedButtonStyle
                      : notSeelectedButtonStyle
                  }
                  onClick={() => {
                    setAutoTransport(true);
                  }}
                >
                  Yes
                </Button>
                <Button
                  size="large"
                  onClick={() => {
                    setAutoTransport(false);
                  }}
                  sx={
                    !autoTransport
                      ? selectedButtonStyle
                      : notSeelectedButtonStyle
                  }
                >
                  No
                </Button>
              </Stack>
            </Box>

            <Stack>
              <InputLabel
                sx={{
                  fontSize: 14,
                }}
                htmlFor="autoTransportCost"
              >
                Auto Transport Cost
              </InputLabel>

              <TextField
                id="autoTransportCost"
                defaultValue={"12345"}
                variant="outlined"
                margin="dense"
                size="small"
                sx={{
                  width: 300,
                }}
              />
            </Stack>

            <Box>
              <Typography
                fontWeight={400}
                fontSize={14}
                color={"rgba(0, 0, 0, 0.6)"}
              >
                Additional Insurance
              </Typography>
              <Stack direction="row" mt={0.3} spacing={2}>
                <Button
                  size="large"
                  sx={
                    isAdditionalInsurance
                      ? selectedButtonStyle
                      : notSeelectedButtonStyle
                  }
                  onClick={() => {
                    setIsAdditionalInsurance(true);
                  }}
                >
                  Yes
                </Button>
                <Button
                  size="large"
                  onClick={() => {
                    setIsAdditionalInsurance(false);
                  }}
                  sx={
                    !isAdditionalInsurance
                      ? selectedButtonStyle
                      : notSeelectedButtonStyle
                  }
                >
                  No
                </Button>
              </Stack>
            </Box>

            <Stack>
              <InputLabel
                sx={{
                  fontSize: 14,
                }}
                htmlFor="additionalInsuranceCost"
              >
                Phone No.
              </InputLabel>

              <TextField
                id="additionalInsuranceCost"
                defaultValue={"12345"}
                variant="outlined"
                margin="dense"
                size="small"
                sx={{
                  width: 300,
                }}
              />
            </Stack>
          </Box>

          <Typography
            fontWeight={400}
            fontSize={14}
            mt={2}
            color={"rgba(0, 0, 0, 0.6)"}
          >
            Storage Needed?
          </Typography>
          <Stack direction="row" mt={1} spacing={2}>
            <Button
              size="large"
              sx={
                isStorageNeeded ? selectedButtonStyle : notSeelectedButtonStyle
              }
              onClick={() => {
                setIsStorageNeeded(true);
              }}
            >
              Yes
            </Button>
            <Button
              size="large"
              onClick={() => {
                setIsStorageNeeded(false);
              }}
              sx={
                !isStorageNeeded ? selectedButtonStyle : notSeelectedButtonStyle
              }
            >
              No
            </Button>
          </Stack>
        </Grid> */}
      </Grid>
    </>
  );
};

export default MoveRequestDetail;
