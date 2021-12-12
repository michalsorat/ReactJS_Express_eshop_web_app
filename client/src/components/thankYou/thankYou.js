import React from 'react';
import './thankYou.css';

class ThankYou extends React.Component {
    constructor() {
        super();
        this.state = {
            count : 1,
            img_path : "",
            url: ""
        };
    }

    componentDidMount() {
        fetch('http://localhost:5000/getAdvertisement')
            .then(res => res.json())
            .then(advertisement => {
                this.setState({count: advertisement[0].pocitadlo, img_path: advertisement[0].obrazok, url: advertisement[0].link})
            })
    }

    incrementCounter = (e) => {
        fetch('http://localhost:5000/incrementCounter', {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            },
        })
        .then(res => {
            if (res.status === 200) {
                console.log("uspech");
            }
            else {
                console.log('Ups, something went wrong');
            }
        });
    }

    render() {
        return (
            <div className="container-adv">
                <h1>Ďakujeme za Vašu objednávku</h1>
                <a onClick={this.incrementCounter} href= {this.state.url} target="_blank" rel="noopener noreferrer"><img src = {this.state.img_path} alt=""/></a>
            </div>
        )
    }
}

export default ThankYou;