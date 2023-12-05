import { useState,useCallback,useEffect,useRef} from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import * as Yup from 'yup';
import MobileDatePicker from '@material-ui/lab/MobileDatePicker';
import { Formik } from 'formik';
import { Auth } from 'aws-amplify';
import XIcon from '../../../icons/X';
import WarningIcon from '@material-ui/icons/WarningOutlined';
import { alpha } from '@material-ui/core/styles';
import wait from '../../../utils/wait';
import PencilAltIcon from '../../../icons/PencilAlt';
import {
  Button,
  Typography,
  Box,
  Card,
  Avatar,
  Grid,
  IconButton,
  Autocomplete,
  Checkbox,
  Table,
  Dialog,
  TextField,
  TableBody,
  CardActions,
  CardHeader,
  CardContent,
  FormHelperText,
  Tooltip,
  TableCell,
  InputAdornment,
  TableHead,
  Popover,
  TableRow,
} from '@material-ui/core';
import styled from 'styled-components';
import { propertiesApi } from '../../../api/PropertiesApi';
import ChevronDown from '../../../icons/ChevronDown';
import { Link as RouterLink } from 'react-router-dom';
import useMounted from '../../../hooks/useMounted';
import numeral from "numeral";
import  {Storage} from "aws-amplify";
import { makeStyles } from "@material-ui/core/styles"
import DownloadIcon from '../../../icons/Download';
import { v4 as uuid } from "uuid";
import toast from 'react-hot-toast';
import FileDropzoneTenancies from '../../FileDropzoneTenancies'; 
import FileDropzoneProp from '../../FileDropzoneProp';



const Main = styled("div")`
  font-family: sans-serif;
  background: 'background.default'
  height: 30vh;
`;

const DropDownContainer = styled("div")`
  width: 500em;
  margin: 0 auto;
  px:20;
  
  
`;

const DropDownHeader = styled("div")`
  margin-bottom: 0.8em;
  padding: 0.4em 2em 0.4em 1em;
  
  font-weight: 500;
  font-size: 1.3rem;
  color: "primary";
  background: 'background.default';
`;

const useStyles = makeStyles({
    root: {
      height: 'auto',
      maxWidth: 90,
      wordWrap: "break-word",
    },
    actions: 
    {
      verticalAlign: 'middle',
      lineHeight: '30px',
      margin: 'auto',
      paddingRight: '5px',
      
    }
  });
const TenancyListResults = (props)=> {
  const mounted = useMounted();
  const[fileNameS,setFileNameS]=useState([])
  const [mode, setMode] = useState('');
  const [selectedCustomerIds] = useState([]);
  const anchorRef = useRef(null);
  const {tenancy,  onBack, onNext, ...other }=props
  const [files, setFiles] = useState('');
  const [files2, setFiles2] = useState([]);
  const [files3, setFiles3] = useState([]);
  const [filesdownload, setFilesDownload] = useState('');
  const [filesdownload2, setFilesDownload2] = useState('');
  const [filesdownload3, setFilesDownload3] = useState('');
  const [filesdownload4, setFilesDownload4] = useState('');
  const [selectedValue, setSelectedValue] = useState([1]);
  const reference = useRef('');
  const [inputValue, setInputValue] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);
  const [filteredResults1, setFilteredResults1] = useState([]);
  const [tenancies, setTenancies] = useState([]);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const toggling = () => setIsOpen(!isOpen);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [properties, setProperties] = useState([]);
  const propertyAddress = properties.map((property=> property.firstAddress))
  var array=[]


const handleOpen = () => {
  setOpen(true);
};

const getProperties = useCallback(async () => {
  try {
    const data = await propertiesApi.getProperties();
 

    if (mounted.current) {
      setProperties(data);
     
      
    }

  } catch (err) {
    console.error(err);
  }
}, [mounted]);


useEffect(() => {
  getProperties();
}, [getProperties]);


