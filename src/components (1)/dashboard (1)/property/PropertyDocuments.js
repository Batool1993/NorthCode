import PropTypes from 'prop-types';
import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardHeader,
  TableRow, 
  Tooltip,
  IconButton,
  TableCell, 
  Table, 
  Box,
} from '@material-ui/core';
import { useState, useRef, useEffect } from 'react';
import wait from '../../../utils/wait';
import XIcon from '../../../icons/X';
import toast from 'react-hot-toast';
import  {Storage} from "aws-amplify";
import FileDropzoneDocuments from '../../FileDropzoneDocuments';
import { v4 as uuid } from "uuid";
import { propertiesApi } from "../../../api/PropertiesApi";
import { Auth } from 'aws-amplify';

const PropertyDocuments = (props) => {
  const {tenant, tenancy, property,  ...other } = props;
  const [mounted, setMounted]= useState(false); 
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState([1]);
  const [files, setFiles] = useState([]);
  const [uploadFileName, setUploadFileName] = useState('');
  const [documents, setDocuments] = useState([]);
  const [something, setSomething] = useState('');

  const getDocuments = async () => {
    setMounted(true)
    try {
      const data = await propertiesApi.getDocuments();
      setDocuments(data);
     
    } catch (err) {
      console.error(err);
    }
  };
  if(!mounted){
    getDocuments();
  }



  
  const upload_to_s3 = async (fileName, file, displayName) => {
    await Storage.put(fileName, file).then((res) => {
     saveDocument(fileName, displayName).then(toast.success("Successfully uploaded"))
     handleRemoveAll();
     getDocuments();
    })
    .catch(err => {
     toast.error('Unexpected error while uploading, try again', err);
    });  
  }
  const uploadFile = async (evt) => {
    const file = files[0];
    const name = uuid() +"-"+file.name;
    const displayName = file.name;
    documents.name = name;
    upload_to_s3(name, file, displayName)
      }

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
          
      
  async function downloadFile(items) {
    console.log(items)
    //const name = items.target.innerHTML
    const result =  await Storage.get(items, { download: true });
    downloadBlob(result.Body, items);
  }

  const saveDocument = async (fileName, displayName) => {
    const user = await Auth.currentAuthenticatedUser({
      bypassCache: false  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    });
    const documents = {

      "userId": user.username,
      "propertyId" : property.id,
      "name": fileName,
      "displayName": displayName

    }
    documents['id'] = await propertiesApi.saveDocument(documents);
    getDocuments();
  }

  const deleteDocument = async (items) => {
    const propertyy = {
      id: items,
    };
     await propertiesApi.deleteDocument(propertyy).then(toast.success("Successfully deleted"))
     getDocuments()
    .catch(err => {
     toast.error('Unexpected error while deleting, try again', err);
    });
  };

  const handleDrop = (newFiles) => {
    setFiles(newFiles);
  };

  const handleRemove = (file) => {
    console.log('or her')
    setFiles((prevFiles) => prevFiles.filter((_file) => _file.path
      !== file.path));
  };

  const handleRemoveAll = () => {
    console.log('ehr')
    setFiles([]);
  };

  const handleOpen = () => {
      setOpen(true);
    };

  const handleClose = () => {
      setOpen(false); 
    };

  return (
    <Card {...other}>
         
      <CardHeader
        sx={{ pb: 0 }}
        title="Miscellaneous Documents"
        titleTypographyProps={{ variant: 'overline' }}
      />
      <CardContent sx={{ pt: 0 }}>
      <Box sx={{ m: -1, }}>
                <Table  >
                 
                 <TableCell > 
                <FileDropzoneDocuments
                  accept="image/*"
                  files={files}
                  onDrop={handleDrop}
                  onRemove={handleRemove}
                  onRemoveAll={handleRemoveAll}
                  //onClick={uploadFile}
                  onClick={evt => {uploadFile(evt)}}
                />
                </TableCell>
                
            </Table>
          </Box>

     {documents.map((items) => (
       
       <> 
      {(property.id == items.propertyId) &&
       <Table>
       <TableRow>
        <TableCell align = 'left'>
          <Button  onClick={() => downloadFile(items.name)}>
          {(items.displayName)}
            </Button> 
         </TableCell>
         <TableCell align="right"> 
           <Tooltip title="Remove">
            <IconButton
              edge="end"
              onClick={() => deleteDocument(items.id)}
            >
              <XIcon fontSize="small" sx={{ color: 'red'}} />
            </IconButton>
          </Tooltip> 
        </TableCell>
       </TableRow>        
       </Table>
               
      }
                
       </>         
     ))}

      
      </CardContent>
    </Card>
  );
};


export default PropertyDocuments;
