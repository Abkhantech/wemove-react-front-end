import { Button, Stack } from "@mui/material";
import { useEffect, useState } from "react";

const YesNoButtons = ({ isTrue, setIsTrue }: any) => {
  const notSeelectedButtonStyle = {
    width: 130,
    height: 40,
    color: "#5859DF",
    fontSize: 12,
    fontWeight: 550,
    border: "1px solid #6552FF",
  };

  const selectedButtonStyle = {
    width: 130,
    height: 40,
    backgroundColor: "#5858E0 !important",
    color: "#FDFCFD",
    fontSize: 12,
    fontWeight: 550,
    border: "1px solid #6552FF",
  };

  useEffect(() => {
    console.log(isTrue);
  });

  return (
    <Stack direction="row" mt={2} spacing={2} justifyContent={"center"}>
      <Button
        size="large"
        sx={!isTrue ? selectedButtonStyle : notSeelectedButtonStyle}
        onClick={() => {
          setIsTrue(false);
        }}
      >
        No
      </Button>
      <Button
        size="large"
        onClick={() => {
          setIsTrue(true);
        }}
        sx={isTrue ? selectedButtonStyle : notSeelectedButtonStyle}
      >
        Yes
      </Button>
    </Stack>
  );
};

export default YesNoButtons;
