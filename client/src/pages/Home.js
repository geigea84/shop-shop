//22.1.6
import React from "react";
import ProductList from "../components/ProductList";
import CategoryMenu from "../components/CategoryMenu";
//22.2.4
import Cart from '../components/Cart';

const Home = () => {

    return (
        <div className="container">
            <CategoryMenu />
            <ProductList />
            <Cart />
        </div>
    );
};

export default Home;
