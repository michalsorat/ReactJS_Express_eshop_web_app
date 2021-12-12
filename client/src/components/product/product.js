import React from 'react';
import './product.css';

class Product extends React.Component {
    constructor(props) {
        super(props);
        this.state = {quantity: 1};
        this.changeQuantity = this.changeQuantity.bind(this);
    }

    changeQuantity (e) {
        this.setState({quantity: e.target.value});
    }
    
    addProductToCart = () => {
        let cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : {};
        let id = this.props.product.id.toString();
        cart[id] = (cart[id] ? cart[id]: 0);
        cart[id] += parseInt(this.state.quantity);
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    render() {
        const { product } = this.props;
        return (
            <div className="grid-item" key={product.id}>
                <h3>{product.nazov}</h3>
                <img src = {product.obrazok} alt=""></img>
                <div className="price-holder">
                    <p>{product.cena}<span>€</span></p> 
                    <div className="add-to-cart">
                        <input type="number" defaultValue= {this.state.quantity} onChange= {this.changeQuantity} min = "1"></input>
                        <button onClick={this.addProductToCart}>Pridať do košíka</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Product;