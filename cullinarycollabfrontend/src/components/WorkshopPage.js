import React, {useState, useEffect } from 'react';
import axios from 'axios'
import './LandingPage.css';

const WorkshopPage = () => {
    const [details, setDetails] = useState([]);
    
    useEffect(() => {
	    let data;
	    axios.get('http://localhost:8000')
	    .then (res => {
		    data = res.data;
		    setDetails(data);
	    })
	    .catch(err => { });
}, []);
    return (
        <div className="landing-page">
            <h2>Workshop</h2>
	    <hr></hr>
	    {details.map((output, id) => (
		  <div key={id}>
		    <div>
		    <h3>{output.name}</h3>
		    <h4>{output.ingredients}</h4>
		    <h5>{output.instructions}</h5>
		    </div>
		  </div>
		 ))}

        </div>
    );
};

export default WorkshopPage;

