import { useState } from "react";
import { useMutation } from "../../hooks/useMutation";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import Swal from "sweetalert2";

const NoteModal = ({ isOpen, onClose, toDoListId, initialNote, backgroundColor }) => {
    const [note, setNote] = useState(initialNote);
    const router = useRouter();
    const { mutate } = useMutation();

    const handleUpdate = async () => {
        await mutate({
          url: `https://localhost:7211/apiList/UpdateList/${toDoListId}`,
          method: "PUT",
          payload: { note, backgroundColor },
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        });
        onClose()
        Swal.fire({
            title: "Success",
            text: "Note has been updated",
            icon: "success"
        })
    };

    console.log(backgroundColor, note)

    return (
        <>
            {/* Modal */}
            {isOpen && (
                <div 
                className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-all duration-300"
                onClick={() => setShowModal(false)}
                >
                <div
                    className={`
                    w-11/12 max-w-md 
                    transform transition-all duration-300 
                    scale-95 hover:scale-100 
                    rounded-xl shadow-2xl 
                    border-2 border-opacity-50
                    overflow-hidden
                    `}
                    style={{ 
                    backgroundColor: backgroundColor, 
                    borderColor: `${backgroundColor}80` // Tambah sedikit opacity ke border
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header dengan judul */}
                    <div 
                    className="px-6 py-4 border-b border-opacity-20"
                    style={{ borderColor: 'black' }}
                    >
                    <h2 className="text-xl font-semibold text-gray-800">
                        Update Note
                    </h2>
                    </div>

                    {/* Konten Modal */}
                    <div className="p-6">
                    <textarea
                        className={`
                        w-full p-3 
                        rounded-lg 
                        focus:ring-2 focus:ring-blue-300 
                        transition-all duration-300
                        text-gray-800
                        `}
                        style={{ 
                        backgroundColor: `${backgroundColor}70`, // Tambah sedikit transparansi
                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
                        }}
                        rows={5}
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Write your note here..."
                    ></textarea>
                    </div>

                    {/* Footer dengan tombol */}
                    <div 
                    className="px-6 py-4 
                    flex justify-end 
                    space-x-3 
                    border-t border-opacity-20"
                    style={{ borderColor: 'black' }}
                    >
                    <button 
                        className="
                        px-4 py-2 
                        rounded-lg 
                        text-gray-700 
                        bg-gray-200 
                        hover:bg-gray-300 
                        transition-all 
                        duration-300
                        "
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button 
                        className="
                        px-4 py-2 
                        rounded-lg 
                        text-white 
                        bg-blue-600 
                        hover:bg-blue-700 
                        transition-all 
                        duration-300
                        shadow-md hover:shadow-lg
                        "
                        onClick={() => handleUpdate()}
                    >
                        Update
                    </button>
                    </div>
                </div>
                </div>
            )}
        </>
    )
}

export default NoteModal;