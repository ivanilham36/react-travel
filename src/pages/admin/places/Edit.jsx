//import hook from react
import React, { useState, useEffect, useRef } from "react";

//import layout
import LayoutAdmin from "../../../layouts/Admin";

//import BASE URL API
import Api from "../../../api";

//import hook navigate dari react router dom
import { useNavigate, useParams } from "react-router-dom";

//import js cookie
import Cookies from "js-cookie";

//import toats
import toast from "react-hot-toast";

//import react Quill
import ReactQuill from "react-quill";

// quill CSS
import "react-quill/dist/quill.snow.css";

//mapbox gl
import mapboxgl from "mapbox-gl";

//mapbox gl geocoder
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";

//api key mapbox
mapboxgl.accessToken = import.meta.env.VITE_APP_MAPBOX;

function PlaceEdit() {

    //title page
    document.title = "Edit Place - Administrator Travel GIS";

    //state form
    const [title, setTitle] = useState("");
    const [categoryID, setCategoryID] = useState("");
    const [description, setDescription] = useState("");
    const [phone, setPhone] = useState("");
    const [website, setWebsite] = useState("");
    const [office_hours, setOfficeHours] = useState("");
    const [address, setAddress] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");

    //state image array / multiple
    const [images, setImages] = useState([]);

    //state categories
    const [categories, setCategories] = useState([]);

    //state validation
    const [validation, setValidation] = useState({});

    //token
    const token = Cookies.get("token");

    //navigate
    const navigate = useNavigate();

    //get ID from parameter URL
    const { id } = useParams();

    //map container
    const mapContainer = useRef(null);

    //map instance
    const mapRef = useRef(null);

    //marker instance
    const markerRef = useRef(null);

    //function "fetchCategories"
    const fetchCategories = async () => {

        await Api.get("/api/web/categories")
            .then((response) => {

                setCategories(response.data.data);

            });
    };

    //function "getPlaceById"
    const getPlaceById = async () => {

        await Api.get(`/api/admin/places/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {

                setTitle(response.data.data.title);
                setCategoryID(response.data.data.category_id);
                setDescription(response.data.data.description);
                setPhone(response.data.data.phone);
                setWebsite(response.data.data.website);
                setOfficeHours(response.data.data.office_hours);
                setAddress(response.data.data.address);
                setLatitude(response.data.data.latitude);
                setLongitude(response.data.data.longitude);

            });
    };

    //hook
    useEffect(() => {

        fetchCategories();
        getPlaceById();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    //function "handleFileChange"
    const handleFileChange = (e) => {

        const selectedFiles = Array.from(e.target.files);

        if (selectedFiles.length === 0) {
            setImages([]);
            return;
        }

        const invalidFile = selectedFiles.find(
            (image) => !image.type.startsWith("image/")
        );

        if (invalidFile) {

            setImages([]);

            toast.error("Format File not Supported!", {
                duration: 4000,
                position: "top-right",
                style: {
                    borderRadius: "10px",
                    background: "#333",
                    color: "#fff",
                },
            });

            return;
        }

        setImages(selectedFiles);
    };

    //function "updatePlace"
    const updatePlace = async (e) => {

        e.preventDefault();

        setValidation({});

        const formData = new FormData();

        formData.append("title", title);
        formData.append("category_id", categoryID);
        formData.append("description", description);
        formData.append("phone", phone);
        formData.append("website", website);
        formData.append("office_hours", office_hours);
        formData.append("address", address);
        formData.append("latitude", latitude);
        formData.append("longitude", longitude);

        //Laravel method spoofing
        formData.append("_method", "PATCH");

        //append image files
        images.forEach((image) => {
            formData.append("image[]", image, image.name);
        });

        await Api.post(`/api/admin/places/${id}`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(() => {

                toast.success("Data Updated Successfully!", {
                    duration: 4000,
                    position: "top-right",
                    style: {
                        borderRadius: "10px",
                        background: "#333",
                        color: "#fff",
                    },
                });

                navigate("/admin/places");

            })
            .catch((error) => {

                console.log("STATUS:", error.response?.status);
                console.log("RESPONSE DATA:", error.response?.data);
                console.log(
                    "VALIDATION ERRORS:",
                    error.response?.data?.errors
                );

                if (error.response && error.response.data) {
                    setValidation(error.response.data);
                }

                toast.error(
                    error.response?.data?.message ||
                    "Update Place gagal!",
                    {
                        duration: 5000,
                        position: "top-right",
                        style: {
                            borderRadius: "10px",
                            background: "#333",
                            color: "#fff",
                        },
                    }
                );

            });
    };

    //=========================================================
    //MAPBOX
    //=========================================================

    useEffect(() => {

        //wait until map container exists
        if (!mapContainer.current) {
            return;
        }

        //wait until coordinates are available
        if (
            latitude === "" ||
            longitude === "" ||
            latitude === null ||
            longitude === null
        ) {
            return;
        }

        const lat = Number(latitude);
        const lng = Number(longitude);

        if (Number.isNaN(lat) || Number.isNaN(lng)) {
            return;
        }

        //remove previous map
        if (mapRef.current) {
            mapRef.current.remove();
            mapRef.current = null;
            markerRef.current = null;
        }

        //init map
        const map = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/streets-v12",
            center: [lng, lat],
            zoom: 15,
        });

        mapRef.current = map;

        //init marker
        const marker = new mapboxgl.Marker({
            draggable: true,
            color: "rgb(47 128 237)",
        })
            .setLngLat([lng, lat])
            .addTo(map);

        markerRef.current = marker;

        //marker drag
        marker.on("dragend", function (e) {

            setLatitude(e.target._lngLat.lat);
            setLongitude(e.target._lngLat.lng);

        });

        //init geocoder
        const geocoder = new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            marker: false,
            mapboxgl: mapboxgl,
        });

        map.addControl(geocoder);

        //geocoder result
        geocoder.on("result", function (e) {

            const [newLng, newLat] = e.result.center;

            marker.setLngLat([newLng, newLat]);

            map.flyTo({
                center: [newLng, newLat],
                zoom: 15,
            });

            setLatitude(newLat);
            setLongitude(newLng);

        });

        //cleanup
        return () => {

            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
                markerRef.current = null;
            }

        };

    }, [latitude, longitude]);

    return (
        <React.Fragment>

            <LayoutAdmin>

                <div className="row mt-4 mb-4">

                    <div className="col-12">

                        <div className="card border-0 rounded shadow-sm border-top-success">

                            <div className="card-header">

                                <span className="font-weight-bold">
                                    <i className="fa fa-map-marked-alt"></i> EDIT PLACE
                                </span>

                            </div>

                            <div className="card-body">

                                <form onSubmit={updatePlace}>

                                    <div className="mb-3">

                                        <label className="form-label fw-bold">
                                            Image (<i>select many file</i>)
                                        </label>

                                        <input
                                            type="file"
                                            className="form-control"
                                            onChange={handleFileChange}
                                            multiple
                                            accept="image/*"
                                        />

                                    </div>

                                    <div className="mb-3">

                                        <label className="form-label fw-bold">
                                            Title
                                        </label>

                                        <input
                                            type="text"
                                            className="form-control"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="Enter Title Place"
                                        />

                                    </div>

                                    {validation.title && (
                                        <div className="alert alert-danger">
                                            {validation.title[0]}
                                        </div>
                                    )}

                                    <div className="row">

                                        <div className="col-md-6">

                                            <div className="mb-3">

                                                <label className="form-label fw-bold">
                                                    Category
                                                </label>

                                                <select
                                                    className="form-select"
                                                    value={categoryID}
                                                    onChange={(e) =>
                                                        setCategoryID(e.target.value)
                                                    }
                                                >

                                                    <option value="">
                                                        -- Select Category --
                                                    </option>

                                                    {categories.map((category) => (
                                                        <option
                                                            value={category.id}
                                                            key={category.id}
                                                        >
                                                            {category.name}
                                                        </option>
                                                    ))}

                                                </select>

                                            </div>

                                            {validation.category_id && (
                                                <div className="alert alert-danger">
                                                    {validation.category_id[0]}
                                                </div>
                                            )}

                                        </div>

                                        <div className="col-md-6">

                                            <div className="mb-3">

                                                <label className="form-label fw-bold">
                                                    Office Hours
                                                </label>

                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={office_hours}
                                                    onChange={(e) =>
                                                        setOfficeHours(e.target.value)
                                                    }
                                                    placeholder="Enter Office Hours"
                                                />

                                            </div>

                                            {validation.office_hours && (
                                                <div className="alert alert-danger">
                                                    {validation.office_hours[0]}
                                                </div>
                                            )}

                                        </div>

                                    </div>

                                    <div className="mb-3">

                                        <label className="form-label fw-bold">
                                            Description
                                        </label>

                                        <ReactQuill
                                            theme="snow"
                                            rows="5"
                                            value={description}
                                            onChange={(content) =>
                                                setDescription(content)
                                            }
                                        />

                                    </div>

                                    {validation.description && (
                                        <div className="alert alert-danger">
                                            {validation.description[0]}
                                        </div>
                                    )}

                                    <div className="row">

                                        <div className="col-md-6">

                                            <div className="mb-3">

                                                <label className="form-label fw-bold">
                                                    Phone
                                                </label>

                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={phone}
                                                    onChange={(e) =>
                                                        setPhone(e.target.value)
                                                    }
                                                    placeholder="Enter Phone"
                                                />

                                            </div>

                                            {validation.phone && (
                                                <div className="alert alert-danger">
                                                    {validation.phone[0]}
                                                </div>
                                            )}

                                        </div>

                                        <div className="col-md-6">

                                            <div className="mb-3">

                                                <label className="form-label fw-bold">
                                                    Website
                                                </label>

                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={website}
                                                    onChange={(e) =>
                                                        setWebsite(e.target.value)
                                                    }
                                                    placeholder="Enter Website Place"
                                                />

                                            </div>

                                            {validation.website && (
                                                <div className="alert alert-danger">
                                                    {validation.website[0]}
                                                </div>
                                            )}

                                        </div>

                                    </div>

                                    <div className="mb-3">

                                        <label className="form-label fw-bold">
                                            Address
                                        </label>

                                        <textarea
                                            className="form-control"
                                            rows="3"
                                            value={address}
                                            onChange={(e) =>
                                                setAddress(e.target.value)
                                            }
                                            placeholder="Enter Address Place"
                                        ></textarea>

                                    </div>

                                    {validation.address && (
                                        <div className="alert alert-danger">
                                            {validation.address[0]}
                                        </div>
                                    )}

                                    <div className="row">

                                        <div className="col-md-6">

                                            <div className="mb-3">

                                                <label className="form-label fw-bold">
                                                    Latitude
                                                </label>

                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={latitude}
                                                    onChange={(e) =>
                                                        setLatitude(e.target.value)
                                                    }
                                                    placeholder="Enter Latitude Place"
                                                />

                                            </div>

                                            {validation.latitude && (
                                                <div className="alert alert-danger">
                                                    {validation.latitude[0]}
                                                </div>
                                            )}

                                        </div>

                                        <div className="col-md-6">

                                            <div className="mb-3">

                                                <label className="form-label fw-bold">
                                                    Longitude
                                                </label>

                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={longitude}
                                                    onChange={(e) =>
                                                        setLongitude(e.target.value)
                                                    }
                                                    placeholder="Enter Longitude Place"
                                                />

                                            </div>

                                            {validation.longitude && (
                                                <div className="alert alert-danger">
                                                    {validation.longitude[0]}
                                                </div>
                                            )}

                                        </div>

                                    </div>

                                    <div className="row mb-3">

                                        <div className="col-md-12">

                                            <div
                                                ref={mapContainer}
                                                className="map-container"
                                            />

                                        </div>

                                    </div>

                                    <div>

                                        <button
                                            type="submit"
                                            className="btn btn-md btn-success me-2"
                                        >
                                            <i className="fa fa-save"></i> UPDATE
                                        </button>

                                        <button
                                            type="reset"
                                            className="btn btn-md btn-warning"
                                        >
                                            <i className="fa fa-redo"></i> RESET
                                        </button>

                                    </div>

                                </form>

                            </div>

                        </div>

                    </div>

                </div>

            </LayoutAdmin>

        </React.Fragment>
    );
}

export default PlaceEdit;