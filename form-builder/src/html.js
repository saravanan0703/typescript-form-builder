import React from "react";
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function HtmlCode () {
    const location = useLocation();
    const htmlCode = location.state.html;
    const navigate = useNavigate();
    const BackPage = () => {
        navigate('/');
    };
    return(
        <div>
            <div className="mt-4 bg-emerald-900	p-10 text-white">
                <button className="text-white mb-10 bg-emerald-950 p-2 rounded-xl" onClick={BackPage}>Create Another Form</button>
                <h2 className='text-2xl mb-4'>The Template of the Generated Html Code :</h2>  
                <pre dangerouslySetInnerHTML={{ __html: htmlCode}} />
            </div>
        </div>
    )
}

export default HtmlCode