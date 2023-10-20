import { Button } from '@chakra-ui/react';
import React from 'react'



function FileUploader({ onSuccess }) {
    const cloudinaryRef = React.useRef();
    const widgetRef = React.useRef()
    React.useEffect(() => {
        cloudinaryRef.current = window?.cloudinary;
        widgetRef.current = cloudinaryRef.current.createUploadWidget({
            cloudName: 'dm0jlrcft',
            uploadPreset: 'vently'
        }, function(error, result) {
            if (result?.info?.files) {
              console.log(result?.info?.files[0].uploadInfo.secure_url)
              onSuccess(result?.info?.files[0].uploadInfo.secure_url);
            }
        });
    }, [onSuccess])
  return (
    <Button color='white' width={'100%'} bg={'brand.chasescrollButttonBlue'} onClick={() => widgetRef.current.open()}>Upload</Button>
  )
}

export default FileUploader