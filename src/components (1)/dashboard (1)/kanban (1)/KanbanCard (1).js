
import { forwardRef, useState ,useCallback,useEffect} from 'react';
import PropTypes from 'prop-types';
import {
  Avatar,
  AvatarGroup,
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography
} from '@material-ui/core';
import CheckIcon from '../../../icons/Check';
import ChatAltIcon from '../../../icons/ChatAlt';
import DocumentTextIcon from '../../../icons/DocumentText';
import EyeIcon from '../../../icons/Eye';
import { useSelector } from '../../../store';
import KanbanCardModal from './KanbanCardModal';
import { Auth } from 'aws-amplify';
import {propertiesApi} from '../../../api/PropertiesApi'
import * as Yup from 'yup';
import { Formik } from 'formik';
import useMounted from '../../../hooks/useMounted';
import { DragDropContext } from 'react-beautiful-dnd';

const cardSelector = (state, cardId) => {
  const { cards, members } = state.kanban;
 
  const card = cards.byId[cardId];


  return {
    ...card,
  
  };
};

const KanbanCard = forwardRef((props, ref) => {
  const { cardId, dragging, column,tasks1 ,...other } = props;
  const card = useSelector((state) => cardSelector(state, cardId));
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [description,setDescription]=useState(''); 
    const [tasks,setTasks]=useState([]); 
     const [limit, setLimit] = useState(5);

     const mounted = useMounted();

  const handleOpen = () => {
    setOpen(true);
  };


  const getTasks = useCallback(async () => {
    try {
      const data  = await propertiesApi.getTasks()
;

      if (mounted.current) {
        setTasks(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [mounted]);

 
  useEffect(() => { 
    getTasks();
  }, [getTasks]);
  
 const handleDragEnd = ({destination, source}) => {
    if (!destination) {
      return
    }

    if (destination.index === source.index && destination.droppableId === source.droppableId) {
      return
    }

    // Creating a copy of item before removing it from state
    const itemCopy = {...tasks[source.droppableId].tasks[source.index]}

    setTasks(prev => {
      prev = {...prev}
      // Remove from previous items array
      prev[source.droppableId].tasks.splice(source.index, 1)


      // Adding to new items array location
      prev[destination.droppableId].tasks.splice(destination.index, 0, itemCopy)

      return prev
    })
  }
  const handleClose = () => {
    setOpen(false);
  

  };

  return (
    <>
 <Box>
 
    <Box 
      ref={ref}
      sx={{
        outline: 'none',
        py: 1
      }}
      {...other}
      
    >
   
      <Card
        key={cardId.id}
        onClick={handleOpen}
        raised={dragging}
        sx={{mt:-1,
          ...(dragging && {
            backgroundColor: 'background.paper'
          }),
          '&:hover': {
            backgroundColor: 'background.default'
          }
        }}
        variant={dragging ? 'elevation' : 'outlined'}
      >
        
          
        <CardContent  >
          <Typography
            color="textPrimary"
            variant="subtitle2"
          >
            {cardId.name ? cardId.name :  <Typography
       color="textPrimary"
       variant="subtitle2"
     >
          {cardId.status ==0 ?  (() => {
                    if (cardId.type === 'LANDLORD_EMERGENCY_COVER') 
                      return 'LANDLORD EMERGENCY COVER' + ' is about to expire'; 
                      else if (cardId.type === 'RENT_PROTECTION_INSURANCE')
                      return 'RENT PROTECTION INSURANCE' + ' is about to expire';
                      else if (cardId.type === 'BUILDING_INSURANCE')
                      return 'BUILDING INSURANCE' + ' is about to expire';
                      else if (cardId.type === 'CONTENT_INSURANCE')
                      return 'CONTENT INSURANCE' + ' is about to expire';
                      else
                      return cardId.type + ' is about to expire';
                      })()
                       : (() => {
                        if (cardId.type === 'LANDLORD_EMERGENCY_COVER') 
                          return 'LANDLORD EMERGENCY COVER' + ' expired'; 
                          else if (cardId.type === 'RENT_PROTECTION_INSURANCE')
                          return 'RENT PROTECTION INSURANCE' + ' expired';
                          else if (cardId.type === 'BUILDING_INSURANCE')
                          return 'BUILDING INSURANCE' + ' expired';
                          else if (cardId.type === 'CONTENT_INSURANCE')
                          return 'CONTENT INSURANCE' + ' expired';
                          else
                          return cardId.type + ' expired';
                          })()}
     </Typography>
 }   
          </Typography>
      
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              mt: 2,
             
              '& svg:not(:first-of-type)': {
                ml: 2
              }
            }}
          >
           
        

            <Box sx={{ flexGrow: 1 }} />
          
          </Box>
        </CardContent>
        
      </Card>

      <KanbanCardModal
        card={cardId}
        column={column}
        onClose={handleClose}
        open={open}
      />
   
       </Box>


{/* <Box>
 
 
<Box 
      ref={ref}
      sx={{
        outline: 'none',
        py: 1
      }}
      {...other}
      
    > 
 <Card
   key={cardId.id}
   onClick={handleOpen}
   raised={dragging}
   sx={{mt:-1,
     ...(dragging && {
       backgroundColor: 'background.paper'
     }),
     '&:hover': {
       backgroundColor: 'background.default'
     }
   }}
   variant={dragging ? 'elevation' : 'outlined'}
 >
   
     
   <CardContent  >
     <Typography
       color="textPrimary"
       variant="subtitle2"
     >
          {cardId.status ==0 ? cardId.type+' is about to expire' : cardId.type+' is expired'}
     </Typography>
 
     <Box
       sx={{
         alignItems: 'center',
         display: 'flex',
         mt: 2,
        
         '& svg:not(:first-of-type)': {
           ml: 2
         }
       }}
     >
      
   

       <Box sx={{ flexGrow: 1 }} />
     
     </Box>
   </CardContent>
   
 </Card>

 <KanbanCardModal
   card={cardId}
   column={column}
   onClose={handleClose}
   open={open}
 />

  </Box>



     
    </Box> */}

    </Box>


 </>
  );
 
} );

KanbanCard.propTypes = {
  cardId: PropTypes.string.isRequired,
  dragging: PropTypes.bool,
  index: PropTypes.number,
  column: PropTypes.object.isRequired,
  style: PropTypes.object
};

KanbanCard.defaultProps = {
  dragging: false
};

export default KanbanCard;