import { useEffect, useState } from "react";
import {Map,Marker,Popup} from 'react-map-gl';
import "mapbox-gl/dist/mapbox-gl.css";
import {Room,Star} from "@material-ui/icons"
import './app.css'
import axios from 'axios'
import {format} from 'timeago.js'

function App() {
  const [viewport, setViewport] = useState({
    latitude: 20.5937,
    longitude:78.9629,
    zoom: 5,
  }); 

  // const [showPopup, setShowPopup] = useState(true);
  const currentUser="Atif"
  const [pins,setPins]=useState([])
  const [currentPlaceId,setCurrentPlaceId]=useState(false)
  const [newPlace,setNewPlace]=useState(null)
  const [title,setTitle]=useState(null)
  const [desc,setDesc]=useState(null)
  const [rating,setRating]=useState(0)

  useEffect(()=>{
    const getPins=async()=>{
        try {
          const res=await axios.get('/pins');
          setPins(res.data);
        } catch (err) {
          console.log(err)
        }
    };
    getPins()
  },[])

  const handleMarkerClick=(id,lat,long)=>{
    if(currentPlaceId) setCurrentPlaceId(false);
    else setCurrentPlaceId(id);
    setViewport({...viewport,latitude:lat,longitude:long})
    
  }

  const handleAddClick=(e)=>{
    const lat=e.lngLat.lat;
    const long=e.lngLat.lng;
    setNewPlace({lat,long})
  }

  const handleSubmit=async (e)=>{
    e.preventDefault();
    const newPin={
      username:currentUser,
      title,
      desc,
      rating,
      lat: newPlace.lat,
      long:newPlace.long,
    }

    try {
        const res=await axios.post('/pins',newPin);
        setPins([...pins,res.data]);
        setNewPlace(null);
    } catch (err) {
        console.log(err);
    }
  }
  return (
    <div className="App" style={{ height: "100vh", width: "100%" }}>
     <Map
    {...viewport}
    mapboxAccessToken={process.env.REACT_APP_MAPBOX}
    onMove={viewport => setViewport(viewport)}
    mapStyle="mapbox://styles/mapbox/streets-v9"
    onDblClick={handleAddClick}
    >
      
      {pins.map(p=>(

        <>
          <Marker latitude={p.lat} longitude={p.long}   >
              <Room style={{fontSize:viewport.zoom * 6 ,color:p.username===currentUser?"tomato":"slateblue",
              cursor:"pointer"}}
                    onClick={()=>handleMarkerClick(p._id,p.lat,p.long)}   
              />
          </Marker>
        
          {p._id===currentPlaceId && (
            
            <Popup  latitude={p.lat} longitude={p.long}
            anchor="left" closeButton={true} closeOnClick={false} onClose={()=>setCurrentPlaceId(false)}>
              <div className="card">
              <label>Place</label>
              <h4 className="place">{p.title}</h4>
              <label>Review</label>
              <p className="description">{p.desc}</p>
              <label>Rating</label>
              <div className="stars">
              <Star className="star"/>
              <Star className="star"/>
              <Star className="star"/>
              <Star className="star"/>
              <Star className="star"/>
              </div>
              <label>Information</label>
              <span className="username">Created by <b>{p.username}</b></span>
              <span className="date">{format(p.createdAt)}</span>
              </div>
            </Popup>)}
          
        </>
      ))}
        {newPlace && (
          <Popup  
          latitude={newPlace.lat} 
          longitude={newPlace.long}
          anchor="left" 
          closeButton={true} closeOnClick={false} onClose={()=>setNewPlace(null)}>

          <div>
            <form onSubmit={handleSubmit}>
                <label>Title</label>
                <input placeholder="Enter a title" 
                 onChange={(e)=>setTitle(e.target.value)}
                />
                <label>Review</label>
                <textarea placeholder="Say us something about this place"
                onChange={(e)=>setDesc(e.target.value)}
                ></textarea>
                <label>Rating</label>
                <select onChange={(e)=>setRating(e.target.value)}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <button className="submitButton" type="submit">Add Pin</button>

            </form>
          </div>

        </Popup>
        )}
    </Map>

    </div>
  );
}

export default App;
