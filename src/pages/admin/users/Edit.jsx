//import hook useState dan useEffect from react
import React, { useState, useEffect } from "react";

//import layout
import LayoutAdmin from "../../../layouts/Admin";

//import BASE URL API
import Api from "../../../api";

//import hook navigate dan useParams dari react router dom
import { useNavigate, useParams } from "react-router-dom";

//import js cookie
import Cookies from "js-cookie";

//import toats
import toast from "react-hot-toast";

function UserEdit() {

    //title page
    document.title = "Edit User - Administrator Travel GIS";

    //state name
    const [name, setName] = useState("");

    //state email
    const [email, setEmail] = useState("");

    //state password
    const [password, setPassword] = useState("");

    //state password confirmation
    const [passwordConfirmation, setPasswordConfirmation] = useState("");

    //state validation
    const [validation, setValidation] = useState({});

    //token
    const token = Cookies.get("token");

    //navigate
    const navigate = useNavigate();

    //useParams
    const { id } = useParams();

    //function "fetchData"
    const fetchData = async () => {

        //fetch data user
        await Api.get(`/api/admin/users/${id}`, {
            headers: {
                //header Bearer + Token
                Authorization: `Bearer ${token}`,
            }
        }).then(response => {

            //set data response to state
            setName(response.data.data.name);
            setEmail(response.data.data.email);

        })
    }

    //hook useEffect
    useEffect(() => {

        //call function "fetchData"
        fetchData();

    }, []);

    //function "updateUser"
    const updateUser = async (e) => {

        //prevent default form
        e.preventDefault();

        //define formData
        const formData = new FormData();

        //append data to "formData"
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('password_confirmation', passwordConfirmation);
        formData.append('_method', 'PATCH');

        //update data
        await Api.post(`/api/admin/users/${id}`, formData, {

            //header
            headers: {
                //header Bearer + Token
                Authorization: `Bearer ${token}`,
            }

        }).then(() => {

            //show toast
            toast.success("Data Updated Successfully!", {
                duration: 4000,
                position: "top-right",
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            });

            //redirect users page
            navigate("/admin/users");

        })
        .catch((error) => {

            //set state "validation"
            setValidation(error.response.data);

        })

    }

    return (
        <React.Fragment>
            <LayoutAdmin>
                <div className="row mt-4">
                    <div className="col-12">
                        <div className="card border-0 rounded shadow-sm border-top-success">

                            <div className="card-header">
                                <span className="font-weight-bold">
                                    <i className="fa fa-users"></i> EDIT USER
                                </span>
                            </div>

                            <div className="card-body">

                                <form onSubmit={updateUser}>

                                    <div className="mb-3">
                                        <label className="form-label fw-bold">
                                            Name
                                        </label>

                                        <input
                                            type="text"
                                            className="form-control"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Name"
                                        />

                                        {validation.name && (
                                            <div className="alert alert-danger mt-2">
                                                {validation.name[0]}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label fw-bold">
                                            Email
                                        </label>

                                        <input
                                            type="email"
                                            className="form-control"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Email"
                                        />

                                        {validation.email && (
                                            <div className="alert alert-danger mt-2">
                                                {validation.email[0]}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label fw-bold">
                                            Password
                                        </label>

                                        <input
                                            type="password"
                                            className="form-control"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Password"
                                        />

                                        {validation.password && (
                                            <div className="alert alert-danger mt-2">
                                                {validation.password[0]}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label fw-bold">
                                            Password Confirmation
                                        </label>

                                        <input
                                            type="password"
                                            className="form-control"
                                            value={passwordConfirmation}
                                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                                            placeholder="Password Confirmation"
                                        />

                                        {validation.password_confirmation && (
                                            <div className="alert alert-danger mt-2">
                                                {validation.password_confirmation[0]}
                                            </div>
                                        )}
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
    )
}

export default UserEdit