import { useState } from 'react'

import Navbar from '../components/Navbar'
import EmailInput from '../components/EmailInput'
import AutoFilledForm from '../components/AutoFilledForm'
import api from '../services/api';

function App() {
  const [data,setData] = useState(null);
  const [loading,setLoading] = useState(false);
  
  const handleExtract = async (email_text) => {
    setLoading(true);
    try {
      const response = await api.post('/extract-data/', { email_text});
      console.log(data);
      setData(response.data);
    } catch (error) {
      console.error('Error extracting data:', error.response?.status, error.response?.data || error.message);
      setData(null);
    } finally {
      // document.getElementById('auto_fill_form')?.scrollIntoView({ behavior: 'smooth' })
      setLoading(false);
    }
  };
  return (
    <>
      <Navbar />
      <div className="main flex flex-col mx-auto w-full max-w-6xl gap-6 md:gap-10" >
        <EmailInput onSubmit={handleExtract} loading={loading}/>
        <hr className='text-gray-600'/>
        <AutoFilledForm data={data} />
      </div>
    </>
  ) 
}

export default App
