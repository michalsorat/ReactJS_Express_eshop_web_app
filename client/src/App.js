import './App.css';
import Products from './components/products/products';
import Header from './components/header/header';
import Cart from './components/cart/cart';
import Admin from './components/admin/admin';
import {Routes, Route} from 'react-router-dom';
import ThankYou from './components/thankYou/thankYou';

function App() {
  return (
    <div className="App">
      <Header heading="VAVJS E-shop" />
      <main>
        <Routes>
          <Route exact path="/" element={<Products/>}/>
          <Route exact path="/shopping-cart" element={<Cart />}/>
          <Route exact path="/admin" element={<Admin />}/>
          <Route exact path="/thank-you" element={<ThankYou />}/>
        </Routes>
      </main>
      
    </div>
  );
}

export default App;
