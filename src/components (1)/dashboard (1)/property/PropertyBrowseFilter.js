import { useState,useRef,useEffect,useCallback } from 'react';
import { Box,Button,Grid,Typography,Card, Checkbox, Chip, Divider, FormControlLabel, Input,ListItemText,
  Menu,
  MenuItem,
  Pagination,
  ToggleButton,
  ToggleButtonGroup, } from '@material-ui/core';
import SearchIcon from '../../../icons/Search';
import PropertyCard from './PropertyCard'
import MultiSelect from '../../MultiSelect';
//import Fuse from 'fuse.js';
import { Helmet } from 'react-helmet-async';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import { propertiesApi } from '../../../api/PropertiesApi';
import gtm from '../../../lib/gtm';
import useMounted from '../../../hooks/useMounted';
import TenancyListToolbar from './TenancyListToolbar';



const PropertyBrowseFilter = (props) => {
  const {  tenant} = props;
  
  const [inputValue, setInputValue] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);
  const [filteredResults1, setFilteredResults1] = useState([]);
    const [value1, settValue] = useState('');
    const [value2, settValue2] = useState('');
      const mounted = useMounted();
const [properties, setProperties] = useState([]);
      useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

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

  const [mode, setMode] = useState('grid');
    const sortRef = useRef(null);

 const [openSort, setOpenSort] = useState(false);
  const [selectedSort, setSelectedSort] = useState('Most popular');
  const [chips, setChips] = useState([
  ]);
  const [checked, setChecked] = useState([true, false]);

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
  
  

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };
 let h=properties.map((ten )=> ten.propertyType)
 let uniqueArray = h.filter(function(item, pos, self) {
    return self.indexOf(item) == pos;
})
  let k=properties.map((ten )=> ten.location)
 let uniqueArray2 = k.filter(function(item, pos, self) {
    return self.indexOf(item) == pos;
})
 const handleSortOpen = () => {
    setOpenSort(true);
  };

const selectOptions = [
  {
    label: 'Type',
    options:uniqueArray
   
           
  },
  {
    label: 'Location',
    options:  uniqueArray2
  }
];

 
 const searchItems = (searchValue) => {
        setInputValue(searchValue)
        if(chips.length>0){
        if (inputValue !== '') {
            const filteredData = filteredResults1.filter((item) => {
                return Object.values(item).join('').toLowerCase().includes(inputValue.toLowerCase())
            })
            
            setFilteredResults(filteredData)
           
        }}
        else{
if (inputValue !== '') {
            const filteredData = properties.filter((item) => {
                return Object.values(item).join('').toLowerCase().includes(inputValue.toLowerCase())
            })
            
            setFilteredResults(filteredData)

        }}
        
   
    }



  const handleInputKeyup = (event) => {
    if (event.code === 'ENTER' && inputValue) {
      if (!chips.includes(inputValue)) {
        setChips((prevChips) => [...prevChips, inputValue]);
        setInputValue(inputValue);
        
      }
    }
  };

  const handleChipDelete = (chip) => {
    setChips((prevChips) => prevChips.filter((prevChip) => chip !== prevChip));
    setFilteredResults1("");
  };

  const handleChange = (event) => {
    setChecked([event.target.checked])
   
  };


  const handleMultiSelectChange = (value) => {
    setChips(value)
      console.log(value, 'he')
                  for(let i in value){

         if (value[i] !== '') {
            const filteredData = properties.filter((item) => {
                return Object.values(item).join('').includes(value[i])}
            )
    
            setFilteredResults1(filteredData)
             for(let j in value){

         if (value[i] !== '') {
            const filteredData1 = properties.filter((item) => {
                return Object.values(item).join('').includes(value[j])}
                 
            )
  
        setFilteredResults1(filteredData1)
         }

    
                     
        }}}
       
    
  };
  

  return (
    
     <div >
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          mb: 2
        }}
      >{inputValue.length > 0 ? (
        <Typography
          color="textPrimary"
          sx={{
            position: 'relative',
            '&:after': {
              backgroundColor: 'primary.main',
              bottom: '-8px',
              content: '" "',
              height: '3px',
              left: 0,
              position: 'absolute',
              width: '48px'
            }
          }}
          variant="h5"
        >
          Showing
          
          {' '}
          {filteredResults.length}
          {' '}
          properties
        </Typography>
      ):
        <Typography
          color="textPrimary"
          sx={{
            position: 'relative',
            '&:after': {
              backgroundColor: 'primary.main',
              bottom: '-8px',
              content: '" "',
              height: '3px',
              left: 0,
              position: 'absolute',
              width: '48px'
            }
          }}
          variant="h5"
        >
          Showing
          
          {' '}
          {properties.length}
          {' '}
          properties
        </Typography>
}
  {/*       <Box
          sx={{
            alignItems: 'center',
            display: 'flex'
          }}
        >
          <Button
            color="primary"
            onClick={handleSortOpen}
            ref={sortRef}
            sx={{
              textTransform: 'none',
              letterSpacing: 0,
              mr: 2
            }}
            variant="text"
          >
            {selectedSort}
            <ArrowDropDownIcon fontSize="small" />
          </Button>
          <ToggleButtonGroup
            exclusive
            onChange={handleModeChange}
            size="small"
            value={mode}
          >
            <ToggleButton value="grid">
              <ViewModuleIcon fontSize="small" />
            </ToggleButton>
          </ToggleButtonGroup>
          
        </Box> */}
      </Box>
