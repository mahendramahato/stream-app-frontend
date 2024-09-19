import React, { useState } from "react"
import videoLogo from "../assets/upload.png"
import { Button, Card, Label, Textarea, TextInput, Progress, Alert } from "flowbite-react"
import axios from "axios";
import toast from "react-hot-toast";

export default function VideoUpload() {

    const [selectedFile, setSelectedFile] = useState(null);
    const [meta, setMeta] = useState({
        title: "",
        description: "",
    });
    const [progress, setProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");

    function handleFileChange(event) {
        console.log(event.target.files[0]);
        setSelectedFile(event.target.files[0]);
    }

    function formFieldChange(event){
        setMeta({
            ...meta ,
            [event.target.name] : event.target.value,
        });
    }

    function handleForm(formEvent) {

        formEvent.preventDefault();
        if(!selectedFile){
            alert("Please select a file !!!");
            return;  
        }

        saveVideoToServer(selectedFile, meta);
        // console.log(formEvent.target.title.value);
        // console.log(formEvent.target.description.value);
        // console.log(meta);
    }

    function resetForm() {
        setMeta({
            title: "",
            description: "",
        });
        setSelectedFile(null);
        setUploading(false);
        //setMessage("");
    }


    // submit file to server
    async function saveVideoToServer(video, videoMetaData) {
        setUploading(true);

        // api call
        try{

            let formData = new FormData();
            formData.append("title", videoMetaData.title);
            formData.append("description", videoMetaData.description);
            formData.append("file", selectedFile);

            let response = await axios.post(
                    `http://localhost:8080/api/v1/videos`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: (ProgressEvent) => {
                    const progress = Math.round(
                        (ProgressEvent.loaded * 100) / ProgressEvent.total
                    );
                    
                    console.log(progress);
                    setProgress(progress);
                    //console.log(ProgressEvent);
                    
                },
            });

            console.log(response);
            setProgress(0);

            setMessage("File uploaded successfully");
            setUploading(false);
            toast.success("File uploaded successfully !!!");
            resetForm();
        }catch(error){
            console.log(error);
            setMessage("Error uploading file");
            setUploading(false);
            toast.error("File not uploaded !!!");
        }

        
    }

    return (
        <div className="text-white">

            <Card className="flex flex-col items-center justify-center">
                <h1>Upload Videos</h1>
                <div>

                    <form className="flex flex-col space-y-6" onSubmit={handleForm} >
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="file-upload" value="Video Title" />
                            </div>
                            <TextInput 
                                value={meta.title} 
                                onChange={formFieldChange} 
                                name="title" 
                                placeholder="Enter title" 
                                id="file-upload" />
                        </div>

                        <div className="max-w-md">
                            <div className="mb-2 block">
                                <Label htmlFor="comment" value="Video Description" />
                            </div>
                            <Textarea 
                                value={meta.description}
                                onChange={formFieldChange} 
                                name="description"
                                id="comment" 
                                placeholder="Write video description..." 
                                required rows={4} />
                        </div>

                        <div className="flex items-center space-x-5 justify-center">
                            <div className="shrink-0">
                                <img className="h-16 w-16 object-cover" src={videoLogo}
                                    alt="Current profile photo" />
                            </div>
                            <label className="block">
                                <span className="sr-only">Choose Video file</span>
                                <input
                                    name="file"
                                    onChange={handleFileChange}
                                    type="file" className="block w-full text-sm text-slate-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-full file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-violet-50 file:text-violet-700
                                    hover:file:bg-violet-100
                                    "/>
                            </label>
                        </div>
                    </form>

                </div>

                <div className="">
                    {uploading && (
                        <Progress
                            color="green"
                            progress={progress} 
                            textLabel="Uploading..." 
                            size="lg" 
                            labelProgress 
                            labelText
                        />
                    )}
                </div>

                <div>
                    {message && (
                        <Alert 
                            color="success"
                            rounded
                            withBorderAccent
                            onDismiss={() => {
                                setMessage("");
                            }}
                        >
                        <span className="font-medium">Success alert!</span>
                        {message}
                        </Alert>
                    )}
                </div>

                <div className="flex justify-center">
                    <Button disabled={uploading} onClick={handleForm}>Upload</Button>
                </div>

            </Card>

        </div>
    )
}