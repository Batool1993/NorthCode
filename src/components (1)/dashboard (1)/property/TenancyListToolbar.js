import {
  Box,
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon,
  Checkbox,
  Typography,
  Input
} from '@material-ui/core';
import { useState,useCallback,useEffect} from 'react';
import { propertiesApi } from '../../../api/PropertiesApi';
import useMounted from '../../../hooks/useMounted';
import TenancyListResults from './TenancyListResults'
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Link as RouterLink } from 'react-router-dom';
import SearchIcon from '../../../icons/Search';
import PropertyBrowseResults from './PropertyBrowseResults'



const TenancyListToolbar = (props) => {
    const mounted = useMounted();
 const [tenancies, setTenancies] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);

const getTenancies = useCallback(async () => {

  
      
      const data4 = await propertiesApi.lisTenancies()
   
setTenancies(data4);

              
    
  
        
       
        
      
    
  }, [mounted]);

 
  useEffect(() => {
   
    getTenancies();
  }, [getTenancies]);

 const searchItems = (searchValue) => {
        setInputValue(searchValue)
      
if (inputValue !== '') {
            const filteredData = tenancies.filter((item) => {
                return Object.values(item).join('').toLowerCase().includes(inputValue.toLowerCase())
            })
            
            setFilteredResults(filteredData)

        }}


useEffect(() => {
   
    searchItems();
  }, [TenancyListToolbar]);


//let file1 = tenancies.filter(cert => cert.documentName);






return(


  <Box >

  </Box>
);
}
export default TenancyListToolbar;





 