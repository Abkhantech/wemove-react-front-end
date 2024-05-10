import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  styled,
  tableCellClasses,
} from "@mui/material";
import AddItemModal from "../../components/modals/addItemModal";
import { useEffect, useState } from "react";
import Subtract from "@mui/icons-material/Remove";
import EditIcon from "@mui/icons-material/Create";
import InfoIcon from "@mui/icons-material/Info";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getMoveRequestById } from "../../redux/actions/move-request";
import { unwrapResult } from "@reduxjs/toolkit";
import InputAlertModal from "../../components/modals/inputAlertModal";
import ProgressBar from "../../components/progressBar/progressBar";
import NavBar from "../../components/navbar/navBar";
import { updateRoomDetails } from "../../redux/actions/room-details";
import PackagingServiceModal from "../../components/modals/packagingServiceModal";

const blueButton = {
  width: 150,
  height: 50,
  backgroundColor: "#5858E0 !important",
  color: "#FFFFFF",
  fontSize: 12,
  fontWeight: 550,
  border: "1px solid #6552FF",
};

const addButton = {
  width: 80,
  height: 30,
  backgroundColor: "#5858E0 !important",
  color: "#FFFFFF",
  fontSize: 10,
  fontWeight: 600,
  border: "1px solid #6552FF",
};

const iconButtonStyle = {
  width: "15px",
  height: "15px",
  color: "white",
  backgroundColor: "#5858E0",
  "&:hover": {
    backgroundColor: "#5858E0",
    opacity: "0.9",
  },
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#08123B",
    color: "#FFFFFF",
    borderLeft: "1px solid rgba(224, 224, 224, 1)",
    width: "fit-content",
    fontSize: 15,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 12,
    fontWeight: "500 !important",
    backgroundColor: "#FDFBFB",
    border: "1px solid #FFFFFF !important",
  },
}));

