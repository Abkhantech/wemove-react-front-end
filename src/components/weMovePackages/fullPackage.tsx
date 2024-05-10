import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import purpleStackIcon from "../../assets/Icons/purpleStackIcon.png";

const FullPackage = ({ updateThisMoveRequest, totalCubicFeet }: any) => {
  return (
    <Grid item xs={12} md={5} marginLeft={"auto"} marginRight={"auto"}>
      <Box
        p={2}
        sx={{
          backgroundColor: "#F2F4FF",
          border: "1px solid #EAECF0",
          borderRadius: "10px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <img src={purpleStackIcon} width={40} height={40} alt="" />

        <Typography variant="subtitle2" fontWeight={700} color={"#5858E0"}>
          Wemove Full Package
        </Typography>
        <Typography variant="h5" fontWeight={700}>
          ${Math.ceil(totalCubicFeet)}
        </Typography>
        <Typography variant="subtitle2" color={"#667085"}>
          Based on your move, a full pro pack where everything is boxed and
          packed properly
        </Typography>
      </Box>

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
            updateThisMoveRequest({
              delivery_details: {
                packagaing_required: true,
                packaging: {
                  packaging_type: "Full Package",
                  dish_boxes: 0,
                  wardrobe_boxes: 0,
                  med_boxes: 0,
                  large_boxes: 0,
                  book_boxes: 0,
                  small_picture_boxes: 0,
                  medium_picture_boxes: 0,
                  large_picture_boxes: 0,
                  extra_large_picture_boxes: 0,
                  mattress_covers: 0,
                  packing_tapes: 0,
                  tv_boxes: 0,
                  packaging_payment: Math.ceil(totalCubicFeet),
                  custom_packaging_preference: "Boxes-and-Packing",
                },
              },
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
    </Grid>
  );
};

export default FullPackage;
