import { useState, useCallback, useEffect, useRef } from 'react';
import gtm from '../../../lib/gtm';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { Formik } from 'formik';
import wait from '../../../utils/wait';
import XIcon from '../../../icons/X';
import WarningIcon from '@material-ui/icons/WarningOutlined';
import { alpha } from '@material-ui/core/styles';
import {
  Avatar,
  Autocomplete,
  Grid,
  CardActions,
  Box,
  Button,
  Card,
  Checkbox,
  Divider,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  TextField,
  Dialog,
  Typography
} from '@material-ui/core';
import PencilAltIcon from '../../../icons/PencilAlt';
import SearchIcon from '../../../icons/Search';
import Scrollbar from '../../Scrollbar';
import { propertiesApi } from '../../../api/PropertiesApi';
import CloseIcon from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Done';
import  {Storage} from "aws-amplify";
import FileDropzoneTenantRtr from '../../FileDropzoneTenantRtr'
import { v4 as uuid } from "uuid";
import property from "../property/PropertyDetailsFormNew";
import FileDropzoneTenantsEdit from '../../FileDropzoneTenantsEdit';
import FileDropzoneTenantRc from '../../FileDropzoneTenantRC';
import { teal } from '@material-ui/core/colors';
const sortOptions = [
  {
    label: 'Last update (newest)',
    value: 'updatedAt|rbase'
  },
  {
    label: 'Last update (oldest)',
    value: 'updatedAt|asc'
  },
];

 

const CustomerListTable = (props) => {
  let {tenants, tenant, ...other } = props;
  const [inputValue, setInputValue] = useState('');
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [page, setPage] = useState(0);
  const [files, setFiles] = useState([]);
  const [files1, setFiles1] = useState([]);
  const [files2, setFiles2] = useState([]);
  const [limit, setLimit] = useState(5);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState(sortOptions[0].value);
  const [mounted, setMounted] = useState(false)
  const navigation = useNavigate();
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false); 
  const [properties, setProperties] = useState([]);
  const [address, setAddress] = useState ('');
  const [selectedValue, setSelectedValue] = useState([1]);
  const [tenancyTitle, setTenancyTitle] = useState('');
  const [tenancies, setTenancies] = useState([]);
                  
  const propertyLocation = properties.map((property=> property.location))
  const propertyAddress = properties.map((property=> property.firstAddress))
  const tenancyTitles= tenancies.map((tenancy=>tenancy.Title))




  const uploadFile = async (evt) => {
    const file = evt.target.files[0];
    const name = uuid() +"-"+file.name;
    tenant.avatar = name;
    upload_to_s3(name, file)
      }

  const upload_RTR = (evt) => {
    const files1 = evt.target.files[0];
    const name2 = uuid() + "-"+files1.name;
    tenant.rightToRent = name2;
    upload_documents(name2, files1)
  }
  
  const upload_RC = (evt) => {
    const files2 = evt.target.files[0];
    const name3 = uuid() + "-"+ files2.name;
    tenant.refrenceCheck = name3; 
    upload_documents(name3, files2) 
  } 
  const upload_to_s3 = async (fileName, file) => {
      await Storage.put(fileName, file).then(res => {
      toast.success('image successfully uploaded');
      getAvatar(fileName);
      })
      .catch(err => {
      toast.error('Unexpected error while uploading, try again', err);
      });  
  }
  const upload_documents = async (fileName, file) => {
    await Storage.put(fileName, file).then(res => {
    toast.success('Document successfully uploaded');
    })
    .catch(err => {
    toast.error('Unexpected error while uploading, try again', err);
    });  
  }
  const updateTenant = async () => {
    const selectedProperty= properties.filter(property=>property.firstAddress==address);
    const selectedTenancy= tenancies.filter(tenancy=>tenancy.Title==tenancyTitle);
    if (selectedProperty== undefined){
      toast.error("you must select an address")
    } 
    const updateTenant= {
      "id" : tenant.id, 
      "name": tenant.name, 
      "tenancyId": selectedTenancy && selectedTenancy[0]? selectedTenancy[0]['id'] : tenant.tenancyId,
      "propertyId": tenant.propertyId,
      "location" : tenant.location,
      "phone": tenant.phone,
      "email": tenant.email,
      "address": tenant.address,
      "rightToRent": tenant.rightToRent,
      "refrenceCheck": tenant.refrenceCheck,
      "avatar": tenant.avatar
    
    }
    return await propertiesApi.updateTenants(updateTenant);
    
  }

  const deleteTenant = async () => {
    const tenantt = {
      id : tenant.id,
    };
     await propertiesApi.deleteTenants(tenantt).then(toast.success("Successfully deleted"),
     handleClose2())
    .catch(err => {
     toast.error('Unexpected error while deleting, try again', err);
    });
  };

   const getProperties = async () => {
    try {
      const data = await propertiesApi.getProperties()
        setProperties(data);
        setMounted(true)
      } catch (err) {
      console.error(err);
    }
  };
  if(!mounted){
    getProperties();
  }
  const [filters, setFilters] = useState({
    hasAcceptedMarketing: null,
    isProspect: null,
    isReturning: null
  });
 
