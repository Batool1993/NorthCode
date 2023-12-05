import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import debounce from 'lodash/debounce';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { Box, Dialog, Button,Divider, Grid, TextField, Typography,FormHelperText, Avatar } from '@material-ui/core';
import LabelIcon from '@material-ui/icons/Label';
import ArchiveIcon from '../../../icons/Archive';
import ArrowRightIcon from '../../../icons/ArrowRight';
import XIcon from '../../../icons/X';
import CheckIcon from '../../../icons/Check';
import DocumentTextIcon from '../../../icons/DocumentText';
import DuplicateIcon from '../../../icons/Duplicate';
import EyeIcon from '../../../icons/Eye';
import EyeOffIcon from '../../../icons/EyeOff';
import TemplateIcon from '../../../icons/Template';
import UsersIcon from '../../../icons/Users';
import { addChecklist, deleteCard, updateCard } from '../../../slices/kanban';
import { useDispatch } from '../../../store';
import {useState} from 'react'
import WarningIcon from '@material-ui/icons/WarningOutlined';
import { alpha } from '@material-ui/core/styles';
import KanbanCardAction from './KanbanCardAction';
import KanbanChecklist from './KanbanChecklist';
import KanbanComment from './KanbanComment';
import KanbanCommentAdd from './KanbanCommentAdd';
import {propertiesApi} from '../../../api/PropertiesApi'
import { Auth } from 'aws-amplify';
import MobileDatePicker from '@material-ui/lab/MobileDatePicker';
import { useEffect,useCallback ,useRef} from 'react';
import useMounted from '../../../hooks/useMounted';

