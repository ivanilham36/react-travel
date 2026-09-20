//import layout
import React, { useEffect, useState, useRef } from "react";

//import react router dom
import { Link, useParams, useLocation } from "react-router-dom";

//import layout web
import LayoutWeb from "../../../layouts/Web";

//import mapbox gl
import mapboxgl from 'mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

//import mapbox gl direction
import Directions from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';

//api key mapbox
mapboxgl.accessToken = import.meta.env.VITE_APP_MAPBOX;

function WebPlaceDirection() {

    //title page
    document.title = "Map Direction - TRAVEL GIS - Website Wisata Berbasis GIS (Geographic Information System)";

    //map container
    const mapContainer = useRef(null);

    //state for user location coordinate
    const [longitude, setLongitude] = useState(110.7241664);
    const [latitude, setLatitude] = useState(-6.9515962);

    //slug params
    const { slug } = useParams();

    //get query params
    const query = new URLSearchParams(useLocation().search);

    //hook
    useEffect(() => {

        //init Map
        const map = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [
                query.get("longitude"),
                query.get("latitude")
            ],
            zoom: 15
        });

        //init geolocate
        const geolocate = new mapboxgl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            },
            trackUserLocation: true,
            showUserHeading: true
        });

        //add geolocate control to the map
        map.addControl(geolocate);

        //init directions
        const directions = new Directions({
            accessToken: mapboxgl.accessToken,
            unit: 'metric',
            profile: 'mapbox/driving',

            // UI controls
            controls: {
                inputs: false,
                instructions: true
            },
        });

        //map load
        map.on('load', () => {

            //automatically activates geolocation
            geolocate.trigger();

            //geolocate event
            geolocate.on('geolocate', (position) => {

                //set value state `longitude`
                setLongitude(position.coords.longitude);

                //set value state `latitude`
                setLatitude(position.coords.latitude);

                //direction origin
                directions.setOrigin([
                    position.coords.longitude,
                    position.coords.latitude
                ]);

                //direction destination
                directions.setDestination([
                    query.get("longitude"),
                    query.get("latitude")
                ]);

            });

            //add directions to map
            map.addControl(directions);
        });

        //cleanup map
        return () => {
            map.remove();
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <React.Fragment>
            <LayoutWeb>

                <div className="container mt-80">

                    <div className="row">

                        <div className="col-md-12">

                            <div className="card border-0 rounded shadow-sm">

                                <div className="card-body">

                                    <h5>
                                        <i className="fa fa-map-marked-alt"></i> MAP DIRECTION
                                    </h5>

                                    <hr />

                                    <div
                                        ref={mapContainer}
                                        className="map-container"
                                        style={{ height: "450px" }}
                                    />

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </LayoutWeb>
        </React.Fragment>
    );
}

export default WebPlaceDirection;