'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import _ from 'lodash';

const StationsContext = createContext();

export const useStations = () => {
  const context = useContext(StationsContext);
  if (!context) {
    throw new Error('useStations must be used within StationsProvider');
  }
  return context;
};

export const StationsProvider = ({ children }) => {
  const [stations, setStations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStations = async () => {
      try {
        const response = await fetch('/stations.json'); // Move JSON to public folder
        const data = await response.json();
        setStations(_.uniqBy(data, 'title'));
        setIsLoading(false);
      } catch (err) {
        setError(err);
        setIsLoading(false);
      }
    };

    loadStations();
  }, []);

  return (
    <StationsContext.Provider value={{ stations, isLoading, error }}>
      {children}
    </StationsContext.Provider>
  );
};

export const getStations = async () => {
  // If you're fetching from an API
  const response = await fetch('your-api-endpoint');
  return response.json();

  // OR if you're importing from a local file
  // return stations data directly
  return [
    // your stations array
  ];
};
