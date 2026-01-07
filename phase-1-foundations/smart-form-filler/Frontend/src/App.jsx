import { useState } from 'react'
import Navbar from '../components/Navbar'
import EmailInput from '../components/EmailInput'
import AutoFilledForm from '../components/AutoFilledForm'

function App() {
  const [data,setData] = useState(null);
  const [loading,setLoading] = useState(false);
  
  const handleExtract = async ({emailText}) => {
    setLoading(true);
    try {
      const response = await axios.post('/extract-data', { emailText });
      setData(response.data);
    } catch (error) {
      console.error('Error extracting data:', error);
      setData(null);
    }finally{
      setLoading(false);
    }
  };
  return (
    <>
      <Navbar />
      <div className="main flex flex-col mx-auto w-full max-w-6xl gap-6 md:gap-10" >
        <EmailInput onSubmit={handleExtract}/>
        <hr className='text-gray-600'/>
        <AutoFilledForm data={data} />
      </div>
    </>
  )
}

export default App
