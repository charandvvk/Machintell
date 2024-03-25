// Form.js
import React from 'react';

function Form({ productName, onProductNameChange, fileLocation, onFileLocationChange, onSave }) {
  return (
    <form>
      <div>
        <label>Name of the Product:</label>
        <input type="text" value={productName} onChange={onProductNameChange} />
      </div>
      <div>
        <label>File location:</label>
        <input type="text" value={fileLocation} onChange={onFileLocationChange} />
      </div>
      <button type="button" onClick={onSave}>Save</button>
    </form>
  );
}

export default Form;
