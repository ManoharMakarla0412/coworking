const fetchData = async (url, options = {}) => {
  try {
    console.log('Fetching URL:', url); // Log the URL
    console.log('Fetch Options:', options); // Log the options
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

module.exports = fetchData;