<Card>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          p: 2
        }}
      >
        <SearchIcon fontSize="small" />
        <Box
          sx={{
            flexGrow: 1,
            ml: 3
          }}
        >
 
          <Input
            disableUnderline
            fullWidth
            onChange={(e) => searchItems(e.target.value)}
           
            onKeyUp={handleInputKeyup}
            placeholder="Enter a keyword"
            value={inputValue}
          />       
        </Box>
      </Box>
                        
      <Divider />
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexWrap: 'wrap',
          p: 2
        }}
      >
        {chips.map((chip) => (
          <Chip
            key={chip}
            label={chip}
            onDelete={() => handleChipDelete(chip)}
            sx={{ m: 1 }}
            variant="outlined"
          />
        ))}
      </Box>
        <Divider />
           <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexWrap: 'wrap',
          p: 1
        }}
      >
        {selectOptions.map((option) => (
          
          <MultiSelect
             key={option.label}
            label={option.label}
            onChange={handleMultiSelectChange}
            options={option.options}
            value={chips}
          />
        ))}
        <Box sx={{ flexGrow: 1 }} />
       {/*  <FormControlLabel
          control={(
            <Checkbox
              color="primary"
              onChange={handleChange}
              defaultChecked
            />
          )}
          label="Tenanted"
        /> */}
        
      </Box>


      <Divider />
</Card>
{filteredResults1.length > 0 ?(
       inputValue.length >0?(          
          <Grid
        container
        spacing={3}
      >
        {filteredResults.map((property) => (
          <Grid
            item
            key={property.id}
            md={mode === 'grid' ? 6 : 12}
            sm={mode === 'grid' ? 12 : 12}
            xs={12}
          >
           <PropertyCard property={(property)} />
            
          </Grid>
        ))}
        
        
      </Grid>   ):(
      <Grid
        container
        spacing={3}
      >
        {filteredResults1.map((property) => (
          <Grid
            item
            key={property.id}
            md={mode === 'grid' ? 6 : 12}
            sm={mode === 'grid' ? 12 : 12}
            xs={12}
          >
           <PropertyCard property={(property)} />
            
          </Grid>
        ))}
        
        
      </Grid> 


      ) 
      
              ):((
     
 inputValue.length >0?(
                     
         <div >
         
        <Grid
        container
        spacing={3}
      >
        {filteredResults.map((property) => (
          <Grid
            item
            key={property.id}
            md={mode === 'grid' ? 6 : 12}
            sm={mode === 'grid' ? 12 : 12}
            xs={12}
          >
           <PropertyCard property={(property)} />
            
          </Grid>
        ))}
        
      </Grid>    
       
  
   </div>
   
                    )
                 : (  
                 <div>
                        
                  <Grid
        container
        spacing={3}
      >
        {properties.map((property) => (
          <Grid
            item
            key={property.id}
            md={mode === 'grid' ? 6 : 12}
            sm={mode === 'grid' ? 12 : 12}
            xs={12}
          >
           <PropertyCard property={(property)} />
            
          </Grid>
        ))}
      </Grid>      
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          mt: 6
        }}
      > 
      </Box>
      </div> 
                    )
                

              ))
      }
 

  

      
      
     {/*  <Menu
        anchorEl={sortRef.current}
        elevation={1}
        onClose={handleSortClose}
        open={openSort}
      >
        {[
          'Most recent',
          'Popular',
          'Price high',
          'Price low',
          'On sale'
        ].map((option) => (
          <MenuItem
            key={option}
            onClick={() => handleSortSelect(option)}
          >
            <ListItemText primary={option} />
          </MenuItem>
        ))}
      </Menu> */}
    </div>
  );
};

export default PropertyBrowseFilter;
