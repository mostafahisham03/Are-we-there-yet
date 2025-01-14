import { useState, useEffect } from 'react';
import axiosInstance from '../../shared/services/axiosInstance';

export default function UpdatePopup({ dialogRef, title, _id, setCategories }) {
  const [isFormValid2, setIsFormValid2] = useState(false);
  const [name2, setName2] = useState('');

  useEffect(() => {
    // Check if both fields are non-empty
    setIsFormValid2(name2.trim().length > 0);
  }, [name2]);

  const handleButtonClick = () => {
    if (isFormValid2) {
      updateCategory(name2, _id).then(() => {
        setName2('');
      });
    } else {
      dialogRef.current?.close(); // Close dialog if "Cancel" is clicked
    }
  };

  const updateCategory = async (name: string, _id: string) => {
    console.log('updating with:', name, _id);
    try {
      // const response = await fetch(`https://are-we-there-yet-mirror.onrender.com/api/categories/${_id}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ _id, name }),
      // });
      const response = await axiosInstance.put(`/categories/${_id}`, {
        _id,
        name,
      });

      // if (!response.ok) {
      //   throw new Error('Failed to update Category');
      // }
      if (response.status !== 200) {
        throw new Error('Failed to update Category');
      }

      // await response.json();
      setCategories((prevCategories) => {
        return prevCategories.map((Category) => {
          if (Category._id === _id) {
            return { _id, name };
          }
          return Category;
        });
      });
      dialogRef.current?.close();
    } catch (error) {
      console.error('Error updating Category:', error);
    }
  };

  return (
    <dialog ref={dialogRef}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleButtonClick();
        }}
      >
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20">
          <div className="w-96 rounded-lg bg-white p-8">
            <h2 className="mb-6 text-2xl font-semibold">{title}</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" htmlFor="name2">
                Name
              </label>
              <input
                type="text"
                id="name2"
                value={name2}
                onChange={(e) => setName2(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleButtonClick}
                className={`rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                  isFormValid2
                     ? 'bg-accent-dark-gold hover:bg-accent-dark-blue/80 focus:ring-gray-500'
                : 'border-red-200 text-lg text-red-600 hover:bg-red-50 hover:text-red-700'
                }`}
              >
                {isFormValid2 ? 'Update' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </dialog>
  );
}
