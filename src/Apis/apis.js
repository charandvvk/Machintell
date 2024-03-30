const hostName = 'http://localhost:3001/api/v1';

export const sendData = async (requestData, endpoint, route) => {
  try {
    const response = await fetch(hostName + route, {
      method: endpoint, //PUT, POST,DELETE,GET
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    const {message,data} = await response.json();
    console.log(message,data)
    return {message,data};
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
