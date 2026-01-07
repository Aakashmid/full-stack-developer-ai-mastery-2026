import React, { useState } from 'react'

const EmailInput = ({ onSubmit, loading }) => {
    const [emailText, setEmailText] = useState('');
    const handleSubmit = () => {
        if (!emailText.trim()) return;
        onSubmit(emailText);
    };



    return (
        <div className='w-full sm:w-xl mx-auto mt-10'>
            <h2 className='text-xl'>Paste Raw Email</h2>
            <textarea
                className='w-full border rounded p-2 my-4 md:text-lg'
                rows="3"
                placeholder="Paste messy email here..."
                value={emailText}
                onChange={(e) => setEmailText(e.target.value)}
                disabled={loading}
            />

            <button disabled={loading} onClick={handleSubmit} className='w-full rounded-md md:text-lg py-2 bg-slate-600 cursor-pointer'>
                {loading ? 'Processing...' : 'Auto-Fill Schedule'}
            </button>
        </div>
    );
};

export default EmailInput