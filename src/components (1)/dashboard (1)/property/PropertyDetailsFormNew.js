import { useState } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Formik } from 'formik';
import MobileDatePicker from '@material-ui/lab/MobileDatePicker';
import locations from '../../dashboard/account/locations';
import InputAdornment from "@material-ui/core/InputAdornment";
import { v4 as uuid } from "uuid";
import  {Storage} from "aws-amplify";
import { Link as RouterLink } from 'react-router-dom';
import FileDropzoneProp from '../../FileDropzoneProp';
import {propertiesApi} from '../../../api/PropertiesApi';
import { Auth } from 'aws-amplify';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  CardHeader,
  FormHelperText,
  TextField,
  Typography
} from '@material-ui/core';
import toast from 'react-hot-toast';
import { PropertyCard } from '.';

const ProjectDetailsFormNew = (props) => {
 
  const { properties, onBack, onNext, ...other } = props;
  const [files, setFiles] = useState([]);
  const [postcode, setPostcode ] = useState (''); 
  const [location, setLocation ] = useState (''); 
  const [purchasePrice, setPurchasePrice] = useState('');
  const [firstAddress, setFirstAddress] = useState('');
  const [purchaseDate, setPurchaseDate] = useState((''));
  const [description,setDescription]=useState('');
  const [uploadFileName, setUploadFileName] = useState('');
  const [propertyType, setType] = useState('');
  const Types = [
  {text : 'Flat'},
  {text : 'Detached'},
  {text : 'Semi-Detached' },
  {text : 'Terraced' }]

  let [property, setProperty] = useState({});
 

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

  

  const uploadFile = (e) => {
    
    const file = files[0];
    const ss = uuid() +"-"+file.name;
    setUploadFileName(ss);
    Storage.put(ss, file).then(res => {
      toast.success('Successfully uploaded');
     })
     .catch(err => {
      toast.error('Unexpected error while uploading, try again', err);
     });  
}


  const saveProperties = async () => {
    const user = await Auth.currentAuthenticatedUser({
      bypassCache: false  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    });
    const newProperty = {
      "postcode": postcode,
      "location" : location,
      "purchasePrice" : purchasePrice,
      "firstAddress": firstAddress,
      "purchaseDate": purchaseDate,
      "userId": user.username,
      "documentName": uploadFileName,
      "propertyType": propertyType,
      "description":description
    
    }
    property['id'] = await propertiesApi.saveProperty(newProperty);

  }

  
    
  return (
    <>
    
  

    <Formik
      initialValues={{
        FirstLineOfAddress: firstAddress,
        Postcode: postcode,
        Location: location,
        purchaseDate: new Date(),
        purchasePrice: purchasePrice,
        images: [],
        propertyType: propertyType,
        Description: description,
        submit: null
      }}
      validationSchema={Yup
        .object()
        .shape({
          FirstLineOfAddress: Yup.string().required("First Line of Address is a required field"),
          Postcode: Yup.string().required(),
          Location: Yup.string().required().nullable(),
          purchasePrice: Yup.number().required("Purchase Price is a required field"),
          purchaseDate: Yup.date().required("Date is required"),
          images: Yup.array(),
          propertyType: Yup.string().required("Property Type is a required field").nullable(),
          Description: Yup.string()
          
          
        })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          // Call API to store step data in server session
          // It is important to have it on server to be able to reuse it if user
          // decides to continue later.
      
          saveProperties(); 
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
          <Card sx={{ p: 3 }}>
            <Typography
              color="textPrimary"
              variant="h6"
            >
              Property details
            </Typography>

            <Box sx={{ mt: 2, fontSize: 8}}/>
                <TextField
                error={Boolean(touched.Postcode && errors.Postcode)}
                fullWidth
                helperText={touched.Postcode && errors.Postcode}
                label="Postcode"
                name="Postcode"
                onBlur={handleBlur}
              
                onChange={(e) => {
                setPostcode(e.target.value)
                values.Postcode = e.target.value
                }}
                variant="outlined"  
                required={true}
                value={values.Postcode}
              />
            
            <Box sx={{ mt: 2 }}/>
                <TextField
                error={Boolean(touched.Description && errors.Description)}
                fullWidth
                helperText={touched.Description && errors.Description}
                label="Description"
                name="Description"
                onBlur={handleBlur}
                required={false}
               
                onChange={(e) => {
                  setDescription(e.target.value)
                values.Description=e.target.value
                }}
                value={values.Description}
                variant="outlined"

              />

              <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  mt: 2
                }}
              >
              </Box>
              <Box sx={{ mt: 2 }}/>
              

               <Autocomplete
                getOptionLabel={(option) => option.text}
                options={Types}
                onChange={(e, value) => {
                  if(value === null) {
                    value="Flat"
                   }
                  setType(value.text)
                values.propertyType= value.text
                }}      
                renderInput={(params) => (
                  <TextField
                    fullWidth
                    label="Property Type"
                    name="PropertyType"
                    required={true}
                    variant="outlined"
                    error={Boolean(touched.propertyType && errors.propertyType)}
                    
                    helperText={touched.propertyType && errors.propertyType}
                    
                    value={values.propertyType}
                    onBlur={handleBlur}              
                    {...params}
                   
                  />
                  
                )}
              />

         
              
              <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  mt: 2
                }}
              >
              </Box>
              <Box sx={{ mt: 2 }}/>
                <TextField
                error={Boolean(touched.FirstLineOfAddress && errors.FirstLineOfAddress)}
                fullWidth
                helperText={touched.FirstLineOfAddress && errors.FirstLineOfAddress}
                label="First Line of Address"
                name="FirstLineOfAddress"
                onBlur={handleBlur}
                required={true}
               
                onChange={(e) => {
                  setFirstAddress(e.target.value)
                values.FirstLineOfAddress=e.target.value
                }}
                value={values.FirstLineOfAddress}
                variant="outlined"

              />


            
              <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  mt: 2
                }}
              >
              </Box>
              <Box sx={{ mt: 2 }}/>
                
                <Autocomplete
                getOptionLabel={(option) => option.text}
                options={locations}
                onChange={(e, value) => {
                  if(value === null) {
                    value="London"
                   }
                  setLocation(value.text)
                values.Location= value.text
                }}      
                renderInput={(params) => (
                  <TextField
                    fullWidth
                    label="Location"
                    name="Location"
                    required={true}
                    variant="outlined"
                    error={Boolean(touched.Location && errors.Location)}
                    fullWidth
                    helperText={touched.Location && errors.Location}
                    variant="outlined"
                    value={values.Location}
                    onBlur={handleBlur}              
                    {...params}
                   
                  />
                  
                )}
              />
              

            
              <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  mt: 2
                }}
              >
              </Box>


            <Box sx={{ mt: 2 }}/>
          
            < TextField
                error={Boolean(touched.purchasePrice && errors.purchasePrice)}
                fullWidth
                helperText={touched.purchasePrice && errors.purchasePrice}
                label="Purchase Price"
                name="purchasePrice" 
                type="number"
                onBlur={handleBlur}
                onChange={(e) => {
                  setPurchasePrice(e.target.value)
                values.purchasePrice= e.target.value
                }}
                variant="outlined"
                value={values.purchasePrice}
                required={true}
                InputProps={{
                  startAdornment: <InputAdornment position="end"> £ </InputAdornment>,
                }}
             
              /> 
  
            
   
       
              <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  mt: 2
                }}
              >
              </Box>
                <Box sx={{ mr: 2 }}>
                <MobileDatePicker
                          label="Purchase Date"
                          onAccept={date => {
                            setPurchaseDate(date.toLocaleDateString());
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
                  <CardHeader title="Upload Property Image" />
                 
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
             <Box
              sx={{
                display: 'flex',
                //mt: 6
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
              Save 
            </Button>
            </Box> 
            <Box sx={{ ml: 2 ,mt:-1}}>
            <Button
              color="primary"
              component={RouterLink}
              variant="contained"
              to="/dashboard/properties/list"
            >
              Cancel
            </Button>
            </Box>
           </Box>
              </Box>
            </Box>
       
          </Card>
        
        </form>
        
      )}
    </Formik>
    </>
  );
              };      
          
ProjectDetailsFormNew.propTypes = {
  onBack: PropTypes.func,
  onNext: PropTypes.func,
  //properties: PropTypes.array.isRequired
 
};

export default ProjectDetailsFormNew;