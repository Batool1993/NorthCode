import { createContext, useEffect, useReducer, useState } from 'react';
import Amplify, { Auth } from 'aws-amplify';
import  {Storage} from "aws-amplify";
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { v4 as uuid } from "uuid";
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  FormHelperText,
  Grid,
  TextField,
} from '@material-ui/core';
import useAuth from '../../../hooks/useAuth';
import wait from '../../../utils/wait';
import countries from './countries';
import FileDropzoneUsers from '../../FileDropzoneUsers';

const AccountGeneralSettings = (props) => {
  const { user } = useAuth();
  const [files, setFiles] = useState([]);
  let [uploadFileName, setUploadFileName] = useState('');
  const [avatar, setAvatar ]= useState('');

  useEffect(() => {
     Auth.currentAuthenticatedUser().then(user =>  {
       if (user.attributes.picture){
       getAvatar(user.attributes.picture) }
     });
  }, []);
 
  const getAvatar = async (fileName) => {
    await Storage.get(fileName,{
    level: 'public'}).then(avatar => {
       setAvatar(avatar)
    }
    )
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
  user.avatar = name;
  setUploadFileName(name)
  upload_to_s3(name, file)
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

const deletePicture = async () => {
  const user = await Auth.currentAuthenticatedUser();
  await Auth.updateUserAttributes(user, {
    'picture': '',
  }
  ).then( 
    (res => res == 'SUCCESS') ? 
    getAvatar('') : toast.success( 'Error!') ) 
}

  return (
   
    <Grid
      container
      spacing={3}
      {...props}
    >
      <Grid
        item
        lg={4}
        md={6}
        xl={3}
        xs={12}
      >
        <Card>
          <CardContent>
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
                textAlign: 'center'
              }}
            >
               <Box
               sx={{
                 p: 1,
                 border: (theme) => `1px dashed ${theme.palette.divider}`,
                 borderRadius: '50%'
               }}
             >
               {
                 avatar ? 
                 <Avatar
                 src={avatar}
                 sx={{
                   height: 100,
                   width: 100
                 }}
               > 
               </Avatar> :
              <Avatar
              sx={{
                height: 100,
                width: 100
              }}> 
            </Avatar> 
               }
               </Box>
              <FileDropzoneUsers
                  accept="image/*"
                  onDrop={handleDrop}
                  onRemove={handleRemove}
                  onRemoveAll={handleRemoveAll}
                  onChange={evt => {uploadFile(evt)}}
                />
                <CardActions>
                <Button
                  color="primary"
                  fullWidth
                  variant="outlined"
                  onClick={deletePicture}
                >
                  Remove Picture
                </Button>
                </CardActions>
                </Box>
                </CardContent>
                </Card>
                </Grid>
                <Grid
                item
                lg={8}
                md={6}
                xl={9}
                xs={12}
              >
        <Formik
          enableReinitialize
          initialValues={{
            country: user.country || '',
            email: user.email || '',
            name: user.name || '',
            phone: user.phone || '',
            address: user.address || '',
            submit: null
          }}
          validationSchema={Yup
            .object()
            .shape({
              country: Yup.string().max(255),
              email: Yup
                .string()
                .email('Must be a valid email')
                .max(255)
                .required('Email is required'),
              name: Yup
                .string()
                .max(255)
                .required('Name is required'),
              phone: Yup.string(),
              address: Yup.string()
            })}
          onSubmit={async (values, { resetForm, setErrors, setStatus, setSubmitting }) => {
            try {
              const user = await Auth.currentAuthenticatedUser();
              await Auth.updateUserAttributes(user, {
               'email': values.email,
               'name': values.name,
                'custom:phone': values.phone,
                'custom:country': values.country,
                'address': values.address,  
                'picture': uploadFileName,
                //'plan': user.attributes["custom:plan"]
              }
              );
              await wait(200);
              resetForm();
              setStatus({ success: true });
              setSubmitting(false);
              toast.success('Profile updated!');
            
            } catch (err) {
              console.error(err);
              toast.error('Something went wrong!');
              setStatus({ success: false });
              setErrors({ submit: err.message });
              setSubmitting(false);
            }
          }}
        >
          {({ errors, handleBlur, handleChange, setFieldValue, handleSubmit, isSubmitting, touched, values }) => (
            <form onSubmit={handleSubmit}>
              <Card>
                <CardHeader title="Profile" />
                <Divider />
                <CardContent>
                  <Grid
                    container
                    spacing={4}
                  >
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
                          user.name = e.target.value
                          }}
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
                        helperText={touched.email && errors.email
                          ? errors.email
                          : 'We will use this email to contact you'}
                        label="Email Address"
                        name="email"
                        onBlur={handleBlur}
                        onChange={(e) => {
                          user.email = e.target.value
                          values.email = e.target.value
                          setFieldValue('email', e.target.value) 
                          }}
                        required
                        type="email"
                        value={values.email}
                        variant="outlined"
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
                        label="Phone Number"
                        name="phone"
                        onBlur={handleBlur}
                        onChange={(e) => {
                          values.phone = e.target.value
                          setFieldValue('phone', e.target.value)
                          user.phone=e.target.value
                          }}
                        value={values.phone}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid
                      item
                      md={6}
                      xs={12}
                    >
                      <Autocomplete
                        getOptionLabel={(option) => option.text}
                        options={countries}
                        onChange={(e, value) => {
                          if(value === null) {
                            value="USA"
                           }
                        values.country= value.text
                        }}    
                        renderInput={(params) => (
                          <TextField
                            fullWidth
                            label={user.country}
                            name="country"
                            variant="outlined"
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
                        error={Boolean(touched.address && errors.address)}
                        fullWidth
                        helperText={touched.address && errors.address}
                        label="Address"
                        name="address"
                        onBlur={handleBlur}
                        onChange={(e) => {
                          values.address = e.target.value
                          setFieldValue('address', e.target.value)
                          user.address=e.target.value
                          }}
                        value={values.address}
                        variant="outlined"
                      />
                    </Grid>
                  </Grid>
                  {errors.submit && (
                    <Box sx={{ mt: 3 }}>
                      <FormHelperText error>
                        {errors.submit}
                      </FormHelperText>
                    </Box>
                  )}
                </CardContent>
                <Divider />
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    p: 2
                  }}
                >
                  <Button
                    color="primary"
                    disabled={isSubmitting}
                    type="submit"
                    variant="contained"
                  >
                    Save Changes
                  </Button>
                </Box>
              </Card>
            </form>
          )}
        </Formik>
      </Grid>
    </Grid>
   
  );
};

export default AccountGeneralSettings;
