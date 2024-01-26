import React from 'react';

const LeftSidebar: React.FC = () => {
  const handleDragStart = (e: React.DragEvent, type: string) => {
    e.dataTransfer.setData('text/plain', type);
  };
  
  return (
    <div className="left-sidebar">
      <div className='border-2 border-rose-500 p-12 text-center'>
        <div>
          <h3 className='mb-10 text-lg'>
            Drag the needed Elements to Right Side and Drop there 
          </h3>
        </div>
        <div>
        <button className="w-3/5 bg-transparent border-2 text-black border-solid border-black p-2"
          draggable
          onDragStart={(e) => handleDragStart(e, 'textfield')}
        >
          <i className="fa fa-font pr-4" aria-hidden="true"></i>
          Text Field
        </button>
        </div>
        <div>
        <button className="w-3/5 bg-transparent border-2 text-black border-solid border-black p-2 mt-10" draggable onDragStart={(e) => handleDragStart(e, 'button')}>
          <i className="fa fa-spinner pr-4" aria-hidden="true"></i>
          Button
        </button>
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
