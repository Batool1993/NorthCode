import { useState } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Formik } from 'formik';
import MobileDatePicker from '@material-ui/lab/MobileDatePicker';
import {
  Box,
  Button,
  Card,
  CardContent,
  FormHelperText,
  TextField,
  Typography
} from '@material-ui/core';
import FileDropzoneBuildingInsurance from '../../FileDropzoneBuildingInsurance';
import FileDropzoneContentInsurance from '../../FileDropzoneContentInsurance';
import FileDropzoneRentProtectionInsurance from '../../FileDropzoneRentProtectionInsurance';
import {propertiesApi} from '../../../api/PropertiesApi';
import { v4 as uuid } from "uuid";
import  {Storage} from "aws-amplify";


const ProjectDetailsFormInsurance = (props) => {
  const { onBack, onNext,property, ...other } = props;
  const [files, setFiles] = useState([]);
  const [files1, setFiles1] = useState([]);
  const [files2, setFiles2] = useState([]);
  const [buildingInsuranceIssueDate, setBuildingInsuranceIssueDate] = useState('');
  const [buildingInsuranceIssuer, setBuildingInsuranceIssuer] = useState('');
  const [buildingInsuranceExpiryDate, setBuildingInsuranceExpiryDate] = useState('');
  const [contentInsuranceIssueDate, setContentInsuranceIssueDate] = useState('');
  const [contentInsuranceExpiryDate, setContentInsuranceExpiryDate] = useState('');
  const [contentInsuranceIssuer, setContentInsuranceIssuer] = useState('');
  const [rentProtectionInsuranceIssueDate, setRentProtectionInsuranceIssueDate] = useState('');
  const [rentProtectionInsuranceExpiryDate, setRentProtectionInsuranceExpiryDate] = useState('');
  const [rentProtectionInsuranceIssuer, setRentProtectionInsuranceIssuer] = useState('');
  const [uploadBuilding, setUploadBuilding] = useState('');
  const [uploadContent, setUploadContent] = useState('');
  const [uploadRentProt, setRentProt] = useState('');


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

const saveBuildingInsurance = () => {
  const insurance = {
   
    "issueDate": buildingInsuranceIssueDate,
    "expiryDate": buildingInsuranceExpiryDate,
    "issuer": buildingInsuranceIssuer,
    "documentName": uploadBuilding,
    "propertyId" : property.id,
    "type" : "BUILDING_INSURANCE"
  }
  propertiesApi.saveInsurance(insurance)
};

const saveContentInsurance = () => {
  const insurance = {
   
    "issueDate": contentInsuranceIssueDate,
    "expiryDate": contentInsuranceExpiryDate,
    "issuer": contentInsuranceIssuer,
    "documentName": uploadContent,
    "propertyId" : property.id,
    "type" : "CONTENT_INSURANCE"
  }
  propertiesApi.saveInsurance(insurance)
};


const saveRentProtInsurance = () => {
  const insurance = {
   
    "issueDate": rentProtectionInsuranceIssueDate,
    "expiryDate": rentProtectionInsuranceExpiryDate,
    "issuer": rentProtectionInsuranceIssuer,
    "documentName": uploadRentProt,
    "propertyId" : property.id,
    "type" : "RENT_PROTECTION_INSURANCE" 
  }
  propertiesApi.saveInsurance(insurance)
};

const uploadBuildingDocument = () => {
  const file = files[0];
  const name1 = uuid() + "-"+file.name;
  setUploadBuilding(name1)
  Storage.put(name1, file)
}

const uploadContentDocument = () => {
  const file = files1[0];
  const name2 = uuid() + "-"+file.name;
  setUploadContent(name2)
  Storage.put(name2, file)
}

const uploadRentProtDocument = () => {
  const file = files2[0];
  const name3 = uuid() + "-"+file.name;
  setRentProt(name3)
  Storage.put(name3, file)
}

  return (
    <Formik
      initialValues={{
      buildingInsuranceIssueDate: new Date() ,
      buildingInsuranceExpiryDate: new Date() ,
      buildingInsuranceIssuer: buildingInsuranceIssuer, 
      contentInsuranceIssueDate: new Date(),
      contentInsuranceExpiryDate: new Date(),
      contentInsuranceIssuer: contentInsuranceIssuer,
      rentProtectionInsuranceIssueDate:  new Date(),
      rentProtectionInsuranceExpiryDate:  new Date(),
      rentProtectionInsuranceIssuer: rentProtectionInsuranceIssuer,
        images: [],
        submit: null
      }}
      validationSchema={Yup
        .object()
        .shape({

          buildingInsuranceIssueDate: Yup.date(),
          buildingInsuranceExpiryDate: Yup.date(),
          buildingInsuranceIssuer: Yup.string().required("Building Issuer is a required field"),
          contentInsuranceIssueDate: Yup.date(),
          contentInsuranceExpiryDate: Yup.date(),
          contentInsuranceIssuer: Yup.string().required("Content Issuer is a required field"),
          rentProtectionInsuranceIssueDate: Yup.date(),
          rentProtectionInsuranceExpiryDate: Yup.date(),
          rentProtectionInsuranceIssuer: Yup.string().required("Rent Protection Issuer is a required field"),
          images: Yup.array()
          
        })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          // Call API to store step data in server session
          // It is important to have it on server to be able to reuse it if user
          // decides to continue later.
          saveBuildingInsurance();
          saveContentInsurance();
          saveRentProtInsurance();
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
           <Card sx={{ p: 2 }}>
            <Typography
              color="textPrimary"
              variant="h6"
            >
              Building Insurance
            </Typography>

            <Box sx={{ mt: 3 }}/>
              <CardContent>
                    
              <FileDropzoneBuildingInsurance
                accept="image/*,.pdf"
                files={files}
                onDrop={handleDrop}
                onRemove={handleRemove}
                onRemoveAll={handleRemoveAll}
                onClick = {uploadBuildingDocument}
              />
              </CardContent>
              <MobileDatePicker 
                    label="Issue Date"
                    onAccept={e => {
                      setBuildingInsuranceIssueDate(e.toLocaleDateString());
                      values.buildingInsuranceIssueDate = e;
                      setFieldTouched('=buildingInsuranceIssueDate');
                    }}
                    onChange={e => setFieldTouched('=buildingInsuranceIssueDate',e)}
                    onClose={() => setFieldTouched('=buildingInsuranceIssueDate')}
                    renderInput={(inputProps) => (
                      <TextField 
                        variant="outlined"
                        {...inputProps}
                      />
                    )}
                    value={values.buildingInsuranceIssueDate}
                  />
                {Boolean(touched.buildingInsuranceIssueDate && errors.buildingInsuranceIssueDate) && (
                  <Box sx={{ mt: 3 }}>
                  <FormHelperText error>
                    {errors.buildingInsuranceIssueDate}
                  </FormHelperText>
                </Box> 
                )}
                <span> </span>
                    <MobileDatePicker
                    label="Expiry Date"
                    onAccept={e => {
                      setBuildingInsuranceExpiryDate(e.toLocaleDateString());
                      values.buildingInsuranceExpiryDate = e;
                      setFieldTouched('=buildingInsuranceExpiryDate');
                    }}
                    onChange={e => setFieldTouched('=buildingInsuranceExpiryDate',e)}
                    onClose={() => setFieldTouched('=buildingInsuranceExpiryDate')}
                    renderInput={(inputProps) => (
                      <TextField 
                        variant="outlined"
                        {...inputProps}
                      />
                    )}
                    value={values.buildingInsuranceExpiryDate}
                  />
              {Boolean(touched.buildingInsuranceExpiryDate && errors.buildingInsuranceExpiryDate) && (
                <Box sx={{ mt: 3 }}>
                  <FormHelperText error>
                    {errors.buildingInsuranceExpiryDate}
                  </FormHelperText>
                </Box>
                
              )} 
              <Box sx={{ mt: 1 }}>
              <TextField
                error={Boolean(touched.buildingInsuranceIssuer && errors.buildingInsuranceIssuer)}
                fullWidth
                helperText={touched.buildingInsuranceIssuer && errors.buildingInsuranceIssuer}
                label="Issuer"
                name="buildingInsuranceIssuer"
                required={true}
                onBlur={handleBlur}
                onChange={(e)=> { setBuildingInsuranceIssuer(e.target.value)
                  values.buildingInsuranceIssuer=e.target.value
                }}
                value={values.buildingInsuranceIssuer}
                variant="outlined"
              />
              </Box>
              <Box sx={{ mt: 4 }}/>
              <Typography
              color="textPrimary"
              variant="h6"
            >
              Content Insurance
            </Typography>

            <Box sx={{ mt: 4 }}/>
              <CardContent>
                    
              <FileDropzoneContentInsurance
                accept="image/*, .pdf"
                files={files1}
                onDrop={handleDrop1}
                onRemove={handleRemove1}
                onRemoveAll={handleRemoveAll1}
                onClick={uploadContentDocument}
              />
              </CardContent>
                <MobileDatePicker 
                      label="Issue Date"
                      onAccept={e => {
                        setContentInsuranceIssueDate(e.toLocaleDateString());
                        values.contentInsuranceIssueDate = e;
                        setFieldTouched('=contentInsuranceIssueDate');
                      }}
                      onChange={e => setFieldTouched('=contentInsuranceIssueDate', e)}
                      onClose={() => setFieldTouched('=contentInsuranceIssueDate')}
                      renderInput={(inputProps) => (
                        <TextField 
                          variant="outlined"
                          {...inputProps}
                        />
                      )}
                      value={values.contentInsuranceIssueDate}
                    />
                  {Boolean(touched.contentInsuranceIssueDate && errors.contentInsuranceIssueDate) && (
                    <Box sx={{ mt: 3 }}>
                    <FormHelperText error>
                      {errors.contentInsuranceIssueDate}
                    </FormHelperText>
                  </Box> 
                  )}
                  <span> </span>
                    <MobileDatePicker
                    label="Expiry Date"
                    onAccept={e => {
                      setContentInsuranceExpiryDate(e.toLocaleDateString());
                      values.contentInsuranceExpiryDate = e;
                      setFieldTouched('=contentInsuranceExpiryDate');
                    }}
                    onChange={e => setFieldTouched('=contentInsuranceExpiryDate',e)}
                    onClose={() => setFieldTouched('=contentInsuranceExpiryDate')}
                    renderInput={(inputProps) => (
                      <TextField
                     
                        variant="outlined"
                        {...inputProps}
                      />
                    )}
                    value={values.contentInsuranceExpiryDate}
                  />
              {Boolean(touched.contentInsuranceExpiryDate && errors.contentInsuranceExpiryDate) && (
                <Box sx={{ mt: 3 }}>
                  <FormHelperText error>
                    {errors.contentInsuranceExpiryDate}
                  </FormHelperText>
                </Box>
                
              )} 
              <Box sx={{ mt: 2 }}>
              <TextField
                error={Boolean(touched.contentInsuranceIssuer && errors.contentInsuranceIssuer)}
                fullWidth
                helperText={touched.contentInsuranceIssuer && errors.contentInsuranceIssuer}
                label="Issuer"
                name="contentInsuranceIssuer"
                required={true}
                onBlur={handleBlur}
                onChange={e=> { setContentInsuranceIssuer(e.target.value)
                  values.contentInsuranceIssuer=e.target.value
                }}
                value={values.contentInsuranceIssuer}
                variant="outlined"
              />
              </Box>
              <Box sx={{ mt: 3 }}/>
              <Typography
              color="textPrimary"
              variant="h6"
            >
              Rent Protection Insurance
            </Typography>

            <Box sx={{ mt: 3 }}/>
              <CardContent>
                    
              <FileDropzoneRentProtectionInsurance
                accept="image/*,.pdf"
                files={files2}
                onDrop={handleDrop2}
                onRemove={handleRemove2}
                onRemoveAll={handleRemoveAll2}
                onClick= {uploadRentProtDocument}
              />
              </CardContent>
              <MobileDatePicker 
                    label="Issue Date"
                    onAccept={e => {
                      setRentProtectionInsuranceIssueDate(e.toLocaleDateString());
                      values.rentProtectionInsuranceIssueDate = e;
                      setFieldTouched('=rentProtectionInsuranceIssueDate');
                    }}
                    onChange={e => setFieldTouched('=rentProtectionInsuranceIssueDate',e)}
                    onClose={() => setFieldTouched('=rentProtectionInsuranceIssueDate')}
                    renderInput={(inputProps) => (
                      <TextField 
                      
                        variant="outlined"
                        {...inputProps}
                      />
                    )}
                    value={values.rentProtectionInsuranceIssueDate}
                  />
                {Boolean(touched.rentProtectionInsuranceIssueDate && errors.rentProtectionInsuranceIssueDate) && (
                  <Box sx={{ mt: 3 }}>
                  <FormHelperText error>
                    {errors.rentProtectionInsuranceIssueDate}
                  </FormHelperText>
                </Box> 
                )}
                <span> </span>
                    <MobileDatePicker
                    label="Expiry Date"
                    onAccept={e => {
                      setRentProtectionInsuranceExpiryDate(e.toLocaleDateString());
                      values.rentProtectionInsuranceExpiryDate = e;
                      setFieldTouched('=rentProtectionInsuranceExpiryDate');
                    }}
                    onChange={e => setFieldTouched('=rentProtectionInsuranceExpiryDate',e)}
                    onClose={() => setFieldTouched('=rentProtectionInsuranceExpiryDate')}
                    renderInput={(inputProps) => (
                      <TextField
                        variant="outlined"
                        {...inputProps}
                      />
                    )}
                    value={values.rentProtectionInsuranceExpiryDate}
                  />
              {Boolean(touched.rentProtectionInsuranceExpiryDate && errors.rentProtectionInsuranceExpiryDate) && (
                <Box sx={{ mt: 3 }}>
                  <FormHelperText error>
                    {errors.rentProtectionInsuranceExpiryDate}
                  </FormHelperText>
                </Box>
                
              )} 
              <Box sx={{ mt: 2 }}>
              <TextField
                error={Boolean(touched.rentProtectionInsuranceIssuer && errors.rentProtectionInsuranceIssuer)}
                fullWidth
                helperText={touched.rentProtectionInsuranceIssuer && errors.rentProtectionInsuranceIssuer}
                label="Issuer"
                required={true}
                name="rentProtectionInsuranceIssuer"
                onBlur={handleBlur}
                onChange={e => {setRentProtectionInsuranceIssuer(e.target.value)
                  values.rentProtectionInsuranceIssuer=e.target.value
                }}
                value={values.rentProtectionInsuranceIssuer}
                variant="outlined"
              />
              </Box>

              <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  mt: 3
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
              <Box sx={{ flexGrow: 1 }} />
                <Button
                  color="primary"
                  disabled={isSubmitting}
                  type="submit"
                  variant="contained"
                >
                  Next
                </Button>
              </Box>
            </Card>
            
          </form>
        )}
      </Formik>
    );
  };

ProjectDetailsFormInsurance.propTypes = {
  onBack: PropTypes.func,
  onNext: PropTypes.func
};

export default ProjectDetailsFormInsurance;
