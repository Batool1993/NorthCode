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
import FileDropzonePATCert from '../../FileDropzonePATCert';
import FileDropzonEICRCert from '../../FileDropzonEICRCert';
import FileDropzoneGCert from '../../FileDropzoneGCert'; 
import {propertiesApi} from '../../../api/PropertiesApi';
import {Storage} from "aws-amplify";
import { v4 as uuid } from "uuid";
import { getDate, isToday } from 'date-fns';



const ProjectDetailsFormCert = (props) => {
  const { onBack, onNext, property,  ...other } = props;
  const [files, setFiles] = useState([]);
  const [files1, setFiles1] = useState([]);
  const [files2, setFiles2] = useState([]);
  const [gasIssueDate, setGasIssueDate] = useState('');
  const [gasExpiryDate, setGasExpiryDate] = useState('');
  const [gasIssuer, setGasIssuer] = useState('');
  const [patIssueDate, setPatIssueDate] = useState('');
  const [patExpiryDate, setPatExpiryDate] = useState('');
  const [patIssuer, setPatIssuer] = useState('');
  const [eicrIssueDate, setEicrIssueDate] = useState('');
  const [eicrExpiryDate, setEicrExpiryDate] = useState('');
  const [eicrIssuer, setEicrIssuer] = useState('');
  const [uploadGS, setUploadGS] = useState('');
  const [uploadPat, setUploadPat] = useState('');
  const [uploadEicr, setUploadEicr] = useState('');
  
 
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

const saveGasSafetyCertificate = () => {
  const cert = {
    "issueDate": gasIssueDate,
    "expiryDate": gasExpiryDate,
    "issuer": gasIssuer,
    "type":"GAS",
    "documentName": uploadGS,
    "propertyId" : property.id
  }
  propertiesApi.saveCertificate(cert)
}

const savePATCertificate = () => {
  const cert = {
    "issueDate": patIssueDate,
    "expiryDate": patExpiryDate,
    "issuer": patIssuer,
    "type":"PAT",
    "documentName": uploadPat,
    "propertyId" : property.id
  }
  propertiesApi.saveCertificate(cert) 
}

const saveEICRCertificate = () => {
  const cert = {
    "issueDate": eicrIssueDate,
    "expiryDate": eicrExpiryDate,
    "issuer": eicrIssuer,
    "type":"EICR",
    "documentName": uploadEicr,
    "propertyId" : property.id
  }
  propertiesApi.saveCertificate(cert)
}

const upload_GS = (e) => {
  const file = files[0];
  const name1 = uuid() +"-"+file.name;
  setUploadGS(name1);
  Storage.put(name1, file)
  
}

const upload_PAT = (e) => {
  const file = files1[0];
  const name2 = uuid() + "-"+file.name;
  setUploadPat(name2)
  Storage.put(name2, file)
}

const upload_EICR = (e) => {
  const file = files2[0];
  const name3 = uuid() + "-"+ file.name;
  setUploadEicr(name3)
  Storage.put(name3, file)
  }


  return (
    <Formik
      initialValues={{
        images: [],
        submit: null,
        gasIssueDate: new Date(),
        gasExpiryDate: new Date(),
        gasIssuer: gasIssuer,
        patIssueDate:new Date(),
        patExpiryDate:new Date(),
        patIssuer:patIssuer,
        eicrIssueDate: new Date(),
        eicrExpiryDate:new Date(),
        eicrIssuer:eicrIssuer 

      }}
      validationSchema={Yup
        .object()
        .shape({
         
          images: Yup.array(),
          gasIssueDate: Yup.date(),
          gasExpiryDate: Yup.date(),
          gasIssuer: Yup.string().required("Gas Issuer is a required field"),
          patIssueDate: Yup.date(),
          patExpiryDate: Yup.date(),
          patIssuer:Yup.string().required("PAT Issuer is a required field"),
          eicrIssueDate: Yup.date(),
          eicrExpiryDate: Yup.date(),
          eicrIssuer:Yup.string().required("EICR Issuer is a required field")
          
        })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          // Call API to store step data in server session
          // It is important to have it on server to be able to reuse it if user
          // decides to continue later.
          saveGasSafetyCertificate();
          savePATCertificate();
          saveEICRCertificate();
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
                    Upload Gas Safety Certificate
                  </Typography>

                  <Box sx={{ mt: 4 }}/>
                    <CardContent>
                          
                    <FileDropzoneGCert
                      accept="image/*,.pdf"
                      files={files}
                      onDrop={handleDrop}
                      onRemove={handleRemove}
                      onRemoveAll={handleRemoveAll}
                      onClick={upload_GS}
                    />
                    </CardContent>
                    <MobileDatePicker 
                          label="Issue Date"
                          onAccept={e => {
                            setGasIssueDate(e.toLocaleDateString());
                            values.gasIssueDate = e;
                            setFieldTouched('=gasIssueDate');
                          }}
                          onChange={e => setFieldTouched('=gasIssueDate')}
                          onClose={() => setFieldTouched('=gasIssueDate')}
                          renderInput={(inputProps) => (
                            <TextField 
                              variant="outlined"
                              {...inputProps}
                            />
                          )}
                          value={values.gasIssueDate}
                        />
                      {Boolean(touched.gasIssueDate && errors.gasIssueDate) && (
                        <Box sx={{ mt: 3 }}>
                        <FormHelperText error>
                          {errors.gasIssueDate}
                        </FormHelperText>
                      </Box> 
                      )}
                      <span> </span>
                          <MobileDatePicker
                          label="Expiry Date"
                          onAccept={e => {
                            setGasExpiryDate(e.toLocaleDateString());
                            values.gasExpiryDate = e;
                            setFieldTouched('=gasExpiryDate');
                          }}
                          onChange={(e) => setFieldTouched('=gasExpiryDate')}
                          onClose={() => setFieldTouched('=gasExpiryDate')}
                          
                          renderInput={(inputProps) => (
                            <TextField
                              variant="outlined"
                              {...inputProps}
                            />
                          )}
                          value={values.gasExpiryDate}
                        />
                    {Boolean(touched.gasExpiryDate && errors.gasExpiryDate) && (
                      <Box sx={{ mt: 3 }}>
                        <FormHelperText error>
                          {errors.gasExpiryDate}
                        </FormHelperText>
                      </Box>
                      
                    )} 
                     <Box sx={{ mt: 1 }}>
                        <TextField
                          error={Boolean(touched.gasIssuer && errors.gasIssuer)}
                          fullWidth
                          helperText={touched.gasIssuer && errors.gasIssuer}
                          label="Issuer"
                          name="gasIssuer"
                          required={true}
                          onBlur={handleBlur}
                          onChange={(e)=> {
                            setGasIssuer(e.target.value)
                            values.gasIssuer = e.target.value}}
                        
                          
                         value={values.gasIssuer}
                         variant="outlined"
                        />
                        </Box>
                        <Box sx={{ mt: 4 }}/>
              <Typography
                 color="textPrimary"
                 variant="h6"
                   >
              Upload PAT Certificate
            </Typography>

            <Box sx={{ mt: 4 }}/>
              <CardContent>
                    
              <FileDropzonePATCert
                accept="image/*,.pdf"
                files={files1}
                onDrop={handleDrop1}
                onRemove={handleRemove1}
                onRemoveAll={handleRemoveAll1}
                onClick={upload_PAT}
              />
              </CardContent>
              <MobileDatePicker 
                    label="Issue Date"
                    onAccept={e => {
                      setPatIssueDate(e.toLocaleDateString());
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
                {Boolean(touched.patIssueDate && errors.patIssueDate) && (
                  <Box sx={{ mt: 3 }}>
                  <FormHelperText error>
                    {errors.patIssueDate}
                  </FormHelperText>
                </Box> 
                )}
             
                    <MobileDatePicker
                    label="Expiry Date"
                    onAccept={e => {
                      setPatExpiryDate(e.toLocaleDateString());
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
                <Box sx={{ mt: 3 }}>
                  <FormHelperText error>
                    {errors.patExpiryDate}
                  </FormHelperText>
                </Box>
                
              )} 
              <Box sx={{ mt: 2 }}>
              <TextField
                error={Boolean(touched.patIssuer && errors.patIssuer)}
                fullWidth
                helperText={touched.patIssuer && errors.patIssuer}
                label="Issuer"
                name="patIssuer"
                onBlur={handleBlur}
                required={true}
                onChange={(e)=> {setPatIssuer(e.target.value)
                values.patIssuer = e.target.value}}
                value={values.patIssuer}
                variant="outlined"
              />
              </Box>
              <Box sx={{ mt: 4 }}/>
              <Typography
              color="textPrimary"
              variant="h6"
            >
              Upload Electiry Safety (EICR) Certificate
            </Typography>

            <Box sx={{ mt: 4 }}/>
              <CardContent>
                    
              <FileDropzonEICRCert
                accept="image/*,.pdf"
                files={files2}
                onDrop={handleDrop2}
                onRemove={handleRemove2}
                onRemoveAll={handleRemoveAll2}
                onClick={upload_EICR}
              />
              </CardContent>
              <MobileDatePicker 
                    label="Issue Date"
                    onAccept={e => {
                      setEicrIssueDate(e.toLocaleDateString());
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
                  <Box sx={{ mt: 3 }}>
                  <FormHelperText error>
                    {errors.eicrIssueDate}
                  </FormHelperText>
                </Box> 
                )}
                <span> </span>
                    <MobileDatePicker
                    label="Expiry Date"
                    onAccept={e => {
                      setEicrExpiryDate(e.toLocaleDateString());
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
                <Box sx={{ mt: 3 }}>
                  <FormHelperText error>
                    {errors.eicrExpiryDate}
                  </FormHelperText>
                </Box>
                
              )} 
                  <Box sx={{ mt: 2 }}>
                  <TextField
                    error={Boolean(touched.eicrIssuer && errors.eicrIssuer)}
                    fullWidth
                    helperText={touched.eicrIssuer && errors.eicrIssuer}
                    label="Issuer"
                    name="eicrIssuer"
                    required={true}
                    onBlur={handleBlur}
                    onChange={e=> { setEicrIssuer(e.target.value)
                      values.eicrIssuer=e.target.value
                    }}
                    value={values.eicrIssuer}
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
                  onClick={handleSubmit}
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

  ProjectDetailsFormCert.propTypes = {
  onBack: PropTypes.func,
  onNext: PropTypes.func
};

export default ProjectDetailsFormCert;
