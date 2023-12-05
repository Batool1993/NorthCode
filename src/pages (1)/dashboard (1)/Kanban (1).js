import { useEffect,useCallback,useState ,useRef} from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { DragDropContext } from 'react-beautiful-dnd';
import toast from 'react-hot-toast';
import { Box,Button,Paper, Breadcrumbs, MenuItem,Menu,Divider,Link,IconButton, Typography,CardContent,Card,TextField } from '@material-ui/core';
import { KanbanColumn, KanbanColumnAdd ,KanbanCard} from '../../components/dashboard/kanban';
import ChevronRightIcon from '../../icons/ChevronRight';
import gtm from '../../lib/gtm';
import { getBoard, moveCard } from '../../slices/kanban';
import { useDispatch, useSelector } from '../../store';
import {propertiesApi} from '../../api/PropertiesApi'
import useMounted from '../../hooks/useMounted';
import DotsHorizontalIcon from '../../icons/DotsHorizontal'
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { clearColumn, deleteColumn, updateColumn } from '../../slices/kanban';
import KanbanCardModal from '../../components/dashboard/kanban/KanbanCardModal';
import KanbanCardAdd from '../../components/dashboard/kanban/KanbanCardAdd'
import * as Yup from 'yup';
import { Formik } from 'formik';
import { Auth } from 'aws-amplify';


const Kanban = () => {
  const dispatch = useDispatch();
  let { columns } = useSelector((state) => state.kanban);
  const mounted = useMounted();
  const [tasks,setTasks]=useState([]); 
 const moreRef = useRef(null);
   const [open, setOpen] = useState(false);
     const [limit, setLimit] = useState(5);
  const [isExpanded, setIsExpanded] = useState(false);
const [name, setName] = useState('');
   const [task, setTask] = useState('');
const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [description,setDescription]=useState(''); 
  const [openMenu, setOpenMenu] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
    const [dueDate,setDueDate]=useState(''); 
    const timestamp = new Date().toDateString();
    
  let columnId1= columns.allIds.map((columnId,key) => {key=columnId
               
           return  columnId
  })

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);


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

      let cardId = tasks.map(task=>task.id)
      let cardName = tasks.map(task=>task.name)


      let columns1=[
    {
      id: '5e849c39325dc5ef58e5a5db',
      name: 'Todo',
      cardIds:[],
      cardNames:cardName
    },
    {
      id: '5e849c2b38d238c33e516755',
      name: 'Progress',
      cardIds:[]
    },
    {
      id: '5e849c2b38d238c33e5146755',
      name: 'Done',
      cardIds:[]
    }
  ];


  const handleDragEnd = async ({ source, destination, draggableId }) => {
    try {
      // Dropped outside the column
      if (!destination) {
        return;
      }

      // Card has not been moved
      if (source.droppableId === destination.droppableId
        && source.index === destination.index) {
        return;
      }

      if (source.droppableId === destination.droppableId) {
        // Moved to the same column on different position
           
        let newa=tasks.map(task=>task.id)
       const card = newa.find((_card) => _card === draggableId);

        if (!card) {
          console.log('Card not found');
          return;
        };
              


        const sourceList = columns1.find((column) => column.id === source.droppableId );
  
         if (!sourceList) {
          console.log('Column not found1');
          return;
        }
//remove
                
                 if (destination) {
          // Find the destination column for the card
          const destinationList = columns1.find((column) => column.id ===destination.droppableId);
       
          if (!destinationList) {
            console.log(('Column not found'));
            return;
          }
let newCard=''
          let newn=tasks.map(task=>task.name)
          const newName = newn.find((_card) => _card === newCard);
     
 const updatecolumnID = async () => {
  const newTask = {
    "id" : draggableId,
   "columnId":destinationList.id,
 
  }
   getTasks()
  return await propertiesApi.updateTasks(newTask)
 
}

 
  
       destinationList.cardIds.splice(destinationList.index, 0, card);
       destinationList.cardIds.splice(destinationList.index, 0, card);
updatecolumnID ()
getTasks()
      
     
 toast.success('Card moved!');
 
          // Store the new columnId reference
        
       
         
      }
      } else {
        // Moved to another column
        
        let newa=tasks.map(task=>task.id)
       const card = newa.find((_card) => _card === draggableId);

        if (!card) {
          console.log('Card not found');
          return;
        };
              

  let y = tasks.map(task=>task.columnId)

        const sourceList = columns1.find((column) => column.id === source.droppableId );
   
         if (!sourceList) {
          console.log('Column not found1');
          return;
        }
//remove
                
                 if (destination) {
          // Find the destination column for the card
          const destinationList = columns1.find((column) => column.id ===destination.droppableId);
       
          if (!destinationList) {
            console.log(('Column not found'));
            return;
          }
let newCard=''
          let newn=tasks.map(task=>task.name)
          const newName = newn.find((_card) => _card === newCard);
 const updatecolumnID = async () => {
  const newTask = {
    "id" : draggableId,
   "columnId":destinationList.id,
 
  }
   getTasks()
  return await propertiesApi.updateTasks(newTask)
 
}

 
  
       destinationList.cardIds.splice(destinationList.index, 0, card);
       destinationList.cardIds.splice(destinationList.index, 0, card);
updatecolumnID ()
getTasks()
      
     
 toast.success('Card moved!');
 
          // Store the new columnId reference
        
    
         
      }

     
        }
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong!');
    }
  };


 
  const handleMenuOpen = () => {
    setOpenMenu(true);
 
  };