const KanbanCardModal = (props) => {
  const { card, column, onClose, open, ...other } = props;
  
  const dispatch = useDispatch();
 const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [description,setDescription]=useState('');
    const [tasks,setTasks]=useState([]); 
    const [dueDate,setDueDate]=useState(''); 
    const timestamp = new Date().toDateString();
    const [open2, setOpen2] = useState(false);
    const [selectedValue, setSelectedValue] = useState([1]);
    
     const mounted = useMounted();
    const [purchaseDate, setPurchaseDate] = useState((''));
  
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


  const handleDetailsUpdate = debounce(async (update) => {
    try {
      await dispatch(updateCard(card.id, update));
      toast.success('Card updated!');
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong!');
    }
  }, 1000);

  const handleSubscribe = async () => {
    try {
      await dispatch(updateCard(card.id, { isSubscribed: true }));
      toast.success('Unsubscribed!');
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong!');
    }
  };

  const handleUnsubscribe = async () => {
    try {
      await dispatch(updateCard(card.id, { isSubscribed: false }));
      toast.success('Subscribed!');
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong!');
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteCard(card.id));
      toast.success('Card archived!');
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong!');
    }
  };

  const handleOpen = () => {
    setOpen2(true);
  };

  const handleClose = () => {
    setOpen2(false);
  };


   const updatecolumnID = async () => {
  const newTask = {
       "id":card.id,
       "name": card.name,
       "columnId":card.columnId,
       "dueDate":card.dueDate,
      
       "description":card.description,
       "createdAt" : timestamp
  }
   getTasks()
  return await propertiesApi.updateTasks(newTask)
 
}

   const saveTasks= async () => {
    const user = await Auth.currentAuthenticatedUser({
      bypassCache: false  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    });
    const newTask= {
      
      "name": name,
      
      "userId": user.username,
      "dueDate":dueDate,
      "description":description,
      "createdAt" : timestamp
    
    }
    user['id'] = await propertiesApi.saveTasks(newTask);

  }


  const handleAddChecklist = async () => {
    try {
      await dispatch(addChecklist(card.id, 'Untitled Checklist'));
      toast.success('Checklist added!');
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong!');
    }
  };

  const deleteTask = async () => {
    const taskk = {
      "id":card.id,
    };
     await propertiesApi.deleteTasks(taskk).then(toast.success("Successfully deleted"),
     handleClose)
    .catch(err => {
     toast.error('Unexpected error while deleting, try again', err);
    });
  };

  return (
    <Formik
      initialValues={{
        
        name: name,
      
        Description: description,
        
        comment: comment,
       
        submit: null
      }}
      validationSchema={Yup
        .object()
        .shape({
   
          Name: Yup.string(),
          Description: Yup.string(),
          Comment: Yup.string()
          
        })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          // Call API to store step data in server session
          // It is important to have it on server to be able to reuse it if user
          // decides to continue later.
      
          updatecolumnID(); 
          
          setStatus({ success: true });
          setSubmitting(false);

         
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
    <Dialog
      fullWidth
      maxWidth="md"
      onClose={onClose}
      open={open}
      {...other}
    >
      <Box sx={{ p: 3 }}>
        <Grid
          container
          spacing={5}
        >
          <Grid
            item
            sm={8}
            xs={12}
          >
            <TextField
              defaultValue={card.name}
               error={Boolean(touched.Name && errors.Name)}
                fullWidth
                helperText={touched.Name && errors.Name}
               
                onBlur={handleBlur}
                required={false}
               
                onChange={(e) => {
                  setName(e.target.value)
                values.Name=e.target.value
                }}
                value={values.Name}
                variant="outlined"
            />
            
            <Box sx={{ mt: 2 }}/>
                <TextField
                defaultValue={card.description}
                error={Boolean(touched.Description && errors.Description)}
                fullWidth
                helperText={touched.Description && errors.Description}
                label="Description"
                name="Description"
                onBlur={handleBlur}
                required={false}
               
                onChange={(e) => {
                  setDescription(e.target.value)
                values.Description=e.target.value
                }}
                value={values.Description}
                variant="outlined"

              />
 <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  mt: 2
                }}
              >
              </Box>
                <Box sx={{ mr: 2 }}>
                <MobileDatePicker
                          label="Due Date"
                          onAccept={date => {
                            setDueDate(date.toLocaleDateString());
                            values.purchaseDate = date;
                            setFieldTouched('=DueDate');
                          }}
                          onChange={date => setFieldTouched('=DueDate',date)}
                          onClose={() => setFieldTouched('=DueDate')}
                          
                     
                          renderInput={(inputProps) => (
                            <TextField
                         
                            
                            variant="outlined"
                            required={true}
                             {...inputProps}
                            
                            />
                          )}
                          
                          name="DueDate"
                          value={values.purchaseDate}
                          
                        />
                      {Boolean(touched.purchaseDate && errors.purchaseDate) && (
                        <FormHelperText error>
                          {errors.purchaseDate} 
                        </FormHelperText>
                     
                      
                    )} 
                  </Box> 
              

              <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  mt: 2
                }}
              >
              
    
              <Box sx={{ m: 1 }}>
              <Button
                    color="primary"
                    disabled={isSubmitting}
                    type="submit"
                    variant="contained"
                    onClick={handleSubmit}
                    >
                      Save
                </Button>
              </Box>

            <Box sx={{ ml: 2 ,mt:-1, m:1}}>
            <Button
              sx={{ color: 'red'}}
              onClick={() => {
                                    
                setOpen2(true);
              }}
              
              >
       
          Delete 
        </Button>
        <Dialog selectedValue={selectedValue}
                            open={open2}
                            onClose={handleClose}
                            BackdropProps={{ style: { backgroundColor: "transparent" } 
                            }}>

        <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          p: 3
        }} >
        <Box
          sx={{
            display: 'flex',
            pb: 2,
            pt: 3,
            px: 3
          }}
        >
          <Avatar
            sx={{
              backgroundColor: (theme) => alpha(theme.palette.error.main, 0.08),
              color: 'error.main',
              mr: 2
            }}
          >
            <WarningIcon />
          </Avatar>
          <Box>
            <Typography
              color="textPrimary"
              variant="h5"
            >
              Delete
            </Typography>
            <Typography
              color="textSecondary"
              sx={{ mt: 1 }}
              variant="body2"
            >
              Are you sure you want to delete your task? All of
              your data will be permanently removed.
              This action cannot be undone.
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            px: 3,
            py: 1.5
          }}
        >
          <Button
            color="primary"
            sx={{ mr: 2 }}
            variant="outlined"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            sx={{
              backgroundColor: 'error.main',
              '&:hover': {
                backgroundColor: 'error.dark'
              }
            }}
            variant="contained"
            onClick = {deleteTask}
          >
            Delete
          </Button>
        </Box>
        </Box>
        </Dialog>
        </Box>
            
        </Box>
          </Grid>
          <Grid
            item
            xs={12}
            sm={4}
          >
           
            
            <Box sx={{ mt: 3 }}>
              <Typography
                color="textPrimary"
                component="h4"
                sx={{
                  fontWeight: 600,
                  mb: 2
                }}
                variant="overline"
              >
                Actions
              </Typography>
              <KanbanCardAction
                disabled
                icon={<ArrowRightIcon fontSize="small" />}
              >
                Move
              </KanbanCardAction>
              <KanbanCardAction
                disabled
                icon={<DuplicateIcon fontSize="small" />}
              >
                Copy
              </KanbanCardAction>
              <KanbanCardAction
                disabled
                icon={<TemplateIcon fontSize="small" />}
              >
                Make Template
              </KanbanCardAction>
              <Divider sx={{ my: 2 }} />
              {card.isSubscribed
                ? (
                  <KanbanCardAction
                    icon={<EyeOffIcon fontSize="small" />}
                    onClick={handleUnsubscribe}
                  >
                    Unwatch
                  </KanbanCardAction>
                )
                : (
                  <KanbanCardAction
                    icon={<EyeIcon fontSize="small" />}
                    onClick={handleSubscribe}
                  >
                    Watch
                  </KanbanCardAction>
                )}
              <KanbanCardAction
                icon={<ArchiveIcon fontSize="small" />}
                onClick={handleDelete}
              >
                Archive
              </KanbanCardAction>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Dialog>
  </form>
    )}
    </Formik>
  );
};

KanbanCardModal.propTypes = {
  card: PropTypes.object.isRequired,
  column: PropTypes.object.isRequired,
  onClose: PropTypes.func,
  open: PropTypes.bool
};

KanbanCardModal.defaultProps = {
  open: false
};

export default KanbanCardModal;
