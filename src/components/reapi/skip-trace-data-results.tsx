import { Backdrop, Button, CircularProgress, Divider, Grid, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getSkipTraceRecords } from "../../redux/actions/reapi";
import { unwrapResult } from "@reduxjs/toolkit";
import InfiniteScroll from "react-infinite-scroll-component";

const SkipTraceDataResults = () => {
  const [offset, setOffset] = useState(0);
  const [skipTraceRecords, setSkipTraceRecords] = useState<any>([]);
  const dispatch = useDispatch();
  const [hasMore, setHasMore] = useState(true);
  const [recordsCount, setRecordsCount] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
const [filterDate, setFilterDate] = useState("")
  const fetchSkipTraceRecords = () => {
console.log(recordsCount)
    if (!hasMore) return;
    setIsLoading(true)
    const body = {
      offset: offset,
      limit: 10,
      date: filterDate
    };
    console.log(body);
    dispatch<any>(getSkipTraceRecords(body))
      .then(unwrapResult)
      .then((records: any) => {
      //  setRecordsCount(records.length)
        if (records.length === 0) {
          setHasMore(false);
          setIsLoading(false)
        } else {
          setSkipTraceRecords([...skipTraceRecords, ...records]);
          setOffset(offset + records.length);
        }
      })
      .catch((err: any) => {
        console.log(err);
        setIsLoading(false)
      });
  };

  function jsonToCSV(jsonArray: any[]): string {
    if (jsonArray.length === 0) return "";
    const allKeys = new Set<string>();
    jsonArray.forEach((obj) => {
      Object.keys(obj).forEach((key) => allKeys.add(key));
    });
    const headers = Array.from(allKeys).sort();
    const rows = jsonArray.map((obj) => {
      return headers.map((header) => obj[header] ?? "-").join(",");
    });
    return [headers.join(","), ...rows].join("\n");
  }

  const downloadCSV = (csvContent: string, fileName: string): void => {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  const downnloadFile = () => {
    let dataToConvert: any = [];
    skipTraceRecords.map((record: any) => {
      const newObj = JSON.parse(record.object);

      const phoneNumbers: { [key: string]: string } = {};
      newObj?.output?.identity?.phones?.map((phone: any, index: number) => {
        phoneNumbers[`phone:${index + 1}`] = phone.phoneDisplay ?? "-";
      });

      const emails: { [key: string]: string } = {};
      newObj?.output?.identity?.emails?.map((email: any, index: number) => {
        emails[`email:${index + 1}`] = email.email ?? "-";
      });

      const customObj = {
        address: `"${newObj.input?.address ?? "-"}"`,
        city: newObj.input?.city ?? "-",
        state: newObj.input?.state ?? "-",
        zip: newObj.input?.zip ?? "-",
        firstName: newObj.output?.demographics?.names[0]?.firstName ?? "-",
        lastName: newObj.output?.demographics?.names[0]?.lastName ?? "-",
        gender:
          newObj.output == null || newObj.output?.demographics?.gender == ""
            ? "-"
            : newObj.output?.demographics?.gender,
        age: newObj.output?.demographics?.age ?? "-",
        ...phoneNumbers,
        ...emails,
      };

      dataToConvert.push(customObj);
    });
    console.log("Data to convert", dataToConvert);
    const csvData = jsonToCSV(dataToConvert);
    downloadCSV(csvData, "Skip-Trace.csv");
  };

  const turnToObject = (obj: any) => {
    const newObj = JSON.parse(obj);
    return (
      <Stack>
        {newObj && (
          <Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>Response Message:</Typography>
              <Typography>{newObj.responseMessage ?? "N/A"}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>Status Code:</Typography>
              <Typography>{newObj.statusCode}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>Status Message:</Typography>
              <Typography>{newObj.statusMessage ?? "N/A"}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>Warnings:</Typography>
              <Typography>{newObj.warnings ?? "N/A"}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>Address:</Typography>
              <Typography>{newObj.input?.address ?? "N/A"}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>City:</Typography>
              <Typography>{newObj.input?.city ?? "N/A"}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>State:</Typography>
              <Typography>{newObj.input?.state ?? "N/A"}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>ZIP Code:</Typography>
              <Typography>{newObj.input?.zip ?? "N/A"}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>Live:</Typography>
              <Typography>{newObj.live ? "Yes" : "No"}</Typography>
            </Stack>
            <Stack spacing={1} direction={"row"}>
              <Typography fontWeight={600}>Match:</Typography>
              <Typography>{newObj.match ? "Yes" : "No"}</Typography>
            </Stack>

            <Typography fontWeight={600}>Demographics</Typography>
            {newObj && newObj?.output && newObj?.output?.demographics && (
              <Stack>
                <Stack spacing={1} direction={"row"}>
                  <Typography fontWeight={600}>Age:</Typography>
                  <Typography>
                    {newObj.output?.demographics?.age ?? "N/A"}
                  </Typography>
                </Stack>
                <Stack spacing={1} direction={"row"}>
                  <Typography fontWeight={600}>Age Display:</Typography>
                  <Typography>
                    {newObj.output?.demographics?.ageDisplay ?? "N/A"}
                  </Typography>
                </Stack>
                <Stack spacing={1} direction={"row"}>
                  <Typography fontWeight={600}>Deceased:</Typography>
                  <Typography>
                    {newObj.output?.demographics?.deceased ? "Yes" : "No"}
                  </Typography>
                </Stack>
                <Stack spacing={1} direction={"row"}>
                  <Typography fontWeight={600}>Date of Birth:</Typography>
                  <Typography>
                    {newObj.output?.demographics?.dob ?? "N/A"}
                  </Typography>
                </Stack>
                <Stack spacing={1} direction={"row"}>
                  <Typography fontWeight={600}>Date of Death:</Typography>
                  <Typography>
                    {newObj.output?.demographics?.dod ?? "N/A"}
                  </Typography>
                </Stack>

                <Stack spacing={1} direction={"row"}>
                  <Typography fontWeight={600}>Education:</Typography>
                  <Stack>
                    {newObj?.output?.demographics?.education?.map(
                      (item: any, index: any) => (
                        <Typography key={index}>{item}</Typography>
                      )
                    )}
                  </Stack>
                </Stack>
                <Stack spacing={1} direction={"row"}>
                  <Typography fontWeight={600}>Gender:</Typography>
                  <Typography>
                    {newObj.output?.demographics?.gender ?? "N/A"}
                  </Typography>
                </Stack>

                {newObj.output?.demographics?.jobs &&
                  newObj.output.demographics.jobs.length > 0 && (
                    <Stack>
                      {newObj.output.demographics.jobs.map(
                        (job: any, index: any) => (
                          <Stack key={index} spacing={1}>
                            <Typography fontWeight={600}>
                              Job {index + 1}:
                            </Typography>
                            <Stack spacing={1} direction={"row"}>
                              <Typography>Title:</Typography>
                              <Typography>{job.title}</Typography>
                            </Stack>
                            <Stack spacing={1} direction={"row"}>
                              <Typography>Organization:</Typography>
                              <Typography>{job.org}</Typography>
                            </Stack>
                            <Stack spacing={1} direction={"row"}>
                              <Typography>Industry:</Typography>
                              <Typography>{job.industry}</Typography>
                            </Stack>
                            <Stack spacing={1} direction={"row"}>
                              <Typography>Display:</Typography>
                              <Typography>{job.display}</Typography>
                            </Stack>
                            <Stack spacing={1} direction={"row"}>
                              <Typography>Dates:</Typography>
                              <Typography>{job.dates}</Typography>
                            </Stack>
                          </Stack>
                        )
                      )}
                    </Stack>
                  )}

                {newObj.output?.demographics?.names &&
                  newObj.output.demographics.names.length > 0 && (
                    <Stack>
                      {newObj.output.demographics.names.map(
                        (name: any, index: any) => (
                          <Stack key={index} spacing={1}>
                            <Typography fontWeight={600}>
                              Name {index + 1}:
                            </Typography>
                            <Stack spacing={1} direction={"row"}>
                              <Typography>First Name:</Typography>
                              <Typography>{name.firstName}</Typography>
                            </Stack>
                            <Stack spacing={1} direction={"row"}>
                              <Typography>Last Name:</Typography>
                              <Typography>{name.lastName}</Typography>
                            </Stack>
                            <Stack spacing={1} direction={"row"}>
                              <Typography>Full Name:</Typography>
                              <Typography>{name.fullName}</Typography>
                            </Stack>
                            <Stack spacing={1} direction={"row"}>
                              <Typography>Middle Name:</Typography>
                              <Typography>{name.middleName}</Typography>
                            </Stack>
                            <Stack spacing={1} direction={"row"}>
                              <Typography>Prefix:</Typography>
                              <Typography>{name.prefix}</Typography>
                            </Stack>
                            <Stack spacing={1} direction={"row"}>
                              <Typography>Suffix:</Typography>
                              <Typography>{name.suffix}</Typography>
                            </Stack>
                            <Stack spacing={1} direction={"row"}>
                              <Typography>Type:</Typography>
                              <Typography>{name.type}</Typography>
                            </Stack>
                            <Stack spacing={1} direction={"row"}>
                              <Typography>Valid Since:</Typography>
                              <Typography>{name.validSince}</Typography>
                            </Stack>
                            <Stack spacing={1} direction={"row"}>
                              <Typography>Last Seen:</Typography>
                              <Typography>{name.lastSeen}</Typography>
                            </Stack>
                          </Stack>
                        )
                      )}
                    </Stack>
                  )}
              </Stack>
            )}
            <Typography fontWeight={600}>Phones</Typography>
            {newObj &&
              newObj.output &&
              newObj.output.identity &&
              newObj.output.identity.phones && (
                <Stack>
                  {newObj.output.identity.phones.map(
                    (phone: any, index: any) => (
                      <Stack key={index} spacing={1}>
                        <Typography fontWeight={600}>
                          Phone {index + 1}:
                        </Typography>
                        <Stack spacing={1} direction={"row"}>
                          <Typography>Phone:</Typography>
                          <Typography>{phone.phone}</Typography>
                        </Stack>
                        <Stack spacing={1} direction={"row"}>
                          <Typography>Phone Display:</Typography>
                          <Typography>{phone.phoneDisplay}</Typography>
                        </Stack>
                        <Stack spacing={1} direction={"row"}>
                          <Typography>Phone Type:</Typography>
                          <Typography>{phone.phoneType}</Typography>
                        </Stack>
                        <Stack spacing={1} direction={"row"}>
                          <Typography>Phone Extension:</Typography>
                          <Typography>{phone.phoneExtension}</Typography>
                        </Stack>
                        <Stack spacing={1} direction={"row"}>
                          <Typography>Do Not Call:</Typography>
                          <Typography>{phone.doNotCall}</Typography>
                        </Stack>
                        <Stack spacing={1} direction={"row"}>
                          <Typography>Is Connected:</Typography>
                          <Typography>
                            {phone.isConnected ? "Yes" : "No"}
                          </Typography>
                        </Stack>
                        <Stack spacing={1} direction={"row"}>
                          <Typography>Last Seen:</Typography>
                          <Typography>{phone.lastSeen}</Typography>
                        </Stack>
                        <Stack spacing={1} direction={"row"}>
                          <Typography>Telco Name:</Typography>
                          <Typography>{phone.telcoName}</Typography>
                        </Stack>
                        <Stack spacing={1} direction={"row"}>
                          <Typography>Valid Since:</Typography>
                          <Typography>{phone.validSince}</Typography>
                        </Stack>
                      </Stack>
                    )
                  )}
                </Stack>
              )}
          </Stack>
        )}
      </Stack>
    );
  };

  useEffect(() => {
    if(filterDate!==""){
      fetchSkipTraceRecords();
    }
  }, [skipTraceRecords]);
  useEffect(()=>{
    if(filterDate!==""){
      fetchSkipTraceRecords();
    }
  },[filterDate])
  return (
    <>
      <Grid container mt={2} mb={2} p={1}>
        <Grid item xs={12} mb={2} justifyContent={"center"}>
          <Typography
            fontSize={20}
            fontWeight={700}
            color={"#000000"}
            textAlign="center"
          >
            SKIP TRACE RESULTS - TOTAL: {skipTraceRecords.length}
          </Typography>
          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={isLoading}
            onClick={()=>{setIsLoading(true)}}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
          <Stack spacing={2} alignSelf={'center'} alignItems={'center'} mt={2}>
        {filterDate===""&&(
          <TextField
          id="outlined-size-small"
          size="small"
          placeholder="Estimate Move Date"
          type="date"
          onChange={(e)=>{setFilterDate(e.target.value)}}
          />
          )}
          {filterDate===""&&(
            <Button onClick={()=>{
              setFilterDate("00")
            }} variant="contained">GET ALL RECORDS</Button>
            )}
          <Button disabled={!filterDate} variant="contained" onClick={() => downnloadFile()}>Download CSV</Button>
          </Stack>
          {/* <InfiniteScroll
            dataLength={skipTraceRecords.length || 0}
            next={fetchSkipTraceRecords}
            hasMore={hasMore}
            loader={hasMore ? <h4>Loading...</h4> : null}
            scrollableTarget="scrollableDiv"
          >
            <div className="d-inline-block">
              {skipTraceRecords.map((record: any) => {
                return (
                  <Stack
                    sx={{ marginY: 4 }}
                    key={record.id}
                    className="userCard border border-dark rounded-pill mt-3 me-2"
                    onClick={() => {}}
                  >
                    <Typography
                      textAlign={"center"}
                      fontWeight={600}
                      fontSize={18}
                    >
                      - RECORD -
                    </Typography>
                    <Typography>{turnToObject(record.object)}</Typography>
                    <Divider />
                  </Stack>
                );
              })}
            </div>
          </InfiniteScroll> */}
        </Grid>
      </Grid>
    </>
  );
};

export default SkipTraceDataResults;
