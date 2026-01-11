import { useState, useEffect } from "react";
import { FaDeleteLeft } from "react-icons/fa6";
const AutoFilledForm = ({ data }) => {
    const [name, setName] = useState("");
    const [date, setDate] = useState("");
    const [actions, setActions] = useState([]);

    // // Custom data for testing/demo purposes
    // const [date, setDate] = useState("2024-01-15");
    // const [name, setName] = useState("John Doe");
    // const [actions, setActions] = useState(["Review documents", "Send email", "Schedule meeting"]);

    useEffect(() => {
        if (data) {
            setName(data.name || "");
            setDate(data.date || "");
            setActions(data.action_items || []);
        }
    }, [data]);

    const handleRemoveAction = (index) => {
        const updatedActions = actions.filter((_, i) => i !== index);
        setActions(updatedActions);
    }
    return (
        <div className="auto-fill-form w-full sm:w-xl mx-auto mt-10" id="auto_fill_form">
            <h2 className="text-xl mb-4">Auto-Filled Schedule</h2>

            <div className="">
                <label>Name</label>
                <input className="outline rounded p-2 md:text-lg"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>

            <div className="">
                <label>Date</label>
                <input
                    className="outline rounded p-2 md:text-lg"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
            </div>

            <div className="">

                <label>Action Items</label>
                <ul>
                    {actions.map((item, index) => (
                        <li key={index} className="flex items-center  text-gray-400"><span className="grow">{item}</span>
                            <span onClick={()=>handleRemoveAction(index)} className=""><FaDeleteLeft className="text-red-700 cursor-pointer"/> </span>
                        </li>
                    ))}
                    <button ></button>
                <li className="flex gap-2 mt-2">
                    <input 
                        type="text" 
                        placeholder="Add new action" 
                        className="flex-1 outline rounded p-2"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && e.target.value.trim()) {
                                setActions([...actions, e.target.value]);
                                e.target.value = '';
                            }
                        }}
                    />
                    <button 
                        onClick={(e) => {
                            const input = e.target.previousElementSibling;
                            if (input.value.trim()) {
                                setActions([...actions, input.value]);
                                input.value = '';
                            }
                        }}
                        className="bg-blue-600 cursor-pointer text-white px-4 rounded hover:bg-blue-700"
                    >
                        Add
                    </button>
                </li>
                </ul>
            </div>

            <button className="bg-gray-950 w-full p-2 rounded">Confirm</button>
        </div>
    );
};

export default AutoFilledForm;
