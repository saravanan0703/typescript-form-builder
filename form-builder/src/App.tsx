import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import LeftSidebar from './LeftSidebar';
import { useNavigate } from 'react-router-dom';

interface FormElement {
  id: number;
  type: string;
  label: string;
}

interface FormData {
  [key: string]: string;
}

const FormBuilder: React.FC = () => {
  const [formElements, setFormElements] = useState<FormElement[]>([]);
  const [formData, setFormData] = useState<FormData>({});
  const [htmlCode, setHtmlCode] = useState<string>('');
  const [editingElementId, setEditingElementId] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState<string>(''); 
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);
  const navigate = useNavigate();

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('text/plain');

    if (type === 'submit') {
      // If dragged element is a submit button, add it to form elements directly
      const newElement: FormElement = {
        id: formElements.length + 1,
        type,
        label: 'Submit',
      };

      setFormElements([...formElements, newElement]);
    } else {
      // For other elements, create a new form element
      const newElement: FormElement = {
        id: formElements.length + 1,
        type,
        label: `${type.charAt(0).toUpperCase()}${type.slice(1)} ${formElements.length + 1}`,
      };

      setFormElements([...formElements, newElement]);
    }
  };

  const handleRemoveElement = (id: number) => {
    const updatedElements = formElements.filter((element) => element.id !== id);
    setFormElements(updatedElements);

    // Remove data associated with the removed element
    const { [id]: removedElement, ...updatedData } = formData;
    setFormData(updatedData);
  };

  const handleEditLabelStart = (id: number) => {
    setEditingElementId(id);
  };

  const handleEditLabelEnd = () => {
    setEditingElementId(null);
  };

  const handleInputChange = (id: number, value: string) => {
    setFormElements((elements) =>
      elements.map((element) =>
        element.id === id ? { ...element, label: value } : element
      )
    );
    setFormData((data) => ({ ...data, [id]: value }));
  };

  const inputChange = (value: string) => {
    setInputValue(value); // Update the input value in the state
  }

  const generateHtmlCode = async () => {
    const code = formElements
      .map((element) => {
        if (element.type === 'textfield') {
          return `<div><label class="text-white">${element.label} : </label><input type="text" class="border-2 border-solid border-emerald-700	 rounded" name="${element.label}" value="${inputValue}"/></div>`;
        } else if (element.type === 'button') {
          return `<div><button class="bg-orange-600 text-white p-2 rounded m-3">${element.label}</button></div>`;
        }
        return '';
      })
      .join('');

    setHtmlCode(code);
    try { 
      const { error } = await fetch('http://localhost:8080/save', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      }).then((res) => res.json());
      handleShow(); // Open the modal
      if (error) {
        throw error;
      }
    } catch (error) {
      console.log(error)
    }
    
  };
  // Sample HTML code from your object
  const code = {
    htmlCode: {
      htmlCode: `${htmlCode}`,
    },
  };


  const redirectToHtmlPage = () => {
    // Assuming 'code' is the HTML code you want to pass
    //const htmlCode = encodeURIComponent(code.htmlCode.htmlCode);
    const html = code.htmlCode.htmlCode;
    navigate('/html', { state: { html } });
  };
  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateHtmlCode();
  };

  return (
    <div className='md:grid grid-cols-3 gap-5 mt-20 mb-20 container'>
      <LeftSidebar />

      <div 
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-rose-500 p-12 text-center">
        <div>
          <h3 className='mb-10 text-lg'>
            Drop the Dragged Elements Here 
          </h3>
        </div>
        {formElements.map((element) => (
          <div key={element.id}>
            {element.type === 'textfield' && (
              <div className='mt-5'>
                <label className='text-red-500'>Label for Text Field:</label>
                {editingElementId === element.id ? (
                  <div>
                    <input
                      type="text"
                      value={element.label}
                      onChange={(e) =>
                        handleInputChange(element.id, e.target.value)
                      }
                      onBlur={handleEditLabelEnd}
                      className='border-solid border-2 border-sky-500 w-full block'
                    />
                  </div>
                ) : (
                  <div>
                    <span className='border-solid border-2 border-sky-500 w-full block p-2' onClick={() => handleEditLabelStart(element.id)}>
                      {element.label}
                    </span>
                  </div>
                )}
              </div>
            )}

            {element.type === 'button' && (
              <div className='mt-5'>
                <label className='text-red-500'>Label for Button:</label>
                {editingElementId === element.id ? (
                  <div>
                    <input
                      type="text"
                      value={element.label}
                      onChange={(e) =>
                        handleInputChange(element.id, e.target.value)
                      }
                      onBlur={handleEditLabelEnd}
                      autoFocus
                      className='border-solid border-2 border-sky-500 w-full block'
                      placeholder='Enter the button Name'
                    />
                  </div>
                ) : (
                  <div>
                    <button className='bg-transparent border-2 text-black border-solid border-black p-2 block w-full' onClick={() => handleEditLabelStart(element.id)}>
                      {element.label}
                    </button>
                  </div>
                )}
              </div>
            )}

            {element.type === 'submit' && (
              <div>
                <button className="bg-red-500 text-white p-2 rounded" type="button" onClick={() => handleRemoveElement(element.id)}>
                  Remove
                </button>
              </div>
            )}

            {element.type !== 'submit' && (
              <button className="bg-red-500 text-white p-2 rounded" type="button" onClick={() => handleRemoveElement(element.id)}>
                Remove
              </button>
            )}
          </div>
        ))}
      </div>

      <div className='border-2 border-rose-500 p-6 text-center"'>
        <div>
          <h3 className='text-2xl text-red-400 font-bold'>Preview Form Elements:</h3>
          {formElements.map((element) => (
            <div key={element.id}>
              {element.type === 'textfield' && (
                <div className='mt-3'>
                  <label className='mr-2'>{element.label}:</label>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => inputChange(e.target.value)}
                    className ="border-2 border-solid border-black rounded"
                    placeholder='The Value Will Come Here'
                    readOnly
                  />
                </div>
              )}

              {element.type === 'button' && (
                <div className='mt-3'>
                  <button className="border-solid border-gray-500 border-2 text-black p-2 rounded w-1/5 read-only:bg-gray-300">{element.label}</button>
                </div>
              )}
            </div>
          ))}
        </div>
        <button className="mt-9 bg-blue-500 text-white p-2 rounded" type="submit" onClick={handleSubmit}>
          Generate Html Code
        </button>
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Generated HTML Code:</h3>
          <div>{htmlCode}</div>
          {htmlCode && (
            <button className='text-amber-600 bg-black p-2 font-bold mt-4 rounded-xl' onClick={redirectToHtmlPage}>
              Create a HTML Template
            </button>
          )}
        </div>
      </div>

      <Modal show={showModal}>
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>You Html Output Code Has been Successfully Saved to the Supabase DB!......</p>
        </Modal.Body>
        <Modal.Footer>
          <Button className='btn btn-secondary' onClick={handleClose}>
            <p className='text-black'>Close</p>
          </Button>
        </Modal.Footer>
      </Modal>
    
    </div>
    
  );
};

export default FormBuilder;
