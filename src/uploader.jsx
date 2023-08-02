import 'react-dropzone-uploader/dist/styles.css'

import Dropzone from "react-dropzone-uploader";
import httpService from "./httpService";
import React from "react";
import Modal from "react-modal";
import { useState } from "react";

const Uploader = () => {
  const [imagePaths, setImagePaths] = useState([]);
  const [uploaded, setUploaded] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [points, setPoints] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [changed,setChanged] = useState(false)
  const [change,setChange] = useState(false)
  const [labels,setLabels] = useState({})
  const [index,setIndex] = useState(0)
  const [selectedPath,setSelectedPath] = useState("")
  const closeModal = () => {
    setModalIsOpen(false);
  };


  const handleImageClick = (event) => {
    const rect = event.target.getBoundingClientRect();
    console.log(rect)
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    console.log(x,y)
    setPoints([...points, { x, y }]);
  };

  const handleSavePoints = () =>{

    var new_coordinates = labels
    console.log(selectedPath)
    new_coordinates[selectedPath.split('_frame_')[0]][index]["coordinates"] = points
    setLabels(new_coordinates)

  }
  const handleResetPoints = () =>{
    var new_coordinates = labels
    var empty_points = []
    console.log(selectedPath)
    new_coordinates[selectedPath.split('_frame_')[0]][index]["coordinates"] = empty_points
    setLabels(new_coordinates)

    setPoints(empty_points)
  }

  // Function to save the dataURL
  const saveDataURL = (dataURL,filepath,index) => {
    // Your logic to save the dataURL goes here
    console.log("DATAURL")
    console.log(dataURL)
    console.log(typeof(dataURL))
    setSelectedImage(dataURL)
    console.log('DataURL to save:', dataURL);
    //send image path here in order to access the coordinates array
    console.log('Path of selected image',filepath)
    setSelectedPath(filepath)
    setPoints(labels[filepath.split('_frame_')[0]][index]["coordinates"])
    setIndex(index)
    setModalIsOpen(true);
    console.log(points)
  };

  const Base64ImageDecoder = ({ base64Image,onImageClick,filepath,index}) => {
    // Create a data URL from the Base64 image string
    const dataURL = `data:image/jpeg;base64,${base64Image}`;
    const handleImageClick = () => {
      onImageClick(dataURL,filepath,index);
    };
    return (
      <div>
        <img src={dataURL} alt="Decoded Image" onClick={handleImageClick} className="rounded"/>
        <div className="gap">

        </div>
      </div>
    );
  };
const handleExport = async () => {
   httpService.post(
    "http://127.0.0.1:5000/get_csv",
    labels,
    
  ).then((response) => {
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  })
  .catch((error) => console.error('Error downloading CSV:', error));


  
}
  const getUploadParams = ({ meta }) => {
    
    return { url: "https://httpbin.org/post" };
    
  };

  // called every time a file's `status` changes
  const handleChangeStatus = ({ meta, file }, status) => {
    console.log(status, meta, file);
  };

  const handleReupload = () =>{
    setUploaded(false)
  }

  // receives array of files that are done uploading when submit button is clicked
  const handleSubmit = async (files) => {
    console.log(files.map((f) => f.meta));
    console.log(files);
    console.log(typeof files[0]);
    const formData = new FormData();
    for (const file of files) {
      console.log("FILE");
      console.log(file);
      console.log(file["file"]);
      formData.append("videos", file.file);
    }
    formData.append("sample_rate", 15);
    console.log(formData);
    const response = await httpService.post(
      "http://127.0.0.1:5000/extract_images",
      formData
    );
    const image_response = await httpService.get(
      "http://127.0.0.1:5000/get_images"
    );
    console.log("Image recevied:", image_response);
    console.log(image_response.data.images);
    console.log("IMAGE PATHS:", imagePaths);
    const coordinates =[]
    const groupedData = {};
    image_response.data.images.forEach((item) => {
      
      const videoName = item["filename"].split('_frame_')[0]; // Extract the video name
      if (!groupedData[videoName]) {
        groupedData[videoName] = []; // Create an empty list for each video
      }
      groupedData[videoName].push({ image:item["data"], path: item["filename"] ,coordinates: []});
    });
    console.log(groupedData)

    setImagePaths(image_response.data.images); // Assuming the response.data is the list of image paths from the backend
    setLabels(groupedData)
    setUploaded(true);
  };

  return (
    <React.Fragment>

      {!uploaded && (
        <Dropzone
          getUploadParams={getUploadParams}
          onChangeStatus={handleChangeStatus}
          onSubmit={handleSubmit}
          accept="video/*"
        />
      )}
      <div>

      <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
        <h2>Label Points</h2>
        <button type="button" className="btn btn-primary" onClick = {handleSavePoints}>Save Points to CSV</button>
        <button type="button" className="btn btn-primary" style={{marginLeft:"10px"}} onClick = {handleResetPoints}>Reset</button>

        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '400px', // Adjust this based on your image height
          }}
          onClick={handleImageClick}
        >
          <img src={selectedImage} alt="Label Image" />
          {points.map((point, index) => (
            <div
              key={index}
              style={{
                position: 'absolute',
                top: point.y,
                left: point.x,
                backgroundColor: 'red',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
              }}
            />
          ))}
        </div>
      </Modal>
      <span className='text-bg-light p-3"'>
      {uploaded && (
            <button
              className="btn btn-primary"
              onClick={handleReupload}
            >
              Reupload
            </button>
            
          )}{uploaded && 
            <button
            className="btn btn-primary"
            style={{marginLeft:"10px"}}
            onClick={handleExport}
          >
            Export to CSV 
          </button>


          }

      </span>


        <div className='d-flex justify-content-center' style={{marginTop:'50px'}}>
            {console.log(labels)}

{uploaded &&
          <div>
            {
              Object.keys(labels).map((video_obj,video_index)=>{
                return labels[video_obj].map((img, img_index)=>{

                  return (<React.Fragment>
                  <span className="d-flex-row">
                  <h3>{img["path"]}</h3>
                                  </span>
                  {labels[img["path"].split('_frame_')[0]][img_index]["coordinates"].length===0 ? <span key={img_index} class="badge text-bg-danger">Unlabelled</span>:<span key={img_index} class="badge text-bg-success">Labelled</span>}
                    
                <Base64ImageDecoder key={img_index} base64Image={img["image"]} onImageClick={saveDataURL} filepath ={img["path"]} index = {img_index}/>
                </React.Fragment> )
                })
              })
            }
          </div>
          }
        </div>
      </div>
    </React.Fragment>
  );
};

export default Uploader;