const ItemsInfo = () => {
  const dispatch = useDispatch();
  const { moveRequestId } = useParams();

  const [canonicalId, setCanonicalId] = useState("");
  const [moveRequest, setMoveRequest] = useState<any>(null);
  const [thisMoveRequestId, setThisMoveRequestId] = useState(null);

  const [isAddItemModal, setIsAddItemModal] = useState(false);
  const [isInputAlertModal, setIsInputAlertModal] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [isPackaginServiceModal, setIsPackaginServiceModal] = useState(false);

  const [editItemInfo, setEditItemInfo] = useState(null);
  const [itemIndex, setItemIndex] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [roomDetailsArray, setRoomDetailsArray] = useState<any>([]);
  const [itemsCount, setItemsCount] = useState(null);

  const handleAddItemModal = (roomId: any, item?: any, index?: any) => {
    if (item) {
      setEditItemInfo(item);
      setItemIndex(index);
    } else {
      setEditItemInfo(null);
      setItemIndex(null);
    }
    setRoomId(roomId);
    setIsAddItemModal(true);
  };

  const handleSubtract = (roomid: any, itemIndex: number) => {
    if (
      editItemInfo &&
      editItemInfo === roomDetailsArray.items.item[itemIndex]
    ) {
      setEditItemInfo(null);
    }
    setRoomDetailsArray((prevRoomDetailsArray: any) => {
      return prevRoomDetailsArray.map((room: any) => {
        if (room.id === roomid) {
          const updatedItems = room.items.filter(
            (_: any, index: any) => index !== itemIndex
          );
          return { ...room, items: updatedItems };
        }
        return room;
      });
    });
  };

  const fetchMoveRequestById = (moveRequestId: any) => {
    dispatch<any>(getMoveRequestById(moveRequestId))
      .then(unwrapResult)
      .then((thisMoveRequest: any) => {
        const filteredRoomDetails = thisMoveRequest.roomDetails
          .filter((room: any) => room.items && room.items.length > 0)
          .map((room: any) => ({
            ...room,
            items: room.items.map((item: any) => ({
              item_name: item.item_name || "",
              item_width: item.item_width || "",
              item_height: item.item_height || "",
              item_length: item.item_length || "",
            })),
          }));

        setMoveRequest(thisMoveRequest);
        setRoomDetailsArray(filteredRoomDetails);
        setThisMoveRequestId(thisMoveRequest.id);
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  const updateThisMoveRequest = async () => {
    setIsPageLoading(true);
    await Promise.all(
      roomDetailsArray.map(async (room: any) => {
        const body = {
          roomDetailId: room.id,
          items: room.items,
        };
        await dispatch<any>(updateRoomDetails(body))
          .then(unwrapResult)
          .then((res: any) => {
            console.log("Room updated", res);
          })
          .catch((err: any) => {
            console.log(err);
          });
      })
    );
    setCanonicalId(moveRequest.canonical_id);
    setIsPackaginServiceModal(true);
    setTimeout(() => {
      setIsPageLoading(false);
    }, 1300);
  };

  useEffect(() => {
    const totalItemsCount = roomDetailsArray.reduce((total: any, room: any) => {
      return total + (room.items ? room.items.length : 0);
    }, 0);
    setItemsCount(totalItemsCount);
  }, [roomDetailsArray]);

  useEffect(() => {
    fetchMoveRequestById(moveRequestId);
    setIsInputAlertModal(true);
  }, []);

  return (
    <>
      <NavBar moveRequestId={moveRequestId} />
      <Grid container>
        {isInputAlertModal && (
          <InputAlertModal
            isInputAlertModal={isInputAlertModal}
            setIsInputAlertModal={setIsInputAlertModal}
          />
        )}

        <Grid item xs={12} md={5} p={2} marginX={"auto"}>
          <ProgressBar value={80} />
          <Stack
            mt={2}
            justifyContent={"flex-end"}
            direction={"row"}
            alignItems={"center"}
          >
            <Box alignItems={"center"} alignSelf={"center"}>
              <Button
                onClick={() => {
                  setIsInputAlertModal(true);
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

          {roomDetailsArray && roomDetailsArray.length > 0 ? (
            roomDetailsArray.map((room: any, index: any) => (
              <Box key={room.id}>
                <Box display={"flex"} justifyContent={"space-between"} mt={3}>
                  <Typography>
                    Inventory from{" "}
                    <Typography fontWeight={600}>{room.title}</Typography>
                  </Typography>
                  <Button
                    size="medium"
                    onClick={() => {
                      handleAddItemModal(room.id);
                    }}
                    sx={addButton}
                  >
                    Add Item
                  </Button>
                </Box>
                <TableContainer
                  sx={{
                    mt: 1,
                  }}
                >
                  <Table sx={{ maxWidth: "100vh" }} aria-label="item table">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>Item Name</StyledTableCell>
                        <StyledTableCell align="center">Width</StyledTableCell>
                        <StyledTableCell align="center">Length</StyledTableCell>
                        <StyledTableCell align="center">Height</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {room.items.map((item: any, index: any) => (
                        <TableRow
                          key={index}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <StyledTableCell component="th" scope="row">
                            <Stack
                              alignItems={"center"}
                              spacing={1}
                              direction={"row"}
                            >
                              <IconButton
                                size="small"
                                onClick={() => handleSubtract(room.id, index)}
                                sx={iconButtonStyle}
                              >
                                <Subtract sx={{ width: 15 }} />
                              </IconButton>
                              <Typography>{item.item_name}</Typography>

                              <IconButton
                                size="small"
                                sx={iconButtonStyle}
                                onClick={() =>
                                  handleAddItemModal(room.id, item, index)
                                }
                              >
                                <EditIcon sx={{ width: 11 }} />
                              </IconButton>
                            </Stack>
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {item.item_width}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {item.item_height}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {item.item_length}
                          </StyledTableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            ))
          ) : (
            <Typography textAlign={"center"} fontWeight={600} color={"#949494"}>
              NO ITEMS
            </Typography>
          )}

          <Box
            mt={2}
            sx={{
              p: 2,
              backgroundColor: "#5A7BFC14",
              border: "1px solid #5A7BFC59",
              borderRadius: "8px",
            }}
          >
            <Stack direction={"row"} justifyContent={"space-between"}>
              <Typography fontSize={14} fontWeight={550} color={"#3C3C3C"}>
                Total Items:
              </Typography>
              <Typography fontSize={14} fontWeight={550} color={"#5858E0"}>
                {itemsCount}
              </Typography>
            </Stack>
          </Box>

          <Box display={"flex"} justifyContent={"end"} mt={3}>
            <Button
              onClick={() => {
                updateThisMoveRequest();
              }}
              size="medium"
              sx={blueButton}
            >
              Proceed
            </Button>
          </Box>

          {isAddItemModal && (
            <AddItemModal
              isAddItemModal={isAddItemModal}
              setIsAddItemModal={setIsAddItemModal}
              editItemInfo={editItemInfo}
              setEditItemInfo={setEditItemInfo}
              roomId={roomId}
              itemIndex={itemIndex}
              roomDetailsArray={roomDetailsArray}
              setRoomDetailsArray={setRoomDetailsArray}
            />
          )}

          {isPackaginServiceModal && (
            <PackagingServiceModal
              thisMoveRequestId={thisMoveRequestId}
              moveRequestId={canonicalId}
              isPackaginServiceModal={isPackaginServiceModal}
              setIsPackaginServiceModal={setIsPackaginServiceModal}
            />
          )}

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

export default ItemsInfo;
