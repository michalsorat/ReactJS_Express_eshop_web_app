import React from 'react';
import CartItem from '../../components/cartItem/cartItem';
import './cart.css';
import { Navigate } from 'react-router-dom';

class Cart extends React.Component {
    constructor() {
        super();
        this.state = {
            products: [],
            total: 0,
            email_error: false,
            redirect: false
        };
    }

    componentDidMount() {
        let cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : null;
        if (!cart) return;
        let id_array = [];
        for(let key in cart) {
            id_array.push(key);
        }
        fetch(`http://localhost:5000/shoppingCartItems?array=${JSON.stringify(id_array)}`)
            .then(res => res.json())
            .then(products => {
                let total = 0;
                for (let i = 0; i < products.length; i++) {
                    total += products[i].cena * cart[products[i].id];
                }
                this.setState({products: products, total: total.toFixed(2)})
            });
    }

    updateTotal = () => {
        let cart = JSON.parse(localStorage.getItem('cart'));
        let total = 0;
        let products = this.state.products;
        for (let i = 0; i < products.length; i++) {
            total += products[i].cena * cart[products[i].id];
        }
        this.setState({total: total.toFixed(2)});
    }

    removeItem = (product) => {
        var cart = JSON.parse(localStorage.getItem('cart'));
        let products = this.state.products;
        let newProducts = [];
        let newTotal = 0;
        for (let i = 0; i < products.length; i++) {
            if (products[i].id === product.id) {
                continue;
            }
            else {
                newProducts.push(products[i]);
                newTotal += products[i].cena * cart[products[i].id];
            }
        }
        delete cart[product.id];
        cart = JSON.stringify(cart);
        if (cart === '{}'){
            localStorage.removeItem('cart');
        }
        else {
            localStorage.setItem('cart', cart);
        }
        console.log(cart);
        this.setState({products: newProducts, total: newTotal.toFixed(2)})
    }

    removeAll = () => {
        localStorage.removeItem('cart');
        this.setState({products: []});
    }

    submitForm = (e) => {
        e.preventDefault();
        var cart = JSON.parse(localStorage.getItem('cart'));
        fetch('http://localhost:5000/createOrder', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: e.target.email.value,
                name: e.target.name.value,
                street: e.target.street.value,
                streetNr: e.target.streetNr.value,
                city: e.target.city.value,
                psc: e.target.psc.value,
                cart: cart,
                total: this.state.total
            })
        })
            .then(res => {
                if (res.status === 201) {
                    this.removeAll();
                    this.setState({redirect: true});
                }
                else if (res.status === 409) {
                    this.setState({email_error: true});
                }
            });
    }

    render() {
        const { redirect } = this.state;

        if (redirect) {
            return <Navigate to='/thank-you'/>;
        }

        return (
            <div className="container">
                <div className="cart-container">
                <div className="Header">
                    <h1>Nákupný košik</h1>
                    <button className="remove-all-button" onClick= {this.removeAll}>Odobrať všetky</button>
                </div>
                    {this.state.products.map((product, index) => <CartItem product={product} updateTotal = {this.updateTotal} removeItem = {this.removeItem} key={index}/>)}
                    { this.state.products.length ? 
                        <div><h4>
                            <small>Total Amount: </small>
                            <span className="float-right text-primary">${this.state.total}</span>
                        </h4></div>: ''}
                    { !this.state.products.length ?<h3 className="text-warning">Nákupný košík je prázdny!</h3>: ''}
                </div>

                { this.state.products.length ? 
                <div className="userInfo-container">
                    <form className="user-form" onSubmit={this.submitForm}>
                        <div className="form-input">
                            <label htmlFor="email">E-mail </label>
                            <input type="email" id="email" name="email" required/>
                        </div>

                        <div className="form-input">
                            <label htmlFor="name">Meno </label>
                            <input type="text" id="name" name="name" required/>
                        </div>

                        <div className="form-input">
                            <label htmlFor="street">Ulica </label>
                            <input type="text" id="street" name="street" required/>
                        </div>

                        <div className="form-input">
                            <label htmlFor="street-nr">Číslo </label>
                            <input type="text" id="street-nr" name="streetNr" required/>
                        </div>

                        <div className="form-input">
                            <label htmlFor="city">Mesto </label>
                            <input type="text" id="city" name="city" required/>
                        </div>

                        <div className="form-input">
                            <label htmlFor="psc">PSČ </label>
                            <input type="text" id="psc" name="psc" required/>
                        </div>

                        <div className="form-submit">
                            { this.state.email_error ? 
                                <p>Táto e-mailová sa už používa!</p> : <p></p>}
                            <button className="check-out-btn" type="submit">Odoslať objednávku</button>
                        </div>

                        
                    </form>  
                </div>: ''}
            </div>
            
        );
    }
}

export default Cart;