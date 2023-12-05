import { useState, useEffect, useCallback, useRef } from "react";
import { Link as RouterLink } from "react-router-dom";
import PropTypes from "prop-types";
import numeral, { reset } from "numeral";
import WarningIcon from '@material-ui/icons/WarningOutlined';
import XIcon from '../../../icons/X';
import Modal11 from '../../../components/widgets/modals/Modal11';
import { alpha } from '@material-ui/core/styles';
import Label from "../../Label"; 
import {
  Box,
  Card,
  CardMedia,
  Divider,
  Grid,
  Container, 
  Avatar, 
  Paper,
  Link,
  Typography,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  TextField,
  CardHeader,
  CardContent,
  FormHelperText,
  Popover,
  Button,
  List,
  ListItem,
  CardActions,
  Tooltip,
  Autocomplete,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Dialog,
} from "@material-ui/core";
import useMounted from "../../../hooks/useMounted";
import { amber, green, red } from "@material-ui/core/colors";
import ArrowDown from "@material-ui/icons/ArrowDownward";
import ArrowUp from "@material-ui/icons/ArrowUpward";
import ReceiptIcon from "@material-ui/icons/Receipt";
import { Storage } from "aws-amplify";
import toast from "react-hot-toast";
import FileDropzoneProp from "../../FileDropzoneProp";
import { propertiesApi } from "../../../api/PropertiesApi";
import { Auth } from "aws-amplify";
import * as Yup from "yup";
import { Formik, setNestedObjectValues } from "formik";
import MobileDatePicker from "@material-ui/lab/MobileDatePicker";
import locations from "../../dashboard/account/locations";
import InputAdornment from "@material-ui/core/InputAdornment";
import { v4 as uuid } from "uuid";
import { makeStyles } from "@material-ui/core/styles";
import { property } from "lodash-es";
import moment from "moment";
import { useTheme } from '@material-ui/core/styles';
import styled, { keyframes } from 'styled-components'





