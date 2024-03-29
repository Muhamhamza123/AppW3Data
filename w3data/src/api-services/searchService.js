// searchService.js

import axios from 'axios';

export const fetchMeasurements = setMeasurements => {
  axios
    .get('https://w3dataapp.onrender.com/measurements')
    .then(response => setMeasurements(response.data))
    .catch(error => console.error('Error fetching measurements:', error));
};

export const fetchFields = (measurementName, setFields) => {
  axios
    .get(`https://w3dataapp.onrender.com/fields?measurement=${measurementName}`)
    .then(response => setFields(response.data))
    .catch(error => console.error('Error fetching fields:', error));
};
export const searchData = async (
  selectedMeasurement,
  fieldNames,
  project_name,
  data_location,
  user_project_name,
  startDate,
  endDate,
  setSearchResults,
  toast
) => {
  try {
    const response = await axios.post('https://w3dataapp.onrender.com/search', {
      selectedMeasurement,
      selectedFields: fieldNames,
      ProjectName: project_name,
      data_Location: data_location,
      userProjectName: user_project_name,
      startDate: startDate ? startDate.toISOString().slice(0, 19).replace('T', ' ') : null,
      endDate: endDate ? endDate.toISOString().slice(0, 19).replace('T', ' ') : null,
    });

    // Handle successful response
    setSearchResults(response.data);
    toast.success('Search successful!',{ className: 'success-toast' });
  } catch (error) {
    if (error.response && error.response.status === 404) {
      // Handle 404 error (No data found)
      console.error('Backend Error:', error.response.data.error);
      toast.error('No data found. Please refine your search criteria.', { className: 'error-toast' });
    } else {
      // Handle network errors or other issues
      console.error('Error searching:', error);
      toast.error('Error during search. Please try again.',{ className: 'error-toast' });
    }
  }
};



export const deleteData = (
  username,
  selectedMeasurement,
  startDate,
  endDate,
  dataCreator,
  data_location,
  toast
) => {
  axios
    .post(`https://w3dataapp.onrender.com/delete/${username}`, {
      selectedMeasurement,
      startDate: startDate ? startDate.toISOString().slice(0, 19).replace('T', ' ') : null,
      endDate: endDate ? endDate.toISOString().slice(0, 19).replace('T', ' ') : null,
      dataCreator,
      data_Location: data_location,
    })
    .then(response => {
      toast.success('Data deleted successfully!', { className: 'success-toast' });
      // Optionally, update state or perform any necessary actions after deletion
    })
    .catch(error => {
      console.error('Error deleting data:', error.response);

      // Check if it's an unauthorized error
      if (error.response && error.response.status === 401) {
        toast.error('Unauthorized. Username and data creator do not match.',{ className: 'error-toast' });
      } else if(error.response && error.response.status === 404) {
        toast.error('No data found for the criteria.', { className: 'error-toast' });
      }else{
        toast.error('Error during data deletion. Please try again.', { className: 'warning-toast' })
      }
    });
};




export const MyMetadata = (projectName, setMetadata, setFilteredMetadata, selectedVersion, toast) => {
    const project_name = projectName;
  
    // Check if projectName is not empty before making the request
    if (project_name) {
      axios
        .get(`https://w3dataapp.onrender.com/metadata?project_name=${project_name}`)
        .then(response => {
          if (response.data.length > 0) {
            setMetadata(response.data);
            // Assuming you still want to filter by selectedVersion
            setFilteredMetadata(response.data.filter(item => item.version === selectedVersion));
            toast.success('Metadata fetched successfully!', {
              className: 'success-toast',
            });
          } else {
            toast.warn('No project found with the specified name.', {
              className: 'warning-toast',
            });
          }
        })
        .catch(error => {
          console.error('Error fetching metadata:', error);
          toast.error('Error fetching metadata. Please try again.', {
            className: 'error-toast',
          });
        });
    } else {
      // Handle the case when projectName is empty (optional)
      console.warn('Project name is empty. Skipping metadata fetch.');
    }
  };

  
  // ... (existing code)
  




