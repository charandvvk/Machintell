import React, { useState } from 'react';
import DynamicTable from './DynamicTable';
import styles from '../product.module.css'

function SpecificationDetails({product}) {
  const [specifications, setSpecifications] = useState([
    [{ value: '', type: 'input' },
    { value: '', type: 'input' },
    { value: "", type: 'input' }]
  ]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [error, seterror] = useState('');

  const handleAddSpecification = () => {
    setSpecifications([...specifications, [{ value: '', type: 'input' },
    { value: '', type: 'input' },
    { value: "", type: 'input' }]]);
  };

  const handleDeleteRow = (index) => {
    const updatedSpecifications = [...specifications];
    updatedSpecifications.splice(index, 1);
    setSpecifications(updatedSpecifications);
    setSelectedRows([]);
  };

  const handleSave = () => {
    // product.specifications=specifications;
    console.log(product);

    if (validation()) {
      console.log('saved');
    }else{
      console.log('Validation Failed');
    }
  }
  const validation = () => {
    let isValid =  true;
    let errorMessage = '';

    if (specifications.some(row => row.some(sp => sp.value.trim() === ''))){
      errorMessage+= "Please enter all Specifications.\n";
      isValid = false;
    }
  
    seterror(errorMessage)
  
    return isValid;
  }

  

  const handleInputChange = (event, rowIndex, cellIndex) => {
    // console.log(event.target.value)
    const updatedSpecifications = [...specifications];
    updatedSpecifications[rowIndex][cellIndex].value = event.target.value; // Update the 'value' property
    setSpecifications(updatedSpecifications);
  };
  return (
    <div>
      <DynamicTable
        className="dynamic-table"
        headers={['Name', 'Units', 'Value']}
        data={specifications}
        selectedRows={selectedRows}
        onRowSelection={(index) => setSelectedRows([index])}
        onDeleteRow={handleDeleteRow}
        onInputChange={handleInputChange}
      />
      <div className={styles.buttonGroup}>
        <div><button className={styles.btn2} onClick={handleAddSpecification}>Add Specification</button></div>
        <div><button className={styles.btn2} onClick={handleDeleteRow}>Delete Specification</button></div>
        <div><button className={styles.btn2} onClick={handleSave}>Save</button></div>
      </div>
      {error && (
        <div className={styles.error}>
          <pre>{error}</pre>
        </div>
      )}
    </div>
  );
}

export default SpecificationDetails;