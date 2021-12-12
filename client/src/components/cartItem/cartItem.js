import React from 'react';
import './cartItem.css';

class CartItem extends React.Component {
    constructor(props) {
        super(props);
        this.changeQuantity = this.changeQuantity.bind(this);
    }

    changeQuantity (e) {
        let cart = JSON.parse(localStorage.getItem('cart'));
        let id = this.props.product.id.toString();
        if (e.target.value > 0) {
            cart[id] = parseInt(e.target.value);
            localStorage.setItem('cart', JSON.stringify(cart));
            this.props.updateTotal();
        }
        else {
            this.props.removeItem(this.props.product);
        }
    }

    render() {
        const { product } = this.props;
        let cart = JSON.parse(localStorage.getItem('cart'));
        return (
            <div className = "cart-item">
                <div className="image-box">
                    <img src={product.obrazok} alt="" style={{ height:"120px" }} />
                </div>
                <h3 className="title">{product.nazov}</h3>
                <input className = "qty-input" type="number" defaultValue= {cart[product.id]} onChange= {this.changeQuantity} min = "1"></input>
                <div className="prices">
                    <div className="amount">{product.cena} €</div>
                    <button className="remove" onClick={() => this.props.removeItem(product)}>Odobrať z košíka</button>
                </div>
            </div>
        );
    }
    
}

export default CartItem;