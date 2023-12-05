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
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import PropertyCard from './PropertyCard';
import useMounted from '../../../hooks/useMounted';
import PropertyCardOverview from './PropertyCardOverview'
const PropertyRegistry = (props) => {
  const { properties, ...other } = props;
  const mounted = useMounted();
  const sortRef = useRef(null);
  const [openSort, setOpenSort] = useState(false);
  const [selectedSort, setSelectedSort] = useState('Most popular');
  const [mode, setMode] = useState('grid');
  const [list, setList] = useState([]);

  const handleSortOpen = () => {
    setOpenSort(true);
  };

    const getProperties = useCallback(async () => {
       try {
      const Data = await fetch('https://landlordfiles170913-dev.s3.amazonaws.com/public/data+(1).json')
    .then(response => response.json())
    .then(data=>{  return data.results})
    

  if (mounted.current) {
        setList(Data);
        
      }
  
    } catch (err) {
      console.error(err);
      
    }
  }, [mounted]);

  useEffect(() => {
    getProperties();
  }, [getProperties]);

var hi=list.map((item) => item.Index)


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
    <div {...other}>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          mb: 2
        }}
      >
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
        <Box
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
        </Box>
      </Box>
          <Grid
        container
        spacing={3}
      >
        {list.map((items) => (
          <Grid
            item
            key={items.Index}
          md={mode === 'grid' ? 6 : 12}
            sm={mode === 'grid' ? 12 : 12}
            xs={12}
            
          >
             <PropertyCardOverview items={(items)} />
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
        <Pagination count={3} />
      </Box>
      <Menu
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
      </Menu>
    </div>
  );
};

PropertyRegistry.propTypes = {
  properties: PropTypes.array.isRequired
};

export default PropertyRegistry;