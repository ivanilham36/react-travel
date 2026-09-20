import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

//import BASE URL API
import Api from "../../../api";

import LayoutAdmin from "../../../layouts/Admin";

function CategoryCreate() {

    document.title = "Create Category - Administrator Travel GIS";

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [image, setImage] = useState(null);
    const [validation, setValidation] = useState({});

    const storeCategory = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append("image", image);
        formData.append("name", name);

        const token = Cookies.get("token");

        try {
            await Api.post("/api/admin/categories", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "content-type": "multipart/form-data"
                }
            });

            toast.success("Data Saved Successfully!", {
                duration: 4000,
                position: "top-right",
                style: {
                    borderRadius: "10px",
                    background: "#333",
                    color: "#fff",
                },
            });

            navigate("/admin/categories");

        } catch (error) {
            setValidation(error.response.data);
        }
    };

    return (
        <React.Fragment>
            <LayoutAdmin>

                <div className="row mt-4">
                    <div className="col-12">

                        <div className="card border-0 rounded shadow-sm border-top-success">

                            <div className="card-header">
                                <span className="font-weight-bold">
                                    <i className="fa fa-folder"></i> CREATE CATEGORY
                                </span>
                            </div>

                            <div className="card-body">

                                <form onSubmit={storeCategory}>

                                    <div className="mb-3">
                                        <label className="form-label fw-bold">
                                            Name
                                        </label>

                                        <input
                                            type="text"
                                            className="form-control"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Enter category name"
                                        />

                                        {validation.errors?.name && (
                                            <div className="alert alert-danger mt-2">
                                                {validation.errors.name[0]}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label fw-bold">
                                            Image
                                        </label>

                                        <input
                                            type="file"
                                            className="form-control"
                                            accept="image/*"
                                            onChange={(e) => setImage(e.target.files[0])}
                                        />

                                        {validation.errors?.image && (
                                            <div className="alert alert-danger mt-2">
                                                {validation.errors.image[0]}
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-md btn-success me-2"
                                    >
                                        <i className="fa fa-save"></i> SAVE
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-md btn-warning"
                                        onClick={() => navigate("/admin/categories")}
                                    >
                                        <i className="fa fa-arrow-left"></i> BACK
                                    </button>

                                </form>

                            </div>

                        </div>

                    </div>
                </div>

            </LayoutAdmin>
        </React.Fragment>
    );
}

export default CategoryCreate;