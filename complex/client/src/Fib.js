import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Fib = () => {
    const [seenIndexes, setSeenIndexes] = useState([])
    const [values, setValues] = useState({})
    const [index, setIndex] = useState('')

    useEffect(() => { 
        fetchValues()
        fetchIndexes()
    }, [seenIndexes, values])

    const fetchValues = async () => {
        const { data } = await axios.get('/api/values/current')
        setValues(data)
    }

    const fetchIndexes = async () => {
        const { data } = await axios.get('/api/values/all')
        setSeenIndexes(data)
    }

    const handleSubmit = async (e) => {
       e.preventDefault()

       await axios.post('api/values', {index})
       
       fetchIndexes()
   }

   return (
        <div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="index">Enter your index</label>
                <input type="text" name="index" id="index"
                    value={index}
                    onChange={({ target }) => setIndex(target.value)}
                />
                <button>submit</button>
            </form>

            <h3>Indexes I have seen:</h3>
            {seenIndexes.map(({ number }) => number).join(', ')}

            <h3>Calculated Values:</h3>
            {Object.keys(values).map(key => (
                <div key={key}>
                    For index {key} I calculated {values[key]}
                </div>
            ))}
        </div>
    )
}

export default Fib