const handleOpen = () => {
    setOpen(true);
  };

const handleClose = () => {
  setOpen(false); 
};

const handleClose2 = () => {
  setOpen2(false);
};

  const applyFilters = (tenants, query, filters) => tenants
  .filter((tenant) => {
    let matches = true;

    if (query) {
      const properties = ['email', 'name'];
      let containsQuery = false;

      properties.forEach((property) => {
        if (tenants[property].toLowerCase().includes(query.toLowerCase())) {
          containsQuery = true;
        }
      });

      if (!containsQuery) {
        matches = false;
      }
    }

    Object.keys(filters).forEach((key) => {
      const value = filters[key];

      if (value && tenant[key] !== value) {
        matches = false;
      }
    });

    return matches;
  });


const applyPagination = (tenants, page, limit) => tenants
  .slice(page * limit, page * limit + limit);

const descendingComparator = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }

  if (b[orderBy] > a[orderBy]) {
    return 1;
  }

  return 0;
};

const getComparator = (order, orderBy) => (order === 'desc'
  ? (a, b) => descendingComparator(a, b, orderBy)
  : (a, b) => -descendingComparator(a, b, orderBy));

const applySort = (tenants, sort) => {
  const [orderBy, order] = sort.split('|');
  const comparator = getComparator(order, orderBy);
  const stabilizedThis = tenants.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const newOrder = comparator(a[0], b[0]);

    if (newOrder !== 0) {
      return newOrder;
    }

    return a[1] - b[1];
  });

  return stabilizedThis.map((el) => el[0]);
}; 


  const handleQueryChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSortChange = (event) => {
    setSort(event.target.value);
  };

  const handleSelectAllCustomers = (event) => {
    setSelectedCustomers(event.target.checked
      ? tenants.map((customer) => customer.id)
      : []);
  };

  const handleSelectOneCustomer = (event, customerId) => {
    if (!selectedCustomers.includes(customerId)) {
      setSelectedCustomers((prevSelected) => [...prevSelected, customerId]);
    } else {
      setSelectedCustomers((prevSelected) => prevSelected.filter((id) => id !== customerId));
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  
  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value, 10));
  };

  const handleDrop = (newFiles) => {
    setFiles(newFiles);
  };

  const handleRemove = (file) => {
    setFiles((prevFiles) => prevFiles.filter((_file) => _file.path
      !== file.path));
  };
  
  const handleRemoveAll = () => {
    setFiles([]);
  };

  


  const getTenancies = async () => {
    try {
      const data4 = await propertiesApi.lisTenancies()
        setTenancies(data4);
        setMounted(true)
      
    } catch (err) {
      console.error(err);
    }
  };
  if(!mounted){
    getTenancies();
  }

  const getAvatar = async () => {
    await Storage.get(tenant.avatar,{
    level: 'public'}).then(res => {
      tenant.avatarUrl = res; 
    }
    )
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
      
      
  async function downloadRightToRent() {
    const result =  await Storage.get(tenant.rightToRent, { download: true });
    downloadBlob(result.Body, tenant.rightToRent);   
  }

  async function downloadRefrenceCheck() {
    const result =  await Storage.get(tenant.refrenceCheck, { download: true });
    downloadBlob(result.Body, tenant.refrenceCheck);   
  }

  
  const filteredCustomers = applyFilters(tenants, query, filters);
  const sortedCustomers = applySort(filteredCustomers, sort);
  const paginatedCustomers = applyPagination(sortedCustomers, page, limit);
  const enableBulkActions = selectedCustomers.length > 0;
  const selectedSomeCustomers = selectedCustomers.length > 0
    && selectedCustomers.length < tenants.length;
  const selectedAllCustomers = selectedCustomers.length === tenants.length;
  const isCustomerSelected = selectedCustomers.includes(tenant.id);
              
  return (
    
    
    
        
   
          <Table style={{ width:'100%' }}>
           
            
            <TableBody>
            <Grid
            item
            justifyContent="space-between"
            //spacing={2}
          >
                  <TableRow
                    //hover
                    key={tenant.id}
                    selected={isCustomerSelected}
                  >
                    <TableCell padding="checkbox">
                    <Button
                    sx={{ color: 'red'}}
                    startIcon={  <XIcon  fontSize="small" sx={{ color: 'red'}} />}
                    onClick={() => {                 
                    setOpen2(true);
                    }}
                    >
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
                        onClick = {deleteTenant}
                      >
                        Delete
                      </Button>
                    </Box>
                    </Box>
                    </Dialog>
                    </TableCell>
                    
                    <TableCell style={{ wordWrap: "break-word", fontSize:'12px',width: 140, maxWidth: 140}}>
                      <Box
                        sx={{
                          alignItems: 'center',
                          display: 'flex'
                        }}
                      >
                        <Avatar
                          src={tenant.avatarUrl}
                          sx={{
                            height: 42,
                            width: 42
                          }}
                        >
                        </Avatar>
                        <Box sx={{ ml: 1 }}>
                          {tenant.name}
                          <Typography
                            color="textSecondary"
                           
                            fontSize='12px'
                            
                            style={{ wordWrap: 'break-word', width: 120,}}
                          >
                            {tenant.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    
                    <TableCell  style={{ wordWrap: 'break-word', width: 60, maxWidth: 60}}>
                      
                      </TableCell>
                    <TableCell style={{ wordWrap: "break-word", fontSize:'11px',width:160, maxWidth: 160}}>
                     +44 {tenant.phone}
                   
                    </TableCell>

                    <TableCell  style={{ wordWrap: 'break-word', width: 20, maxWidth: 20}}>
                      </TableCell>
                    <TableCell style={{maxWidth: 220,wordWrap: "break-word",fontSize:'11px', width:220}}>
                      {tenant.location}
                    </TableCell>
                    
                    
                    
                    <TableCell style={{maxWidth: 150,wordWrap: "break-word", fontSize:'10px', width:150}}>
                      {tenant.address}
                    </TableCell>
                    
                    
                    <TableCell style={{maxWidth: 1,wordWrap: "break-word", width:1}} ></TableCell>
                    <TableCell style={{maxWidth: 150,wordWrap: "break-word", width:150, align: 'left'}}> 
                      
                       <Tooltip title={ tenant.rightToRent ? "Click to Download" : "Edit to Modify"}> 
                       {
                        tenant.rightToRent ?   
                       
                        <DoneIcon align='right' fontSize="small" onClick= {downloadRightToRent} />  :   
                        <CloseIcon align='right' fontSize="small" />  }
                      </Tooltip>
                      
                    </TableCell>
                   
                    
                    
                    <TableCell >
                        <Tooltip title={ tenant.refrenceCheck ? "Click to Download" : "Edit to Modify"}> 
                      { 
                        tenant.refrenceCheck ?      
                        <DoneIcon align='right' fontSize="small" onClick= {downloadRefrenceCheck} />  :   
                        <CloseIcon align='right' fontSize="small" />  }
                        </Tooltip> 
                      
                    </TableCell>
                    <TableCell>
                    </TableCell>
                    
                    
                    <TableCell >
                    
                    <Button
                      color="inherit"
                      startIcon={<PencilAltIcon fontSize="small" />}
                      variant="text"
                        onClick={() => {
                              
                          setOpen(true);
                        }}
                        ref={anchorRef}
                    >
                     
                    </Button>
                    
                   
                      <Dialog selectedValue={selectedValue}
                            open={open}
                            onClose={handleClose}
                            BackdropProps={{ style: { backgroundColor: "transparent" } 
                            }}>
                            <Formik
                              initialValues={{
                                address1: tenant.address,
                                location: tenant.location || '',
                                email: tenant.email || '',
                                name: tenant.name || '',
                                phone: tenant.phone,
                                submit: null
                              }}
                              validationSchema={Yup
                                .object()
                                .shape({
                                  address1: Yup.string().max(255),
                                  country: Yup.string().max(255),
                                  email: Yup
                                    .string()
                                    .email('Must be a valid email')
                                    .max(255)
                                    .required('Email is required'),
                                    refrenceCheck: Yup.string().max(255),
                                  name: Yup
                                    .string()
                                    .max(255)
                                    .required('Name is required'),
                                  phone: Yup.string().max(15),
                                  state: Yup.string().max(255)
                                })}
                              onSubmit={async (values, { resetForm, setErrors, setStatus, setSubmitting }) => {
                                try {
                                  updateTenant();
                                  handleClose();
                                  // NOTE: Make API request
                                  await wait(500);
                                  resetForm();
                                  setStatus({ success: true });
                                  setSubmitting(false);
                                  toast.success('Tenant updated!');
                                } catch (err) {
                                  console.error(err);
                                  toast.error('Something went wrong!');
                                  setStatus({ success: false });
                                  setErrors({ submit: err.message });
                                  setSubmitting(false);
                                }
                              }}
                            >
                              {({ errors, handleBlur,setFieldValue, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                                <form
                                  onSubmit={handleSubmit}
                                  {...other}
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
                                        
                                     
                                      
                                       
                                         <Grid>
                                         <Box
                                              sx={{
                                                justifyContent:"center",
                                                alignItems:"center",
                                                
                                                p: 1,
                                                border: (theme) => `1px dashed ${theme.palette.divider}`,
                                                borderRadius: '50%'
                                              }}
                                            >
                                              <Tooltip title="Click to upload">
                                              <Avatar
                                                src={tenant.avatarUrl}
                                                sx={{
                                                  height: 100,
                                                  width: 100
                                                }}
                                              />
                                              </Tooltip>
                                            </Box>
                                            <FileDropzoneTenantsEdit
                                          accept="image/*"
                                          //files={files}
                                          onDrop={handleDrop}
                                          onRemove={handleRemove}
                                          onRemoveAll={handleRemoveAll}
                                          onChange={evt => {uploadFile(evt)}}
                                          />
                                       
                                       </Grid>
                                       <Grid
                                          item
                                          //md={6}
                                          xs={12}
                                        />
                                                  
                                        <Grid
                                          item
                                          md={6}
                                          xs={12}
                                        >
                                          <TextField
                                            error={Boolean(touched.name && errors.name)}
                                            fullWidth
                                            helperText={touched.name && errors.name}
                                            label="Name"
                                            name="name"
                                            onBlur={handleBlur}
                                            onChange={(e) => {
                                              values.name = e.target.value
                                              setFieldValue('name', e.target.value)
                                              tenant.name=e.target.value
                                             
                                              }}
                                            required
                                            value={values.name}
                                            variant="outlined"
                                          />
                                        </Grid>
                                        <Grid
                                          item
                                          md={6}
                                          xs={12}
                                        >
                                          <TextField
                                            error={Boolean(touched.email && errors.email)}
                                            fullWidth
                                            helperText={touched.email && errors.email}
                                            label="Email address"
                                            name="email"
                                            onBlur={handleBlur}
                                            onChange={(e) => {
                                              values.email = e.target.value
                                              setFieldValue('email', e.target.value)
                                              tenant.email=e.target.value
                                             
                                              }}
                                            required
                                            value={values.email}
                                            variant="outlined"
                                          />
                                        </Grid>
                                        <Grid
                                          item
                                          md={6}
                                          xs={12}
                                        >
                                        
                                        <Autocomplete
                                         getOptionLabel={(option) => option}
                                        options={tenancyTitles}
                                        onChange={(e, value) => {
                                          if(value === null) {
                                            value=" "
                                          }
                                          setTenancyTitle(value)
                                        values.tenancyTitle= value.array
                                        }}      
                                        renderInput={(params) => (
                                          <TextField
                                            fullWidth
                                            label="Tenancy Title"
                                            name="tenancyTitle"
                                            variant="outlined"
                                            error={Boolean(touched.tenancyTitle && errors.tenancyTitle)}
                                            
                                            helperText={touched.tenancyTitle && errors.tenancyTitle}
                                            
                                            value={values.tenancyTitle}
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
                                        
                                        <Autocomplete
                                          getOptionLabel={(option) => option}
                                          options={propertyAddress}
                                          onChange={(e, value) => {
                                            if(value === null) {
                                              value=" "
                                            }
                                            tenant.address =value
                                          values.Address= value.array
                                          }}      
                                          renderInput={(params) => (
                                            <TextField
                                              fullWidth
                                              label="Address"
                                              name="Address"
                                              variant="outlined"
                                              error={Boolean(touched.Address && errors.Address)}
                                              
                                              helperText={touched.Address && errors.Address}
                                              
                                              value={values.Address}
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
                                        <Autocomplete
                                       getOptionLabel={(option) => option}
                                        options={propertyLocation}
                                        onChange={(e, value) => {
                                          if(value === null) {
                                            value=" "
                                          }
                                          tenant.location=(value)
                                        values.location= value.array
                                        }}      
                                        renderInput={(params) => (
                                          <TextField
                                            fullWidth
                                            label="Location"
                                            name="Location"
                                            variant="outlined"
                                            error={Boolean(touched.location && errors.location)}
                                            
                                            helperText={touched.location && errors.location}
                                            
                                            value={values.location}
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
                                            error={Boolean(touched.phone && errors.phone)}
                                            fullWidth
                                            helperText={touched.phone && errors.phone}
                                            label="Phone number"
                                            name="phone"
                                            onBlur={handleBlur}
                                            onChange={(e) => {
                                              values.phone = e.target.value
                                              setFieldValue('phone', e.target.value)
                                              tenant.phone=e.target.value
                                             
                                              }}
                                              value={values.phone}
                                              InputProps={{
                                              startAdornment: <InputAdornment position="start"> +44 </InputAdornment>,
                                            }}
                                          />
                                        </Grid>


                                        <Grid
                                         container
                                         direction="row"
                                         justifyContent="center"
                                         alignItems="center"
                                           >
                                        <CardActions>
                                         
                                         <FileDropzoneTenantRtr
                                         accept="image/*,.pdf"
                                         //files={files}
                                         onDrop={handleDrop}
                                         onRemove={handleRemove}
                                         onRemoveAll={handleRemoveAll}
                                         onChange={evt => {upload_RTR(evt)}}
                                          
                                         //maxFileSize={5000000}
                                         />
                                       
                                       

                                       <FileDropzoneTenantRc
                                         accept="image/*,.pdf"
                                         //files={files}
                                         onDrop={handleDrop}
                                         onRemove={handleRemove}
                                         onRemoveAll={handleRemoveAll}
                                         onChange={evt => {upload_RC(evt)}}
                                          
                                         //maxFileSize={5000000}
                                         />

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
                                        onClick={handleClose}
                                        variant="contained"
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
                    </TableCell>
                  </TableRow>
                  </Grid>
               
            </TableBody>
          </Table>
       
      
      
   
    
  );
};


export default CustomerListTable;
