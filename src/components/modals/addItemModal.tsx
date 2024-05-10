import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useEffect, useState } from "react";
import {
  Alert,
  FormControl,
  Stack,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";

const inputStyle = {
  background: "#F9FAFB",
  borderRadius: "8px",
  height: 20,
};

const textFieldStyle = {
  marginTop: 1,
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderRadius: "8px",
    },
  },
};

const acceptButton = {
  width: 180,
  height: 45,
  backgroundColor: "#5858E0 !important",
  color: "#FFFFFF",
  fontSize: 12,
  fontWeight: 550,
  border: "1px solid #6552FF",
};

const rejectButton = {
  width: 180,
  height: 45,
  color: "#5859DF",
  fontSize: 12,
  fontWeight: 550,
};

interface ItemInfo {
  item_name: string;
  item_width: number | string;
  item_height: number | string;
  item_length: number | string;
}

const AddItemModal = ({
  isAddItemModal,
  setIsAddItemModal,
  editItemInfo,
  setEditItemInfo,
  roomId,
  itemIndex,
  roomDetailsArray,
  setRoomDetailsArray,
}: any) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.only("xs"));

  const [targetRoom, setTargetRoom] = useState<any>(null);
  const [formError, setFormError] = useState("");

  const [itemInfo, setItemInfo] = useState<ItemInfo>({
    item_name: "",
    item_width: "",
    item_height: "",
    item_length: "",
  });

  const handleClose = () => setIsAddItemModal(false);

  const isValidDimension = (dimension: any) => {
    const value = Number(dimension);
    return !isNaN(value) && value > 0;
  };

  const handleOnSubmitItem = () => {
    if (!itemInfo.item_name.trim()) {
      setFormError("Item name cannot be empty.");
      return;
    }
    if (
      !itemInfo.item_name.trim() ||
      !isValidDimension(itemInfo.item_width) ||
      !isValidDimension(itemInfo.item_height) ||
      !isValidDimension(itemInfo.item_length)
    ) {
      setFormError("Width, Height, and Length should not be zero or empty.");
      return;
    }
    const newItemInfo = { ...itemInfo };

    if (targetRoom && targetRoom.items) {
      const updatedItems = [...targetRoom.items, newItemInfo];
      setTargetRoom((prevState: any) => ({
        ...prevState,
        items: updatedItems,
      }));

      setRoomDetailsArray((prevRoomDetailsArray: any) => {
        return prevRoomDetailsArray.map((room: any) => {
          if (room.id === targetRoom.id) {
            return { ...room, items: updatedItems };
          }
          return room;
        });
      });
    }

    setItemInfo({
      item_name: "",
      item_width: "",
      item_height: "",
      item_length: "",
    });
    handleClose();
  };

  const handleEditItem = () => {
    if (!itemInfo.item_name.trim()) {
      setFormError("Item name cannot be empty.");
      return;
    }

    if (
      !itemInfo.item_name.trim() ||
      !isValidDimension(itemInfo.item_width) ||
      !isValidDimension(itemInfo.item_height) ||
      !isValidDimension(itemInfo.item_length)
    ) {
      setFormError("Width, Height, and Length should not be zero or empty.");
      return;
    }

    const updatedRoom = roomDetailsArray.find(
      (room: any) => room.id === roomId
    );

    if (updatedRoom) {
      const updatedItemsArray = [...updatedRoom.items];

      if (itemIndex >= 0 && itemIndex < updatedItemsArray.length) {
        updatedItemsArray[itemIndex] = {
          ...updatedItemsArray[itemIndex],
          ...itemInfo,
        };

        setRoomDetailsArray((prevRoomDetailsArray: any) => {
          return prevRoomDetailsArray.map((room: any) => {
            if (room.id === roomId) {
              return { ...room, items: updatedItemsArray };
            }
            return room;
          });
        });
      }
    }

    setEditItemInfo(null);
    setIsAddItemModal(false);
  };

  useEffect(() => {
    if (editItemInfo) {
      setItemInfo({
        ...itemInfo,
        ...editItemInfo,
      });
    }
  }, [editItemInfo]);

  useEffect(() => {
    const foundRoom = roomDetailsArray.find((room: any) => room.id === roomId);
    setTargetRoom(foundRoom);
  }, [roomId]);

  return (
    <>
      <Modal
        open={isAddItemModal}
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
            width: isMobile ? "75vw" : "35vw",
            bgcolor: "background.paper",
            borderRadius: "8px",
            boxShadow: 24,
            p: 3,
          }}
        >
          <Typography mt={1} fontSize={18} fontWeight={700} color={"#262626"}>
            {editItemInfo?.item_name ? "Edit Item" : "Add Item"}
          </Typography>

          <FormControl fullWidth>
            <Typography
              mt={2}
              fontSize="14px"
              fontWeight={500}
              color={"#373737"}
            >
              Item
            </Typography>

            <TextField
              id="outlined-basic"
              variant="outlined"
              fullWidth
              placeholder="Item name"
              value={itemInfo.item_name}
              size="small"
              onChange={(event) =>
                setItemInfo((prevItemInfo) => ({
                  ...prevItemInfo,
                  item_name: event.target.value,
                }))
              }
              inputProps={{ style: inputStyle }}
              sx={textFieldStyle}
              required
            />

            <Typography
              mt={1}
              fontSize="14px"
              fontWeight={500}
              color={"#373737"}
            >
              Width (Feet)
            </Typography>

            <TextField
              id="outlined-basic"
              variant="outlined"
              type="number"
              fullWidth
              placeholder="width"
              value={itemInfo.item_width}
              size="small"
              onChange={(event) =>
                setItemInfo((prevItemInfo) => ({
                  ...prevItemInfo,
                  item_width: Number(event.target.value),
                }))
              }
              inputProps={{ min: 0, style: inputStyle }}
              sx={textFieldStyle}
              required
            />

            <Typography
              mt={1}
              fontSize="14px"
              fontWeight={500}
              color={"#373737"}
            >
              Height (Feet)
            </Typography>

            <TextField
              id="outlined-basic"
              variant="outlined"
              type="number"
              fullWidth
              placeholder="height"
              value={itemInfo.item_height}
              size="small"
              onChange={(event) =>
                setItemInfo((prevItemInfo) => ({
                  ...prevItemInfo,
                  item_height: Number(event.target.value),
                }))
              }
              inputProps={{ style: inputStyle }}
              sx={textFieldStyle}
              required
            />

            <Typography
              mt={1}
              fontSize="14px"
              fontWeight={500}
              color={"#373737"}
            >
              Length (Feet)
            </Typography>

            <TextField
              id="outlined-basic"
              variant="outlined"
              type="number"
              fullWidth
              placeholder="length"
              value={itemInfo.item_length}
              size="small"
              onChange={(event) =>
                setItemInfo((prevItemInfo) => ({
                  ...prevItemInfo,
                  item_length: Number(event.target.value),
                }))
              }
              inputProps={{ style: inputStyle }}
              sx={textFieldStyle}
              required
            />

            <Box p={3}>
              {formError && <Alert severity="error">{formError}</Alert>}
            </Box>

            <Box mt={3} display={"flex"} justifyContent={"center"}>
              <Stack>
                <Button
                  sx={acceptButton}
                  onClick={
                    editItemInfo?.item_name
                      ? handleEditItem
                      : handleOnSubmitItem
                  }
                >
                  {editItemInfo?.item_name ? "Edit Item" : "Add Item"}
                </Button>

                <Button sx={rejectButton} onClick={handleClose}>
                  Cancel
                </Button>
              </Stack>
            </Box>
          </FormControl>
        </Box>
      </Modal>
    </>
  );
};

export default AddItemModal;
