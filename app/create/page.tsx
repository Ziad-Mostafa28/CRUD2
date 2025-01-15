'use client'
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, useState } from 'react'

const Createpage = () => {
  const [formData,setFormData] =useState({term:"",interpretation:""});
  const [isLoading,setIsLoading] = useState(false);
  const [error,setError] = useState<string | null>(null);

  const router =useRouter();

  const handleInputChange = (e:ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prevData) => (
      {
        ...prevData,
        [e.target.name]: e.target.value,
      }
    ));

    console.log(formData)
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.term || !formData.interpretation) {
      setError("Please fill in all the fields");
      return;
    }
    setError(null);
    setIsLoading(true);

    try{
      const response = await fetch('/api/interpretations',{
        method:"POST",
        headers:{
          'Content-type':'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('faild to Create');
      }
      router.push("/");
    } catch (error) {
      console.log(error);
      setError("something wrong");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
        <h2 className="text-2x1 font-bold my-8">Add New Interpretation</h2> 
            <form onSubmit={handleSubmit} className="flex gap-3 flex-col"> 
            <input 
            type="text" 
            name="term"
            value={formData.term}
            placeholder="Tern" 
            className="py-1 px-4 border rounded-md"
            onChange={handleInputChange}/> 
            <textarea name="interpretation" rows={4}
            value={formData.interpretation}
            placeholder='Interpretation'
            className='py-1 px-4 border round-md resize-none'
            onChange={handleInputChange}
            ></textarea> 
            <button className='bg-black text-white mt-5 px-4 py-1 rounded-md cursor-pointer'
            type='submit'
            disabled={isLoading}>
              
              {isLoading ? "Adding.." : "Add interpretation"}
            </button>
            </form> 
            {error && <p className='text-red-500 mt-4'>{error}</p>}
    </div>
  )
}

export default Createpage