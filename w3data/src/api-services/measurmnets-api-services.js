// dataService.js

import axios from 'axios';

export const fetchData = async (username, selectedMeasurement, selectedProject, setData, setFieldNames, setLoading) => {
  try {
    const response = await axios.get(`http://localhost:5000/influxdb-data/${username}`, {
      params: { measurement: selectedMeasurement, project: selectedProject },
    });
    setData(response.data.data_list);
    setFieldNames(response.data.field_names);
    setLoading(false);
  } catch (error) {
    console.error('Error:', error);
    setLoading(false);
  }
};

export const fetchUserProjects = async (username, setUserProjects, setMetadata, setUniqueVersions) => {
  try {
    const projectResponse = await axios.get(`http://localhost:5000/${username}`);
    setUserProjects(projectResponse.data.projects);

    // Set metadata in the state
    setMetadata(projectResponse.data.metadata);

    // Extract unique versions from metadata and set them in state
    const versions = projectResponse.data.metadata.map((meta) => meta.version);
    const uniqueVersions = [...new Set(versions)];
    setUniqueVersions(uniqueVersions);
  } catch (error) {
    console.error('Error:', error);
  }
};

export const fetchMeasurementNames = async (setMeasurementNames) => {
  try {
    const measurementsResponse = await axios.get('http://localhost:5000/measurements');
    setMeasurementNames(measurementsResponse.data);
  } catch (error) {
    console.error('Error:', error);
  }
};

