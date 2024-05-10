import { Button, Stack } from "@mui/material";

const ButtomSubmitButtons = ({ cancel, submit }: any) => {
  return (
    <Stack direction="row" mt={3} spacing={2} justifyContent={"space-between"}>
      <Button
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
        {cancel}
      </Button>
      <Button
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
        {submit}
      </Button>
    </Stack>
  );
};

export default ButtomSubmitButtons;
