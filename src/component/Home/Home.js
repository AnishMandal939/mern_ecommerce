import React, { Fragment } from 'react'
import { CgMouse } from 'react-icons/cg';
import "./Home.css";
import Product from "./Product.js";

// temp product
const product = {
    name: "Blue Shirt",
    images: [{url:"https://i.ibb.co/DRST11n/1.webp"}],
    price: "Rs 3000",
    _id: "anish",
};

const Home = () => {
    return (
        <Fragment>
            <div className="banner">
                <p>Welcome to Ecommerce</p>
                <h1>Find amazing products below</h1>
                <a href="#container">
                    <button>Scroll <CgMouse /> </button>
                </a>
            </div>

            {/* adding heading */}
            <h2 className="homeHeading">Featured Products</h2>
            {/* adding heading */}
            {/* for product conntainer */}
            <div className="container" id="container">
                <Product product={product} />
                <Product product={product} />
                <Product product={product} />
                <Product product={product} />
                
                <Product product={product} />
                <Product product={product} />
                <Product product={product} />
                <Product product={product} />

            </div>
        </Fragment>
    )
};

export default Home;