const PropertyCardOverview = (props) => {
  let { property, onBack, onNext, ...other } = props;
  const mounted = useMounted();
  const anchorRef = useRef(null);
//  const anchorRefCert = useRef(null);
//  const anchorRefIns = useRef(null);
  const [fileNameS, setFileNameS] = useState("");
  const [isLiked, setIsLiked] = useState(property.isLiked);
  const [likes, setLikes] = useState(property.likes);
  const [list, setList] = useState([]);
  const [mode, setMode] = useState("grid");
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
//  const [openCert, setOpenCert] = useState(false);
//  const [openIns, setOpenIns] = useState(false);
  const [files, setFiles] = useState([]);
//  const [mountedCert, setMountedCert] = useState(false);
//  const [mountedIns, setMountedIns] = useState(false);
// const [certification, setCertification] = useState([]);
// const [insurance, setInsurance] = useState([]);
  const [dbCurrent, setdbCurrent] = useState([]);
  const [tasks, setTasks] =  useState([]);
  const [mountedTasks, setMountedTasks] = useState(false);
  const [selectedValue, setSelectedValue] = useState([1]);
  const theme = useTheme();
  const colors = [
    {
      name: 'Success',
      code: theme.palette.success.main
    },
    {
      name: 'Error',
      code: theme.palette.error.main
    },
    {
      name: 'Warning',
      code: theme.palette.warning.main
    },
    {
      name: 'Info',
      code: theme.palette.info.main
    }
  ];


  function blinkingEffect() {
    return keyframes`
      50% {
        opacity: 0.7;
      }
    `;
  }

const AnimatedComponent = styled.div`
  animation: ${blinkingEffect} 1s linear infinite;
`
  const current = new Date();
  const date = `${
    current.getMonth() + 1
  }/${current.getDate()}/${current.getFullYear()}`;

  //{Date.parse(insur.EndDate) > Date.parse(current) ? insur.status = getStatusLabel('expired') : insur.status = getStatusLabel('valid')}

  const getStatusLabel = (certificateStatus) => {
    const map = {
      expired: {
        color: "error",
        text: "Expired",
      },
      valid: {
        color: "success",
        text: "Valid",
      },
      pending: {
        color: "warning",
        text: "About the Expire",
      },
    };

    const { text, color } = map[certificateStatus];

    return <Typography color={color}>{text}</Typography>;
  };

  const Types = [
    { text: "Flat" },
    { text: "Detached" },
    { text: "Semi-Detached" },
    { text: "Terraced" },
  ];

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleClose2 = () => {
    setOpen2(false);
  };

  const handleDrop = (newFiles) => {
    setFiles(newFiles);
  };

  const handleRemove = (file) => {
    setFiles((prevFiles) =>
      prevFiles.filter((_file) => _file.path !== file.path)
    );
  };

  const handleRemoveAll = () => {
    setFiles([]);
  };

  const uploadFile = (e) => {
    const file = files[0];
    const ss = uuid() + "-" + file.name;
    property.documentName = ss;
    Storage.put(ss, file)
      .then((res) => {
        toast.success("Successfully uploaded");
        handleRemoveAll();
        //getData();
      })

      .catch((err) => {
        toast.error("Unexpected error while uploading, try again", err);
      });
  };

  const updateProperties = async () => {
    const propertyy = {
      id: property.id,
      postcode: property.postcode,
      location: property.location,
      purchasePrice: property.purchasePrice,
      firstAddress: property.firstAddress,
      purchaseDate: property.purchaseDate,
      documentName: property.documentName,
      propertyType: property.propertyType,
      description: property.description,
    };
    getData();
    return await propertiesApi.updateProperties(propertyy);
  };

  const deleteProperty = async () => {
    const propertyy = {
      id: property.id,
    };
     await propertiesApi.deleteProperty(propertyy)
     .then(toast.success("Successfully deleted"),
     handleClose2())
    .catch(err => {
     toast.error('Unexpected error while deleting, try again', err);
     
    });
  };

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename || "download";
    const clickHandler = () => {
      setTimeout(() => {
        URL.revokeObjectURL(url);
        a.removeEventListener("click", clickHandler);
      }, 150);
    };
    a.addEventListener("click", clickHandler, false);
    a.click();
    return a;
  }

  async function downloadProperty() {
    const result = await Storage.get(property.documentName, { download: true });
    downloadBlob(result.Body, property.documentName);
  }
  
  const getTasks = async() => {
    try {
      const data1 = await propertiesApi.getTasks();
      setTasks(data1);
      setMountedTasks(true);
    } catch(err) {
      console.error(err);
    }
  };

  if (!mountedTasks) {
    getTasks();
  }

  const useStyles = makeStyles({
    font: {
      fontSize: "11.5px",
    },
  });

  const classes = useStyles();

  const handleLike = () => {
    setIsLiked(true);
    setLikes((prevLikes) => prevLikes + 1);
  };
  const handleModeChange = (event, value) => {
    setMode(value);
  };

  const getData = useCallback(async () => {
    Storage.get(property.documentName, {
      level: "public",
    })
      .then((data) => {
        return data;
      })
      .then((data) => setFileNameS(data));
    try {
      const Data = await fetch(
        "https://landlordfiles170913-dev.s3.amazonaws.com/public/AccurateData.json"
      )
        .then((response) => response.json())
        .then((data) => {
          return data;
        });
      if (mounted.current) {
        setList(Data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [mounted]);

  useEffect(() => {
    getData();
  }, [getData]);

  const handleUnlike = () => {
    setIsLiked(false);
    setLikes((prevLikes) => prevLikes - 1);
  };
  


  var dif1 = 463000 - property.purchasePrice;
  var x = (Math.abs(dif1) / property.purchasePrice) * 100;


  return (
    <Card {...other}>
      <Box sx={{ p: 3 }}>
        <Tooltip
          title={
            property.documentName
              ? "Click to download"
              : "Click edit to add an image"
          }
        >
          <CardMedia
            image={fileNameS}
            onClick={downloadProperty}
            sx={{
              backgroundColor: "background.default",
              height: 250,
            }}
          />
        </Tooltip>
      </Box>
      <Box
        sx={{
          px: 3,
          py: 1,
        }}
      >
        <Grid
          alignItems="center"
          container
          justifyContent="space-between"
          spacing={3}
        >
          <Grid item>
            <Typography color="textSecondary" variant="body2">
              Description
            </Typography>
            <Typography color="textPrimary" variant="subtitle2">
              {property.description}
            </Typography>
          </Grid>
          <Grid item>
            <Typography ml={-2} color="textSecondary" variant="body2">
              Postcode
            </Typography>
            <Typography align="left" color="textPrimary" variant="subtitle2">
              {property.postcode}
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <Box
        sx={{
          px: 3,
          py: 1,
        }}
      >
        <Grid
          alignItems="center"
          container
          justifyContent="space-between"
          spacing={3}
        >
          <Grid item>
            <Typography color="textSecondary" variant="body2">
              First Line of Address
            </Typography>
            <Typography color="textPrimary" variant="subtitle2">
              {property.firstAddress}
            </Typography>
          </Grid>
          <Grid item>
            <Typography ml={-2} color="textSecondary" variant="body2">
              Purchase Date
            </Typography>
            <Typography align="left" color="textPrimary" variant="subtitle2">
              {property.purchaseDate}
            </Typography>
          </Grid>
        </Grid>
      </Box>

      <Box
        sx={{
          px: 3,
          py: 1,
        }}
      >
        <Grid
          alignItems="right"
          container
          justifyContent="space-between"
          spacing={3}
        >
          <Grid item>
            <Typography color="textSecondary" variant="body2">
              Type
            </Typography>
            {list.map((items) => (
              <Grid
                item
                key={items.RegionName}
                md={mode === "grid" ? 6 : 12}
                sm={mode === "grid" ? 12 : 12}
                xs={6}
              >
                <Grid item>
                  {(() => {
                    // if (items.RegionName===property.location) {
                    //return items.AreaCode

                    if (items.regionname === property.location) {
                      //return items.AreaCode
                      switch (property.propertyType) {
                        case "Detached":
                          return (
                            <Typography color="textPrimary" variant="subtitle2">
                              
                              Detached
                            </Typography>
                          );
                        case "Semi-Detached":
                          return (
                            <Typography color="textPrimary" variant="subtitle2">
                              
                              Semi-Detached
                            </Typography>
                          );
                        case "Terraced":
                          return (
                            <Typography color="textPrimary" variant="subtitle2">
                              Terraced
                            </Typography>
                          );
                        case "Flat":
                          return (
                            <Typography color="textPrimary" variant="subtitle2">
                              
                              Flat
                            </Typography>
                          );
                        default:
                          return "undefined";
                      }
                    }
                  })()}
                </Grid>
              </Grid>
            ))}
          </Grid>
          <Grid item>
            <Typography color="textSecondary" variant="body2">
              Location
            </Typography>
            <Typography color="textPrimary" variant="subtitle2">
              {property.location}
            </Typography>
          </Grid>
        </Grid>
      </Box>

      <Divider />

      <Box
        sx={{
          px: 3,
          py: 2,
        }}
      >
        <Grid
          alignItems="center"
          container
          justifyContent="space-between"
          spacing={3}
        >
          <Grid item>
            <Typography color="textPrimary" variant="subtitle2">
              £
              {numeral(property.purchasePrice).format(
                `${property.currency}0,0.00`
              )}
            </Typography>
            <Typography color="textSecondary" variant="body2">
              Purchase Price
            </Typography>
          </Grid>
          <Grid item>
            <Grid>
              {list.map((items) => (
                <Grid item>               
                  {(() => {
                    if (items.regionname === property.location) {
                      switch (property.propertyType) {
                        case "Detached":
                          return (
                            <Grid item>
                              <Typography
                                color="textPrimary"
                                variant="subtitle2"
                              >                             
                                {(() => {
                                  const detachedCurrent = (items.detachedprice >= property.purchasePrice) ? numeral(
                                    (property.purchasePrice *
                                      (items.detached12mchange + 1)) /
                                      (items.detached1mchange + 1)
                                  ).format(`0,0.00`) : numeral(
                                    property.purchasePrice *
                                      (1 -
                                        Math.abs(
                                          items.detachedprice -
                                            property.purchasePrice
                                        ) /
                                          property.purchasePrice)
                                  ).format(`0,0.00`)

                                  return (
                                    <Typography 
                                      color="textPrimary"
                                      variant="subtitle2"
                                      >
                                        £{detachedCurrent}
                                    </Typography>           
                                  ); 


                                })()}
                              </Typography>
                            </Grid>
                          );
                          
                        case "Flat":
                          return (
                            <Grid item>
                              <Typography
                                color="textPrimary"
                                variant="subtitle2"
                              >
                                {(() => {
                                  const flatCurrent = (items.flatprice >= property.purchasePrice) ? numeral(
                                    (property.purchasePrice *
                                      (items.flat12mchange + 1)) /
                                      (items.flat1mchange + 1)
                                  ).format(`0,0.00`) : numeral(
                                    property.purchasePrice *
                                      (1 -
                                        Math.abs(
                                          items.flatprice -
                                            property.purchasePrice
                                        ) /
                                          property.purchasePrice)
                                  ).format(`0,0.00`)

                                  return (
                                    <Typography 
                                      color="textPrimary"
                                      variant="subtitle2"
                                      >
                                        £{flatCurrent}
                                    </Typography>           
                                  );
                                })()}
                              </Typography>
                            </Grid>
                          );

                        case "Semi-Detached":
                          return (
                            <Grid item>
                              <Typography
                                color="textPrimary"
                                variant="subtitle2"
                              >
                                {(() => {
                                  const semidetachedCurrent = (items.semidetachedprice >= property.purchasePrice) ? numeral(
                                    (property.purchasePrice *
                                      (items.semidetached12mchange + 1)) /
                                      (items.semidetached1mchange + 1)
                                  ).format(`0,0.00`) : numeral(
                                    property.purchasePrice *
                                      (1 -
                                        Math.abs(
                                          items.semidetached -
                                            property.purchasePrice
                                        ) /
                                          property.purchasePrice)
                                  ).format(`0,0.00`)

                                  return (
                                    <Typography 
                                      color="textPrimary"
                                      variant="subtitle2"
                                      >
                                        £{semidetachedCurrent}
                                    </Typography>           
                                  );

                                })()}
                              </Typography>
                            </Grid>
                          );
                        
                        case "Terraced":
                          return (
                            <Grid item>
                              <Typography
                                color="textPrimary"
                                variant="subtitle2"
                              >
                                {(() => {
                                  const terracedCurrent = (items.terracedprice >= property.purchasePrice) ? numeral(
                                    (property.purchasePrice *
                                      (items.terraced12mchange + 1)) /
                                      (items.terraced1mchange + 1)
                                  ).format(`0,0.00`) : numeral(
                                    property.purchasePrice *
                                      (1 -
                                        Math.abs(
                                          items.terraced -
                                            property.purchasePrice
                                        ) /
                                          property.purchasePrice)
                                  ).format(`0,0.00`)

                                  return (
                                    <Typography 
                                      color="textPrimary"
                                      variant="subtitle2"
                                      >
                                        £{terracedCurrent}
                                    </Typography>  
                                  );                                 
                                })()};
                              </Typography>
                            </Grid>
                          );                       
                        default:
                          return "";
                      }
                    }                                 
                  })()}                 
                </Grid>               
              ))}             
            </Grid>
            <Typography color="textSecondary" variant="body2">
              Curent Price
            </Typography>
          </Grid>
          <Grid item>
            <Grid>
              {list.map((items) => (
                <Grid item>
                  {(() => {
                    if (items.regionname === property.location) {
                      switch (property.propertyType) {
                        case "Detached":
                          return (
                            <Grid item>
                              <Typography
                                color="textPrimary"
                                variant="subtitle2"
                              >
                                £{numeral(items.detachedprice).format(`0,0.00`)}
                              </Typography>
                            </Grid>
                          );
                        case "Flat":
                          return (
                            <Grid item>
                              <Typography
                                color="textPrimary"
                                variant="subtitle2"
                              >
                                £{numeral(items.flatprice).format(`0,0.00`)}
                              </Typography>
                            </Grid>
                          );

                        case "Semi-Detached":
                          return (
                            <Grid item>
                              <Typography
                                color="textPrimary"
                                variant="subtitle2"
                              >
                                £
                                {numeral(items.semidetachedprice).format(
                                  `0,0.00`
                                )}
                              </Typography>
                            </Grid>
                          );

                        case "Terraced":
                          return (
                            <Grid item>
                              <Typography
                                color="textPrimary"
                                variant="subtitle2"
                              >
                                £{numeral(items.terracedprice).format(`0,0.00`)}
                              </Typography>
                            </Grid>
                          );

                        default:
                          return "";
                      }
                    }
                  })()}
                </Grid>
              ))}
            </Grid>

            <Typography color="textSecondary" variant="body2">
              Average Value
            </Typography>
          </Grid>
          <Grid container spacing={3}></Grid>
        </Grid>
        <Grid
          alignItems="center"
          container
          justifyContent="space-between"
          spacing={1}
        >
          <Grid item>
            <Grid>
              {list.map((items) => (
                <Grid item>
                  {(() => {
                    if (items.regionname === property.location) {
                      switch (property.propertyType) {
                        case "Detached":
                          return (
                            <Grid item>
                              {(() => {
                                if (
                                  items.detachedprice >= property.purchasePrice
                                ) {
                                  return (
                                    <ArrowUp
                                      color="action"
                                      sx={{ color: green[900] }}
                                    />
                                  );
                                }
                                return (
                                  <ArrowDown
                                    color="action"
                                    sx={{ color: red[900] }}
                                  />
                                );
                              })()}
                              <Typography
                                variant="body2"
                                sx={{
                                  color: green[900],
                                  mr: 1,
                                }}
                              >
                                
                                {Math.round(Math.abs(items.detached1mchange))}
                                {"%"}
                              </Typography>
                            </Grid>
                          );

                        case "Flat":
                          return (
                            <Grid item>
                              {(() => {
                                if (items.flatprice >= property.purchasePrice) {
                                  return (
                                    <ArrowUp
                                      color="action"
                                      sx={{ color: green[900] }}
                                    />
                                  );
                                }
                                return (
                                  <ArrowDown
                                    color="action"
                                    sx={{ color: red[900] }}
                                  />
                                );
                              })()}
                              <Typography
                                variant="body2"
                                sx={{
                                  color: green[900],
                                  mr: 1,
                                }}
                              >
                                
                                {Math.round(Math.abs(items.flat1mchange))}
                                {"%"}
                              </Typography>
                            </Grid>
                          );

                        case "Semi-Detached":
                          return (
                            <Grid item>
                              {(() => {
                                if (
                                  items.semidetachedprice >=
                                  property.purchasePrice
                                ) {
                                  return (
                                    <ArrowUp
                                      color="action"
                                      sx={{ color: green[900] }}
                                    />
                                  );
                                }
                                return (
                                  <ArrowDown
                                    color="action"
                                    sx={{ color: red[900] }}
                                  />
                                );
                              })()}
                              <Typography
                                variant="body2"
                                sx={{
                                  color: green[900],
                                  mr: 1,
                                }}
                              >
                                
                                {Math.round(
                                  Math.abs(items.semidetached1mchange)
                                )}
                                {"%"}
                              </Typography>
                            </Grid>
                          );

                        case "Terraced":
                          return (
                            <Grid item>
                              {(() => {
                                if (
                                  items.terracedprice >= property.purchasePrice
                                ) {
                                  return (
                                    <ArrowUp
                                      color="action"
                                      sx={{ color: green[900] }}
                                    />
                                  );
                                }
                                return (
                                  <ArrowDown
                                    color="action"
                                    sx={{ color: red[900] }}
                                  />
                                );
                              })()}
                              <Typography
                                variant="body2"
                                sx={{
                                  color: green[900],
                                  mr: 1,
                                }}
                              >
                                
                                {Math.round(Math.abs(items.terraced1mchange))}
                                {"%"}
                              </Typography>
                            </Grid>
                          );
                        default:
                      }
                    }
                  })()}
                </Grid>
              ))}
            </Grid>
            <Typography color="textSecondary" variant="caption">
              Since last month
            </Typography>
          </Grid>
          <Grid item>
            <Grid>
              {list.map((items) => (
                <Grid item>
                  {(() => {
                    if (items.regionname === property.location) {
                      switch (property.propertyType) {
                        case "Detached":
                          return (
                            <Grid item>
                              {(() => {
                                if (
                                  items.detachedprice >= property.purchasePrice
                                ) {
                                  return (
                                    <ArrowUp
                                      color="action"
                                      sx={{ color: green[900] }}
                                    />
                                  );
                                }
                                return (
                                  <ArrowDown
                                    color="action"
                                    sx={{ color: red[900] }}
                                  />
                                );
                              })()}
                              <Typography
                                variant="body2"
                                sx={{
                                  color: green[900],
                                  mr: 1,
                                }}
                              >
                                
                                {Math.round(Math.abs(items.detached12mchange))}
                                {"%"}
                              </Typography>
                            </Grid>
                          );

                        case "Flat":
                          return (
                            <Grid item>
                              {(() => {
                                if (items.flatprice >= property.purchasePrice) {
                                  return (
                                    <ArrowUp
                                      color="action"
                                      sx={{ color: green[900] }}
                                    />
                                  );
                                }
                                return (
                                  <ArrowDown
                                    color="action"
                                    sx={{ color: red[900] }}
                                  />
                                );
                              })()}
                              <Typography
                                variant="body2"
                                sx={{
                                  color: green[900],
                                  mr: 1,
                                }}
                              >
                                
                                {Math.round(Math.abs(items.flat12mchange))}
                                {"%"}
                              </Typography>
                            </Grid>
                          );

                        case "Semi-Detached":
                          return (
                            <Grid item>
                              {(() => {
                                if (
                                  items.semidetachedprice >=
                                  property.purchasePrice
                                ) {
                                  return (
                                    <ArrowUp
                                      color="action"
                                      sx={{ color: green[900] }}
                                    />
                                  );
                                }
                                return (
                                  <ArrowDown
                                    color="action"
                                    sx={{ color: red[900] }}
                                  />
                                );
                              })()}
                              <Typography
                                variant="body2"
                                sx={{
                                  color: green[900],
                                  mr: 1,
                                }}
                              >
                                
                                {Math.round(
                                  Math.abs(items.semidetached12mchange)
                                )}
                                {"%"}
                              </Typography>
                            </Grid>
                          );

                        case "Terraced":
                          return (
                            <Grid item>
                              {(() => {
                                if (
                                  items.terracedprice >= property.purchasePrice
                                ) {
                                  return (
                                    <ArrowUp
                                      color="action"
                                      sx={{ color: green[900] }}
                                    />
                                  );
                                }
                                return (
                                  <ArrowDown
                                    color="action"
                                    sx={{ color: red[900] }}
                                  />
                                );
                              })()}
                              <Typography
                                variant="body2"
                                sx={{
                                  color: green[900],
                                  mr: 1,
                                }}
                              >
                                
                                {Math.round(Math.abs(items.terraced12mchange))}
                                {"%"}
                              </Typography>
                            </Grid>
                          );

                        default:
                          return "foo";
                      }
                    }
                  })()}
                </Grid>
              ))}
            </Grid>
            <Typography color="textSecondary" variant="caption">
              Since last year
            </Typography>
          </Grid>
          <Grid item>
            <Grid>
              {list.map((items) => (
                <Grid item>
                  {(() => {
                    if (items.regionname === property.location) {
                      switch (property.propertyType) {
                        case "Detached":
                          return (
                            <Grid item>
                              {(() => {
                                if (
                                  items.detachedprice >= property.purchasePrice
                                ) {
                                  return (
                                    <ArrowUp
                                      color="action"
                                      sx={{ color: green[900] }}
                                    />
                                  );
                                }
                                return (
                                  <ArrowDown
                                    color="action"
                                    sx={{ color: red[900] }}
                                  />
                                );
                              })()}
                              <Typography
                                variant="body2"
                                sx={{
                                  color: green[900],
                                  mr: 1,
                                }}
                              >
                                
                                {Math.floor(
                                  Math.abs(
                                    items.detachedprice - property.purchasePrice
                                  ) / property.purchasePrice
                                ) * 100}
                                {"%"}
                              </Typography>
                            </Grid>
                          );

                        case "Flat":
                          return (
                            <Grid item>
                              {(() => {
                                if (items.flatprice >= property.purchasePrice) {
                                  return (
                                    <ArrowUp
                                      color="action"
                                      sx={{ color: green[900] }}
                                    />
                                  );
                                }
                                return (
                                  <ArrowDown
                                    color="action"
                                    sx={{ color: red[900] }}
                                  />
                                );
                              })()}
                              <Typography
                                variant="body2"
                                sx={{
                                  color: green[900],
                                  mr: 1,
                                }}
                              >
                                
                                {Math.floor(
                                  (Math.abs(
                                    items.flatprice - property.purchasePrice
                                  ) /
                                    property.purchasePrice) *
                                    100
                                )}
                                {"%"}
                              </Typography>
                            </Grid>
                          );

                        case "Semi-Detached":
                          return (
                            <Grid item>
                              {(() => {
                                if (
                                  items.semidetachedprice >=
                                  property.purchasePrice
                                ) {
                                  return (
                                    <ArrowUp
                                      color="action"
                                      sx={{ color: green[900] }}
                                    />
                                  );
                                }
                                return (
                                  <ArrowDown
                                    color="action"
                                    sx={{ color: red[900] }}
                                  />
                                );
                              })()}
                              <Typography
                                variant="body2"
                                sx={{
                                  color: green[900],
                                  mr: 1,
                                }}
                              >
                                {Math.floor(
                                  (Math.abs(
                                    items.semidetachedprice -
                                      property.purchasePrice
                                  ) /
                                    property.purchasePrice) *
                                    100
                                )}
                                {"%"}
                              </Typography>
                            </Grid>
                          );

                        case "Terraced":
                          return (
                            <Grid item>
                              {(() => {
                                if (
                                  items.terracedprice >= property.purchasePrice
                                ) {
                                  return (
                                    <ArrowUp
                                      color="action"
                                      sx={{ color: green[900] }}
                                    />
                                  );
                                }
                                return (
                                  <ArrowDown
                                    color="action"
                                    sx={{ color: red[900] }}
                                  />
                                );
                              })()}
                              <Typography
                                variant="body2"
                                sx={{
                                  color: green[900],
                                  mr: 1,
                                }}
                              >
                                
                                {Math.floor(
                                  (Math.abs(
                                    items.terracedprice - property.purchasePrice
                                  ) /
                                    property.purchasePrice) *
                                    100
                                )}
                                {"%"}
                              </Typography>
                            </Grid>
                          );

                        default:
                          return "foo";
                      }
                    }
                  })()}
                </Grid>
              ))}
            </Grid>

            <Typography color="textSecondary" variant="caption">
              Since purchase
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <Divider />
      <CardActions>
        <Button
          color="primary"
          startIcon={<ReceiptIcon fontSize="small" />}
          component={RouterLink}
          to="/dashboard/properties/tenancy"
          variant="text"
        >
          Start New Tenancy
        </Button>
        <Button
          color="primary"
          startIcon={<ReceiptIcon fontSize="small" />}
          variant="text"
          onClick={() => {
            setOpen(true);
          }}
          ref={anchorRef}
        >
          Edit
        </Button>
        <Button
        sx={{ color: 'red'}}
        startIcon={  <XIcon  fontSize="small" sx={{ color: 'red'}} />}
        onClick={() => {
                              
          setOpen2(true);
        }}
        
        >
       
          Delete 
        </Button>
        <Dialog selectedValue={selectedValue}
                            open={open2}
                            onClose={handleClose2}
                            BackdropProps={{ style: { backgroundColor: "transparent" } 
                            }}>

        <Box
    sx={{
      backgroundColor: 'background.default',
      minHeight: '100%',
      p: 3
    }}
  >
    
     
        <Box
          sx={{
            display: 'flex',
            pb: 2,
            pt: 3,
            px: 3
          }}
        >
          <Avatar
            sx={{
              backgroundColor: (theme) => alpha(theme.palette.error.main, 0.08),
              color: 'error.main',
              mr: 2
            }}
          >
            <WarningIcon />
          </Avatar>
          <Box>
            <Typography
              color="textPrimary"
              variant="h5"
            >
              Delete
            </Typography>
            <Typography
              color="textSecondary"
              sx={{ mt: 1 }}
              variant="body2"
            >
              Are you sure you want to delete your property? All of
              your data will be permanently removed.
              This action cannot be undone.
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            px: 3,
            py: 1.5
          }}
        >
          <Button
            color="primary"
            sx={{ mr: 2 }}
            variant="outlined"
            onClick={handleClose2}
          >
            Cancel
          </Button>
          <Button
            sx={{
              backgroundColor: 'error.main',
              '&:hover': {
                backgroundColor: 'error.dark'
              }
            }}
            variant="contained"
            onClick = {deleteProperty}
          >
            Delete
          </Button>
        </Box>
  </Box>
        </Dialog>

        <Popover
          anchorEl={anchorRef.current}
          anchorOrigin={{
            horizontal: "left",
            vertical: "bottom",
          }}
          onClose={handleClose}
          open={open}
        >
          <Formik
            initialValues={{
              FirstLineOfAddress: property.firstAddress,
              Postcode: property.postcode,
              Location: property.location,
              purchaseDate: property.purchaseDate,
              purchasePrice: property.purchasePrice,
              images: [],
              propertyType: property.propertyType,
              Description: property.description,
              submit: null,
            }}
            validationSchema={Yup.object().shape({
              FirstLineOfAddress: Yup.string().required(
                "First Line of Address is a required field"
              ),
              Postcode: Yup.string().required(),
              Location: Yup.string().required(),
              purchasePrice: Yup.number().required(
                "Purchase Price is a required field"
              ),
              purchaseDate: Yup.date().required("Date is required"),
              propertyType: Yup.string().required("Type is a required field"),
              Description: Yup.string(),
              images: Yup.array(),
            })}
            onSubmit={async (
              values,
              { setErrors, setStatus, setSubmitting }
            ) => {
              try {
                // Call API to store step data in server session
                // It is important to have it on server to be able to reuse it if user
                // decides to continue later.

                updateProperties();
                toast.success("Properties Updated");
                handleClose();

                // window.location.reload();
                setStatus({ success: true });
                setSubmitting(false);

                if (onNext) {
                  onNext();
                }
              } catch (err) {
                console.error(err);
                setStatus({ success: false });
                setErrors({ submit: err.message });
                setSubmitting(false);
              }
            }}
          >
            {({
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
              isSubmitting,
              setFieldValue,
              setFieldTouched,
              touched,
              values,
            }) => (
              <form onSubmit={handleSubmit} {...other}>
                <Card sx={{ p: 3 }}>
                  <Typography color="textPrimary" variant="h6">
                    Property details
                  </Typography>

                  <Box sx={{ mt: 2 }} />
                  <TextField
                    error={Boolean(touched.Postcode && errors.Postcode)}
                    fullWidth
                    helperText={touched.Postcode && errors.Postcode}
                    label="Postcode"
                    name="Postcode"
                    onBlur={handleBlur}
                    onChange={(e) => {
                      values.Postcode = e.target.value;
                      setFieldValue("Postcode", e.target.value);
                      property.postcode = e.target.value;
                    }}
                    variant="outlined"
                    value={values.Postcode}
                  />

                  <Box sx={{ mt: 2 }} />
                  <TextField
                    error={Boolean(touched.Description && errors.Description)}
                    fullWidth
                    helperText={touched.Description && errors.Description}
                    label="Description"
                    name="Description"
                    onBlur={handleBlur}
                    onChange={(e) => {
                      property.description = e.target.value;
                      values.Description = e.target.value;
                      setFieldValue("Description", e.target.value);
                    }}
                    value={values.Description}
                    variant="outlined"
                  />

                  <Box
                    sx={{
                      alignItems: "center",
                      display: "flex",
                      mt: 2,
                    }}
                  ></Box>
                  <Box sx={{ mt: 2 }} />

                  <Autocomplete
                    getOptionLabel={(option) => option.text}
                    options={Types}
                    onChange={(e, value) => {
                      if (value === null) {
                        value = "Flat";
                      }
                      property.propertyType = value.text;
                      values.propertyType = value.text;
                    }}
                    renderInput={(params) => (
                      <TextField
                        fullWidth
                        label={"Type"}
                        placeholder={values.propertyType}
                        name="PropertyType"
                        variant="outlined"
                        error={Boolean(
                          touched.propertyType && errors.propertyType
                        )}
                        helperText={touched.propertyType && errors.propertyType}
                        value={values.propertyType}
                        onBlur={handleBlur}
                        {...params}
                      />
                    )}
                  />

                  <Box sx={{ mt: 2 }} />
                  <TextField
                    error={Boolean(
                      touched.FirstLineOfAddress && errors.FirstLineOfAddress
                    )}
                    fullWidth
                    helperText={
                      touched.FirstLineOfAddress && errors.FirstLineOfAddress
                    }
                    label="First Line of Address"
                    name="FirstLineOfAddress"
                    onBlur={handleBlur}
                    onChange={(e) => {
                      property.firstAddress = e.target.value;
                      values.FirstLineOfAddress = e.target.value;
                      setFieldValue("FirstLineOfAddress", e.target.value);
                    }}
                    value={values.FirstLineOfAddress}
                    variant="outlined"
                  />
                  <Box sx={{ mt: 2 }} />

                  <Autocomplete
                    getOptionLabel={(option) => option.text}
                    options={locations}
                    onChange={(e, value) => {
                      if (value === null) {
                        value = "London";
                      }
                      property.location = value.text;
                      values.Location = value.text;
                    }}
                    renderInput={(params) => (
                      <TextField
                        label={"Location"}
                        name="Location"
                        placeholder={values.Location}
                        variant="outlined"
                        error={Boolean(touched.Location && errors.Location)}
                        helperText={touched.Location && errors.Location}
                        variant="outlined"
                        value={values.Location}
                        onBlur={handleBlur}
                        {...params}
                      />
                    )}
                  />

                  <Box sx={{ mt: 2 }} />

                  <TextField
                    error={Boolean(
                      touched.purchasePrice && errors.purchasePrice
                    )}
                    fullWidth
                    helperText={touched.purchasePrice && errors.purchasePrice}
                    label="Purchase Price"
                    name="purchasePrice"
                    type="number"
                    onBlur={handleBlur}
                    onChange={(e) => {
                      property.purchasePrice = e.target.value;
                      values.purchasePrice = e.target.value;
                      setFieldValue("purchasePrice", e.target.value);
                    }}
                    variant="outlined"
                    value={values.purchasePrice}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="end"> £ </InputAdornment>
                      ),
                    }}
                  />

                  <Box sx={{ mt: 2 }}>
                    <MobileDatePicker
                      label="Purchase Date"
                      onAccept={(date) => {
                        property.purchaseDate = date.toLocaleDateString();
                        values.purchaseDate = date;
                        setFieldTouched("=purchaseDate");
                      }}
                      onChange={(date) =>
                        setFieldTouched("=purchaseDate", date)
                      }
                      onClose={() => setFieldTouched("=purchaseDate")}
                      renderInput={(inputProps) => (
                        <TextField variant="outlined" {...inputProps} />
                      )}
                      name="purchaseDate"
                      value={values.purchaseDate}
                    />
                    {Boolean(touched.purchaseDate && errors.purchaseDate) && (
                      <FormHelperText error>
                        {errors.purchaseDate}
                      </FormHelperText>
                    )}
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    <Card>
                      <CardHeader
                        title={
                          <Typography variant="caption">
                            Update Property Image
                          </Typography>
                        }
                      />
                      <CardContent>
                        <FileDropzoneProp
                          accept="image/*,.pdf"
                          files={files}
                          onDrop={handleDrop}
                          onRemove={handleRemove}
                          onRemoveAll={handleRemoveAll}
                          onClick={uploadFile}
                          //maxFileSize={5000000}
                        />
                      </CardContent>
                    </Card>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      mt: 6,
                    }}
                  >
                    <Box sx={{ m: 1, justifyContent: "center" }}>
                      <Button
                        color="primary"
                        disabled={isSubmitting}
                        type="submit"
                        variant="contained"
                        onClick={handleSubmit}
                      >
                        Update
                      </Button>
                    </Box>
                    <Box sx={{ m: 1 }}>
                      <Button
                        color="primary"
                        onClick={handleClose}
                        variant="outlined"
                      >
                        Cancel
                      </Button>
                    </Box>
                  </Box>
                </Card>
              </form>
            )}
          </Formik>
        </Popover>
      </CardActions>
      <Divider />
      
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
        }}
      >
        <List>
          <ListItem>
            <Table>
              {tasks.map((task) => (
                <TableBody  >
                  {(() => {
                    if (task.propertyId === property.id) {
                      return(
                     
                        <TableCell sx={{ borderBottom: "none"}}  >
                        <Link
                        style={{ textDecoration: 'none' }}
                        component={RouterLink}
                        to="/dashboard/kanban"
                      >
                          
                          {task.status ==0 ?    <AnimatedComponent> <Label sx={{backgroundColor:  theme.palette.warning.light,}}> <Typography variant="subtitle2">
                  {(() => {
                    if (task.type === 'LANDLORD_EMERGENCY_COVER') 
                      return 'LANDLORD EMERGENCY COVER' + ' is about to expire'; 
                      else if (task.type === 'RENT_PROTECTION_INSURANCE')
                      return 'RENT PROTECTION INSURANCE' + ' is about to expire';
                      else if (task.type === 'BUILDING_INSURANCE')
                      return 'BUILDING INSURANCE' + ' is about to expire';
                      else if (task.type === 'CONTENT_INSURANCE')
                      return 'CONTENT INSURANCE' + ' is about to expire';
                      else
                      return task.type + ' is about to expire';
                      })()}
                </Typography></Label> </AnimatedComponent> :<AnimatedComponent> <Label sx={{backgroundColor:  theme.palette.error.light,}}> <Typography variant="subtitle2" >
                {(() => {
                    if (task.type === 'LANDLORD_EMERGENCY_COVER') 
                      return 'LANDLORD EMERGENCY COVER' + ' expired'; 
                      else if (task.type === 'RENT_PROTECTION_INSURANCE')
                      return 'RENT PROTECTION INSURANCE' + ' expired';
                      else if (task.type === 'BUILDING_INSURANCE')
                      return 'BUILDING INSURANCE' + ' expired';
                      else if (task.type === 'CONTENT_INSURANCE')
                      return 'CONTENT INSURANCE' + ' expired';
                      else
                      return task.type + ' expired';
                      })()}
                </Typography></Label> </AnimatedComponent> }
                        
                      
                        </Link>
                        </TableCell>
                     
                      )
                    }  
                  })()}
                </TableBody>
              ))}   
            </Table>
          </ListItem>
          {/* <ListItem>
            <Table>
              <TableHead>
                <TableRow >
                  <TableCell size="medium">Insurances</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {insurance.map((insur) => (
                  <TableRow >
                    <TableCell className={classes.font}>
                      {Date.parse(insur.expiryDate) < Date.parse(current) ? (
                        <Typography color="textSecondary" variant="body2">
                          {insur.type} is expired!
                        </Typography>
                      ) : (
                        <Typography color="textSecondary" variant="body2">
                          {insur.type} is about to expire
                        </Typography>
                      )}
                      <Button variant="contained" size="small">Renew</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ListItem> */}
        </List>
      </Box>
    </Card>
  );
};
PropertyCardOverview.propTypes = {
  property: PropTypes.object.isRequired,
};
export default PropertyCardOverview;
