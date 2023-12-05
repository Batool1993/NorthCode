import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';


import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography
} from '@material-ui/core';
import DuplicateIcon from '../icons/Duplicate';
import XIcon from '../icons/X';
import bytesToSize from '../utils/bytesToSize';
import AddPhotoIcon from '@material-ui/icons/AddPhotoAlternate';
const FileDropzoneProp = (props) => {
  const {
    accept,
    disabled,
    files,
    getFilesFromEvent,
    maxFiles,
    maxSize,
    minSize,
    noClick,
    noDrag,
    noDragEventsBubbling,
    noKeyboard,
    onDrop,
    onDropAccepted,
    onDropRejected,
    onFileDialogCancel,
    onRemove,
    onRemoveAll,
    onUpload,
    onClick,
    preventDropOnDocument,
    fileName,
    ...other
  } = props;
 

  // We did not add the remaining props to avoid component complexity
  // but you can simply add it if you need to.

  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept,
    maxFiles:1,
    maxSize,
    minSize,
    onDrop
  });

  
  

  return (
    
    <div {...other}>
      <Box
        sx={{
          width: 300,
        height: 120,
          alignItems: 'center',
          //border: 1,
          borderRadius: 1,
          borderColor: 'divider',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          outline: 'none',
         
          ...(isDragActive && {
            backgroundColor: 'action.active',
            opacity: 0.5
          }),
          '&:hover': {
            backgroundColor: 'action.hover',
            cursor: 'pointer',
            opacity: 0.5
          }
        }}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        
        <Box >
          <Typography
           
          >
            {` ${(maxFiles && maxFiles === 1) ? '' : ''}`}
            
          </Typography>
          <Box sx={{ mt: 2 }}>
            
               <AddPhotoIcon fontSize="small" />
              {` ${(maxFiles && maxFiles === 1) ? '' : ''}`}
              {' '}
           {/*    <Link
                color="primary"
                underline="always"
              >
                browse
              </Link> */}
              {' '}
             
          
          </Box>
        </Box>
      </Box>
      {files.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <List>
            {files.map((file) => (
              <ListItem
                key={file.path}
                sx={{
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                  '& + &': {
                    mt: 1
                  }
                }}
              >
                <ListItemIcon>
                  <DuplicateIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  sx={{
                  maxWidth: 150}}
                  primary={file.name}
                  primaryTypographyProps={{
                    color: 'textPrimary',
                    variant: 'subtitle2'
                  }}
                  secondary={bytesToSize(file.size)}
                />
                <Tooltip title="Remove">
                  <IconButton
                    edge="end"
                    onClick={() => onRemove && onRemove(file)}
                  >
                    <XIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </ListItem>
            ))}
          </List>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              mt: 1
            }}
          >
           {/*  <Button
              color="primary"
              onClick={onRemoveAll}
              size="small"
              type="button"
              variant="text"
            >
              Remove 
            </Button> */}
            <Button
              color="primary"
              onClick={onClick}
              size="small"
              sx={{ ml: 2 }}
              type="button"
              variant="contained"
              
            >
              Upload
            
            </Button> 
            

          </Box>

        </Box>
      )}
    </div>
  );
};

FileDropzoneProp.propTypes = {
  accept: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string)
  ]),
  disabled: PropTypes.bool,
  files: PropTypes.array,
  getFilesFromEvent: PropTypes.func,
  maxFiles: PropTypes.number,
  maxSize: PropTypes.number,
  minSize: PropTypes.number,
  noClick: PropTypes.bool,
  noDrag: PropTypes.bool,
  noDragEventsBubbling: PropTypes.bool,
  noKeyboard: PropTypes.bool,
  onDrop: PropTypes.func,
  onDropAccepted: PropTypes.func,
  onDropRejected: PropTypes.func,
  onFileDialogCancel: PropTypes.func,
  onRemove: PropTypes.func,
  onRemoveAll: PropTypes.func,
  onUpload: PropTypes.func,
  preventDropOnDocument: PropTypes.bool
};

FileDropzoneProp.defaultProps = {
  files: []
};

export default FileDropzoneProp;
