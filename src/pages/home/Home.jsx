import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Hero from './sections/Hero';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="">
      <Hero />
    </div>
  );
};

export default Home;