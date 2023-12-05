import { useState, useRef, useMemo, useEffect, useCallback} from "react";
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Card,
  IconButton,
  Table,
  TableBody,
  Popover,
  TableCell,
  TableHead,
  FormHelperText,
  TextField,
  TableRow,
  Button,
  Typography,

} from "@material-ui/core";
import PencilAltIcon from "../../../icons/PencilAlt";
import { v4 as uuid } from "uuid";
import FileDropzonePATCert from '../../FileDropzonePATCert';
import FileDropzonEICRCert from '../../FileDropzonEICRCert';
import FileDropzoneGCert from '../../FileDropzoneGCert'; 
import {propertiesApi} from '../../../api/PropertiesApi';
import MobileDatePicker from '@material-ui/lab/MobileDatePicker';
import PlusIcon from '../../../icons/Plus';
import  {Storage} from "aws-amplify";
import DownloadIcon from '../../../icons/Download';
import toast from 'react-hot-toast';
import { makeStyles } from "@material-ui/core/styles"
import { Auth } from 'aws-amplify';

const applyPagination = (certificates, page, limit) =>
  certificates.slice(page * limit, page * limit + limit);


  
const PropertyCertificates = (props) => {
  const { onBack, property, onCancel, onSelect, onNext, ...other } = props;
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [page, setPage] = useState(0);
  const anchorRef = useRef(null);
  const [limit, setLimit] = useState(5);
  const [files, setFiles] = useState([]);
  const [files1, setFiles1] = useState([]);
  const [files2, setFiles2] = useState([]);
  const [gasPopOver, setGasPopOver] = useState(false);
  const [patPopOver, setPatPopOver] = useState(false);
  const [eicrPopOver, setEicrPopOver] = useState(false);
  const [mounted, setMounted] = useState(false)
  let [certificates, setCertificates] = useState([]);

  const getCertificates = async () => {
    try {
      const data2 = await propertiesApi.getCertificates(property.id)
      setCertificates(data2);
      setGasCert(getCert('GAS'));
      setPatCert(getCert('PAT'));
      setEicrCert(getCert('EICR'));
      setMounted(true)
    } catch (err) {
      console.error(err);
    }
  };

  if(!mounted){
    getCertificates();
  }



  const getCert = (type) => {
    
    let cert = certificates.filter(cert => cert.type == type);
    if(cert.length == 0){
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
    return cert[0];
  }

  let [gasCert, setGasCert] = useState(() => getCert('GAS'))
  let [patCert, setPatCert] = useState(() => getCert('PAT'))
  let [eicrCert, setEicrCert] = useState(() => getCert('EICR'))

  const handleDrop = (newFiles) => {
    setFiles(newFiles);
  };
  const handleDrop1 = (newFiles1) => {
    setFiles1(newFiles1);
  };
  const handleDrop2 = (newFiles2) => {
    setFiles2(newFiles2);
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
  
  const handleRemoveAll = () => {
    setFiles([]);
  };
  const handleRemoveAll1 = () => {
    setFiles1([]);
  };
  const handleRemoveAll2 = () => {
    setFiles2([]);
  };

const setCert = (cert) => {
  if(cert.type === 'GAS') {
    gasCert.id = cert.id;
    gasCert.propertyId = cert.propertyId;
    gasCert.type = cert.type;
    gasCert.issueDate = cert.issueDate;
    gasCert.expiryDate = cert.expiryDate;
    gasCert.documentName = cert.documentName;
  } else if (cert.type === 'PAT') {
    patCert.id = cert.id;
    patCert.propertyId = cert.propertyId;
    patCert.type = cert.type;
  } else if (cert.type === 'EICR') {
    eicrCert.id = cert.id;
    eicrCert.propertyId = cert.propertyId;
    eicrCert.type = cert.type;
  }
}

const saveGasSafetyCertificate = async () => {
  const user = await Auth.currentAuthenticatedUser({
    bypassCache: false  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
  });
  const cert = {
    "issueDate": gasCert.issueDate,
    "expiryDate": gasCert.expiryDate,
    "issuer": gasCert.issuer,
    "type": "GAS",
    "documentName": gasCert.documentName,
    "propertyId" : property.id,
    "userId": user.username,
  };
  let lw = await propertiesApi.saveCertificate(cert);
  setCert(lw);
  //setGasCert(lw);
}

const savePATCertificate = async () => {
  const user = await Auth.currentAuthenticatedUser({
    bypassCache: false  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
  });
  const cert = {
    "issueDate": patCert.issueDate,
    "expiryDate": patCert.expiryDate,
    "issuer": patCert.issuer,
    "type":"PAT",
    "documentName": patCert.documentName,
    "propertyId" : property.id,
    "userId": user.username,
  }
  patCert['id']= await propertiesApi.saveCertificate(cert);
  //setCert(lw);
}

const saveEICRCertificate = async () => {
  const user = await Auth.currentAuthenticatedUser({
    bypassCache: false  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
  });
  const cert = {
    "issueDate": eicrCert.issueDate,
    "expiryDate": eicrCert.expiryDate,
    "issuer": eicrCert.issuer,
    "type":"EICR",
    "documentName": eicrCert.documentName,
    "propertyId" : property.id,
    "userId": user.username,
  }
  eicrCert['id']= await propertiesApi.saveCertificate(cert);
  //setCert(lw);
}


const updateGasSafetyCertificate = async () => {
  const certt = {
    "id" : gasCert.id,
    "issueDate": gasCert.issueDate,
    "expiryDate": gasCert.expiryDate,
    "issuer": gasCert.issuer,
    "documentName": gasCert.documentName,
    "propertyId" : property.id
  }
  return await propertiesApi.updateCertificate(certt)
}

const updatePATCertificate = async () => {
  const certt = {
    "id" : patCert.id,
    "issueDate": patCert.issueDate,
    "expiryDate": patCert.expiryDate,
    "issuer": patCert.issuer,
    "documentName": patCert.documentName,
    "propertyId" : property.id

  }
  return await propertiesApi.updateCertificate(certt)
}

const updateEICRCertificate = async () => {
  const certt = {
    "id" : eicrCert.id,
    "issueDate": eicrCert.issueDate,
    "expiryDate": eicrCert.expiryDate,
    "issuer": eicrCert.issuer,
    "documentName": eicrCert.documentName,
    "propertyId" : property.id
  }
  return await propertiesApi.updateCertificate(certt)
}

const upload_to_s3 = async (fileName, file) => {

   await Storage.put(fileName, file).then(res => {
    toast.success('Certificate successfully uploaded');
   })
   .catch(err => {
    toast.error('Unexpected error while uploading, try again', err);
   });  
}



const upload_GS = (evt) => {
  setFiles(evt.target.files)
  const file = evt.target.files[0];
  const name1 = uuid() +"-"+file.name;
  gasCert.documentName = name1;
  upload_to_s3(name1, file)
}

const upload_PAT = (evt) => {
  setFiles1(evt.target.files)
  const files1 = evt.target.files[0];
  const name2 = uuid() + "-"+files1.name;
  patCert.documentName = name2;
  upload_to_s3(name2, files1)
}

const upload_EICR = (evt) => {
  setFiles2(evt.target.files)
  const files2 = evt.target.files[0];
  const name3 = uuid() + "-"+ files2.name;
  eicrCert.documentName = name3; 
  upload_to_s3(name3, files2) 
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
    
    
async function downloadPat() {
  const result =  await Storage.get(patCert.documentName, { download: true });
  downloadBlob(result.Body, patCert.documentName);
  
  
}


async function downloadGas() {
  const result =  await Storage.get(gasCert.documentName, { download: true });
  downloadBlob(result.Body, gasCert.documentName);
  
}

async function downloadEicr() {
  const result =  await Storage.get(eicrCert.documentName, { download: true });
  downloadBlob(result.Body, eicrCert.documentName);

  
  
}

  const handleSelectAllOrders = (event) => {
    setSelectedOrders(
      event.target.checked
        ? certificates.map((certificate) => certificates.id)
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



  const paginatedOrders = applyPagination(certificates, page, limit);
  const enableBulkActions = selectedOrders.length > 0;
  const selectedSomeOrders =
    selectedOrders.length > 0 && selectedOrders.length < certificates.length;
  const selectedAllOrders = selectedOrders.length === certificates.length;
  //width:500
  const useStyles = makeStyles({
    root: {
      height: 'auto',
      maxWidth: 90,
      fontSize: '11px',
      wordWrap: "break-word",
    },
    actions: 
    {
      verticalAlign: 'middle',
      lineHeight: '30px',
      margin: 'auto',
      paddingRight: '5px',
      verticalAlign: 'middle',
    },

    font:
    {
      fontSize: '12px',
    
    },
    removeBorder:
    {
      borderBottom: "none",
      border:'none',
      //width: '60px'
      disableUnderline: 'true'
      
     
    }

  });
  const classes = useStyles();  


  return (

    <>
    
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
              <TableCell className={classes.font} align="justify" >Type</TableCell>
              <TableCell  className={classes.font} align= "justify">Issue Date</TableCell>
              <TableCell  className={classes.font} align="justify">Expiry Date</TableCell>
              <TableCell className={classes.font}  align="justify" >Issuer </TableCell>
              <TableCell className={classes.font} align="justify" >Actions</TableCell>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell  className={classes.font} >GAS</TableCell>
              <TableCell  className={classes.font}>{gasCert ? gasCert.issueDate : ''}</TableCell> 
              <TableCell className={classes.font} >{ gasCert? gasCert.expiryDate : ''}</TableCell>
              <TableCell className={classes.root}> { gasCert ? gasCert.issuer : ''}</TableCell>
              <TableCell className={classes.actions}> 
                { gasCert ? gasCert.documentName? <DownloadIcon align="right"  className={classes.font} onClick={downloadGas}/> : null : null} 
                 
               <IconButton
                  onClick={() => {
                    setGasPopOver(true);
                  }}
                  ref={anchorRef}
                > 
                { 
                  gasCert.id ?
                  <PencilAltIcon align="left"  className={classes.font} />
                  :
                 <PlusIcon  className={classes.font} />
                }
                </IconButton> 
                <Popover
                  anchorEl={anchorRef.current}
                  anchorOrigin={{
                    
                  }}
                  onClose={() => setGasPopOver(false)}
                  open={gasPopOver}
                  PaperProps={{
                    style: {  display: "flex",
                    flexWrap: "wrap",
                  width: "50%"},
                  }}
                >
                  <Formik  
                    
                    initialValues={{  
                      gasIssueDate: gasCert.issueDate ? gasCert.issueDate : '',
                      gasExpiryDate: gasCert.expiryDate ? gasCert.expiryDate : '',
                      gasIssuer: gasCert.issuer ? gasCert.issuer : '',
                      
                    }}
                    validationSchema={
                      Yup.object().shape({
                        images: Yup.array(),
                        gasIssueDate: Yup.date().required("Issue date is a required field"),
                        gasExpiryDate: Yup.date().required("Expiry date is a required field").when('gasIssueDate',
                        (gasIssueDate, gasExpiryDate) => (gasIssueDate && gasExpiryDate.min(gasIssueDate,
                          'Expiry date must be later than issue date'))),
                        gasIssuer: Yup.string().required("Gas Issuer is a required field"),
                      })
                    }
                    onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                      try {
                        // Call API to store step data in server session
                        // It is important to have it on server to be able to reuse it if user
                        // decides to continue later.
                       
                        if(gasCert.id){
                          updateGasSafetyCertificate()
                          .then(res => {
                            toast.success('Certificate Updated');
                            setGasPopOver(false);
                          })
                        } else {
                          await saveGasSafetyCertificate()
                          .then(res => {
                            
                            toast.success('Certificate Added');
                          })
                          setGasPopOver(false)
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
                          <Table   >
                          
                            <TableHead>
                              <TableRow >   
                                <TableCell padding="checkbox"/>
                                <TableCell align="justify">Type</TableCell>
                                <TableCell align="justify">Issue Date</TableCell>
                                <TableCell align="justify">Expiry Date</TableCell>
                                <TableCell align="justify">Issuer</TableCell>
                                <TableCell align="justify">Certificate</TableCell>
                              </TableRow>
                            </TableHead>    

                            <TableBody>
                              <TableRow >
                              <TableCell padding="checkbox"/>
                                <TableCell align="left"> 
                                  <Typography
                                  >
                                      GAS
                                  </Typography>
                                </TableCell>
                                <TableCell align="right">
                                  <Typography color="textSecondary" variant="body2">
                                    <MobileDatePicker 
                                    //label="Issue Date"
                                    onAccept={e => {
                                      gasCert.issueDate=e.toLocaleDateString();
                                      values.gasIssueDate = e;
                                      setFieldTouched('=gasIssueDate');
                                    }}
                                    onChange={e => setFieldValue('=gasIssueDate', e)
                                    }
                                    onClose={() => setFieldTouched('gasIssueDate')}
                                    renderInput={(inputProps) => (
                                      <TextField 
                                        variant="outlined"
                                        {...inputProps}
                                      />
                                    )}
                                    value={values.gasIssueDate}
                                  />
                                  {Boolean(touched.gasIssueDate && errors.gasIssueDate) && (
                                    
                                    <FormHelperText error>
                                      {errors.gasIssueDate}
                                    </FormHelperText>
                                 
                                  )}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography color="textPrimary" variant="subtitle2">
                                    <MobileDatePicker className={classes.actions} 
                                      //label="Expiry Date"
                                      onAccept={e => {
                                        gasCert.expiryDate = e.toLocaleDateString();
                                        //gasCert.expiryDate=e.toLocaleDateString('en-GB', {day: 'numeric', month: 'numeric', year: 'numeric' });
                                        values.gasExpiryDate = e;
                                        setFieldTouched('=gasExpiryDate');
                                      }}
                                      onChange={(e) => setFieldValue('=gasExpiryDate', e)}
                                      onClose={() => setFieldTouched('gasExpiryDate')}
                                      renderInput={(inputProps) => (
                                        <TextField
                                          variant="outlined"

                                          {...inputProps}
                                        />
                                      )}
                                      value={values.gasExpiryDate}
                                    />
                                    {Boolean(touched.gasExpiryDate && errors.gasExpiryDate) && (
                                    
                                      <FormHelperText error>
                                        {errors.gasExpiryDate}
                                      </FormHelperText>
                                  
                                  )} 
                                  </Typography>
                                </TableCell>
                                <TableCell align="justify">             
                                    <TextField
                                      error={Boolean(touched.gasIssuer && errors.gasIssuer)}
                                      fullWidth
                                      helperText={touched.gasIssuer && errors.gasIssuer}
                                      //label="Issuer"
                                      name="gasIssuer"
                                      required={true}
                                      onBlur={handleBlur}
                                      onChange={e => { 
                                        values.gasIssuer = e.target.value
                                        setFieldValue('gasIssuer', e.target.value)
                                        gasCert.issuer=e.target.value
                                      }} 
                                      value={values.gasIssuer}
                                      variant="outlined"
                                    />
                                </TableCell>
                                <TableCell align="left">
                                  <FileDropzoneGCert
                                      accept="image/*,.pdf"
                                      //files={files}
                                      onDrop={handleDrop}
                                      onRemove={handleRemove}
                                      onRemoveAll={handleRemoveAll}
                                      onChange={evt => {
                                        upload_GS(evt)
                                      }}                                
                                      /> 
                                </TableCell>
                              </TableRow> 
                            </TableBody>
                          </Table>
                          <Box sx={{ m:1, alignItems:"center", justifyContent:"center", display: "flex"}}>
                          {gasCert.id ? <Button 
                          color="primary"
                          onClick={handleSubmit } >
                          Update
                          </Button>  : <Button 
                          color="primary"
                          onClick={handleSubmit} 
                          >
                        Submit
                          </Button>}
                          <Button
                          color="primary"
                          onClick={() => setGasPopOver(false)}
                          >
                            Cancel
                          </Button>
                          </Box>
                        </Card>
                        <Box sx={{ flexGrow: 1 }} />
                      </form>
                    )}
                  </Formik>
                </Popover> 
              </TableCell>
            </TableRow> 
          
            <TableRow>
              <TableCell  className={classes.font} >PAT</TableCell>
              <TableCell  className={classes.font}>{patCert.issueDate}</TableCell>
              <TableCell  className={classes.font}>{patCert.expiryDate}</TableCell>
              <TableCell  className={classes.root}>{patCert.issuer}</TableCell>
              <TableCell className={classes.actions}> 
              {patCert ? patCert.documentName? <DownloadIcon  className={classes.font} onClick={downloadPat}/> : null: null}
                <IconButton
                  onClick={() => { 
                    setPatPopOver(true)
                  }}
                  ref={anchorRef}
                > 
                { 
                  patCert.id ?
                  <PencilAltIcon  className={classes.font} fontSize="small" />
                  
                  :
                 <PlusIcon  className={classes.font} fontSize="small" />
                }
                </IconButton>
                <Popover 
                  anchorEl={anchorRef.current}
                  anchorOrigin={{
                   /*  horizontal: 'center',
                    vertical: 'bottom' */
                  }}
                  onClose={() => setPatPopOver(false)}
                  open={patPopOver}
                  PaperProps={{
                    style: {  display: "flex",
                    flexWrap: "wrap",
                  width: "50%"},
                  }}
                  >
                  <Formik  
                    initialValues={{
                      patIssueDate: patCert.issueDate ? patCert.issueDate : '',
                      patExpiryDate: patCert.expiryDate ? patCert.expiryDate : '', 
                      patIssuer: patCert.issuer ? patCert.issuer : '',
                      
                    }}
                    validationSchema={
                      Yup.object().shape({
                        images: Yup.array(),
                        patIssueDate: Yup.date().required("Issue date is a required field"),
                        patExpiryDate: Yup.date().required("Expiry date is a required field").when('patIssueDate',
                        (patIssueDate, patExpiryDate) => (patIssueDate && patExpiryDate.min(patIssueDate,
                          'Expiry date must be later than issue date'))),
                        patIssuer:Yup.string().required("PAT Issuer is a required field") 
                      })
                    }
                    onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    try {
                      // Call API to store step data in server session
                      // It is important to have it on server to be able to reuse it if user
                      // decides to continue later.
                      if(patCert.id) {
                        updatePATCertificate()
                        .then(res => {
                          toast.success('Certificate Updated');
                          setPatPopOver(false)
                        })
                      } else {
                        savePATCertificate()
                        .then(res => {
                          toast.success('Certificate Added');
                        })
                        setPatPopOver(false)
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
                            
                             
                              <TableCell align="justify"> Type </TableCell>
                              <TableCell align="justify">Issue Date</TableCell>
                              <TableCell align="justify">Expiry Date</TableCell>
                              <TableCell align="justify">Issuer</TableCell>
                              <TableCell align="justify">Certificate</TableCell>
                            </TableRow>
                          </TableHead>
                    
                          <TableBody>
                            <TableRow >
                                
                                <TableCell>               
                                  <Typography color="textPrimary"
                                    variant="h7">PAT</Typography>
                                </TableCell>
                                    
                                <TableCell>
                                  <Typography>
                                    <MobileDatePicker 
                                      //label="Issue Date"
                                      onAccept={e => {
                                        patCert.issueDate = e.toLocaleDateString();
                                        values.patIssueDate = e;
                                        setFieldTouched('=patIssueDate');
                                      }}
                                      onChange={(e) => setFieldValue('patIssueDate', e)}
                                      onClose={() => setFieldTouched('patIssueDate')}
                                      renderInput={(inputProps) => (
                                        <TextField 
                                          variant="outlined"
                                          {...inputProps}
                                        />
                                      )}
                                      value={values.patIssueDate}
                                    />
                                    {
                                    Boolean(touched.patIssueDate && errors.patIssueDate) && (
                                      
                                        <FormHelperText error>
                                          {errors.patIssueDate}
                                        </FormHelperText>
                                     )
                                    }
                                  </Typography>
                                </TableCell>
                                <TableCell align="justify">
                                  <MobileDatePicker
                                    // label="Expiry Date"
                                    onAccept={e => {
                                      patCert.expiryDate = e.toLocaleDateString();
                                      values.patExpiryDate = e;
                                      setFieldTouched('=patExpiryDate');
                                    }}
                                    onChange={(e) => setFieldValue('patExpiryDate', e)}
                                    onClose={() => setFieldTouched('patExpiryDate')}
                                    
                                    renderInput={(inputProps) => (
                                      <TextField
                                        
                                        variant="outlined"
                                        {...inputProps}
                                      />
                                    )}
                                    value={values.patExpiryDate}
                                  />
                                  {Boolean(touched.patExpiryDate && errors.patExpiryDate) && (
                                   
                                      <FormHelperText error>
                                        {errors.patExpiryDate}
                                      </FormHelperText>
                                  
                                    
                                  )} 
                                </TableCell>

                                <TableCell>

                                 
                                    <TextField
                                      error={Boolean(touched.patIssuer && errors.patIssuer)}
                                      fullWidth
                                      helperText={touched.patIssuer && errors.patIssuer}
                                      //label="Issuer"
                                      name="patIssuer"
                                      onBlur={handleBlur}
                                      required={true}
                                      onChange={(e)=> {
                                        patCert.issuer = e.target.value
                                        values.patIssuer = e.target.value
                                        setFieldValue('patIssuer', e.target.value)
                                    }}
                                      value={values.patIssuer}
                                      variant="outlined"
                                    />
                                 
                                </TableCell>

                              <TableCell align="left">
                                <FileDropzonePATCert
                                  accept="image/*,.pdf"
                                  //files={files1}
                                  onDrop={handleDrop1}
                                  onRemove={handleRemove1}
                                  onRemoveAll={handleRemoveAll1}
                                  onChange={evt => {upload_PAT(evt)}}
                                  /> 
                              </TableCell>
                            </TableRow> 
                          </TableBody>
                      </Table>
                       <Box sx={{ m:1, alignItems:"center", justifyContent:"center", display: "flex"}}>
                          {patCert.id ? <Button 
                          color="primary"
                          onClick={handleSubmit } >
                          Update
                          </Button>  : <Button 
                          color="primary"
                          onClick={handleSubmit} 
                          >
                        Submit
                          </Button>}
                          <Button
                          color="primary"
                          onClick={() => setPatPopOver(false)}
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
              <TableCell  className={classes.font} >EICR</TableCell>
              <TableCell  className={classes.font} >{eicrCert.issueDate}</TableCell>
              <TableCell  className={classes.font}>{eicrCert.expiryDate}</TableCell>
              <TableCell className={classes.root}>{eicrCert.issuer}</TableCell>
              <TableCell className={classes.actions}>              
              {eicrCert ? eicrCert.documentName ? <DownloadIcon  className={classes.font} onClick={downloadEicr}/> : null : null} 

                <IconButton
                  onClick={() => {
                    setEicrPopOver(true)
                  }}
                  ref={anchorRef}
                > 
                { 
                  eicrCert.id ?
                  <PencilAltIcon  className={classes.font} fontSize="small" />
                  :
                 <PlusIcon  className={classes.font} fontSize="small" />
                }
                </IconButton>
                <Popover
                  anchorEl={anchorRef.current}
                  anchorOrigin={{
                  /* horizontal: 'center',
                    vertical: 'bottom' */ 
                  }}
                  onClose={() => setEicrPopOver(false)}
                  open={eicrPopOver}
                  PaperProps={{
                    style: {  display: "flex",
                    flexWrap: "wrap",
                  width: "50%"},
                  }}
                  >
                  <Formik  
                    initialValues={{
                      eicrIssueDate: eicrCert.issueDate ? eicrCert.issueDate : '',
                      eicrExpiryDate: eicrCert.expiryDate ? eicrCert.expiryDate :'',
                      eicrIssuer: eicrCert.issuer ? eicrCert.issuer : "" ,
                    }}
                    validationSchema={Yup
                    .object()
                    .shape({
                      images: Yup.array(),
                      eicrIssueDate: Yup.date().required("Issue date is a required field"),
                      eicrExpiryDate: Yup.date().required("Expiry date is a required field").when('eicrIssueDate',
                      (eicrIssueDate, eicrExpiryDate) => (eicrIssueDate && eicrExpiryDate.min(eicrIssueDate,
                        'Expiry date must be later than issue date'))),
                      eicrIssuer:Yup.string().required("EICR Issuer is a required field")
                    })}
                    onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                      
                      try {
                        // Call API to store step data in server session
                        // It is important to have it on server to be able to reuse it if user
                        // decides to continue later.
                        
                        if(eicrCert.id) {
                          await updateEICRCertificate()
                          .then(res => {
                            toast.success('Certificate Updated');
                          })
                          setEicrPopOver(false);
                        } else {
                          saveEICRCertificate()
                          .then(res => {
                            toast.success('Certificate Added');
                          })
                          setEicrPopOver(false);
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
                          <Table >
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
                                <TableCell align="center">Certificate</TableCell>
                              </TableRow>
                            </TableHead> 
                            
                            <TableBody>
                              <TableRow >
                                <TableCell >               
                                  <Typography
                                    color="textPrimary"
                                    variant="h7"
                                  >
                                    EICR
                                  </Typography>
                                </TableCell>
                               
                                <TableCell>
                                <Typography>
                                    <MobileDatePicker 
                                      //label="Issue Date"
                                      onAccept={e => {
                                        eicrCert.issueDate = e.toLocaleDateString();
                                        values.eicrIssueDate = e;
                                        setFieldTouched('=eicrIssueDate');
                                      }}
                                      onChange={(date) => setFieldValue('eicrIssueDate', date)}
                                      onClose={() => setFieldTouched('eicrIssueDate')}
                                      renderInput={(inputProps) => (
                                        <TextField 
                                        variant="outlined"
                                          {...inputProps}
                                        />
                                      )}
                                      value={values.eicrIssueDate}
                                    />
                                    {Boolean(touched.eicrIssueDate && errors.eicrIssueDate) && (
                                   
                                    <FormHelperText error>
                                      {errors.eicrIssueDate}
                                    </FormHelperText>
                                 
                                  )}
                                  </Typography>
                                </TableCell>
                               
                              
                                <TableCell >
                                  <Typography>
                                    <MobileDatePicker
                                   
                                    //   label="Expiry Date"
                                    onAccept={e => {
                                      eicrCert.expiryDate = e.toLocaleDateString();
                                      values.eicrExpiryDate = e;
                                      setFieldTouched('=eicrIssueDate');
                                    }}
                                    onChange={(date) => setFieldValue('eicrExpiryDate', date)}
                                    onClose={() => setFieldTouched('eicrExpiryDate')}
                                    renderInput={(inputProps) => (
                                      <TextField
                                      
                                        variant="outlined"
                                      
                                        {...inputProps}
                                       
                                      />
                                    )}
                                  value={values.eicrExpiryDate}
                                  />
                                    {Boolean(touched.eicrExpiryDate && errors.eicrExpiryDate) && (
                                   
                                        <FormHelperText error>
                                          {errors.eicrExpiryDate}
                                        </FormHelperText>
                                    )} 
                                 </Typography>
                                 </TableCell>
                                 
                                 <TableCell>
                                   <TextField
                                   error={Boolean(touched.eicrIssuer && errors.eicrIssuer)}
                                   helperText={touched.eicrIssuer && errors.eicrIssuer}
                                    //label="Issuer"
                                    name="eicrIssuer"
                                    required={true}
                                    onBlur={handleBlur}
                                    onChange={e=> { 
                                      eicrCert.issuer = e.target.value
                                      values.eicrIssuer=e.target.value
                                      setFieldValue('eicrIssuer', e.target.value)
                                    }}
                                    value={values.eicrIssuer}
                                    variant="outlined"/>
                                 </TableCell>

                                <TableCell>
                                  <FileDropzonEICRCert
                                  accept="image/*,.pdf"
                                  //files={files2}
                                  onDrop={handleDrop2}
                                  onRemove={handleRemove2}
                                  onRemoveAll={handleRemoveAll2}
                                  onChange={evt => upload_EICR(evt)}
                                  /> 
                                </TableCell>
                              </TableRow> 
                            </TableBody>
                          </Table>
                          
                            <Box sx={{ m:1, alignItems:"center", justifyContent:"center", display: "flex"}}>
                              {eicrCert.id ? <Button 
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
                                 onClick={() => setEicrPopOver(false)}
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
            
export default PropertyCertificates;
