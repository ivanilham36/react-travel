import React, { useState, useEffect } from "react";

//import layout
import LayoutAdmin from "../../../layouts/Admin";

//import BASE URL API
import Api from "../../../api";

//import js cookie
import Cookies from "js-cookie";

//import pagination component
import PaginationComponent from "../../../components/utilities/Pagination";

//import react router
import { Link } from "react-router-dom";

//import toast
import toast from "react-hot-toast";

//import confirm alert
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

function PlacesIndex() {

    //title page
    document.title = "Places - Administrator Travel GIS";

    //state places
    const [places, setPlaces] = useState([]);

    //state currentPage
    const [currentPage, setCurrentPage] = useState(1);

    //state perPage
    const [perPage, setPerPage] = useState(0);

    //state total
    const [total, setTotal] = useState(0);

    //state search
    const [search, setSearch] = useState("");

    //token
    const token = Cookies.get("token");

    //function fetchData
    const fetchData = async (pageNumber, searchData) => {

        //define variable "page"
        const page = pageNumber ? pageNumber : currentPage;

        //define variable "searchQuery"
        const searchQuery = searchData ? searchData : search;

        //fetching data from Rest API
        await Api.get(
            `/api/admin/places?q=${searchQuery}&page=${page}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
        ).then(response => {

            //set data response to state "places"
            setPlaces(response.data.data.data);

            //set currentPage
            setCurrentPage(response.data.data.current_page);

            //set perPage
            setPerPage(response.data.data.per_page);

            //total
            setTotal(response.data.data.total);

        });
    };

    //hook
    useEffect(() => {

        //call function "fetchData"
        fetchData();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    //function "searchHandlder"
    const searchHandlder = (e) => {

        e.preventDefault();

        //call function "fetchData"
        fetchData(1, search);
    };

    //function "deletePlace"
    const deletePlace = (id) => {

        //show confirm alert
        confirmAlert({
            title: "Are You Sure ?",
            message: "want to delete this data ?",

            buttons: [
                {
                    label: "YES",

                    onClick: async () => {

                        await Api.delete(`/api/admin/places/${id}`, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            }
                        }).then(() => {

                            //show toast
                            toast.success("Data Deleted Successfully!", {
                                duration: 4000,
                                position: "top-right",
                                style: {
                                    borderRadius: "10px",
                                    background: "#333",
                                    color: "#fff",
                                },
                            });

                            //call function "fetchData"
                            fetchData();

                        });
                    }
                },
                {
                    label: "NO",
                    onClick: () => {}
                }
            ]
        });
    };

    return (
        <React.Fragment>

            <LayoutAdmin>

                <div className="row mt-4">

                    <div className="col-12">

                        <div className="card border-0 rounded shadow-sm border-top-success">

                            <div className="card-header">

                                <span className="font-weight-bold">
                                    <i className="fa fa-map-marked-alt"></i> PLACES
                                </span>

                            </div>

                            <div className="card-body">

                                <div className="row mb-3">

                                    <div className="col-md-6">

                                        <form
                                            onSubmit={searchHandlder}
                                            className="form-group"
                                        >

                                            <div className="input-group">

                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Search Places..."
                                                    value={search}
                                                    onChange={(e) => setSearch(e.target.value)}
                                                />

                                                <button
                                                    type="submit"
                                                    className="btn btn-md btn-primary"
                                                >
                                                    <i className="fa fa-search"></i>
                                                </button>

                                            </div>

                                        </form>

                                    </div>

                                    <div className="col-md-6 text-end">

                                        <Link
                                            to="/admin/places/create"
                                            className="btn btn-md btn-success"
                                        >
                                            <i className="fa fa-plus-circle"></i> ADD NEW
                                        </Link>

                                    </div>

                                </div>

                                <div className="table-responsive">

                                    <table className="table table-bordered">

                                        <thead>

                                            <tr>
                                                <th scope="col">NO.</th>
                                                <th scope="col">IMAGE</th>
                                                <th scope="col">TITLE</th>
                                                <th scope="col">CATEGORY</th>
                                                <th scope="col">ADDRESS</th>
                                                <th scope="col">ACTION</th>
                                            </tr>

                                        </thead>

                                        <tbody>

                                            {
                                                places.length > 0
                                                    ?
                                                    places.map((place, index) => (

                                                        <tr key={place.id}>

                                                            <td className="text-center">
                                                                {index + 1 + (currentPage - 1) * perPage}
                                                            </td>

                                                            <td className="text-center">

                                                                {
                                                                    place.images && place.images.length > 0
                                                                        ?
                                                                        <img
                                                                            src={place.images[0].image}
                                                                            alt={place.title}
                                                                            width="80"
                                                                            height="60"
                                                                            className="img-thumbnail"
                                                                            style={{
                                                                                objectFit: "cover"
                                                                            }}
                                                                        />
                                                                        :
                                                                        <span className="text-muted">
                                                                            No Image
                                                                        </span>
                                                                }

                                                            </td>

                                                            <td>
                                                                {place.title}
                                                            </td>

                                                            <td>
                                                                {place.category?.name || "-"}
                                                            </td>

                                                            <td>
                                                                {place.address || "-"}
                                                            </td>

                                                            <td className="text-center">

                                                                <Link
                                                                    to={`/admin/places/edit/${place.id}`}
                                                                    className="btn btn-sm btn-primary me-2"
                                                                >
                                                                    <i className="fa fa-pencil-alt"></i>
                                                                </Link>

                                                                <button
                                                                    onClick={() => deletePlace(place.id)}
                                                                    className="btn btn-sm btn-danger"
                                                                >
                                                                    <i className="fa fa-trash"></i>
                                                                </button>

                                                            </td>

                                                        </tr>

                                                    ))
                                                    :
                                                    <tr>

                                                        <td
                                                            colSpan="6"
                                                            className="text-center"
                                                        >
                                                            No Data Found
                                                        </td>

                                                    </tr>
                                            }

                                        </tbody>

                                    </table>

                                </div>

                                <div className="mt-3">

                                    <PaginationComponent
                                        currentPage={currentPage}
                                        perPage={perPage}
                                        total={total}
                                        onChange={(pageNumber) => fetchData(pageNumber)}
                                        position="end"
                                    />

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </LayoutAdmin>

        </React.Fragment>
    );
}

export default PlacesIndex;