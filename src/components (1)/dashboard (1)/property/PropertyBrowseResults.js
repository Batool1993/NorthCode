import { useRef, useState ,useCallback,useEffect} from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Grid,
  ListItemText,
  Menu,
  MenuItem,
  Pagination,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from '@material-ui/core';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
// eslint-disable-next-line no-unused-vars
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import PropertyCard from './PropertyCard';
import useMounted from '../../../hooks/useMounted';
import TenancyListResults from './TenancyListResults'
import { propertiesApi } from '../../../api/PropertiesApi';
import  {Storage} from "aws-amplify";
import Auth from '@aws-amplify/auth';
import { sign, decode, JWT_SECRET, JWT_EXPIRES_IN } from '../../../utils/jwt'


const PropertyBrowseResults = (props) => {
  
  const [tenancies, setTenancies] = useState([]);
  const mounted = useMounted();
    const {tenancy}=props;
    
  const sortRef = useRef(null);

  
  const [openSort, setOpenSort] = useState(false);
  const [selectedSort, setSelectedSort] = useState('Most popular');
  const [mode, setMode] = useState('grid');
  const [list, setList] = useState([]);
   const[fileNameS,setFileNameS]=useState([])

  const handleSortOpen = () => {
    setOpenSort(true);
  };
  



   




const getData = useCallback(async () => {
     Storage.get(tenancy.documentName,{
     level: 'public'})
    .then(data=>{;return data;})
    .then(data=> setFileNameS(data));

  }, [mounted]);
 


  const handleSortClose = () => {
    setOpenSort(false);
  };

  const handleSortSelect = (value) => {
    setSelectedSort(value);
    setOpenSort(false);
  };

  const handleModeChange = (event, value) => {
    setMode(value);
  };

  return (
    <div >

             
          
       
                <Box
                 
             
                 
                >
               
           
          </Box>
         
    </div>
  );
};

PropertyBrowseResults.propTypes = {
  properties: PropTypes.array.isRequired
};

export default PropertyBrowseResults;

