 import { useState,useCallback,useEffect,useRef} from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Button,
  Typography,
  Box,
  Card,
  Grid,
  IconButton,
  Checkbox,
  Table,
  TextField,
  TableBody,
  TableCell,
  InputAdornment,
  TableHead,
  TableRow,
  Divider,Input,FormControlLabel
} from '@material-ui/core';
import { propertiesApi } from '../../../api/PropertiesApi';
import SearchIcon from '../../../icons/Search';
import Label from "../../Label";
import ArrowRightIcon from '../../../icons/ArrowRight';
import { Link as RouterLink } from 'react-router-dom';
import useMounted from '../../../hooks/useMounted';
import numeral from "numeral";
import TenancyListToolbar from './TenancyListToolbar';
import  {Storage} from "aws-amplify";
import { makeStyles } from "@material-ui/core/styles"
import DownloadIcon from '../../../icons/Download';
import UploadIcon from '../../../icons/Upload';
import PropertyBrowseResults from './PropertyBrowseResults'
import { v4 as uuid } from "uuid";
import toast from 'react-hot-toast';
import FileDropzoneTenancies from '../../FileDropzoneTenancies'; 
import { saveAs } from "file-saver";
import gtm from '../../../lib/gtm';


const TenancyDetails = (props)=> {
  const mounted = useMounted();


   const[fileNameS,setFileNameS]=useState([])
  const [mode, setMode] = useState('');
  const [limit] = useState(10);
  const [selectedCustomerIds] = useState([]);

   const [files, setFiles] = useState([]);
 const reference = useRef('');
  const [inputValue, setInputValue] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);
  const [filteredResults1, setFilteredResults1] = useState([]);
   const [Tenancies, setTenancies] = useState([]);














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
   

 


const upload_to_s3 = async (fileName, file) => {
  console.log(fileName)
   await Storage.put(fileName, file).then(res => {
    toast.success('File successfully uploaded');
   })
   .catch(err => {
    toast.error('Unexpected error while uploading, try again', err);
   });  
}

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
  const classes = useStyles();  

 
 
  
  return (

     <div>

    <Box >
    
    
    <Box sx={{ mt: -2 }}>
  
    </Box>
  </Box>
   
    
       <Card>
        
        
                
       
           <Box sx={{ minWidth: 1060,width: 480}}>
          

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
        {filteredResults.slice(0, limit).map((tenancy) => (
          <Grid item
          hover
                  key={tenancy.id}
                  
                  selected={selectedCustomerIds.indexOf(tenancy.id) !== -1}
          >
            
                   <Typography padding="checkbox" >
                  <Checkbox sx={{
          px:2,
          mt:-1 ,
        }}/>

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
              { <DownloadIcon  color="primary"      download /> }
            </Typography>
            <Typography color="primary" variant="body2"sx={{
          px:120,
          mt:-4 ,
        }}>
    <Box sx={{ pt: 2 }} >  
          <TenancyDetails tenancy={tenancy} />
        </Box> 
             <IconButton
                        component={RouterLink}
                        to="/dashboard/customers/1"
                        
                      ><Typography
                      
                  color="primary"
                  variant="subtitle2"
                >
                        <ArrowRightIcon fontSize="small" /></Typography>
                      </IconButton>
            </Typography>
          </Grid>))}
  <Grid item>

           
             </Grid>
             
          
            
             
          </Grid>
              
              
          
              </Box>
      
    </Box>
      
    </Card>
    
        )}
   
       </div>

   
  );
};

TenancyDetails.propTypes = {
  tenancies: PropTypes.object.isRequired
};

export default TenancyDetails;
