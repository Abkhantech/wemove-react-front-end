import {
  Button,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  Paper,
  Radio,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import Subtract from "@mui/icons-material/Remove";
import purpleStackIcon from "../../assets/Icons/purpleStackIcon.png";

const textFieldTitles = [
  "Dish Boxes",
  "Wardrobe Boxes",
  "Medium Boxes",
  "Large Boxes",
  "Book Boxes",
  "Small Picture Boxes",
  "Medium Picture Boxes",
  "Large Picture Boxes",
  "Extra-Large Picture Boxes",
  "Mattress Covers",
  "Packing Tapes",
];

const initialCounts: { [key: string]: number } = {};

textFieldTitles.forEach((title) => {
  initialCounts[title] = 0;
});

const CustomizePackage = ({ updateThisMoveRequest, totalCubicFeet }: any) => {
  const [counts, setCounts] = useState<{ [key: string]: number }>(
    initialCounts
  );
  const [totalCostOfPackaging, setTotalCostOfPackaging] = useState(0);
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  const [selectedValue, setSelectedValue] = useState("");
  const [fieldError, setFieldError] = useState("");

  const totalPackagingCost = () => {
    if (selectedValue === "Boxes-Only") {
      let totalCost =
        counts["Dish Boxes"] * 12 +
        counts["Wardrobe Boxes"] * 20 +
        counts["Medium Boxes"] * 6 +
        counts["Large Boxes"] * 8.25 +
        counts["Book Boxes"] * 4 +
        counts["Small Picture Boxes"] * 10 +
        counts["Medium Picture Boxes"] * 13 +
        counts["Large Picture Boxes"] * 15 +
        counts["Extra-Large Picture Boxes"] * 20 +
        counts["Mattress Covers"] * 15 +
        counts["Packing Tapes"] * 7;
      setTotalCostOfPackaging(totalCost);
    }
    if (selectedValue === "Boxes-and-Packing") {
      let totalCost =
        counts["Dish Boxes"] * 27 +
        counts["Wardrobe Boxes"] * 35 +
        counts["Medium Boxes"] * 13 +
        counts["Large Boxes"] * 18.25 +
        counts["Book Boxes"] * 9 +
        counts["Small Picture Boxes"] * 20 +
        counts["Medium Picture Boxes"] * 25 +
        counts["Large Picture Boxes"] * 28 +
        counts["Extra-Large Picture Boxes"] * 35 +
        counts["Mattress Covers"] * 15 +
        counts["Packing Tapes"] * 7;
      setTotalCostOfPackaging(totalCost);
    }
    return 0;
  };

  const handleAdd = (title: any) => {
    setCounts((prevCounts) => ({
      ...prevCounts,
      [title]: (prevCounts[title] || 0) + 1,
    }));
  };

  const handleSubtract = (title: any) => {
    setCounts((prevCounts) => ({
      ...prevCounts,
      [title]: Math.max((prevCounts[title] || 0) - 1, 0),
    }));
  };

  const handleChange = (event: any) => {
    setFieldError("");
    setSelectedValue(event.target.value);
    setTotalCostOfPackaging(0);
  };

  useEffect(() => {
    totalPackagingCost();
  }, [counts]);

  useEffect(() => {
    totalPackagingCost();
    if (selectedValue === "Labor-Only") {
      if (totalCubicFeet !== null) {
        let totalCost = totalCubicFeet * 1;
        setTotalCostOfPackaging(totalCost);
      }
    }
  }, [selectedValue]);

  return (
    <>
      <Grid item xs={12} md={6} p={1} marginLeft={"auto"} marginRight={"auto"}>
        <Stack direction="row" alignItems={"center"} justifyContent={"center"}>
          <img src={purpleStackIcon} width={40} height={40} alt="" />

          <Typography
            variant="subtitle1"
            fontWeight={800}
            lineHeight={1.3}
            color={"#5858E0"}
          >
            Customize your package for your needs , choose what you need
          </Typography>
        </Stack>

        <Stack>
          <FormGroup>
            <FormControlLabel
              value="Boxes-Only"
              control={<Radio />}
              label="Boxes-Only"
              checked={selectedValue === "Boxes-Only"}
              onChange={handleChange}
            />
            <FormControlLabel
              value="Boxes-and-Packing"
              control={<Radio />}
              label="Boxes-and-Packing"
              checked={selectedValue === "Boxes-and-Packing"}
              onChange={handleChange}
            />
            <FormControlLabel
              value="Labor-Only"
              control={<Radio />}
              label="Labor-Only (you have your own boxes)"
              checked={selectedValue === "Labor-Only"}
              onChange={handleChange}
            />
          </FormGroup>
        </Stack>

        {selectedValue !== "Labor-Only" && selectedValue !== "" && (
          <TableContainer component={Paper}>
            <Table
              sx={{ minWidth: 500, alignItems: "center" }}
              aria-label="simple table"
            >
              <TableHead
                sx={{ backgroundColor: "#5858E0", alignItems: "center" }}
              >
                <TableRow>
                  <TableCell
                    align="center"
                    sx={{ fontWeight: "600", fontSize: 14, color: "FFFFFF" }}
                  >
                    Item Name
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ fontWeight: "600", fontSize: 14, color: "FFFFFF" }}
                  >
                    Dimensions
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ fontWeight: "600", fontSize: 14, color: "FFFFFF" }}
                  >
                    Price
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ fontWeight: "600", fontSize: 14, color: "FFFFFF" }}
                  >
                    Box+Packing
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ fontWeight: "600", fontSize: 14, color: "FFFFFF" }}
                  >
                    Quantity
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {textFieldTitles.map((item: any) => {
                  return (
                    <TableRow
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                        alignItems: "center",
                      }}
                    >
                      <TableCell align="center">
                        <Typography
                          variant="subtitle1"
                          fontWeight={400}
                          color={"#667085"}
                          textAlign={"start"}
                          fontSize={12}
                        >
                          {item}
                        </Typography>
                      </TableCell>

                      <TableCell align="center">
                        <Typography
                          variant="subtitle1"
                          fontWeight={400}
                          color={"#667085"}
                          textAlign={"start"}
                          fontSize={12}
                        >
                          {item === "Dish Boxes"
                            ? "18x18x27"
                            : item === "Wardrobe Boxes"
                            ? "18x21x46"
                            : item === "Medium Boxes"
                            ? "18x18x17"
                            : item === "Large Boxes"
                            ? "18x18x24"
                            : item === "Book Boxes"
                            ? "18x18x13"
                            : item === "Small Picture Boxes"
                            ? "20x30x3.5"
                            : item === "Medium Picture Boxes"
                            ? "24x36x3.5"
                            : item === "Large Picture Boxes"
                            ? "30x40x3.5"
                            : item === "Extra-Large Picture Boxes"
                            ? "40x50x3.5"
                            : item === "Mattress Covers"
                            ? "King/Queen"
                            : item === "Packing Tapes"
                            ? "1 Roll"
                            : ""}
                        </Typography>
                      </TableCell>

                      <TableCell align="center">
                        <Typography
                          variant="subtitle1"
                          fontWeight={400}
                          color={"#667085"}
                          textAlign={"start"}
                          fontSize={12}
                        >
                          {item === "Dish Boxes"
                            ? "$12.00"
                            : item === "Wardrobe Boxes"
                            ? "$20.00"
                            : item === "Medium Boxes"
                            ? "$6.00"
                            : item === "Large Boxes"
                            ? "$8.25"
                            : item === "Book Boxes"
                            ? "$4.00"
                            : item === "Small Picture Boxes"
                            ? "$10.00"
                            : item === "Medium Picture Boxes"
                            ? "$13.00"
                            : item === "Large Picture Boxes"
                            ? "$15.00"
                            : item === "Extra-Large Picture Boxes"
                            ? "$20.00"
                            : item === "Mattress Covers"
                            ? "$15.00"
                            : item === "Packing Tapes"
                            ? "$7.00"
                            : ""}
                        </Typography>
                      </TableCell>

                      <TableCell align="center">
                        <Typography
                          variant="subtitle1"
                          fontWeight={400}
                          color={"#667085"}
                          textAlign={"start"}
                          fontSize={12}
                        >
                          {item === "Dish Boxes"
                            ? "$27.00"
                            : item === "Wardrobe Boxes"
                            ? "$35.00"
                            : item === "Medium Boxes"
                            ? "$13.00"
                            : item === "Large Boxes"
                            ? "$18.25"
                            : item === "Book Boxes"
                            ? "$9.00"
                            : item === "Small Picture Boxes"
                            ? "$20.00"
                            : item === "Medium Picture Boxes"
                            ? "$25.00"
                            : item === "Large Picture Boxes"
                            ? "$28.00"
                            : item === "Extra-Large Picture Boxes"
                            ? "$35.00"
                            : item === "Mattress Covers"
                            ? "$15.00"
                            : item === "Packing Tapes"
                            ? "$7.00"
                            : ""}
                        </Typography>
                      </TableCell>

                      <TableCell align="center">
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems={"center"}
                        >
                          <IconButton
                            size="small"
                            aria-label={`subtract ${item} boxes`}
                            onClick={() => handleSubtract(item)}
                            sx={{
                              width: "25px",
                              height: "25px",
                              color: "white",
                              backgroundColor: "#5858E0",
                              "&:hover": {
                                backgroundColor: "#5858E0",
                                opacity: "0.9",
                              },
                            }}
                          >
                            <Subtract />
                          </IconButton>

                          <TextField
                            id="outlined-basic"
                            variant="outlined"
                            value={counts[item] || 0}
                            size="small"
                            onChange={(event) => {
                              const newValue =
                                parseInt(event.target.value) || 0;
                              setCounts((prevCounts) => ({
                                ...prevCounts,
                                [item]: newValue,
                              }));
                            }}
                            inputProps={{
                              style: {
                                color: "#5858E0",
                                background: "#5A7BFC14",
                                borderRadius: "8px",
                                textAlign: "center",
                              },
                            }}
                            sx={{
                              width: 55,
                              "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                  borderColor: "#5A7BFC59",
                                  borderWidth: "1.43",
                                  borderRadius: "8px",
                                },
                              },
                            }}
                          />

                          <IconButton
                            size="small"
                            aria-label={`add ${item} boxes`}
                            onClick={() => handleAdd(item)}
                            sx={{
                              width: "25px",
                              height: "25px",
                              color: "white",
                              backgroundColor: "#5858E0",
                              "&:hover": {
                                backgroundColor: "#5858E0",
                                opacity: "0.9",
                              },
                            }}
                          >
                            <AddIcon />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Stack
          p={2}
          marginTop={2}
          direction="row"
          alignItems={"center"}
          justifyContent={"space-between"}
          sx={{
            backgroundColor: "#5A7BFC14",
            borderRadius: "10px",
            border: "1.5px solid #5A7BFC59",
          }}
        >
          <Typography fontSize={"18px"} fontWeight={600} color={"#667085"}>
            Total Cost for packaging
          </Typography>
          <Typography fontSize={"20px"} fontWeight={600} color={"#374145"}>
            {totalCostOfPackaging}
          </Typography>
        </Stack>

        <Stack alignItems={"center"}>
          {fieldError && (
            <Typography color={"#FF0000"} fontSize={14}>
              {fieldError}
            </Typography>
          )}
        </Stack>

        <Stack
          direction="row"
          mt={3}
          spacing={2}
          justifyContent={"space-between"}
        >
          <Button
            onClick={() => {
              updateThisMoveRequest({
                delivery_details: {
                  packagaing_required: false,
                },
              });
            }}
            size="medium"
            sx={{
              width: 130,
              height: 50,
              color: "#5859DF",
              backgroundColor: "#F2F4FF",
              fontSize: 12,
              fontWeight: 550,
              border: "1px solid #6552FF",
            }}
          >
            Reject
          </Button>
          <Button
            onClick={() => {
              if (selectedValue !== "") {
                updateThisMoveRequest({
                  delivery_details: {
                    packagaing_required: true,
                    packaging: {
                      packaging_type: "Customized Package",
                      dish_boxes: counts["Dish Boxes"],
                      wardrobe_boxes: counts["Wardrobe Boxes"],
                      med_boxes: counts["Medium Boxes"],
                      large_boxes: counts["Large Boxes"],
                      book_boxes: counts["Book Boxes"],
                      small_picture_boxes: counts["Small Picture Boxes"],
                      medium_picture_boxes: counts["Medium Picture Boxes"],
                      large_picture_boxes: counts["Large Picture Boxes"],
                      extra_large_picture_boxes:
                        counts["Extra-Large Picture Boxes"],
                      mattress_covers: counts["Mattress Covers"],
                      packing_tapes: counts["Packing Tapes"],
                      tv_boxes: 0,
                      custom_packaging_preference: selectedValue,
                      packaging_payment: totalCostOfPackaging,
                    },
                  },
                });
              } else {
                setFieldError("Please select a packaging preference.");
              }
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
      </Grid>
    </>
  );
};

export default CustomizePackage;
