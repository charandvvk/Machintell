import React, { useState } from 'react';
import ProductDetails from './ProductDetails';
import styles from '../product.module.css';

function AddNewProduct() {
  const [productName, setProductName] = useState('');
  const [fileLocation, setFileLocation] = useState('');
  const [form, setForm] = useState('');
  const [error, setError] = useState('');

  const handleProductNameChange = (event) => {
    setProductName(event.target.value);
  };

  const handleFileLocationChange = (event) => {
    setFileLocation(event.target.value);
  };

  const handleSave = () => {
    console.log('Saving data...', productName, fileLocation);

    // Perform validation
    if (validation()) {
      setForm('productAdded'); // Set the form state to 'productAdded' to display ProductDetails
    } else {
      console.log('Validation failed');
    }
  };

  const validation = () => {
    let isValid = true;
    let errorMessage = '';

    // Check if productName is empty
    if (productName.trim() === '') {
      errorMessage += 'Please enter product name.\n';
      isValid = false;
    }

    // Check if fileLocation is empty
    if (fileLocation.trim() === '') {
      errorMessage += 'Please enter file location.\n';
      isValid = false;
    }

    // Set error message
    setError(errorMessage);

    return isValid;
  };

  return (
    <div aria-label="Product Form" className={styles.form}>
      {form === 'productAdded' ? (
        <ProductDetails productName={productName} fileLocation={fileLocation} />
      ) : (
        <form>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Name of the Product</th>
                  <td className={styles.td}>
                    <input
                      className={styles.input}
                      type="text"
                      value={productName}
                      onChange={handleProductNameChange}
                      required
                    />
                  </td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th className={styles.th}>File location</th>
                  <td className={styles.td}>
                    <input
                      className={styles.input}
                      type="text"
                      value={fileLocation}
                      onChange={handleFileLocationChange}
                      required
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <div className={styles.buttonGroup}>
              <button type="button" className={styles.btn2} onClick={handleSave}>
                Save
              </button>
            </div>
          </div>
        </form>
      )}

      {error && (
        <div className={styles.error}>
          <pre>{error}</pre>
        </div>
      )}
    </div>
  );
}

export default AddNewProduct;
