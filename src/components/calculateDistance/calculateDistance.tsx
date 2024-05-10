import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import placesApiKey from "../utils/Google-Places-API-Key";
import axios from "axios";
import { useState } from "react";
import { Button, Grid, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { getMoveDistance, getMoveDistanceForAdmin } from "../../redux/actions/consumer";
import { unwrapResult } from "@reduxjs/toolkit";

const PLACES_API_KEY = placesApiKey;

const acceptButton = {
  width: 200,
  height: 50,
  mt: 3,
  backgroundColor: "#5858E0 !important",
  color: "#FFFFFF",
  fontSize: 12,
  fontWeight: 550,
  border: "1px solid #6552FF",
};

const CalculateDistance = () => {
  const dispatch = useDispatch();

  const [pickupAddress, setPickupAddress] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [calculatedDistance, setCalculatedDistance] = useState("");

  const handleFromAddress = async (add: any) => {
    const zip = await fetchZipCodeForAddress(add.value.description);
    const completeAddress = add.value.description.toString() + ", " + zip;
    setPickupAddress(completeAddress);
  };

  const handleToAddress = async (add: any) => {
    const zip = await fetchZipCodeForAddress(add.value.description);
    const completeAddress = add.value.description.toString() + ", " + zip;
    setDeliveryAddress(completeAddress);
  };

  const fetchZipCodeForAddress = async (add: string) => {
    const apiKey = "AIzaSyAk8hBHGztX6M9UX2MdZlRQS3HbdqINzp8";
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${add}&key=${apiKey}`;
    try {
      const response = await axios.get(url);
      const results = response.data.results;
      console.log(response.data, "---->");
      const zipCode = results[0].address_components?.find((component: any) =>
        component.types.includes("postal_code")
      )?.long_name;
      if (zipCode) {
        return zipCode.toString();
      } else {
        return "";
      }
    } catch (error) {
      console.error("Error fetching ZIP code:", error);
      throw error;
    }
  };

  const calculateMoveDistance = () => {
    if (pickupAddress !== "" && deliveryAddress !== "") {
      const body = {
        pickup_address: pickupAddress,
        delivery_address: deliveryAddress,
        moveRequestId: 4,
      };
      console.log("body=>",body)
      dispatch<any>(getMoveDistanceForAdmin(body))
        .then(unwrapResult)
        .then((res: any) => {
          setCalculatedDistance(res);
        })
        .catch((err: any) => {
          console.log(err);
        });
    } else {
      alert("Addresses should not be empty!");
    }
  };

  return (
    <>
      <Grid container>
        <Grid item xs={12} md={5} p={2} marginX={"auto"}>
          <Typography mt={3} fontSize="14px" fontWeight={600} color={"#797979"}>
            From Address
          </Typography>
          <GooglePlacesAutocomplete
            apiOptions={{
              language: "en",
            }}
            minLengthAutocomplete={1}
            apiKey={PLACES_API_KEY}
            debounce={500}
            selectProps={{
              styles: {
                input: (provided) => ({
                  ...provided,
                  color: "#000000",
                  height: "100%",
                  borderRadius: "8px",
                }),
                option: (provided) => ({
                  ...provided,
                  color: "#808080",
                }),
                singleValue: (provided) => ({
                  ...provided,
                  color: "#808080",
                }),
              },
              onChange: handleFromAddress,
              placeholder: "Enter Address",
            }}
          />

          <Typography mt={3} fontSize="14px" fontWeight={600} color={"#797979"}>
            To Address
          </Typography>
          <GooglePlacesAutocomplete
            apiOptions={{
              language: "en",
            }}
            minLengthAutocomplete={1}
            apiKey={PLACES_API_KEY}
            debounce={500}
            selectProps={{
              styles: {
                input: (provided) => ({
                  ...provided,
                  color: "#000000",
                  height: "100%",
                  borderRadius: "8px",
                }),
                option: (provided) => ({
                  ...provided,
                  color: "#808080",
                }),
                singleValue: (provided) => ({
                  ...provided,
                  color: "#808080",
                }),
              },
              onChange: handleToAddress,
              placeholder: "Enter Address",
            }}
          />

          <Typography mt={3} fontSize="16px" fontWeight={600} color={"#FFFFF"}>
            Calculated Distance: {calculatedDistance}
          </Typography>

          <Button
            size="medium"
            sx={acceptButton}
            onClick={calculateMoveDistance}
          >
            Calculate Distance
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default CalculateDistance;
