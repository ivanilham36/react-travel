//import react and hook
import React, { useEffect, useState } from "react";

//import layout web
import LayoutWeb from "../../../layouts/Web";

//import BASE URL API
import Api from "../../../api";

//import card category component
import CardCategory from "../../../components/utilities/CardCategory";

function WebCategoriesIndex() {

    //title page
    document.title = "Categories - TRAVEL GIS - Website Wisata Berbasis GIS (Geographic Information System)";

    //state categories
    const [categories, setCategories] = useState([]);

    //function fetch data categories
    const fetchDataCategories = async () => {
        await Api.get('/api/web/categories')
            .then((response) => {
                setCategories(response.data.data);
            });
    };

    //hook
    useEffect(() => {
        fetchDataCategories();
    }, []);

    return (
        <React.Fragment>
            <LayoutWeb>

                <div className="container mt-80 mb-5">

                    <div className="row">

                        <div className="col-md-12">

                            <h4>
                                ALL <strong>CATEGORIES</strong>
                            </h4>

                            <hr />

                        </div>

                        {
                            categories.length > 0
                                ? categories.map((category) => (
                                    <CardCategory
                                        key={category.id}
                                        id={category.id}
                                        name={category.name}
                                        slug={category.slug}
                                        image={category.image}
                                    />
                                ))
                                : (
                                    <div
                                        className="alert alert-danger border-0 rounded shadow-sm"
                                        role="alert"
                                    >
                                        <strong>Opps...!</strong> Data Belum Tersedia!.
                                    </div>
                                )
                        }

                    </div>

                </div>

            </LayoutWeb>
        </React.Fragment>
    );
}

export default WebCategoriesIndex;