import React from 'react';
import './admin.css';

class Products extends React.Component {
    constructor() {
        super();
        this.state = {
            orders: [],
            count: 0
        };
    }

    componentDidMount() {
         fetch('http://localhost:5000/getOrders')
            .then(res => res.json())
            .then(orders => {
                this.setState({orders: orders});
                fetch('http://localhost:5000/getAdvertisement')
                    .then(res => res.json())
                    .then(advertisement => {
                        this.setState({count: advertisement[0].pocitadlo})
                    })
            })
        
    }

    stringifyData = (arr_names, arr_prices, arr_quantities) => {
        let names_arr = arr_names.split(',');
        let price_arr = arr_prices.split(',');
        let quantity_arr = arr_quantities.split(',');
        let string = "";
        for (let j=0; j < names_arr.length; j++) {
            string += "| " + names_arr[j] + ", ";
            string += price_arr[j] + "€, ";
            string += quantity_arr[j] + "ks | ";
        }
        return string;
    }

    submitFormUrl = (e) => {
        fetch('http://localhost:5000/postNewUrl', {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                newUrl: e.target.url.value
            })
        })
            .then(res => {
                if (res.status === 201) {
                    console.log("URL changed");
                }
                else if (res.status === 409) {
                    console.log("Ups, something went wrong");
                }
            });
    }

    submitFormImg = (e) => {
        fetch('http://localhost:5000/postNewImg', {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                newImg: e.target.img.value
            })
        })
            .then(res => {
                if (res.status === 201) {
                    console.log("IMG changed");
                }
                else if (res.status === 409) {
                    console.log("Ups, something went wrong");
                }
            });
    }

    changeOrderState = (order) => {
        fetch('http://localhost:5000/changeOrderState', {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                customer_id: order['id'],
            })
        })
        .then(res => {
                if (res.status === 200) {
                    let orders_tmp = this.state.orders;
                    orders_tmp.forEach(orderItem => {
                        if (orderItem['id'] === order['id']) {
                            orderItem['stav_objednavky'] = 'zaplatena';
                        }
                    });
                    this.setState({orders: orders_tmp});
                }
                else {
                    console.log('Ups, something went wrong');
                }
            });
    }



    render() {
        return (
            <div className="admin-container">
                <table>
                    <thead>
                        <tr>
                            <th colSpan="8">Objednávky</th>
                        </tr>
                        <tr>
                            <th colSpan="5">Info o zákazníkovi</th>
                            <th colSpan="3">Info o objednávke</th>
                        </tr>
                        <tr>
                            <td>E-mail</td>
                            <td>Ulica</td>
                            <td>Číslo domu</td>
                            <td>Mesto</td>
                            <td>PSČ</td>
                            <td>Produkty</td>
                            <td>Cena celkom</td>
                            <td>Stav objednávky</td>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.orders.map((order, index) => 
                            <tr key={order['email']}>
                                <td>{order['email']}</td>
                                <td>{order['ulica']}</td>
                                <td>{order['cislo']}</td>
                                <td>{order['mesto']}</td>
                                <td>{order['psc']}</td>
                                <td>{this.stringifyData(order['produkt_nazvy'], order['produkt_ceny'], order['produkt_pocty_kusov'])}</td>
                                <td>{order['total']}€</td>
                                <td>{order['stav_objednavky']}</td>
                                {order['stav_objednavky'] === 'prijata' ?<td><button onClick={e => {this.changeOrderState(order)}}>Zaplatiť</button></td>: <td style={{display: 'none'}}></td>}
                            </tr>
                        )}
                    </tbody>
                </table>
                <div>
                    <form className="advertisement-form" onSubmit={this.submitFormUrl}>
                        <div className="form-input-adv">
                            <label htmlFor="url">Nový url odkaz na reklamu </label>
                            <input type="text" id="url" name="url" required/>
                        </div> 
                        <div className="form-submit-adv">
                            <button className="change-adv-btn" type="submit">Zmeniť url odkaz reklamy</button>
                        </div>
                    </form>

                    <form className="advertisement-form" onSubmit={this.submitFormImg}>
                        <div className="form-input-adv">
                            <label htmlFor="img">Nový url odkaz na obrazok reklamy </label>
                            <input type="text" id="img" name="url" required/>
                        </div> 
                        <div className="form-submit-adv">
                            <button className="change-adv-btn" type="submit">Zmeniť obrázok reklamy</button>
                        </div>
                    </form>
                    <h1 className="counter">Počet kliknutí na reklamu: {this.state.count}</h1>
                </div>
                
            </div>
        );
    }
}

export default Products;