const handleRenameInit = () => {
    setIsRenaming(true);
    setOpenMenu(false);
  };
  const handleMenuClose = () => {
    setOpenMenu(false);
  };
  const handleDelete = async () => {
    try {
      setOpenMenu(false);
      await dispatch(deleteColumn(columns.id));
      toast.success('Column deleted!');
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong!');
    }
  };

   const handleOpen = () => {
     
    setOpen(true);
  };
const handleClose = () => {
    setOpen(false);
  

  };
  const handleClear = async () => {
    try {
      setOpenMenu(false);
      await dispatch(clearColumn(columns.id));
      toast.success('Column cleared!');
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong!');
    }
  };
 const handleAddInit = () => {
    setIsExpanded(true);
  };

 

 const saveTasks= async () => {
    const user = await Auth.currentAuthenticatedUser({
      bypassCache: false  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    });
    const newTask= {
     
      "name": name,
      "comment": comment,
      "userId": user.username,
      "columnId":'5e849c39325dc5ef58e5a5db',
      "description":description,
      "userId": user.username,
      "createdAt" : timestamp
    }
    user['id'] = await propertiesApi.saveTasks(newTask);
    getTasks()
  }
  const handleAddCancel = () => {
    setIsExpanded(false);
    setName('');
  };

  const handleAddConfirm = async () => {
    try {
      await getTasks(("5e849c39325dc5ef58e5a5db", title || 'Untitled Card'));
      saveTasks(); 
      setTasks(tasks)
      setIsExpanded(false);
     
      setName(name);
      toast.success('Card created!');
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong!');
    }
  };
  return (
    <>
    
      <Helmet>
        <title>Dashboard: Kanban | Material Kit Pro</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ p: 3 }}>
          <Typography
            color="textPrimary"
            variant="h5"
          >
            Kanban
          </Typography>
          <Breadcrumbs
            aria-label="breadcrumb"
            separator={<ChevronRightIcon fontSize="small" />}
            sx={{ mt: 1 }}
          >
            <Link
              color="textPrimary"
              component={RouterLink}
              to="/dashboard"
              variant="subtitle2"
            >
              Dashboard
            </Link>
            <Typography
              color="textSecondary"
              variant="subtitle2"
            >
              Kanban
            </Typography>
          </Breadcrumbs>
        </Box>
       
        <DragDropContext onDragEnd={handleDragEnd}>
            
          <Box
            sx={{
              display: 'flex',
              flexGrow: 1,
              flexShrink: 1,
              overflowX: 'auto',
              overflowY: 'hidden'
            }}
          >
            <Box
              sx={{
                display: 'flex',
                px: 1,
                py: 3
              }}
            >
             
                {columns1.map((columnId) => (
                       <div       key={columnId}>
      <Paper
        sx={{
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '100%',
          mx: 1,
          overflowX: 'hidden',
          overflowY: 'hidden',
          width: {
            xs: 300,
            sm: 380
          }
        }}
      >
     
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            px: 2,
            py: 1
          }}
        >
          
              
                 
              <Typography
             
             
                color="inherit"
                onClick={handleRenameInit}
                variant="h6"
              >
               
               
                {columnId.name}
              </Typography>
          
              
  
          <Box sx={{ flexGrow: 1 }} />
          <IconButton
            color="inherit"
            edge="end"
            onClick={handleMenuOpen}
            ref={moreRef}
          >
            <DotsHorizontalIcon fontSize="small" />
          </IconButton>
        </Box>
        
        <Divider />
      {tasks.map((task) => (
          <Box key={task.id}>
  <KanbanCardModal
        
        card={task}
       column={columnId.id}
        onClose={handleClose}
        open={open}
      />
      </Box>))}
        <Droppable
          key={columnId.id}
          droppableId={columnId.id}
          type="card"
        >
          {(provided) => (
            <Box
              ref={provided.innerRef}
              sx={{
                flexGrow: 1,
                minHeight: 80,
                overflowY: 'auto',
                px: 2,
                py: 1
              }}
            >
              
                {tasks.map((task, index) => (
                task.columnId===columnId.id?(
                <Draggable
                  draggableId={task.id}
                  index={index}
                  key={task.id}
                >
               
                  
                  
               {(_provided, snapshot) => (
               
             <KanbanCard
                      cardId={task}
                      dragging={snapshot.isDragging}
                      index={index}
                      key={task.id}
                      column={columnId}
                      ref={_provided.innerRef}
                      style={{ ..._provided.draggableProps.style }}
                      {..._provided.draggableProps}
                      {..._provided.dragHandleProps}
                    />
                  )}
      
       </Draggable>
                 ):(
       ""
      )
                ))
                 }
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
    
        <Divider />
        <Box
            sx={{
              p:1,
            
            }}
          >
     
        
       
 
       
        </Box>
          <div >
      {isExpanded
        ? (
          <>
      {columnId.id==='5e849c39325dc5ef58e5a5db'?(
          <Formik
      initialValues={{
        
        title: title,
      
        Description: description,
        
        comment: comment,
       
        submit: null
      }}
      validationSchema={Yup
        .object()
        .shape({
   
          Title: Yup.string().required("Please Enter Title"),
          Description: Yup.string(),
          Comment: Yup.string()
          
        })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
    
        try {
          // Call API to store step data in server session
          // It is important to have it on server to be able to reuse it if user
          // decides to continue later.
          
          saveTasks(name); 
          setStatus({ success: true });
          setSubmitting(false);
             setIsExpanded(false);
      setName(name);
      toast.success('Task created!');
     
         
        } catch (err) {
          console.error(err);
           toast.error('Something went wrong!');
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
         
        >
            
                <TextField
                error={Boolean(touched.Title && errors.Title)}
                fullWidth
                helperText={touched.Title && errors.Title}
                label="Title"
                name="Title"
                onBlur={handleBlur}
                required={true}
               
                onChange={(e) => {
                  setName(e.target.value)
                values.Title=e.target.value
                }}
                value={values.Title}
                variant="outlined"

              />
              
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mt: 1
              }}
            >
              <Button
                color="primary"
                onClick={handleAddCancel}
                variant="text"
              >
                Cancel
              </Button>
              <Button
                color="primary"
                onClick={handleAddConfirm}
                
                variant="contained"
              >
                Add
                
              </Button>
            </Box>
            </form>
      )}
      </Formik>):("")}
          </>
        )
        : (
          
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center'
            }}
          >
          {columnId.id==='5e849c39325dc5ef58e5a5db'?(
            <Button
              color="primary"
              onClick={handleAddInit}
              variant="text"
            >
              Add Task
            </Button>):("")}
          </Box>
        )}
    </div>
        <Menu
        key={columnId.id}
          anchorEl={moreRef.current}
          anchorOrigin={{
            horizontal: 'center',
            vertical: 'bottom'
          }}
          keepMounted
          onClose={handleMenuClose}
          open={openMenu}
        >
          <MenuItem onClick={handleRenameInit}>
            Rename
          </MenuItem>
          <MenuItem onClick={handleClear}>
            Clear
          </MenuItem>
          <MenuItem onClick={handleDelete}>
            Delete
          </MenuItem>
        </Menu>
      </Paper>
    </div>
             
              ))}
           
            </Box>
          </Box>
          
        </DragDropContext>
    
      </Box>
    </>
  );
};

export default Kanban;

