import React, { useState, useEffect } from 'react';
import BlockchainVisualizer from './BlockchainVisualizer';
import { ProductCRUD } from './blockchain';
import { useSpring, animated, config } from '@react-spring/web';

const AnimatedButton = ({ children, onClick, className }) => {
  const [hovered, setHovered] = useState(false);
  const props = useSpring({
    transform: hovered ? 'scale(1.05)' : 'scale(1)',
    config: config.wobbly,
  });

  return (
    <animated.button
      style={props}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      className={className}
    >
      {children}
    </animated.button>
  );
};

function App() {
  const [productCRUD] = useState(new ProductCRUD());
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [products, setProducts] = useState([]);
  const [blockchain, setBlockchain] = useState(productCRUD.getBlockchain());
  const [isValid, setIsValid] = useState(true);
  const [latestAction, setLatestAction] = useState(null);

  useEffect(() => {
    setProducts(productCRUD.getAllProducts());
    setBlockchain(productCRUD.getBlockchain());
  }, [productCRUD]);

  const handleCreateProduct = () => {
    if (productName && productPrice) {
      const newProduct = {
        id: Date.now(),
        name: productName,
        price: parseFloat(productPrice)
      };
      productCRUD.createProduct(newProduct);
      updateState('create');
    }
  };

  const handleUpdateProduct = (id) => {
    const updatedProduct = {
      id: id,
      name: productName ? `${productName} (Updated)` : `Product ${id} (Updated)`,
      price: productPrice ? parseFloat(productPrice) + 10 : 0
    };
    productCRUD.updateProduct(id, updatedProduct);
    updateState('update');
  };

  const handleDeleteProduct = (id) => {
    productCRUD.deleteProduct(id);
    updateState('delete');
  };

  const handleTamper = () => {
    if (blockchain.chain.length > 1) {
      productCRUD.tamperWithBlock(1, { action: 'TAMPERED', product: { id: 'FAKE', name: 'Tampered Product', price: 9999 } });
      updateState('tamper');
    }
  };

  const handleValidate = () => {
    setIsValid(productCRUD.validateChain());
    setLatestAction('validate');
  };

  const handleReset = () => {
    productCRUD.reset();
    updateState('reset');
  };

  const updateState = (action) => {
    setProducts(productCRUD.getAllProducts());
    setBlockchain(productCRUD.getBlockchain());
    setProductName('');
    setProductPrice('');
    setIsValid(productCRUD.validateChain());
    setLatestAction(action);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Blockchain Product CRUD Demo</h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          className="border p-2 mr-2"
        />
        <input
          type="number"
          placeholder="Price"
          value={productPrice}
          onChange={(e) => setProductPrice(e.target.value)}
          className="border p-2 mr-2"
        />
        <AnimatedButton
          onClick={handleCreateProduct}
          className="bg-blue-500 text-white p-2 rounded mr-2"
        >
          Add Product
        </AnimatedButton>
        <AnimatedButton
          onClick={handleTamper}
          className="bg-yellow-500 text-white p-2 rounded mr-2"
        >
          Tamper with Block
        </AnimatedButton>
        <AnimatedButton
          onClick={handleValidate}
          className="bg-green-500 text-white p-2 rounded mr-2"
        >
          Validate Chain
        </AnimatedButton>
        <AnimatedButton
          onClick={handleReset}
          className="bg-red-500 text-white p-2 rounded"
        >
          Reset Blockchain
        </AnimatedButton>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Products</h2>
        <ul>
          {products.map(product => (
            <li key={product.id} className="mb-2">
              {product.name} - ${product.price.toFixed(2)}
              <button
                onClick={() => handleUpdateProduct(product.id)}
                className="ml-2 bg-yellow-500 text-white p-1 rounded text-sm"
              >
                Update
              </button>
              <button
                onClick={() => handleDeleteProduct(product.id)}
                className="ml-2 bg-red-500 text-white p-1 rounded text-sm"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Blockchain Status</h2>
        <p className={isValid ? "text-green-500" : "text-red-500"}>
          Chain is {isValid ? "valid" : "invalid"}
        </p>
      </div>

      <BlockchainVisualizer blockchain={blockchain} latestAction={latestAction} />
    </div>
  );
}

export default App;