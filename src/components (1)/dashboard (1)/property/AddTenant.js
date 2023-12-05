import { useState, useCallback, useEffect} from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import InputAdornment from "@material-ui/core/InputAdornment";
import { v4 as uuid } from "uuid";
import  {Storage} from "aws-amplify";
import {propertiesApi} from '../../../api/PropertiesApi';
import { Auth } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';
import { Navigate } from 'react-router';
import {
  Autocomplete,
  Box,
  Button,
  CardActions,
  Card,
  Avatar,
  Grid,
  CardContent,
  TextField,
} from '@material-ui/core';
import toast from 'react-hot-toast';
import { Link as RouterLink } from 'react-router-dom';
import FileDropzoneTenants from '../../FileDropzoneTenants';
import FileDropzoneTenantRC from '../../FileDropzoneTenantRC';
import FileDropzoneTenantRtr from '../../FileDropzoneTenantRtr';

const AddTenant = (props) => {
const {  onBack, onNext, ...other } = props;
const [files, setFiles] = useState([]);
const [files1, setFiles1] = useState([]);
const [files2, setFiles2] = useState([]);
const [name, setName ] = useState (''); 
const [location, setLocation ] = useState (''); 
const [address, setAddress] = useState ('');
const [phone, setPhone ] = useState (''); 
const [rightToRent, setRightToRent ] = useState (false); 
const [refrenceCheck, setRefrenceCheck ] = useState (false);
const [avatar, setAvatar ] = useState (''); 
let [tenant, setTenant] = useState({});
const [properties, setProperties] = useState([]);
const [mounted, setMounted] = useState(false)
const [email, setEmail] = useState('');
const [uploadFileName, setUploadFileName] = useState('');
const navigate = useNavigate();
const [tenancyTitle, setTenancyTitle] = useState('');
const [tenancies, setTenancies] = useState([]);
const src = "";

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


   


const getAvatar = async (fileName) => {
  await Storage.get(fileName,{
  level: 'public'}).then(avatar => {
    setAvatar(avatar) 
  }
  )
} 

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

  const upload_RTR = (evt) => {
    setFiles1(evt.target.files)
    const files1 = evt.target.files[0];
    const name2 = uuid() + "-"+files1.name;
    setRightToRent(name2);
    upload_documents(name2, files1)
  }
  
  const upload_RC = (evt) => {
    setFiles2(evt.target.files)
    const files2 = evt.target.files[0];
    const name3 = uuid() + "-"+ files2.name;
    setRefrenceCheck (name3); 
    upload_documents(name3, files2) 
  } 

  const upload_documents = async (fileName, file) => {
    await Storage.put(fileName, file).then(res => {
    toast.success('Document successfully uploaded');
    
    })
    .catch(err => {
    toast.error('Unexpected error while uploading, try again', err);
    });  
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

  const uploadFile = async (evt) => {
  const file = evt.target.files[0];
  const name = uuid() +"-"+file.name;
  setUploadFileName(name);
  upload_to_s3(name, file)
}

 
                                   
  const saveTenant = async () => {
    const user = await Auth.currentAuthenticatedUser({
      bypassCache: false  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    });
    const selectedProperty= properties.filter(property=>property.firstAddress==address);
    const selectedTenancy= tenancies.filter(tenancy=>tenancy.Title==tenancyTitle);
    if (selectedProperty== undefined){
      toast.error("you must select an address")
    } 
    const newTenant= {
      "name": name,
      "propertyId":selectedProperty && selectedProperty[0]? selectedProperty[0]['id'] : '',
      "tenancyId": selectedTenancy && selectedTenancy[0]? selectedTenancy[0]['id'] : '' ,
      "location" : location,
      "phone": phone,
      "email":email,
      "address": address,
      "rightToRent": rightToRent,
      "refrenceCheck": refrenceCheck,
      "avatar": uploadFileName,
      "userId": user.username
    }
    tenant['id'] = await propertiesApi.saveTenant(newTenant);

  }

  const propertyLocation = properties.map((property)=> property.location)
  const propertyAddress = properties.map((property=> property.firstAddress))
  const tenancyTitles= tenancies.map((tenancy=>tenancy.Title))

  return (
    
    <Grid
    container
    //spacing={1}
    {...props}
  >
    <Grid
      item
      lg={4}
      md={6}
      xl={3}
      //xs={12}
      
    >
         <Card  sx={{
               
                //alignItems: 'left',
                //display: 'flex',
                p: 16.8,
              }}>
          <CardContent>
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
                //textAlign: 'center',
                //justifyContent: 'flex-end',
                
              }}
            >
              <Box
                sx={{
                  p: 1,
                  border: (theme) => `1px dashed ${theme.palette.divider}`,
                  borderRadius: '50%'
                }}
              >
                <Avatar
                  src={avatar}
                  sx={{
                    height: 100,
                    width: 100
                  }}
                />
                
              </Box>
              <FileDropzoneTenants
              accept="image/*"
              //files={files}
              onDrop={handleDrop}
              onRemove={handleRemove}
              onRemoveAll={handleRemoveAll}
              onChange={evt => {uploadFile(evt)}}
            //maxFileSize={5000000}
             />
           
            </Box>
          </CardContent>
          <CardActions sx={{ display: 'flex', mx:-17}}>
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
            <FileDropzoneTenantRC
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
            </CardActions>
        </Card>
      </Grid>
      <Grid
        item
        md={8}
        //xs={16}
         >
        <Formik
          initialValues={{
                email: email,
                name: name,
                phone: phone,
                submit: null
          }}
          validationSchema={Yup
            .object()
            .shape({
              name: Yup.string().required("Name is a required value"),
              email: Yup.string().required("Email is a required value").email(),
              phone: Yup.string(),
            })}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            try {
              // Call API to store step data in server session
              // It is important to have it on server to be able to reuse it if user
              // decides to continue later.
              
              
              saveTenant();
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
            values
          }) => (
            <form
              onSubmit={handleSubmit}
              
              {...other}
            >
            
              <Card sx={{ p: 3, mx: 2 }}>
                <Box sx={{ mt: 2 }}/>
                <Autocomplete
                    getOptionLabel={(option) => option}
                    options={propertyLocation}
                    onChange={(e, value) => {
                      if(value === null) {
                        value=" "
                      }
                      setLocation(value)
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
                  <Box sx={{ mt: 2 }}/>
                  <Autocomplete
                    getOptionLabel={(option) => option}
                    options={propertyAddress}
                    onChange={(e, value) => {
                      if(value === null) {
                        value=" "
                      }
                      setAddress(value)
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
                  <Box sx={{ mt: 2 }}/>
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
                    <Box sx={{ mt: 2 }}/>
                      <TextField
                      error={Boolean(touched.name && errors.name)}
                      fullWidth
                      helperText={touched.name && errors.name}
                      label="Name"
                      name="name"
                      onBlur={handleBlur}
                    
                      onChange={(e) => {
                      setName(e.target.value)
                      values.name = e.target.value
                      }}
                      variant="outlined"  
                      required={true}
                      value={values.name}
                    />
          
                  <Box sx={{ mt: 2 }}/>
                    <TextField
                    error={Boolean(touched.email && errors.email)}
                    fullWidth
                    helperText={touched.email && errors.email}
                    label="Email"
                    name="email"
                    onBlur={handleBlur}
                    required={true}
                    onChange={(e) => {
                    setEmail(e.target.value)
                    values.email = e.target.value
                    }}
                    variant="outlined"  
                    value={values.email}
                  />
                  
                <Box sx={{ mt: 2 }}/>
                  <TextField
                    error={Boolean(touched.phone && errors.phone)}
                    fullWidth
                    helperText={touched.phone && errors.phone}
                    label="Phone"
                    name="phone" 
                    onBlur={handleBlur}
                    onChange={(e) => {
                      setPhone(e.target.value)
                    values.phone= e.target.value
                    }}
                    variant="outlined"
                    value={values.phone}
                    InputProps={{
                      startAdornment: <InputAdornment position="start"> +44 </InputAdornment>,
                    }}
                  /> 
      
                <Box
                  sx={{
                    display: 'flex',
                    mt: 6
                  }}
                > 
                  {onBack && (
                    <Button
                      color="primary"
                      onClick={onBack}
                      size="large"
                      variant="text"
                    >
                      Previous
                    </Button>
                  )}
        
                <Box sx={{ m: -1 }}>
                <Button
                    color="primary"
                    disabled={isSubmitting}
                    type="submit"
                    variant="contained"
                    onClick={handleSubmit}
                  >
                    Save
                  </Button> 
                
                </Box>         
                <Box sx={{ ml: 2 ,mt:-1}}>
                 <Button
                  color="primary"
                  component={RouterLink}
                  variant="contained"
                  to="/dashboard/tenants"
                  >
                    Cancel
                  </Button>
                  </Box>
                </Box>
              </Card>
            </form>
          )}
        </Formik>
        </Grid>
        </Grid>
    
  );

              };    
          


export default AddTenant ;
