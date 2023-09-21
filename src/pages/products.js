import React, { useEffect, useState } from "react";
import axios from "axios";

export function Products() {
    const [content, setContent] = useState(<ProductList showForm={showForm} />);

    function showList() {
        setContent(<ProductList showForm={showForm} />)
    }
    function showForm(product) {
        setContent(<ProductForm product={product} showList={showList} />)
    }
    return (
        <div className="container my-5">
            {content}
        </div>
    )
}

const categoryData = [
    "smartphones",
    "laptops",
    "fragrances",
    "skincare",
    "groceries",
    "home-decoration",
    "furniture",
    "tops",
    "womens-dresses",
    "womens-shoes",
    "mens-shirts",
    "mens-shoes",
    "mens-watches",
    "womens-watches",
    "womens-bags",
    "womens-jewellery",
    "sunglasses",
    "automotive",
    "motorcycle",
    "lighting"
]

function ProductList(props) {
    const [products, setProducts] = useState([]);

    // useEffect(() =>{
    //     async function fetchProducts() {
    //         const data = await fetch("https://dummyjson.com/products")
    //         const res = await data.json()
    //         setProducts(res);
    //         console.log("setProducts: ", setProducts)
    //         console.log("Products: ", products)
    //     }
    //     fetchProducts();
    // },[])


    // async function fetchProducts() {
    //     fetch("https://dummyjson.com/products")
    //         .then(response => {
    //             if (!response.ok) {
    //                 throw new Error('Unexpected Server Error');
    //             }

    //             return response.json();
    //         })
    //         .then((data) => {

    //             setProducts(data);
    //             console.log(data);
    //             // console.log("setProducts: ",setProducts);
    //             // console.log("products: ",products);
    //         })
    //         .catch((error) => console.log("Error: ", error));
    // }

    const fetchProducts = async () => {
        try {
            const res = await axios.get("http://localhost:3000/product/all")
            if (res.status !== 200) {
                throw new Error('Unexpected Server Error');
            }
            const data = res.data
            setProducts(data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchProducts();
    }, []);

    function deleteProduct(id) {
        fetch("http://localhost:3000/product/deletebyid/" + id, {
            method: "DELETE"
           
        })
            .then((response) => response.json())
            .then((data) => fetchProducts());
            alert("deleted");
    }
    return (
        <>
            <h2 className="text-center mb-3">List Of Products</h2>
            <button onClick={() => props.showForm({})} type="button" className="btn btn-primary me-3">Create</button>
            <button onClick={() => fetchProducts()} type="button" className="btn btn-outline-primary me-3">Refresh</button>

            <table className="table">
                {/* console.log(products); */}
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Discount</th>
                        <th>Rating</th>
                        <th>Stock</th>
                        <th>Brand</th>
                        <th>Category</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        products.map((product, index) => {
                            return (
                                <tr key={index}>
                                    <td>{product._id}</td>
                                    <td>{product.title}</td>
                                    <td>{product.description}</td>
                                    <td>{product.price}$</td>
                                    <td>{product.discount}</td>
                                    <td>{product.rating}</td>
                                    <td>{product.stock}</td>
                                    <td>{product.brand}</td>
                                    <td>{product.category}</td>

                                    <td style={{ width: "10px", whiteSpace: "nowrap" }}>

                                        <button onClick={() => props.showForm(product)} type="button" className="btn btn-primary btn-sm me-2">Edit</button>
                                        <button onClick={() => deleteProduct(product._id)} type="button" className="btn btn-danger btn-sm">Delete</button>

                                    </td>

                                </tr>
                            );
                        })
                    }
                </tbody>

            </table>
        </>
    );
}
function ProductForm(props) {
    const [errorMessage, setErrorMessage] = useState("");
    async function handleSubmit(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const product = Object.fromEntries(formData.entries());
        console.log(typeof(price))
        product.price = parseInt(product.price)
        console.log(typeof(price))
        product.discount = parseInt(product.discount)
        product.rating = parseInt(product.rating)
        product.stock = parseInt(product.stock)
        if (!product.title || !product.description || !product.price || !product.discount || !product.rating || !product.stock || !product.brand || !product.category) {
            console.log("Please Provide All Required Fields!");
            setErrorMessage(
                <div class="alert alert-warning" role="alert">
                    Please Provide All Required Fields!
                </div>
            )
            return;
        }

        if (props.product._id) {
            fetch("http://localhost:3000/product/updatebyid/" + props.product._id, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(product)
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Network response is not ok");
                    }
                    return response.json()
                })
                .then((data) => props.showList())
                .catch((error) => {
                    console.log("Error: ", error)

                });
        }


        // else {
        //     fetch("https://dummyjson.com/products", {
        //         method: "POST",
        //         headers: {
        //             "Content-Type": "application/json",
        //         },
        //         body: JSON.stringify(product)
        //     })
        //         .then((response) => {
        //             if (!response.ok) {
        //                 throw new Error('Network response was not ok');
        //             }
        //             return response.json()
        //         })
        //         .then((data) =>

        //             props.showList())

        //         .catch((error) => {
        //             console.error("Error: ", error);
        //         });
        // }
        else {
            try {
                const response = await axios.post("http://localhost:3000/product/newproduct", product, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                console.log(response)
                if(response.status===200){
                    alert('Created Successfully')
                }

                props.showList();
            } catch (error) {
                console.error("Error: ", error);
            }
        }
    }
    return (
        <>
            <h2 className="text-center mb-3">{props.product._id ? "Edit Product" : "Create New Product"}</h2>

            <div className="row">

                <div className="col-lg-6 mx-auto">
                    {errorMessage}
                    <form onSubmit={(event) => handleSubmit(event)}>

                        {props.product._id && <div className="row mb-3">
                            <label className="col-sm-4 col-form-label">ID</label>
                            <div className="col-sm-8">
                                <input readOnly className="form-control-plaintext" name="_id" defaultValue={props.product._id} />
                            </div></div>}
                        <div className="row mb-3">
                            <label className="col-sm-4 col-form-label">Title</label>
                            <div className="col-sm-8">
                                <input className="form-control" name="title" defaultValue={props.product.title} />
                            </div></div>
                        <div className="row mb-3">
                            <label className="col-sm-4 col-form-label">Description</label>
                            <div className="col-sm-8">
                                <input className="form-control" name="description" defaultValue={props.product.description} />
                            </div></div>
                        <div className="row mb-3">
                            <label className="col-sm-4 col-form-label">Price</label>
                            <div className="col-sm-8">
                                <input className="form-control" name="price" defaultValue={props.product.price} />
                            </div></div>
                        <div className="row mb-3">
                            <label className="col-sm-4 col-form-label">Discount</label>
                            <div className="col-sm-8">
                                <input className="form-control" name="discount" defaultValue={props.product.discount} />
                            </div></div>
                        <div className="row mb-3">
                            <label className="col-sm-4 col-form-label">Rating</label>
                            <div className="col-sm-8">
                                <input className="form-control" name="rating" defaultValue={props.product.rating} />
                            </div></div>
                        <div className="row mb-3">
                            <label className="col-sm-4 col-form-label">Stock</label>
                            <div className="col-sm-8">
                                <input className="form-control" name="stock" defaultValue={props.product.stock} />
                            </div></div>
                        <div className="row mb-3">
                            <label className="col-sm-4 col-form-label">Brand</label>
                            <div className="col-sm-8">
                                <input className="form-control" name="brand" defaultValue={props.product.brand} />
                            </div></div>
                        <div className="row mb-3">
                            <label className="col-sm-4 col-form-label">Category</label>
                            <div className="col-sm-8">
                                <select className="form-select" name="category" defaultValue={props.product.category} >
                                    {
                                        categoryData.map((item) => {
                                            return (
                                                <option>{item}</option>
                                            );
                                        })
                                    }
                                </select>
                            </div></div>
                        <div className="row">
                            <div className="offset-sm-4 col-sm-4 d-grid">
                                <button type="submit" className="btn btn-primary btn-sm me-3" value="submit">
                                    Save
                                </button>

                            </div>

                            <div className="col-sm-4 d-grid">
                                <button onClick={() => props.showList()} type="button" className="btn btn-secondary me-3">Cancel</button>
                            </div>
                        </div>
                    </form>

                </div>
            </div>
        </>
    );
}
