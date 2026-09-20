//import hook react
import React, { useEffect, useState, useRef } from "react";

//import react router dom
import { Link, useParams } from "react-router-dom";

//import layout web
import LayoutWeb from "../../../layouts/Web";

//import BASE URL API
import Api from "../../../api";

//import imageGallery
import ImageGallery from "react-image-gallery";

//import imageGallery CSS
import "react-image-gallery/styles/css/image-gallery.css";

//import mapbox gl
import mapboxgl from "mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax

//api key mapbox
mapboxgl.accessToken = import.meta.env.VITE_APP_MAPBOX;

function WebPlaceShow() {

    //state place
    const [place, setPlace] = useState({});

    //map container
    const mapContainer = useRef(null);

    //slug params
    const { slug } = useParams();

    //function "fetchDataPlace"
    const fetchDataPlace = async () => {

        //fetching Rest API
        await Api.get(`/api/web/places/${slug}`)
            .then((response) => {

                //set data to state "places"
                setPlace(response.data.data);

                //set title from state "category"
                document.title = `${response.data.data.title} - Website Wisata Berbasis GIS (Geographic Information System)`;
            });
    };

    //hook
    useEffect(() => {

        //call function "fetchDataPlace"
        fetchDataPlace();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    //=================================================================
    // react image gallery
    //=================================================================

    //define image array
    const images = [];

    //function "placeImages"
    const placeImages = () => {

        //loop data from object "place"
        for (let value in place.images) {

            //define image
            let image = place.images[value].image;

            //check image URL
            if (!image.startsWith("http://") && !image.startsWith("https://")) {
                image = `${import.meta.env.VITE_APP_BASEURL}/storage/places/${image}`;
            }

            //push to image array
            images.push({
                original: image,
                thumbnail: image,
            });
        }
    };

    //call function "placeImages"
    placeImages();

    //=================================================================
    // mapbox
    //=================================================================

    //function "initMap"
    const initMap = () => {

        //check map container and coordinate
        if (
            !mapContainer.current ||
            !place.longitude ||
            !place.latitude
        ) {
            return;
        }

        //init Map
        const map = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [
                Number(place.longitude),
                Number(place.latitude),
            ],
            zoom: 15,
        });

        //init popup
        new mapboxgl.Popup({
                closeOnClick: false
            })
            .setLngLat([
                Number(place.longitude),
                Number(place.latitude),
            ])
            .setHTML(
                `<h6>${place.title}</h6><hr/><p><i>${place.address}</i></p>`
            )
            .addTo(map);

        return map;
    };

    //hook mapbox
    useEffect(() => {

        //check data place
        if (!place.longitude || !place.latitude) {
            return;
        }

        //call function "initMap"
        const map = initMap();

        //cleanup map
        return () => {
            if (map) {
                map.remove();
            }
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [place.longitude, place.latitude]);

    return (
        <React.Fragment>
            <LayoutWeb>

                <div className="container mt-80">

                    <div className="row">

                        <div className="col-md-7 mb-4">

                            <div className="card border-0 rounded shadow-sm">

                                <div className="card-body">

                                    <h4>{place.title}</h4>

                                    <span className="card-text">
                                        <i className="fa fa-map-marker"></i>{" "}
                                        <i>{place.address}</i>
                                    </span>

                                    <hr />

                                    <ImageGallery
                                        items={images}
                                        autoPlay={true}
                                    />

                                    <div className="mt-4">

                                        <div
                                            ref={mapContainer}
                                            className="map-container"
                                            style={{ height: "350px" }}
                                        />

                                        <div className="d-grid gap-2">

                                            <Link
                                                to={`/places/${place.slug}/direction?longitude=${place.longitude}&latitude=${place.latitude}`}
                                                className="float-end btn btn-success btn-block btn-md mt-3"
                                            >
                                                <i className="fa fa-location-arrow"></i> OPEN DIRECTION
                                            </Link>

                                        </div>

                                    </div>

                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: place.description
                                        }}
                                    />

                                </div>

                            </div>

                        </div>

                        <div className="col-md-5 mb-4">

                            <div className="card border-0 rounded shadow-sm">

                                <div className="card-body">

                                    <h5>
                                        <i className="fa fa-map-marked-alt"></i> MAPS
                                    </h5>

                                    <hr />

                                    <div className="card-body">

                                        <div className="row">

                                            <div className="col-md-2 col-2">
                                                <div className="icon-info-green">
                                                    <i className="fa fa-map-marker-alt"></i>
                                                </div>
                                            </div>

                                            <div className="col-md-10 col-10">

                                                <div className="capt-info fw-bold">
                                                    ADDRESS
                                                </div>

                                                <div className="sub-title-info">
                                                    <i>{place.address}</i>
                                                </div>

                                            </div>

                                            <div className="col-md-2 col-2">
                                                <div className="icon-info-green">
                                                    <i className="fa fa-clock"></i>
                                                </div>
                                            </div>

                                            <div className="col-md-10 col-10">

                                                <div className="capt-info fw-bold">
                                                    OFFICE HOURS
                                                </div>

                                                <div className="sub-title-info">
                                                    {place.office_hours}
                                                </div>

                                            </div>

                                            <div className="col-md-2 col-2">
                                                <div className="icon-info-green">
                                                    <i className="fa fa-phone"></i>
                                                </div>
                                            </div>

                                            <div className="col-md-10 col-10">

                                                <div className="capt-info fw-bold">
                                                    PHONE
                                                </div>

                                                <div className="sub-title-info">
                                                    {place.phone}
                                                </div>

                                            </div>

                                            <div className="col-md-2 col-2">
                                                <div className="icon-info-green">
                                                    <i className="fa fa-globe-asia"></i>
                                                </div>
                                            </div>

                                            <div className="col-md-10 col-10">

                                                <div className="capt-info fw-bold">
                                                    WEBSITE
                                                </div>

                                                <div className="sub-title-info">

                                                    <a
                                                        href={place.website}
                                                        className="text-decoration-none"
                                                    >
                                                        {place.website}
                                                    </a>

                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </LayoutWeb>
        </React.Fragment>
    );
}

export default WebPlaceShow;