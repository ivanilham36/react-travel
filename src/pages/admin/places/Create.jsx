//import hook from react
import React, { useState, useEffect } from "react";

//import layout
import LayoutAdmin from "../../../layouts/Admin";

//import BASE URL API
import Api from "../../../api";

//import hook navigate from react router dom
import { useNavigate } from "react-router-dom";

//import js cookie
import Cookies from "js-cookie";

//import toast
import toast from "react-hot-toast";

//import react Quill
import ReactQuill from "react-quill";

// quill CSS
import "react-quill/dist/quill.snow.css";

function PlaceCreate() {

    //title page
    document.title = "Add New Place - Administrator Travel GIS";

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

    //function "fetchCategories"
    const fetchCategories = async () => {

        //fetching data from Rest API
        await Api.get("/api/web/categories")
            .then((response) => {

                //set data response to state "categories"
                setCategories(response.data.data);

            });
    };

    //hook
    useEffect(() => {

        //call function "fetchCategories"
        fetchCategories();

    }, []);

    //function "handleFileChange"
    const handleFileChange = (e) => {

        //define variable for get value image data
        const imageData = e.target.files;

        Array.from(imageData).forEach((image) => {

            //check validation file
            if (!image.type.match("image.*")) {

                setImages([]);

                //show toast
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

            } else {

                setImages([...e.target.files]);

            }

        });

    };

    //function "storePlace"
    const storePlace = async (e) => {

        e.preventDefault();

        //define formData
        const formData = new FormData();

        //append data to "formData"
        formData.append("title", title);
        formData.append("category_id", categoryID);
        formData.append("description", description);
        formData.append("phone", phone);
        formData.append("website", website);
        formData.append("office_hours", office_hours);
        formData.append("address", address);
        formData.append("latitude", latitude);
        formData.append("longitude", longitude);

        Array.from(images).forEach((image) => {
            formData.append("image[]", image);
        });

        try {

            //send data to server
            await Api.post("/api/admin/places", formData, {

                //header
                headers: {
                    //header Bearer + Token
                    Authorization: `Bearer ${token}`,
                    "content-type": "multipart/form-data",
                },

            }).then(() => {

                //show toast
                toast.success("Data Stored Successfully!", {
                    duration: 4000,
                    position: "top-right",
                    style: {
                        borderRadius: "10px",
                        background: "#333",
                        color: "#fff",
                    },
                });

                //redirect places page
                navigate("/admin/places");

            });

        } catch (error) {

            //set state "validation"
            setValidation(error.response?.data || {});

        }

    };

    return (
        <React.Fragment>

            <LayoutAdmin>

                <div className="container-fluid mt-4 mb-5">

                    <div className="row">

                        <div className="col-md-12">

                            <div className="card border-0 shadow-sm rounded">

                                <div className="card-body">

                                    <h5 className="fw-bold">
                                        ADD NEW PLACE
                                    </h5>

                                    <hr />

                                    <form onSubmit={storePlace}>

                                        <div className="row">

                                            {/* title */}
                                            <div className="col-md-6">

                                                <div className="mb-3">

                                                    <label className="form-label fw-bold">
                                                        Title
                                                    </label>

                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={title}
                                                        onChange={(e) => setTitle(e.target.value)}
                                                        placeholder="Enter Place Title"
                                                    />

                                                    {validation.title && (
                                                        <div className="alert alert-danger mt-2">
                                                            {validation.title[0]}
                                                        </div>
                                                    )}

                                                </div>

                                            </div>

                                            {/* category */}
                                            <div className="col-md-6">

                                                <div className="mb-3">

                                                    <label className="form-label fw-bold">
                                                        Category
                                                    </label>

                                                    <select
                                                        className="form-control"
                                                        value={categoryID}
                                                        onChange={(e) => setCategoryID(e.target.value)}
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

                                                    {validation.category_id && (
                                                        <div className="alert alert-danger mt-2">
                                                            {validation.category_id[0]}
                                                        </div>
                                                    )}

                                                </div>

                                            </div>

                                            {/* description */}
                                            <div className="col-md-12">

                                                <div className="mb-3">

                                                    <label className="form-label fw-bold">
                                                        Description
                                                    </label>

                                                    <ReactQuill
                                                        theme="snow"
                                                        value={description}
                                                        onChange={setDescription}
                                                    />

                                                    {validation.description && (
                                                        <div className="alert alert-danger mt-2">
                                                            {validation.description[0]}
                                                        </div>
                                                    )}

                                                </div>

                                            </div>

                                            {/* phone */}
                                            <div className="col-md-6">

                                                <div className="mb-3">

                                                    <label className="form-label fw-bold">
                                                        Phone
                                                    </label>

                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={phone}
                                                        onChange={(e) => setPhone(e.target.value)}
                                                        placeholder="Enter Phone Number"
                                                    />

                                                    {validation.phone && (
                                                        <div className="alert alert-danger mt-2">
                                                            {validation.phone[0]}
                                                        </div>
                                                    )}

                                                </div>

                                            </div>

                                            {/* website */}
                                            <div className="col-md-6">

                                                <div className="mb-3">

                                                    <label className="form-label fw-bold">
                                                        Website
                                                    </label>

                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={website}
                                                        onChange={(e) => setWebsite(e.target.value)}
                                                        placeholder="Enter Website"
                                                    />

                                                    {validation.website && (
                                                        <div className="alert alert-danger mt-2">
                                                            {validation.website[0]}
                                                        </div>
                                                    )}

                                                </div>

                                            </div>

                                            {/* office hours */}
                                            <div className="col-md-6">

                                                <div className="mb-3">

                                                    <label className="form-label fw-bold">
                                                        Office Hours
                                                    </label>

                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={office_hours}
                                                        onChange={(e) => setOfficeHours(e.target.value)}
                                                        placeholder="Enter Office Hours"
                                                    />

                                                    {validation.office_hours && (
                                                        <div className="alert alert-danger mt-2">
                                                            {validation.office_hours[0]}
                                                        </div>
                                                    )}

                                                </div>

                                            </div>

                                            {/* address */}
                                            <div className="col-md-6">

                                                <div className="mb-3">

                                                    <label className="form-label fw-bold">
                                                        Address
                                                    </label>

                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={address}
                                                        onChange={(e) => setAddress(e.target.value)}
                                                        placeholder="Enter Address"
                                                    />

                                                    {validation.address && (
                                                        <div className="alert alert-danger mt-2">
                                                            {validation.address[0]}
                                                        </div>
                                                    )}

                                                </div>

                                            </div>

                                            {/* latitude */}
                                            <div className="col-md-6">

                                                <div className="mb-3">

                                                    <label className="form-label fw-bold">
                                                        Latitude
                                                    </label>

                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={latitude}
                                                        onChange={(e) => setLatitude(e.target.value)}
                                                        placeholder="Latitude Place"
                                                    />

                                                    {validation.latitude && (
                                                        <div className="alert alert-danger mt-2">
                                                            {validation.latitude[0]}
                                                        </div>
                                                    )}

                                                </div>

                                            </div>

                                            {/* longitude */}
                                            <div className="col-md-6">

                                                <div className="mb-3">

                                                    <label className="form-label fw-bold">
                                                        Longitude
                                                    </label>

                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={longitude}
                                                        onChange={(e) => setLongitude(e.target.value)}
                                                        placeholder="Longitude Place"
                                                    />

                                                    {validation.longitude && (
                                                        <div className="alert alert-danger mt-2">
                                                            {validation.longitude[0]}
                                                        </div>
                                                    )}

                                                </div>

                                            </div>

                                            {/* images */}
                                            <div className="col-md-12">

                                                <div className="mb-3">

                                                    <label className="form-label fw-bold">
                                                        Images
                                                    </label>

                                                    <input
                                                        type="file"
                                                        className="form-control"
                                                        multiple
                                                        accept="image/*"
                                                        onChange={handleFileChange}
                                                    />

                                                    {validation.image && (
                                                        <div className="alert alert-danger mt-2">
                                                            {validation.image[0]}
                                                        </div>
                                                    )}

                                                </div>

                                            </div>

                                        </div>

                                        <div className="mt-4">

                                            <button
                                                type="submit"
                                                className="btn btn-primary"
                                            >
                                                <i className="fa fa-save"></i> SAVE
                                            </button>

                                        </div>

                                    </form>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </LayoutAdmin>

        </React.Fragment>
    );
}

export default PlaceCreate;