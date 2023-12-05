import { useState,useCallback,useEffect } from 'react';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import { Box, Button, TextField } from '@material-ui/core';
import { createCard } from '../../../slices/kanban';
import { useDispatch } from '../../../store';
import { Auth } from 'aws-amplify';
import { propertiesApi } from '../../../api/PropertiesApi';
import * as Yup from 'yup';
import { Formik } from 'formik';
import useMounted from '../../../hooks/useMounted';
import KanbanCard from './KanbanCard'



const KanbanCardAdd = (props) => {
  const { columnId, ...other } = props;
  const dispatch = useDispatch();
  const [isExpanded, setIsExpanded] = useState(false);
  const [name, setName] = useState('');
   const [task, setTask] = useState('');
const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [description,setDescription]=useState(''); 
  const [tasks,setTasks]=useState([]); 
  const timestamp = new Date().toDateString();
   const mounted = useMounted();
 
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
  const handleChange = (event) => {
    setName(event.target.value);
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
    <div {...other}>
      {isExpanded
        ? (
          <>
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
          {...other}
        >
            
                <TextField
                error={Boolean(touched.Name && errors.Name)}
                fullWidth
                helperText={touched.Name && errors.Name}
                label="Title"
                name="Title"
                onBlur={handleBlur}
                required={true}
               
                onChange={(e) => {
                  setName(e.target.value)
                values.Name=e.target.value
                }}
                value={values.Name}
                variant="outlined"

              />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                py: -9
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
                Auuuu
                
              </Button>
            </Box>
            </form>
      )}
      </Formik>
          </>
        )
        : (
          
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center'
            }}
          >
          {columnId==='5e849c39325dc5ef58e5a5db'?(
            <Button
              color="primary"
              sx={{py:3}}
              onClick={handleAddInit}
              variant="text"
            >
              Add Task
            </Button>):("")}
          </Box>
        )}
    </div>
  );
};

KanbanCardAdd.propTypes = {
  columnId: PropTypes.string.isRequired
};

export default KanbanCardAdd;