import React from 'react';
import './products.css';
import Product from '../../components/product/product';

class Products extends React.Component {
    constructor() {
        super();
        this.state = {
            products: []
        };
    }

    componentDidMount() {
        fetch('http://localhost:5000/allProducts')
            .then(res => res.json())
            .then(products => this.setState({products}));
    }

    render() {
        return (
            <div className="grid-container">
                {this.state.products.map((product, index) => <Product product={product} key={index}/>)}
            </div>
        );
    }
}

export default Products;