const uploadFile = (e) => {
    
  const file = files[0];
  const ss = uuid() +"-"+file.name;
  tenancy.documentName= (ss);
  Storage.put(ss, file).then(res => {
    toast.success('Successfully uploaded');
   })
   .catch(err => {
    toast.error('Unexpected error while uploading, try again', err);
   });  
}
const updateTenancy = async () => {
  console.log('here')
  const user = await Auth.currentAuthenticatedUser({
    bypassCache: false  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
  });
  const selectedProperty= properties.filter(property=>property.firstAddress==tenancy.property);
  if (selectedProperty== undefined){
    toast.error("you must select a property")
  } 
  const updateTenancy= {
    "id" : tenancy.id, 
    "propertyId":selectedProperty && selectedProperty[0]? selectedProperty[0]['id'] : '',
    "Title": tenancy.Title,
    "price" : tenancy.price,
    "deposit": tenancy.deposit,
    "property" : tenancy.property,
    "purchaseDate": tenancy.purchaseDate,
    "EndDate": tenancy.EndDate,
    "userId": user.username,
    "documentName": tenancy.documentName,
  
  
  }
  return await propertiesApi.updateTenancies(updateTenancy);
  
}

const descendingComparator = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }

  if (b[orderBy] > a[orderBy]) {
    return 1;
  }

  return 0;
};





   


   Storage.get(tenancy.documentName,{
     level: 'public'})
    .then(data=>{return data;})
    .then(data=>{array.push({data});setFileNameS(
     
              // Use the current size as ID (needed to iterate the list later) 
              
            data

            
    ) })


const upload_to_s3 = async (fileName, file) => {
   await Storage.put(fileName, file).then(res => {
    toast.success('File successfully uploaded');
   })
   .catch(err => {
    toast.error('Unexpected error while uploading, try again', err);
   });  
}

   const handleDrop = (newFiles) => {
    setFiles(newFiles);
  };
  const handleDrop2 = (newFiles1) => {
    setFiles2(newFiles1);
  };
  const handleRemove = (file) => {
    setFiles((prevFiles) => prevFiles.filter((_file) => _file.path
      !== file.path));
  };
  const handleRemove2 = (file) => {
    setFiles2((prevFiles) => prevFiles.filter((_file) => _file.path
      !== file.path));
  };

  const handleRemoveAll = () => {
    setFiles([]);
  };

   const handleRemoveAll2 = () => {
    setFiles([]);
  };

const upload_GS = (evt) => {
  setFiles(evt.target.files)
  const files1 = evt.target.files[0];
  const name1 = uuid() +"-"+files1.name;
 setFilesDownload(name1)
  upload_to_s3(name1, files1)
}
const upload_2 = (evt) => {
  setFiles2(evt.target.files)
  const files2 = evt.target.files[0];
  const name2 = uuid() +"-"+files2.name;
 setFilesDownload2(name2)
  upload_to_s3(name2, files2)
}

const upload_3 = (evt) => {
  setFiles3(evt.target.files)
  const files3 = evt.target.files[0];
  const name3 = uuid() +"-"+files3.name;
  setFilesDownload3(name3);
  upload_to_s3(name3, files3)
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

const deleteTenancy = async () => {
  const tenancyy = {
    id: tenancy.id,
  };
   await propertiesApi.deleteTenancy(tenancyy)
   .then(toast.success("Successfully deleted"),
   handleClose2())
  .catch(err => {
   toast.error('Unexpected error while deleting, try again', err);
   
  });
};
   

  const handleSelectOneCustomer = (event, customerId) => {
    if (!selectedCustomers.includes(customerId)) {
      setSelectedCustomers((prevSelected) => [...prevSelected, customerId]);
    } else {
      setSelectedCustomers((prevSelected) => prevSelected.filter((id) => id !== customerId));
    }
  };

  async function download4() {
    const result =  await Storage.get(tenancy.documentName, { download: true });
    downloadBlob(result.Body, tenancy.documentName);
    
  }

   async function download1() {
  const result =  await Storage.get(filesdownload, { download: true });
  downloadBlob(result.Body, filesdownload);
  
}
async function download2() {
  const result =  await Storage.get(filesdownload2, { download: true });
  downloadBlob(result.Body, filesdownload2);
  
}

async function download3() {
  const result =  await Storage.get(filesdownload3, { download: true });
  downloadBlob(result.Body, filesdownload3);
  
}
const applyPagination = (tenancy, page, limit) =>( tenancy)
 
  const saveFile = () => {
    
   /*  saveAs(
      fileNameS,
      
    );  */
  }


  const handleClose = () => {
    setOpen(false); 
  };
  const handleClose2 = () => {
    setOpen2(false); 
  };


const getComparator = (order, orderBy) => (order === 'desc'
  ? (a, b) => descendingComparator(a, b, orderBy)
  : (a, b) => -descendingComparator(a, b, orderBy));



const applySort = (customers, sort) => {
  const [orderBy, order] = sort.split('|');
  const comparator = getComparator(order, orderBy);
  const stabilizedThis = customers.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const newOrder = comparator(a[0], b[0]);

    if (newOrder !== 0) {
      return newOrder;
    }

    return a[1] - b[1];
  });

  return stabilizedThis.map((el) => el[0]);
};

