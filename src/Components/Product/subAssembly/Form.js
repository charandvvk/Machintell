// Form.js
import React from 'react';

function Form({ SubAssemblyName, onSubAssemblyNameChange, fileLocation, onFileLocationChange, onSave }) {
  return (
    <form>
      <div>
        <label>Name of the Product:</label>
        <input type="text" value={SubAssemblyName} onChange={onSubAssemblyNameChange} />
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
