import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Card,
  CardHeader,
  IconButton,
  Table,
  TableBody,
  Popover,
  TableCell,
  TableHead,
  FormHelperText,
  Button,
  TextField,
  TableRow,
  Typography

} from "@material-ui/core";
import PencilAltIcon from "../../../icons/PencilAlt";
import MobileDatePicker from '@material-ui/lab/MobileDatePicker';
import FileDropzoneBuildingInsurance from '../../FileDropzoneBuildingInsurance';
import FileDropzoneContentInsurance from '../../FileDropzoneContentInsurance';
import FileDropzoneRentProtectionInsurance from '../../FileDropzoneRentProtectionInsurance';
import FileDropzoneLandlordInsurance from '../../FileDropzoneLandlordInsurance';
import {propertiesApi} from '../../../api/PropertiesApi';
import { v4 as uuid } from "uuid";
import  {Storage} from "aws-amplify";
import PlusIcon from '../../../icons/Plus';
import DownloadIcon from '../../../icons/Download';
import toast from 'react-hot-toast';
import { makeStyles } from "@material-ui/core/styles"
import { Auth } from 'aws-amplify';

const applyPagination = (insurances, page, limit) =>
  insurances.slice(page * limit, page * limit + limit);


const PropertyInsurances = (props) => {
  const { onBack, property, onSelect, onNext, ...other } = props;
  const anchorRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [files1, setFiles1] = useState([]);
  const [files2, setFiles2] = useState([]);
  const [files3, setFiles3] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [buildingPopOver, setBuildingPopOver] = useState(false);
  const [contentPopOver, setContentPopOver] = useState(false);
  const [rentPopOver, setRentPopOver] = useState(false);
  const [emergencyPopOver, setEmergencyPopover] = useState(false);
  const [mounted, setMounted] = useState(false)
  let [insurances, setInsurances] = useState([]);
  const getInsurances = async () => {
    try {
      const data3 = await propertiesApi.getInsurances(property.id)
      setInsurances(data3);
      setBuildingInsu(getInsu('BUILDING_INSURANCE'));
      setContentInsu(getInsu('CONTENT_INSURANCE'));
      setRentInsu(getInsu('RENT_PROTECTION_INSURANCE'));
      setEmergencyInsu(getInsu('LANDLORD_EMERGENCY_COVER'));
      setMounted(true)
    } catch (err) {
      console.error(err);
    }
  };

  if(!mounted){
    getInsurances();
  }

  const getInsu = (type) => {
    
    let insu = insurances.filter(insu => insu.type == type);
    if(insu.length == 0){
      return  {
        'id': null,
        'propertyId': null,
        'issuer' : null,
        'issueDate' : null,
        'expiryDate' : null,
        'documentName' : null,
        'type' : type
      };
    }
    return insu[0];
  }

  let [buildingInsu, setBuildingInsu] = useState(() => getInsu('BUILDING_INSURANCE'))
  let [contentInsu, setContentInsu] = useState(() => getInsu('CONTENT_INSURANCE'))
  let [rentInsu, setRentInsu] = useState(() => getInsu('RENT_PROTECTION_INSURANCE'))
  let [emergencyInsu, setEmergencyInsu] = useState(() => getInsu('LANDLORD_EMERGENCY_COVER'))

  const handleDrop = (newFiles) => {
    setFiles(newFiles);
  };
  const handleDrop1 = (newFiles1) => {
    setFiles1(newFiles1);
  };
  const handleDrop2 = (newFiles2) => {
    setFiles2(newFiles2);
  };

  const handleDrop3 = (newFiles3) => {
    setFiles3(newFiles3);
  };
  
  const handleRemove = (file) => {
    setFiles((prevFiles) => prevFiles.filter((_file) => _file.path
      !== file.path));
  };
  const handleRemove1 = (file1) => {
    setFiles1((prevFiles1) => prevFiles1.filter((_file1) => _file1.path
      !== file1.path));
  };
  const handleRemove2 = (file2) => {
    setFiles2((prevFiles2) => prevFiles2.filter((_file2) => _file2.path
      !== file2.path));
  };
  const handleRemove3 = (file3) => {
    setFiles3((prevFiles2) => prevFiles2.filter((_file3) => _file3.path
      !== file3.path));
  };
  
  const handleRemoveAll = () => {
    setFiles([]);
  };
  const handleRemoveAll1 = () => {
    setFiles1([]);
  };
  const handleRemoveAll2 = () => {
    setFiles2([]);
  };

  const handleRemoveAll3 = () => {
    setFiles3([]);
  };

  const setInsu = (insu) => {
    if(insu.type === 'BUILDING_INSURANCE') {
      buildingInsu.id = insu.id;
      buildingInsu.propertyId = insu.propertyId;
      buildingInsu.type = insu.type;
      buildingInsu.issueDate = insu.issueDate;
      buildingInsu.expiryDate = insu.expiryDate;
      buildingInsu.documentName = insu.documentName;
    } else if (insu.type === 'CONTENT_INSURANCE') {
      contentInsu.id = insu.id;
      contentInsu.propertyId = insu.propertyId;
      contentInsu.type = insu.type;
    } else if (insu.type === 'RENT_PROTECTION_INSURANCE') {
      rentInsu.id = insu.id;
      rentInsu.propertyId = insu.propertyId;
      rentInsu.type = insu.type;
    }
  }
  
  const saveBuildingInsurance = async () => {
    const user = await Auth.currentAuthenticatedUser({
      bypassCache: false  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    });
    const insurance = {
     
      "issueDate": buildingInsu.issueDate,
      "expiryDate": buildingInsu.expiryDate,
      "issuer": buildingInsu.issuer,
      "documentName": buildingInsu.documentName,
      "propertyId" : property.id,
      "type" : "BUILDING_INSURANCE",
      "userId": user.username
    }
    buildingInsu['id']= await propertiesApi.saveInsurance(insurance)
  };
  
  const saveContentInsurance = async () => {
    const user = await Auth.currentAuthenticatedUser({
      bypassCache: false  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    });
    const insurance = {
     
      "issueDate": contentInsu.issueDate,
      "expiryDate": contentInsu.expiryDate,
      "issuer": contentInsu.issuer,
      "documentName": contentInsu.documentName,
      "propertyId" : property.id,
      "type" : "CONTENT_INSURANCE",
      "userId": user.username
    }
    contentInsu['id'] = await propertiesApi.saveInsurance(insurance)
  };
  
  
  const saveRentProtInsurance = async () => {
    const user = await Auth.currentAuthenticatedUser({
      bypassCache: false  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    });
    const insurance = {
     
      "issueDate": rentInsu.issueDate,
      "expiryDate": rentInsu.expiryDate,
      "issuer": rentInsu.issuer,
      "documentName": rentInsu.documentName,
      "propertyId" : property.id,
      "type" : "RENT_PROTECTION_INSURANCE",
      "userId": user.username
    }
    rentInsu['id'] = await propertiesApi.saveInsurance(insurance)
  };

  const saveLandlordEmergencyCover = async () => {
    const user = await Auth.currentAuthenticatedUser({
      bypassCache: false  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    });
    const insurance = {
     
      "issueDate": emergencyInsu.issueDate,
      "expiryDate": emergencyInsu.expiryDate,
      "issuer": emergencyInsu.issuer,
      "documentName": emergencyInsu.documentName,
      "propertyId" : property.id,
      "type" : "LANDLORD_EMERGENCY_COVER",
      "userId": user.username
    }
    emergencyInsu['id'] = await propertiesApi.saveInsurance(insurance)
  };

  const updateBuildingInsurance = async () => {
    const insurancee = {
      "id": buildingInsu.id,
      "issueDate": buildingInsu.issueDate,
      "expiryDate": buildingInsu.expiryDate,
      "issuer": buildingInsu.issuer,
      "documentName": buildingInsu.documentName,
      "propertyId" : property.id,
    }
    return propertiesApi.updateInsurance(insurancee)
  };

  const updateContentInsurance = async () => {
    const insurancee = {
      "id": contentInsu.id,
      "issueDate": contentInsu.issueDate,
      "expiryDate": contentInsu.expiryDate,
      "issuer": contentInsu.issuer,
      "documentName": contentInsu.documentName,
      "propertyId" : property.id
    }
   return propertiesApi.updateInsurance(insurancee)
  };

  const updateRentProtInsurance = async () => {
    const insurancee = {
      "id": rentInsu.id,
      "issueDate": rentInsu.issueDate,
      "expiryDate": rentInsu.expiryDate,
      "issuer": rentInsu.issuer,
      "documentName": rentInsu.documentName,
      "propertyId" : property.id
    }
    return propertiesApi.updateInsurance(insurancee)
  };

  const updateLandlordEmergencyCover = async () => {
    const insurancee = {
      "id": emergencyInsu.id,
      "issueDate": emergencyInsu.issueDate,
      "expiryDate": emergencyInsu.expiryDate,
      "issuer": emergencyInsu.issuer,
      "documentName": emergencyInsu.documentName,
      "propertyId" : property.id
    }
    return propertiesApi.updateInsurance(insurancee)
  };
  
  const upload_to_s3 = async (fileName, file) => {
     await Storage.put(fileName, file).then(res => {
      toast.success('Insurance successfully uploaded');
     })
     .catch(err => {
      toast.error('Unexpected error while uploading, try again', err);
     });  
  }

  const uploadBuildingDocument = (evt) => {
    setFiles(evt.target.files)
    const file = evt.target.files[0];
    const name1 = uuid() + "-"+file.name;
    buildingInsu.documentName = name1
    upload_to_s3(name1, file)
  } 
  
  const uploadContentDocument = (evt) => {
    setFiles1(evt.target.files)
    const files1 = evt.target.files[0];
    const name2 = uuid() + "-"+files1.name;
    contentInsu.documentName = name2
    upload_to_s3(name2, files1)
  }
  
  const uploadRentProtDocument = (evt) => {
    setFiles2(evt.target.files)
    const files2 = evt.target.files[0];
    const name3 = uuid() + "-"+files2.name;
    rentInsu.documentName = name3
    upload_to_s3(name3, files2)
  }

  const uploadEmergencyCover = (evt) => {
    setFiles3(evt.target.files)
    const files3 = evt.target.files[0];
    const name4 = uuid() + "-"+files3.name;
    emergencyInsu.documentName = name4
    upload_to_s3(name4, files3)
  }


  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'download';
    const clickHandler = () => {
    setTimeout(() => {
    URL.revokeObjectURL(url);
    a.removeEventListener('click', clickHandler);
    }, 150);
      };
   a.addEventListener('click', clickHandler, false);
   a.click();
  return a;
    }
    
    
    async function downloadBuilding() {
      const result =  await Storage.get(buildingInsu.documentName, { download: true });
      downloadBlob(result.Body, buildingInsu.documentName);
      
      
    }


    async function downloadContent() {
      const result =  await Storage.get(contentInsu.documentName, { download: true });
      downloadBlob(result.Body, contentInsu.documentName);
      
      
    }

    async function downloadRentProt() {
      const result =  await Storage.get(rentInsu.documentName, { download: true });
      downloadBlob(result.Body, rentInsu.documentName);
      
      
    }

    async function downloadEmergencyCover() {
      const result =  await Storage.get(emergencyInsu.documentName, { download: true });
      downloadBlob(result.Body, emergencyInsu.documentName);
      
      
    }

  const handleSelectAllOrders = (event) => {
    setSelectedOrders(
      event.target.checked
        ? insurances.map((insurance) => insurances.id)
        : []
    );
  };

  const handleSelectOneOrder = (event, orderId) => {
    if (!selectedOrders.includes(orderId)) {
      setSelectedOrders((prevSelected) => [...prevSelected, orderId]);
    } else {
      setSelectedOrders((prevSelected) =>
        prevSelected.filter((id) => id !== orderId)
      );
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value, 10));
  };

  const paginatedOrders = applyPagination(insurances, page, limit);
  const enableBulkActions = selectedOrders.length > 0;
  const selectedSomeOrders =
    selectedOrders.length > 0 && selectedOrders.length < insurances.length;
  const selectedAllOrders = selectedOrders.length === insurances.length;
  const useStyles = makeStyles({
    root: {
      height: 'auto',
      maxWidth: 90,
      wordWrap: "break-word",
      fontSize: '11px',
    },
    actions: 
    {
      verticalAlign: 'middle',
      lineHeight: '30px',
      margin: 'auto',
      paddingRight: '5px',
      verticalAlign: 'middle', 
     
    },
    wid:
    {
      width:'0.1%',
      whiteSpace: 'nowrap'

    },
    font:
    {
      fontSize: '12px',
    },

    smaller_font:
    {
      fontSize: '11px',
    },
    date:
    {
      fontSize: '9px',
    }
    ,
    
    

  });
  const classes = useStyles();  
 


  return (

    <>
 
 <Card {...other}>
      
    
        <Table  >
          <TableHead>
              <TableCell   className={classes.font}>Type</TableCell>
              <TableCell  className={classes.font} >Issue Date</TableCell>
              <TableCell  className={classes.font}>Expiry Date</TableCell>
              <TableCell className={classes.font} >Issuer</TableCell>
              <TableCell  className={classes.font} >Actions</TableCell>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell className={classes.font} >Building </TableCell>
              <TableCell className={classes.font}>{buildingInsu.issueDate}</TableCell>
              <TableCell className={classes.font} >{buildingInsu.expiryDate}</TableCell>
              <TableCell className={classes.root}>{buildingInsu.issuer}</TableCell>
              <TableCell className={classes.wid} >              
              { buildingInsu ? buildingInsu.documentName? <DownloadIcon align="left" className={classes.font}  onClick={downloadBuilding}/> : null :null}
                
                <IconButton
                  onClick={() => {
                    
                    setBuildingPopOver(true);
                  }}
                  ref={anchorRef}
                > 
                { 
                  buildingInsu.id ?
                  <PencilAltIcon className={classes.font} fontSize="small" />
                  :
                 <PlusIcon  className={classes.font} fontSize="small"  />
                }
                </IconButton> 
                <Popover
                  anchorEl={anchorRef.current}
                  anchorOrigin={{
                    horizontal: 'center',
                    vertical: 'bottom'
                  }}
                  onClose={() => setBuildingPopOver(false)}
                  open={buildingPopOver}
                  PaperProps={{
                    style: {  display: "flex",
                    flexWrap: "wrap",
                  width: "50%"},
                  }}
                >
                  <Formik  
                   
                    initialValues={{
                      buildingInsuranceIssueDate: buildingInsu.issueDate ? buildingInsu.issueDate :'',
                      buildingInsuranceExpiryDate: buildingInsu.expiryDate ? buildingInsu.expiryDate :'',
                      buildingInsuranceIssuer: buildingInsu.issuer ? buildingInsu.issuer : "",
                      

                      
                    }}
                    validationSchema={
                      Yup.object().shape({
                        images: Yup.array(),
                        buildingInsuranceIssueDate: Yup.date().required("Issue date is a required field"),
                        buildingInsuranceExpiryDate: Yup.date().required("Expiry date is a required field").when('buildingInsuranceIssueDate',
                        (buildingInsuranceIssueDate, buildingInsuranceExpiryDate) => (buildingInsuranceIssueDate && buildingInsuranceExpiryDate.min(buildingInsuranceIssueDate,
                          'Expiry date must be later than issue date'))),
                        buildingInsuranceIssuer: Yup.string().required("Building Issuer is a required field"),
                      
                      })
                    }
                    onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                      try {
                        // Call API to store step data in server session
                        // It is important to have it on server to be able to reuse it if user
                        // decides to continue later.
                        if(buildingInsu.id){
                          updateBuildingInsurance().then(res => {
                            toast.success('Insurance Updated');
                          })
                          setBuildingPopOver(false);
                        } else {
                          await saveBuildingInsurance().then(res => {
                            toast.success('Insurance Added');
                          })
                          setBuildingPopOver(false);
                        }
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
                      }}
                    }
                  >
                    {({
                      errors,
                      handleBlur,
                      handleChange,
                      handleSubmit,
                      isSubmitting,
                      setFieldValue,
                      setFieldTouched,
                      reset,
                      touched,
                      values
                      }) => (
                      <form
                        onSubmit={handleSubmit}
                        {...other}
                      >
                        <Card {...other}>
                          <Table>
                            <colgroup>
                              <col style={{width:'0.1%'}}/>
                              <col style={{width:'2%'}}/>
                              <col style={{width:'2%'}}/>
                              <col style={{width:'3%'}}/>
                              <col style={{width:'0.1%'}}/>
                            
                              
                            </colgroup>
                            <TableHead>
                              <TableRow >   
                                <TableCell align="center">Type</TableCell>
                                <TableCell align="center">Issue Date</TableCell>
                                <TableCell align="center">Expiry Date</TableCell>
                                <TableCell align="center">Issuer</TableCell>
                                <TableCell align="center">Insurance</TableCell>
                              </TableRow>
                            </TableHead>  

                            <TableBody>
                              <TableRow >
                                <TableCell align="left"> 
                                 <Typography
                                    color="textPrimary"
                                    variant="h7" >
                                      Building
                                  </Typography>
                                </TableCell>
                               <TableCell align="right">
                                  <Typography color="textSecondary" variant="body2">
                                  <MobileDatePicker 
                                      
                                      //label="Issue Date"
                                      onAccept={e => {
                                        values.buildingInsuranceIssueDate = e;
                                        buildingInsu.issueDate = e.toLocaleDateString();
                                        setFieldTouched('=buildingInsuranceIssueDate');
                                      }}
                                      onChange={e => setFieldTouched('=buildingInsuranceIssueDate',e)}
                                      onClose={() => setFieldTouched('buildingInsuranceIssueDate')}
                                      renderInput={(inputProps) => (
                                        <TextField 
                                        className={classes.font}
                                          {...inputProps}
                                        />
                                      )}
                                       value={values.buildingInsuranceIssueDate}
                                    />
                                  {Boolean(touched.buildingInsuranceIssueDate && errors.buildingInsuranceIssueDate) && (
                                    <FormHelperText error>
                                      {errors.buildingInsuranceIssueDate}
                                    </FormHelperText>
                                  )}
                                   </Typography>
                                   </TableCell>
                                   <TableCell>
                                   <Typography color="textPrimary" variant="subtitle2">
                                      <MobileDatePicker
                                      //label="Expiry Date"
                                      onAccept={e => {
                                        buildingInsu.expiryDate = e.toLocaleDateString();
                                        values.buildingInsuranceExpiryDate = e;
                                        setFieldTouched('=buildingInsuranceExpiryDate');
                                      }}
                                      onChange={e => setFieldValue('=buildingInsuranceExpiryDate', e)}
                                      onClose={() => setFieldTouched('buildingInsuranceExpiryDate')}
                                      renderInput={(inputProps) => (
                                        <TextField 
                                          variant="outlined"
                                          {...inputProps}
                                        />
                                      )}
                                      value={values.buildingInsuranceExpiryDate}
                                    />
                                {Boolean(touched.buildingInsuranceExpiryDate && errors.buildingInsuranceExpiryDate) && (
                                    <FormHelperText error>
                                      {errors.buildingInsuranceExpiryDate}
                                    </FormHelperText>
                                )} 
                                </Typography>
                                </TableCell>
                                <TableCell align="justify">     
                                <TextField
                                  error={Boolean(touched.buildingInsuranceIssuer && errors.buildingInsuranceIssuer)}
                                  fullWidth
                                  helperText={touched.buildingInsuranceIssuer && errors.buildingInsuranceIssuer}
                                  //label="Issuer"
                                  name="buildingInsuranceIssuer"
                                  required={true}
                                  onBlur={handleBlur}
                                  onChange={(e)=> { 
                                    buildingInsu.issuer = e.target.value;
                                    values.buildingInsuranceIssuer=e.target.value
                                    setFieldValue('buildingInsuranceIssuer', e.target.value)
                                  }}
                                  value={values.buildingInsuranceIssuer}
                                  variant="outlined"
                                  />
                                </TableCell>
                                <TableCell align="left">
                                <FileDropzoneBuildingInsurance
                                  accept="image/*,.pdf"
                                  //files={files}
                                  onDrop={handleDrop}
                                  onRemove={handleRemove}
                                  onRemoveAll={handleRemoveAll}
                                  onChange = {evt => {uploadBuildingDocument(evt)}}
                                />
                                </TableCell>
                              </TableRow> 
                            </TableBody>
                          </Table>
                          <Box sx={{ m:1, alignItems:"center", justifyContent:"center", display: "flex"}}>
                              {buildingInsu.id ? <Button 
                              color="primary"
                              onClick={handleSubmit} >
                              Update
                              </Button>  : <Button 
                              color="primary"
                              onClick={handleSubmit} 
                              >
                                Submit
                                 </Button>}
                                 <Button
                                 color="primary"
                                 onClick={() => setBuildingPopOver(false)}
                                  >
                                    Cancel
                                  </Button>
                            </Box>
                        </Card>
                    
                      </form>
                    )}
                  </Formik>
                </Popover> 
              </TableCell>
            </TableRow> 
          
            <TableRow>
              <TableCell className={classes.font} >Content </TableCell>
              <TableCell className={classes.font}>  {contentInsu.issueDate}</TableCell>
              <TableCell  className={classes.font}> {contentInsu.expiryDate }</TableCell>
              <TableCell className={classes.root}>{contentInsu.issuer}</TableCell>
              
              <TableCell className={classes.actions}>              
              {contentInsu ? contentInsu.documentName?<DownloadIcon fontSize="inherit" className={classes.font}   onClick={downloadContent}/> : null : null}
                <IconButton
                  onClick={() => {
                    setContentPopOver(true);
                  }}
                  ref={anchorRef}
                > 
                { 
                  contentInsu.id ?
                  <PencilAltIcon className={classes.font}   fontSize="small" />
                  :
                 <PlusIcon className={classes.font}   fontSize="small" />
                }
                </IconButton> 
                <Popover
                  anchorEl={anchorRef.current}
                  anchorOrigin={{
                   /*  horizontal: 'center',
                    vertical: 'bottom' */
                  }}
                  onClose={() => setContentPopOver(false)}
                  open={contentPopOver}
                  PaperProps={{
                    style: {  display: "flex",
                    flexWrap: "wrap",
                  width: "50%"},
                  }}
                >
                  <Formik  
                    
                    initialValues={{
                      contentInsuranceIssueDate: contentInsu.issueDate ? contentInsu.issueDate : '',
                      contentInsuranceExpiryDate: contentInsu.expiryDate ? contentInsu.expiryDate : '', 
                      contentInsuranceIssuer: contentInsu.issuer ? contentInsu.issuer : '',
                  
                     

                      
                    }}
                    validationSchema={
                      Yup.object().shape({
                        images: Yup.array(),
                        contentInsuranceIssueDate: Yup.date().required("Issue date is a required field"),
                        contentInsuranceExpiryDate: Yup.date().required("Expiry date is a required field").when('contentInsuranceIssueDate',
                        (contentInsuranceIssueDate, contentInsuranceExpiryDate) => (contentInsuranceIssueDate && contentInsuranceExpiryDate.min(contentInsuranceIssueDate,
                          'Expiry date must be later than issue date'))),
                        contentInsuranceIssuer: Yup.string().required("Content Issuer is a required field"),
                      
                      
                      })
                    }
                    onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                      try {
                        // Call API to store step data in server session
                        // It is important to have it on server to be able to reuse it if user
                        // decides to continue later.
                        if(contentInsu.id) {
                          updateContentInsurance().then(res => {
                            toast.success('Insurance Updated');
                          })
                          setContentPopOver(false);
                        } else {
                          saveContentInsurance().then(res => {
                            toast.success('Insurance Added');
                          })
                          setContentPopOver(false);
                        }
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
                      }}
                    }
                  >
                    {({
                      errors,
                      handleBlur,
                      handleChange,
                      handleSubmit,
                      isSubmitting,
                      setFieldValue,
                      setFieldTouched,
                      reset,
                      touched,
                      values
                      }) => (
                      <form
                        onSubmit={handleSubmit}
                        {...other}
                      >
                        <Card {...other}>
                          <Table>
                          <colgroup>
                              <col style={{width:'0.1%'}}/>
                              <col style={{width:'2%'}}/>
                              <col style={{width:'2%'}}/>
                              <col style={{width:'3%'}}/>
                              <col style={{width:'0.1%'}}/>
                            </colgroup>
                            <TableHead>
                              <TableRow >   
                                <TableCell align="justify">Type</TableCell>
                                <TableCell align="justify">Issue Date</TableCell>
                                <TableCell align="justify">Expiry Date</TableCell>
                                <TableCell align="justify">Issuer</TableCell>
                                <TableCell align="justify">Insurance</TableCell>
                              </TableRow>
                            </TableHead>  

                            <TableBody>
                              <TableRow >
                                <TableCell align="left"> 
                                 <Typography
                                    >
                                      Content
                                  </Typography>
                                </TableCell>
                               <TableCell align="right">
                                  <Typography color="textSecondary" variant="body2">
                                  <MobileDatePicker 
                                      //label="Issue Date"
                                      onAccept={e => {
                                        contentInsu.issueDate = e.toLocaleDateString();
                                        values.contentInsuranceIssueDate = e;
                                        setFieldTouched('=contentInsuranceIssueDate');
                                      }}
                                      onChange={e => setFieldValue('=contentInsuranceIssueDate',e)}
                                      onClose={() => setFieldTouched('contentInsuranceIssueDate')}
                                      renderInput={(inputProps) => (
                                        <TextField 
                                          variant="outlined"
                                          {...inputProps}
                                        />
                                      )}
                                      value={values.contentInsuranceIssueDate}
                                    />
                                  {Boolean(touched.contentInsuranceIssueDate && errors.contentInsuranceIssueDate) && (
                                   
                                    <FormHelperText error>
                                      {errors.contentInsuranceIssueDate}
                                    </FormHelperText>
                               
                                  )}
                                   </Typography>
                                   </TableCell>
                                   <TableCell align="justify">
                                   
                                      <MobileDatePicker
                                      //label="Expiry Date"
                                      onAccept={e => {
                                        contentInsu.expiryDate = e.toLocaleDateString();
                                        values.contentInsuranceExpiryDate = e;
                                        setFieldTouched('=contentInsuranceExpiryDate');
                                      }}
                                      onChange={e => setFieldValue('=contentInsuranceExpiryDate',e)}
                                      onClose={() => setFieldTouched('contentInsuranceExpiryDate')}
                                      renderInput={(inputProps) => (
                                        <TextField 
                                          variant="outlined"
                                          {...inputProps}
                                        />
                                      )}
                                      value={values.contentInsuranceExpiryDate}
                                    />
                                {Boolean(touched.contentInsuranceExpiryDate && errors.contentInsuranceExpiryDate) && (
                                    <FormHelperText error>
                                      {errors.contentInsuranceExpiryDate}
                                    </FormHelperText>
                                )} 
                               
                                </TableCell>
                                <TableCell >             
                            
                                <TextField
                                  error={Boolean(touched.contentInsuranceIssuer && errors.contentInsuranceIssuer)}
                                  fullWidth
                                  helperText={touched.contentInsuranceIssuer && errors.contentInsuranceIssuer}
                                  //label="Issuer"
                                  name="contentInsuranceIssuer"
                                  required={true}
                                  onBlur={handleBlur}
                                  onChange={(e)=> { 
                                    contentInsu.issuer = e.target.value
                                    values.contentInsuranceIssuer=e.target.value
                                    setFieldValue('contentInsuranceIssuer', e.target.value)
                                  }}
                                  value={values.contentInsuranceIssuer}
                                  variant="outlined"
                                  />
                         
                                </TableCell>
                                <TableCell align="left">
                                <FileDropzoneContentInsurance
                                  accept="image/*,.pdf"
                                  //files={files}
                                  onDrop={handleDrop1}
                                  onRemove={handleRemove1}
                                  onRemoveAll={handleRemoveAll1}
                                  onChange = {evt => {uploadContentDocument(evt)}}
                                />
                                </TableCell>
                              </TableRow> 
                            </TableBody>
                          </Table>
                          <Box sx={{ m:1, alignItems:"center", justifyContent:"center", display: "flex"}}>
                              {contentInsu.id ? <Button 
                              color="primary"
                              onClick={handleSubmit} >
                              Update
                              </Button>  : <Button 
                              color="primary"
                              onClick={handleSubmit} 
                              >
                                Submit
                                 </Button>}
                                 <Button
                                 color="primary"
                                 onClick={() => setContentPopOver(false)}
                                  >
                                    Cancel
                                  </Button>
                                  </Box>
                        </Card>
                      </form>
                    )}
                  </Formik>
                </Popover> 
              </TableCell>
            </TableRow> 
            
             
            
            <TableRow>
              <TableCell className= {classes.smaller_font} >Rent Protection</TableCell>
              <TableCell  className={classes.font}>{rentInsu ? rentInsu.issueDate : ''}</TableCell>
              <TableCell  className={classes.font}>{rentInsu ? rentInsu.expiryDate : ''}</TableCell>
              <TableCell className={classes.root}>{rentInsu ? rentInsu.issuer : ''}</TableCell>
              <TableCell className={classes.actions}>              
              {rentInsu ? rentInsu.documentName?<DownloadIcon fontSize="inherit" className={classes.font}   onClick={downloadRentProt}/> : null :null}
                <IconButton
                  onClick={() => {
                  
                    setRentPopOver(true)
                  }}
                  ref={anchorRef}
                > 
                { 
                  rentInsu.id ?
                  <PencilAltIcon className={classes.font}   fontSize="small" />
                  :
                 <PlusIcon className={classes.font}   fontSize="small" />
                }
                </IconButton>
                <Popover
                  anchorEl={anchorRef.current}
                  anchorOrigin={{
                    //horizontal: 'center',
                    //vertical: 'bottom'
                  }}
                  onClose={() => setRentPopOver(false)}
                  open={rentPopOver}
                  PaperProps={{
                    style: {  display: "flex",
                    flexWrap: "wrap",
                  width: "50%"},
                  }}
                  >
                  <Formik  
                    enableReinitialize={true}
                    initialValues={{
                            rentProtectionInsuranceIssueDate: rentInsu.issueDate ? rentInsu.issueDate : '',
                            rentProtectionInsuranceExpiryDate: rentInsu.expiryDate ? rentInsu.expiryDate : '',
                            rentProtectionInsuranceIssuer: rentInsu ? rentInsu.issuer : "" 
                           
                    }}
                    validationSchema={Yup
                    .object()
                    .shape({
                      images: Yup.array(),
                      rentProtectionInsuranceIssueDate: Yup.date().required("Issue date is a required field"),
                      rentProtectionInsuranceExpiryDate: Yup.date().required("Expiry date is a required field").when('rentProtectionInsuranceIssueDate',
                      (rentProtectionInsuranceIssueDate, rentProtectionInsuranceExpiryDate) => (rentProtectionInsuranceIssueDate && rentProtectionInsuranceExpiryDate.min(rentProtectionInsuranceIssueDate,
                        'Expiry date must be later than issue date'))),
                      rentProtectionInsuranceIssuer: Yup.string().required("Rent Protection Issuer is a required field"),
                    })}
                    validateOnChange={true}
                    onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                      try {
                        // Call API to store step data in server session
                        // It is important to have it on server to be able to reuse it if user
                        // decides to continue later.
                        
                        if(rentInsu.id) {
                          updateRentProtInsurance().then(res => {
                            toast.success('Insurance Updated');
                          })
                          setRentPopOver(false);
                        } else {
                          saveRentProtInsurance().then(res => {
                            toast.success('Insurance Added');
                          })
                          setRentPopOver(false);
                        }
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
                    reset,
                    touched,
                    values
                    }) => (
                      
                      <form
                        onSubmit={handleSubmit}
                       
                        {...other}
                      >
                        <Card {...other}>
                          <Table>
                          <colgroup>
                              <col style={{width:'0.1%'}}/>
                              <col style={{width:'2%'}}/>
                              <col style={{width:'2%'}}/>
                              <col style={{width:'3%'}}/>
                              <col style={{width:'0.1%'}}/>
                            </colgroup>
                            <TableHead>
                              <TableRow >
                               
                                <TableCell className={classes.font} align="center ">Type</TableCell>
                                <TableCell className={classes.font} align="center">Issue Date</TableCell>
                                <TableCell className={classes.font} align="center">Expiry Date</TableCell>
                                <TableCell className={classes.font} align="center">Issuer</TableCell>
                                <TableCell  className={classes.font} align="center">Insurance</TableCell>
                              </TableRow>
                            </TableHead> 
                            
                            <TableBody>
                              <TableRow >
                             
                                <TableCell className={classes.font} >  
                                   Rent Protection
                                </TableCell>

                                <TableCell align="right">
                                 
                                   <MobileDatePicker 
                                    //label="Issue Date"
                                    onAccept={e => {
                                      rentInsu.issueDate = e.toLocaleDateString();
                                      values.rentProtectionInsuranceIssueDate = e;
                                      setFieldTouched('=rentProtectionInsuranceIssueDate');
                                    }}
                                    onChange={e => setFieldValue('=rentProtectionInsuranceIssueDate',e)}
                                    onClose={() => setFieldTouched('rentProtectionInsuranceIssueDate')}
                                    renderInput={(inputProps) => (
                                    <TextField 
                                    
                                      variant="outlined"
                                      {...inputProps}
                                    />
                                  )}
                                  value={values.rentProtectionInsuranceIssueDate}
                                />
                                    

                              {Boolean(touched.rentProtectionInsuranceIssueDate && errors.rentProtectionInsuranceIssueDate) && (
                               
                                <FormHelperText error>
                                  {errors.rentProtectionInsuranceIssueDate}
                                </FormHelperText>
                              )}
                              
                                </TableCell>
                                <TableCell align="justify">
                                   <MobileDatePicker
                                    //label="Expiry Date"
                                    onAccept={e => {
                                      rentInsu.expiryDate = e.toLocaleDateString();
                                      values.rentProtectionInsuranceExpiryDate = e;
                                      setFieldTouched('=rentProtectionInsuranceExpiryDate');
                                    }}
                                    onChange={e => setFieldValue('=rentProtectionInsuranceExpiryDate',e)}
                                    onClose={() => setFieldTouched('rentProtectionInsuranceExpiryDate')}
                                    renderInput={(inputProps) => (
                                      <TextField
                                        variant="outlined"
                                        {...inputProps}
                                      />
                                    )}
                                    value={values.rentProtectionInsuranceExpiryDate}
                                  />
                              {Boolean(touched.rentProtectionInsuranceExpiryDate && errors.rentProtectionInsuranceExpiryDate) && (
                                  <FormHelperText error>
                                    {errors.rentProtectionInsuranceExpiryDate}
                                  </FormHelperText>
                            
                                
                              )} 
                              
                               </TableCell>
                               <TableCell>
                                 <TextField
                                    error={Boolean(touched.rentProtectionInsuranceIssuer && errors.rentProtectionInsuranceIssuer)}
                                    fullWidth
                                    helperText={touched.rentProtectionInsuranceIssuer && errors.rentProtectionInsuranceIssuer}
                                    //label="Issuer"
                                    required={true}
                                    name="rentProtectionInsuranceIssuer"
                                    onBlur={handleBlur}
                                    onChange={e => {
                                      rentInsu.issuer = e.target.value
                                      values.rentProtectionInsuranceIssuer=e.target.value
                                      setFieldValue('rentProtectionInsuranceIssuer', e.target.value)

                                    }}
                                    value={values.rentProtectionInsuranceIssuer}
                                    variant="outlined"
                                          />
                                </TableCell>

                                <TableCell  align="left">
                                <FileDropzoneRentProtectionInsurance
                                    accept="image/*,.pdf"
                                    //files={files2}
                                    onDrop={handleDrop2}
                                    onRemove={handleRemove2}
                                    onRemoveAll={handleRemoveAll2}
                                    onChange= {evt => {uploadRentProtDocument(evt)}}
                                  />
                                </TableCell>
                              </TableRow> 
                            </TableBody>
                          </Table>
                          <Box sx={{ m:1, alignItems:"center", justifyContent:"center", display: "flex"}}>
                              {rentInsu.id ? <Button 
                              color="primary"
                              onClick={handleSubmit} >
                              Update
                              </Button>  : <Button 
                              color="primary"
                              onClick={handleSubmit} 
                              >
                                Submit
                                 </Button>}
                                 <Button
                                 color="primary"
                                 onClick={() => setRentPopOver(false)}
                                  >
                                    Cancel
                                  </Button>
                                  </Box>
                        </Card>
                      </form>
                      )}
                  </Formik>
                </Popover> 
              </TableCell>
            </TableRow>  
            <TableRow>
              <TableCell className={classes.smaller_font} >Landlord Emergency Cover </TableCell>
              <TableCell className={classes.font}>{emergencyInsu.issueDate}</TableCell>
              <TableCell className={classes.font} >{emergencyInsu.expiryDate}</TableCell>
              <TableCell className={classes.root}>{emergencyInsu.issuer}</TableCell>
              <TableCell className={classes.wid} >              
              { emergencyInsu ? emergencyInsu.documentName? <DownloadIcon align="left" className={classes.font}  onClick={downloadEmergencyCover}/> : null :null}
                
                <IconButton
                  onClick={() => {
                    
                    setEmergencyPopover(true);
                  }}
                  ref={anchorRef}
                > 
                { 
                  emergencyInsu.id ?
                  <PencilAltIcon className={classes.font} fontSize="small" />
                  :
                 <PlusIcon  className={classes.font} fontSize="small"  />
                }
                </IconButton> 
                <Popover
                  anchorEl={anchorRef.current}
                  anchorOrigin={{
                    horizontal: 'center',
                    vertical: 'bottom'
                  }}
                  onClose={() => setEmergencyPopover(false)}
                  open={emergencyPopOver}
                  PaperProps={{
                    style: {  display: "flex",
                    flexWrap: "wrap",
                  width: "50%"},
                  }}
                >
                  <Formik  
                   
                    initialValues={{
                      emergencyInsuIssueDate: emergencyInsu.issueDate ? emergencyInsu.issueDate :'',
                      emergencyInsuExpiryDate: emergencyInsu.expiryDate ? emergencyInsu.expiryDate :'',
                      emergencyInsuIssuer: emergencyInsu.issuer ? emergencyInsu.issuer : "",
                      

                      
                    }}
                    validationSchema={
                      Yup.object().shape({
                        images: Yup.array(),
                        emergencyInsuIssueDate: Yup.date().required("Issue date is a required field"),
                        emergencyInsuExpiryDate: Yup.date().required("Expiry date is a required field").when('bemergencyInsuIssueDate',
                        (emergencyInsuIssueDate, emergencyInsuExpiryDate) => (emergencyInsuIssueDate && emergencyInsuExpiryDate.min(emergencyInsuIssueDate,
                          'Expiry date must be later than issue date'))),
                          emergencyInsuIssuer: Yup.string().required(" Issuer is a required field"),
                      
                      })
                    }
                    onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                      try {
                        // Call API to store step data in server session
                        // It is important to have it on server to be able to reuse it if user
                        // decides to continue later.
                        if(emergencyInsu.id){
                          updateLandlordEmergencyCover().then(res => {
                            toast.success('Insurance Updated');
                          })
                          setEmergencyPopover(false);
                        } else {
                          await saveLandlordEmergencyCover().then(res => {
                            toast.success('Insurance Added');
                          })
                          setEmergencyPopover(false);
                        }
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
                      }}
                    }
                  >
                    {({
                      errors,
                      handleBlur,
                      handleChange,
                      handleSubmit,
                      isSubmitting,
                      setFieldValue,
                      setFieldTouched,
                      reset,
                      touched,
                      values
                      }) => (
                      <form
                        onSubmit={handleSubmit}
                        {...other}
                      >
                        <Card {...other}>
                          <Table>
                            <colgroup>
                              <col style={{width:'0.1%'}}/>
                              <col style={{width:'2%'}}/>
                              <col style={{width:'2%'}}/>
                              <col style={{width:'3%'}}/>
                              <col style={{width:'0.1%'}}/>
                            
                              
                            </colgroup>
                            <TableHead>
                              <TableRow >   
                                <TableCell align="center">Type</TableCell>
                                <TableCell align="center">Issue Date</TableCell>
                                <TableCell align="center">Expiry Date</TableCell>
                                <TableCell align="center">Issuer</TableCell>
                                <TableCell align="center">Insurance</TableCell>
                              </TableRow>
                            </TableHead>  

                            <TableBody>
                              <TableRow >
                                <TableCell align="left"> 
                                 <Typography
                                    color="textPrimary"
                                    variant="h7" >
                                      Landlord Emergency Cover
                                  </Typography>
                                </TableCell>
                               <TableCell align="right">
                                  <Typography color="textSecondary" variant="body2">
                                  <MobileDatePicker 
                                      
                                      //label="Issue Date"
                                      onAccept={e => {
                                        values.emergencyInsuIssueDate = e;
                                        emergencyInsu.issueDate = e.toLocaleDateString();
                                        setFieldTouched('=emergencyInsuIssueDate');
                                      }}
                                      onChange={e => setFieldTouched('=emergencyInsuIssueDate',e)}
                                      onClose={() => setFieldTouched('emergencyInsuIssueDate')}
                                      renderInput={(inputProps) => (
                                        <TextField 
                                        className={classes.font}
                                          {...inputProps}
                                        />
                                      )}
                                       value={values.emergencyInsuIssueDate}
                                    />
                                  {Boolean(touched.emergencyInsuIssueDate && errors.emergencyInsuIssueDate) && (
                                    <FormHelperText error>
                                      {errors.emergencyInsuIssueDate}
                                    </FormHelperText>
                                  )}
                                   </Typography>
                                   </TableCell>
                                   <TableCell>
                                   <Typography color="textPrimary" variant="subtitle2">
                                      <MobileDatePicker
                                      //label="Expiry Date"
                                      onAccept={e => {
                                        emergencyInsu.expiryDate = e.toLocaleDateString();
                                        values.emergencyInsuExpiryDate = e;
                                        setFieldTouched('=bemergencyInsuExpiryDate');
                                      }}
                                      onChange={e => setFieldValue('=emergencyInsuExpiryDate', e)}
                                      onClose={() => setFieldTouched('emergencyInsuExpiryDate')}
                                      renderInput={(inputProps) => (
                                        <TextField 
                                          variant="outlined"
                                          {...inputProps}
                                        />
                                      )}
                                      value={values.emergencyInsuExpiryDate}
                                    />
                                {Boolean(touched.emergencyInsuExpiryDate && errors.emergencyInsuExpiryDate) && (
                                    <FormHelperText error>
                                      {errors.emergencyInsuExpiryDate}
                                    </FormHelperText>
                                )} 
                                </Typography>
                                </TableCell>
                                <TableCell align="justify">     
                                <TextField
                                  error={Boolean(touched.emergencyInsuIssuer && errors.emergencyInsuIssuer)}
                                  fullWidth
                                  helperText={touched.emergencyInsuIssuer && errors.emergencyInsuIssuer}
                                  //label="Issuer"
                                  name="emergencyInsuInsuranceIssuer"
                                  required={true}
                                  onBlur={handleBlur}
                                  onChange={(e)=> { 
                                    emergencyInsu.issuer = e.target.value;
                                    values.emergencyInsuIssuer=e.target.value
                                    setFieldValue('emergencyInsuIssuer', e.target.value)
                                  }}
                                  value={values.emergencyInsuIssuer}
                                  variant="outlined"
                                  />
                                </TableCell>
                                <TableCell align="left">
                                <FileDropzoneLandlordInsurance
                                  accept="image/*,.pdf"
                                  //files={files}
                                  onDrop={handleDrop}
                                  onRemove={handleRemove}
                                  onRemoveAll={handleRemoveAll}
                                  onChange = {evt => {uploadEmergencyCover(evt)}}
                                />
                                </TableCell>
                              </TableRow> 
                            </TableBody>
                          </Table>
                          <Box sx={{ m:1, alignItems:"center", justifyContent:"center", display: "flex"}}>
                              {emergencyInsu.id ? <Button 
                              color="primary"
                              onClick={handleSubmit} >
                              Update
                              </Button>  : <Button 
                              color="primary"
                              onClick={handleSubmit} 
                              >
                                Submit
                                 </Button>}
                                 <Button
                                 color="primary"
                                 onClick={() => setEmergencyPopover(false)}
                                  >
                                    Cancel
                                  </Button>
                            </Box>
                        </Card>
                    
                      </form>
                    )}
                  </Formik>
                </Popover> 
              </TableCell>
            </TableRow> 
          </TableBody>    
        </Table>
      </Card>
    </>
  );           
};
            

PropertyInsurances.propTypes = {
  insurances: PropTypes.array.isRequired,
};

export default PropertyInsurances;
