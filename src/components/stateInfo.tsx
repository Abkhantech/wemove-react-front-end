import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const StateInfo = ({ state, onUpdate }:any) => {
  const [pointOfContactName, setPointOfContactName] = useState('');
  const [pointOfContactNumber, setPointOfContactNumber] = useState('');
  const [zipCodeInput, setZipCodeInput] = useState('');
  const [zipCodes, setZipCodes] = useState<any>([]);

  const addZipCode = () => {
    if (zipCodeInput.trim() !== '') {
      setZipCodes([...zipCodes, zipCodeInput.trim()]);
      setZipCodeInput('');
    }
  };

  const handleRemoveZipCode = (index:any) => {
    const updatedZipCodes = [...zipCodes];
    updatedZipCodes.splice(index, 1);
    setZipCodes(updatedZipCodes);
  };

  const handleUpdate = () => {
    const stateInfo = {
      pickup_service_state: state.name,
      zip_codes: zipCodes.map((zip:any) => ({ zip_code: zip })),
      point_of_contact_name: pointOfContactName,
      point_of_contact_phone_number: pointOfContactNumber,
    };
    onUpdate(stateInfo);
  };

  return (
    <div>
      <Typography fontWeight={600} fontSize={12}>
        {state.name}
      </Typography>
      <TextField
        label="Point of Contact Name"
        variant="outlined"
        value={pointOfContactName}
        onChange={(e) => setPointOfContactName(e.target.value)}
      />
      <TextField
        label="Point of Contact Number"
        variant="outlined"
        value={pointOfContactNumber}
        onChange={(e) => setPointOfContactNumber(e.target.value)}
      />
      <div>
        <TextField
          label="Zip Code"
          variant="outlined"
          value={zipCodeInput}
          onChange={(e) => setZipCodeInput(e.target.value)}
        />
        <IconButton onClick={addZipCode}>
          <AddCircleOutlineIcon />
        </IconButton>
      </div>
      <Stack spacing={1}>
        {zipCodes.map((zip:any, index:any) => (
          <div key={index}>
            <Typography>{zip}</Typography>
            <IconButton onClick={() => handleRemoveZipCode(index)}>
              <AddCircleOutlineIcon />
            </IconButton>
          </div>
        ))}
      </Stack>
      <button onClick={handleUpdate}>Update</button>
    </div>
  );
};

export default StateInfo;