const applyFilters = (customers, query, filters) => customers
  .filter((customer) => {
    let matches = true;

    if (query) {
      const properties = ['email', 'name'];
      let containsQuery = false;

      properties.forEach((property) => {
        if (customer[property].toLowerCase().includes(query.toLowerCase())) {
          containsQuery = true;
        }
      });

      if (!containsQuery) {
        matches = false;
      }
    }

 


    Object.keys(filters).forEach((key) => {
      const value = filters[key];

      if (value && customer[key] !== value) {
        matches = false;
      }
    });

    return matches;
  });
       const handleSelectAllCustomers = (event) => {
    setSelectedCustomers(event.target.checked
      ? ( tenancy.id)
      : []);
  };
  const classes = useStyles();  

  const paginatedCustomers = applyPagination(tenancy, page, limit);
  const enableBulkActions = selectedCustomers.length > 0;
  const selectedSomeCustomers = selectedCustomers.length > 0
    && selectedCustomers.length < tenancy.length;
  const selectedAllCustomers = selectedCustomers.length === tenancy.length;
           const isCustomerSelected = selectedCustomers.includes(tenancy.id);
  
  return (

     <div>

    <Box >
    
    
    <Box sx={{ mt: -2 }}>
  
    </Box>
  </Box>
     
       {inputValue.length >0?(
                     
<Card>
      <PerfectScrollbar>
        <Box sx={{ minWidth: 1050 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox />
                </TableCell>
                
                <TableCell>Start date</TableCell>
                <TableCell>End date</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Price</TableCell>
                <TableCell align="justify" >Contract</TableCell>
                <TableCell>Deposit</TableCell>
                <TableCell>nofity Electriciy Provider</TableCell>
                <TableCell>nofity GasP rovider</TableCell>
                <TableCell>nofity Water Provider</TableCell>
                <TableCell>nofity Council</TableCell>
                <TableCell>endOfT enancy Settlements</TableCell>
                <TableCell>Inventroy Checkin</TableCell>
                <TableCell>Inventroy Checkout</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredResults.slice(0, limit).map((tenancy) => (
                
                <TableRow
                  hover
                  key={tenancy.id}
                  
                  selected={selectedCustomerIds.indexOf(tenancy.id) !== -1}
                >
                
                  <TableCell padding="checkbox">
                    <Checkbox />
                  </TableCell>
                
                  <TableCell>
                    {moment(tenancy.purchaseDate).format('DD/MM/YYYY')}
                  </TableCell>
                  <TableCell>
                    {moment(tenancy.enexpiryDated).format('DD/MM/YYYY')}
                  </TableCell>
                  <TableCell>{tenancy.Title}</TableCell>
                  <TableCell>£
              {numeral(tenancy.price).format(
                `${tenancy.currency}0,0.00`
              )}</TableCell>
                      <TableCell className={classes.actions}> 
                { <DownloadIcon  fontSize="inherit" sx={{ ml: 3}} onClick={download1} download/> } </TableCell>
                  <TableCell>£
              {numeral(tenancy.deposit).format(
                `${tenancy.currency}0,0.00`
              )}</TableCell>
                  <TableCell padding="checkbox">
                  <Checkbox />
                </TableCell>
                   <TableCell padding="checkbox">
                  <Checkbox />
                </TableCell>
                   <TableCell padding="checkbox" >
                  <Checkbox />
                </TableCell>
                   <TableCell padding="checkbox">
                  <Checkbox />
                </TableCell>
                   
                       <TableCell align="left">{ <DownloadIcon  fontSize="inherit"  sx={{ mt: 6}}  download/> }
                                 { <FileDropzoneTenancies
                                      accept="image/*,.pdf"
                                      //files={files}
                                      onDrop={handleDrop}
                                      
                                      onRemove={handleRemove}
                                      onRemoveAll={handleRemoveAll}
                                      onChange={evt => {
                                        upload_GS(evt)
                                      }}                                
                                      /> }</TableCell>
                   <TableCell align="left">{ <DownloadIcon  fontSize="inherit"  sx={{ mt: 6}}  download/> }
                                 { <FileDropzoneTenancies
                                      accept="image/*,.pdf"
                                      //files={files}
                                      onDrop={handleDrop}
                                      
                                      onRemove={handleRemove}
                                      onRemoveAll={handleRemoveAll}
                                      onChange={evt => {
                                        upload_2(evt)
                                      }}                                
                                      /> }</TableCell>
                    <TableCell align="left">{ <DownloadIcon  fontSize="inherit"  sx={{ mt: 6}}  download/> }
                                 { <FileDropzoneTenancies
                                      accept="image/*,.pdf"
                                      //files={files}
                                      onDrop={handleDrop}
                                      
                                      onRemove={handleRemove}
                                      onRemoveAll={handleRemoveAll}
                                      onChange={evt => {
                                        upload_3(evt)
                                      }}                                
                                      /> }</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
         
        </Box>
      </PerfectScrollbar>
      </Card>):(
       <Card sx={{mt:-5,py:2.5}}>
        
         
       
           <Box sx={{ minWidth: 1060,width: 480}}>
          
{enableBulkActions && (
        <Box sx={{ position: 'relative' }}>
          <Box
            sx={{
              backgroundColor: 'background.paper',
              mt: '6px',
              position: 'absolute',
              px: '4px',
              width: '100%',
              zIndex: 2
            }}
          >
            <Checkbox
              checked={selectedAllCustomers}
              color="primary"
              indeterminate={selectedSomeCustomers}
               onChange={(event) => handleSelectOneCustomer(event, tenancy.id)}
            />
            <Button
       color="primary"   
       sx={{ ml: 2, mx: 1 }}      
       variant="outlined"
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
        }} >
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
              Are you sure you want to delete your tenant? All of
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
            onClick = {deleteTenancy}
          >
            Delete
          </Button>
        </Box>
        </Box>
        </Dialog>
           
                        
           <Button
                      color="primary"
                      
                      variant="outlined"
                        onClick={() => {
                              
                          setOpen(true);
                        }}
                        ref={anchorRef}
                    >
                     Edit 
                    </Button>
                    
                   
                      <Dialog selectedValue={selectedValue}
                            open={open}
                            onClose={handleClose}
                            BackdropProps={{ style: { backgroundColor: "transparent" } 
                            }}>
                            <Formik
                              initialValues={{
                                Property: tenancy.property,
                                Title: tenancy.Title,
                                purchaseDate: tenancy.purchaseDate,
                                price: tenancy.price,
                                images: [],
                                EndDate: tenancy.EndDate,
                               deposit: tenancy.deposit,
                                submit: null
                              }}
                              validationSchema={Yup
                                .object()
                                .shape({
                                 /*  Title: Yup.string().required(),
                                  price: Yup.number().required("Price is a required field"),
                                  purchaseDate: Yup.date().required("Date is required"),
                                  images: Yup.array(),
                                  deposit: Yup.string().required(),
                                  endDate: Yup.date().required("Date is required"), */
                                })}
                              onSubmit={async (values, { resetForm, setErrors, setStatus, setSubmitting }) => {
                                try {
                                  console.log('here')
                                  updateTenancy();
                                  handleClose();
                                  // NOTE: Make API request
                                  await wait(500);
                                  resetForm();
                                  setStatus({ success: true });
                                  setSubmitting(false);
                                  toast.success('Tenancy updated!');
                                } catch (err) {
                                  console.error(err);
                                  toast.error('Something went wrong!');
                                  setStatus({ success: false });
                                  setErrors({ submit: err.message });
                                  setSubmitting(false);
                                }
                              }}
                            >
                               {({ errors, handleBlur,setFieldValue, setFieldTouched, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                                <form
                                  onSubmit={handleSubmit}
                                 
                                >
                                  <Card>
                                    <Box sx={{ p: 4,  justifyContent:"center",
                                        alignItems:"center"}}>
                                      <Grid
                                        container
                                        spacing={1.5}
                                        //md={6}
                                        justifyContent="center"
                                        alignItems="center"
                                      > 
                                        
                                       
                                           <Grid
                                          item
                                          md={6}
                                          xs={12}
                                        >
                                        
                                        <Autocomplete
                                        getOptionLabel={(option) => option}
                                        options={propertyAddress}
                                        onChange={(e, value) => {
                                          if(value === null) {
                                            value=" "
                                          }
                                          tenancy.property = value
                                        values.Property= value.array
                                        }}      
                                        renderInput={(params) => (
                                          <TextField
                                            fullWidth
                                            label="Property"
                                            name="Property"
                                            variant="outlined"
                                            error={Boolean(touched.Property && errors.Property)}
                                            helperText={touched.Property && errors.Property}
                                            value={values.Property}
                                            onBlur={handleBlur}              
                                            {...params}
                                          />
                                        )}
                                      />
                                          
                                        </Grid>       
                                        <Grid
                                          item
                                          md={6}
                                          xs={12}
                                        >
                                          <TextField
                                            error={Boolean(touched.Title && errors.Title)}
                                            fullWidth
                                            helperText={touched.Title && errors.Title}
                                            label="Title"
                                            name="Title"
                                            onBlur={handleBlur}
                                            onChange={(e) => {
                                              values.Title = e.target.value
                                              setFieldValue('Title', e.target.value)
                                              tenancy.Title=e.target.value
                                             
                                              }}
                                            required
                                            value={values.Title}
                                            variant="outlined"
                                          />
                                        </Grid>
                                        <Grid
                                          item
                                          md={6}
                                          xs={12}
                                        >
                                          <TextField
                                            error={Boolean(touched.price && errors.price)}
                                            fullWidth
                                            helperText={touched.price && errors.price}
                                            label="Price"
                                            name="price"
                                            onBlur={handleBlur}
                                            onChange={(e) => {
                                              values.price = e.target.value
                                              setFieldValue('price', e.target.value)
                                              tenancy.price=e.target.value
                                             
                                              }}
                                            required
                                            value={values.price}
                                            variant="outlined"
                                            InputProps={{
                                              startAdornment: <InputAdornment position="end">€</InputAdornment>,
                                            }}
                                          />
                                        </Grid>
                                        
                                        <Grid
                                          item
                                          md={6}
                                          xs={12}
                                        >
                                        
                                        <TextField
                                            error={Boolean(touched.deposit && errors.deposit)}
                                            fullWidth
                                            helperText={touched.deposit && errors.deposit}
                                            label="Deposit"
                                            name="deposit"
                                            onBlur={handleBlur}
                                            onChange={(e) => {
                                              values.deposit = e.target.value
                                              setFieldValue('deposit', e.target.value)
                                              tenancy.deposit=e.target.value
                                             
                                              }}
                                            required
                                            value={values.deposit}
                                            variant="outlined"
                                            InputProps={{
                                              startAdornment: <InputAdornment position="end">€</InputAdornment>,
                                            }}
                                          />
                                        </Grid>
                                        <Grid
                                          item
                                          md={6}
                                          xs={12}
                                        >
                                         <Box sx={{ mr: 2 }}>
                                        <MobileDatePicker
                                        label="Start Date"
                                        onAccept={date => {
                                          tenancy.purchaseDate = date.toLocaleDateString();
                                          values.purchaseDate = date;
                                          setFieldTouched('=purchaseDate');
                                        }}
                                        onChange={date => setFieldTouched('=purchaseDate',date)}
                                        onClose={() => setFieldTouched('=purchaseDate')}
                                        
                                    
                                        renderInput={(inputProps) => (
                                          <TextField
                                        
                                          
                                          variant="outlined"
                                          required={true}
                                            {...inputProps}
                                          
                                          />
                                        )}
                                        
                                        name="Start Date"
                                        value={values.purchaseDate}
                                        
                                      />
                                    {Boolean(touched.purchaseDate && errors.purchaseDate) && (
                                      <FormHelperText error>
                                        {errors.purchaseDate} 
                                      </FormHelperText>
                                    
                                    
                                            )} 
                                          </Box> 
                                      </Grid>
                                      <Grid
                                          item
                                          md={6}
                                          xs={12}
                                        >
                                        
                    <Box sx={{ mr: 2 }}>
                <MobileDatePicker
                          label="End Date"
                          onAccept={date => {
                            tenancy.EndDate = date.toLocaleDateString();
                            values.EndDate = date;
                            setFieldTouched('=EndDate');
                          }}
                          onChange={date => setFieldTouched('=EndDate',date)}
                          onClose={() => setFieldTouched('=EndDate')}
                          
                     
                          renderInput={(inputProps) => (
                            <TextField
                         
                            
                            variant="outlined"
                            required={true}
                             {...inputProps}
                            
                            />
                          )}
                          
                          name="End Date"
                          value={values.EndDate}
                          
                        />
                      {Boolean(touched.EndDate && errors.EndDate) && (
                        <FormHelperText error>
                          {errors.EndDate} 
                        </FormHelperText>
                     
                      
                    )} 
                  </Box> 
                                        </Grid>


                                        <Grid
                                         container
                                         direction="row"
                                         justifyContent="center"
                                         alignItems="center"
                                           >
                                        <CardActions>
                                         
                                         
                                       
                                        <Card>
                                        <CardHeader title="Upload Contract" />
                                      
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
                                       </CardActions>  
                                          </Grid>
                                      
                                        </Grid>
                                        <Box
                                          sx={{
                                            display: 'flex',
                                            mt: 6
                                          }}
                                        > 
                                        <Box sx={{ m: -1 }}>
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
                                       <Box sx={{ ml: 2 ,mt:-1}}>
                                      <Button
                                         color="primary"
                                         variant="contained"
                                         onClick={handleClose}
                                      >
                                        Cancel
                                      </Button>
                                      </Box>
                                      </Box>
                                    </Box>
                                  </Card>
                                </form>
                              )}
                            </Formik>

                       </Dialog>
                   
          </Box>
        </Box>
      )}
      <Box
        sx={{
        
          py: 2,
        }}
      >
        <Grid 
          alignItems="right"
          container
          justifyContent="space-between"
          spacing={1}
          
        >
        
  
          <Grid item
           hover
                    key={tenancy.id}
                    selected={isCustomerSelected}
          >
            
                   <Typography padding="checkbox" >
                  <Checkbox sx={{
          px:2,
          mt:-1 ,
        }} checked={isCustomerSelected}
                        color="primary"
                        onChange={(event) => handleSelectOneCustomer(event, tenancy.id)}
                        value={isCustomerSelected}/>

                </Typography>
  
           <Typography  variant="body2" sx={{
          px:8,
          mt:-4 ,
        }}> 
               {moment(tenancy.purchaseDate).format('DD/MM/YYYY')}
           
            </Typography>

             <Typography  variant="body2"sx={{
          px:30,
          mt:-2.5 ,
        }}>
             {moment(tenancy.enexpiryDate).format('DD/MM/YYYY')}
            </Typography>

                <Typography  variant="body2"sx={{
          px:51,
          mt:-2.5 ,
        }}>
              {tenancy.Title}
            </Typography>
            <Typography  variant="body2"sx={{
          px:68,
          mt:-2.5 ,
        }}>
              £
              {numeral(tenancy.price).format(
                `${tenancy.currency}0,0.00`
              )}
            </Typography>
              <Typography  variant="body2"sx={{
          px:90,
          mt:-2.5 ,
        }}>
              £
              {numeral(tenancy.deposit).format(
                `${tenancy.currency}0,0.00`
              )}
            </Typography>

             <Typography color="primary" variant="body2"sx={{
          px:110,
          mt:-2.5 ,
        }}>
              { <DownloadIcon  color="primary"     onClick={download4}  download /> }
            </Typography>
            <Typography color="primary" variant="body2"sx={{
          px:120,
          mt:-4 ,
        }}>
            
                         <Main>
      
        <DropDownHeader  onClick={toggling}><IconButton
                        
                       
               ref={anchorRef}
                        
                      ><Typography
                  sx={{mt:-1}}
                  
                  variant="subtitle2"
                >
                        <ChevronDown color="primary" fontSize="small" /></Typography>
                      </IconButton></DropDownHeader>
        {isOpen && (
          <DropDownContainer sx={{width:1050,ml:-80}}>
            
               <Card sx={{width:1050,ml:-120,border: 1}}>
      <PerfectScrollbar>
        <Box sx={{ minWidth: 1050 }}>
          <Table>
          
            <TableHead>
              <TableRow>
               
                
                
                <TableCell ><Typography color="primary" variant="body2"> nofity Electriciy Provider</Typography></TableCell>
                <TableCell><Typography color="primary" variant="body2"> nofity GasP rovider</Typography></TableCell>
                <TableCell><Typography color="primary" variant="body2"> nofity Water Provider</Typography></TableCell>
                <TableCell><Typography color="primary" variant="body2"> nofity Council</Typography></TableCell>
                <TableCell align="center"><Typography color="primary" variant="body2"> endOfT enancy Settlements</Typography></TableCell>
                <TableCell><Typography color="primary" variant="body2"> Inventroy Checkin</Typography></TableCell>
                <TableCell><Typography color="primary" variant="body2"> Inventroy Checkout</Typography></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            
                
                <TableRow
               
                >
               
                
                  <TableCell padding="checkbox">
                  <Checkbox />
                </TableCell>
                   <TableCell padding="checkbox">
                  <Checkbox />
                </TableCell>
                   <TableCell padding="checkbox" >
                  <Checkbox />
                </TableCell>
                   <TableCell padding="checkbox">
                  <Checkbox />
                </TableCell>
                   
                   <TableCell >{filesdownload ? <DownloadIcon   color="primary"  fontSize="inherit"  sx={{ mt: 5,ml:13}} onClick={download1} download/> :<DownloadIcon   color="primary"  fontSize="inherit"  sx={{ mt: 5,ml:13}} /> }                                 { <FileDropzoneTenancies
                                      accept="image/*,.pdf"
                                      //files={files}
                                      onDrop={handleDrop}
                                      align="center"
                                      onRemove={handleRemove}
                                      onRemoveAll={handleRemoveAll}
                                      onChange={evt => {
                                        upload_GS(evt)
                                      }}                                
                                      /> }</TableCell>
                   <TableCell >{filesdownload2 ? <DownloadIcon   color="primary"  fontSize="inherit"  sx={{ mt: 5,ml:4}} onClick={download2} download/> :<DownloadIcon   color="primary"  fontSize="inherit"  sx={{ mt: 5,ml:4}} /> }
                                 { <FileDropzoneTenancies
                                      accept="image/*,.pdf"
                                      //files={files}
                                      
                                      onDrop={handleDrop2}
                                      
                                      onRemove={handleRemove2}
                                      onRemoveAll={handleRemoveAll2}
                                      onChange={evt => {
                                        upload_2 (evt)
                                      }}                                
                                      /> }</TableCell>
                                      
                    <TableCell >{filesdownload3 ? <DownloadIcon   color="primary"  fontSize="inherit"  sx={{ mt: 5,ml:4}} onClick={download3} download/> :<DownloadIcon   color="primary"  fontSize="inherit"  sx={{ mt: 5,ml:4}} /> }
                                 { <FileDropzoneTenancies
                                      accept="image/*,.pdf"
                                      //files={files}
                                      onDrop={handleDrop}
                                      
                                      onRemove={handleRemove}
                                      onRemoveAll={handleRemoveAll}
                                      onChange={evt => {
                                        upload_3(evt)
                                      }}                                
                                      /> }</TableCell>
                </TableRow>
            
            </TableBody>
             
              

          </Table>
         
        </Box>
      </PerfectScrollbar>
      </Card>
      </DropDownContainer>
        
        )}
      
    </Main>
                     
            </Typography>
          </Grid>
   
      
          </Grid>
              
              
          
              </Box>
      
    </Box>
      
    </Card>
    
        )}
   
       </div>

   
  );
};

TenancyListResults.propTypes = {
  tenancies: PropTypes.object.isRequired
};

export default TenancyListResults;
