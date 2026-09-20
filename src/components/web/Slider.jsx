//import react and hook
import React, { useState, useEffect } from "react";

//import component react bootstrap
import { Carousel } from 'react-bootstrap';

//import BASE URL API
import Api from "../../api";

function Slider() {

    //state sliders
    const [sliders, setSliders] = useState([]);

    //function "fetchDataSliders"
    const fetchDataSliders = async () => {

        //fetching Rest API "sliders"
        await Api.get('/api/web/sliders')
            .then((response) => {

                //set data to state
                setSliders(response.data.data);

            })
    }

    //useEffect
    useEffect(() => {

        //call function "fetchDataSliders"
        fetchDataSliders();

    }, []);

    return (
        <React.Fragment>
            <Carousel
                nextIcon={<span aria-hidden="true" className="carousel-control-next-icon" />}
                prevIcon={<span aria-hidden="true" className="carousel-control-prev-icon" />}
            >
                {
                    sliders.map((slider, index) => (
                        <Carousel.Item key={index}>
                            <img
                                className="d-block w-100"
                                src={slider.image}
                                alt={`Slide ${index}`}
                                style={{
                                    height: '500px',
                                    objectFit: 'cover'
                                }}
                            />
                        </Carousel.Item>
                    ))
                }
            </Carousel>
        </React.Fragment>
    );
}

export default Slider;