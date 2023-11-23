import React, { useState } from 'react'

import { Upload } from "@aws-sdk/lib-storage";
import { S3Client } from "@aws-sdk/client-s3";

const cred = {
    accessKeyId: 'AKIA6I6LF3LQ4YD4GL5H',
    secretAccessKey: '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'
}

const AWSHook = () => {
    const [loading, setLoading] = useState(false)
    const [uploadedFile, setUploadedFile] = useState<Array<{file: string, url: string}>>([]);

    const fileUploadHandler = (files:FileList) => {
        setLoading(true);
        console.time('upload');

        const uploadPromises = Array.from(files).map((file) => {

            const params = {
                Bucket: 'chasescroll-videos',
                Key: file.name,
                Body: file,
                ContentType: 'application/octet-stream',
            };

            return new Promise((resolve, reject) => {
                const upload = new Upload({
                    client: new S3Client({
                        region: 'eu-west-2',
                        credentials: cred,
                    },),
                    leavePartsOnError: false,
                    params: params,
                });

                // upload.on("httpUploadProgress", (progres) => console.log(progres))

                upload.done()
                    .then(
                        (data) => resolve(data),
                        (error) => reject(error)
                    );
            });
        });

        Promise.all(uploadPromises)
            .then((results) => {
                const urls = results.map((r: any) => ({ file: r.Key, url: r.Location }));

                setUploadedFile([...urls, ...uploadedFile]);
                setLoading(false);
                console.timeEnd('upload');
            })
            .catch((error) => {
                console.error('Error uploading files:', error);
                setLoading(false);
            });
    };

    const reset = () => {
        setUploadedFile([]);
    }

    const deleteFile = (index: number) => {
        setUploadedFile(prev => prev.filter((_, i) => index !== i));
    }


    return ({ loading, uploadedFile, fileUploadHandler, reset, deleteFile })
}

export default AWSHook