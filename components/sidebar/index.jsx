import { useState, useEffect } from "react";
import { useMutation } from "@/hooks/useMutation";
import { useQueries } from "@/hooks/useQueries";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import Link from "next/link";
import Image from "next/image";

export default function Sidebar() {
  const [showDropdown, setShowDropdown] = useState(false)
  const [isMobile, setIsMobile] = useState(false) // Deteksi perangkat mobile/tablet
  const [selectedColor, setSelectedColor] = useState("") // warna yang dipilih
  const [showModal, setShowModal] = useState(false) // Tampilkan modal
  const [noteText, setNoteText] = useState("") // Note Todolist
  const colors = ["yellow", "orange", "violet", "aqua", "lime", "LightPink"]; // Warna-warna lingkaran
  const { mutate } = useMutation()
  const router = useRouter();

  const { data: user } = useQueries({
    prefixUrl: "https://localhost:7211/apiAuth/User/me",
    headers: {
      Authorization: `Bearer ${Cookies.get("token")}`,
    }
  });

  useEffect(() => {
    // Deteksi ukuran layar untuk menentukan mode
    const handleResize = () => {
      setIsMobile(window.matchMedia("(max-width: 1024px)").matches); // sm dan md
    };
    handleResize(); // Inisialisasi
    window.addEventListener("resize", handleResize); // Tambahkan event listener
    return () => window.removeEventListener("resize", handleResize); // Bersihkan event listener
  }, []);

  const handleCreate = async () => {
    const payload = { Note: noteText, Color: selectedColor }
    const response = await mutate({
      url: "https://localhost:7211/apiList/CreateList",
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`, // Sertakan token dalam header
      },
      payload
    })
    console.log(response)

    if (response) {
      Swal.fire({
        title: "Success",
        text: "Data Added Successfully",
        icon: "success"
      }).then(() => {
        router.reload();
      })
      setShowModal(false);
      setNoteText("");
    } else {
      Swal.fire({
        title: "Failed",
        text: "Failed to add data",
        icon: "error"
      });
    }
  }

  return (
    <aside className="w-16 md:w-28 bg-gray-800 text-white flex flex-col items-center py-6  relative">
      {/* Container Tombol dan Dropdown */}

      {/* photo profile start */}
            <div className="w-12 h-12 md:w-20 md:h-20 mb-1 relative px-4 overflow-hidden  rounded-full border border-gray-600">
                  {user?.profilePicture ? (
                      <Image
                      src={`data:image/jpeg;base64,${user.profilePicture}`}
                      alt="Profile Picture"
                      layout="fill"
                      objectFit="cover"
                      />
                  ) :
                  (<svg className="size-full text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" data-slot="icon">
                      <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clip-rule="evenodd" />
                  </svg>
                  )}
            </div>
            {/* photo profile end */}

      <div className="mt-3 mb-6">
        <Link className="bg-slate-500 px-2 py-1 md:px-4 md:py-2 rounded-xl shadow-lg text-sm hover:bg-slate-400 duration-300 transition" href={router.pathname === "/profile" ? "/" : "/profile"}>
            {router.pathname === "/profile" ? "Home" : "Profile"}
        </Link>

      </div>

      <div
        className="relative"
        onMouseEnter={!isMobile ? () => setShowDropdown(true) : undefined} // Hover untuk layar lg
        onMouseLeave={!isMobile ? () => setShowDropdown(false) : undefined} // Hover untuk layar lg
        onClick={isMobile ? () => setShowDropdown((prev) => !prev) : undefined} // Click untuk layar sm/md
      >
        {/* Tombol + */}
        <button className="bg-blue-500 p-3 rounded-full shadow-lg hover:bg-blue-600 transition">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </button>

        {/* Dropdown dengan Animasi */}
        <div
          className={`absolute top-full left-1/2 transform -translate-x-1/2 p-3 rounded-lg shadow-lg flex flex-col items-center space-y-4 transition-all duration-1000 ${
            showDropdown
              ? "opacity-100 scale-100 translate-y-0 "
              : "opacity-0 scale-90 -translate-y-2 pointer-events-none"
          }`}
        >
          {colors.map((color, index) => (
            <button
              key={index}
              style={{ backgroundColor: color }} // Warna lingkaran diatur langsung
              className="w-8 h-8 mt-2 rounded-full shadow-lg hover:scale-110 transition-transform cursor-pointer"
              onClick={() => {
                setSelectedColor(color); // Simpan warna yang dipilih
                setShowModal(true); // Tampilkan modal
              }}
            ></button>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
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
              backgroundColor: selectedColor, 
              borderColor: `${selectedColor}80` // Tambah sedikit opacity ke border
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header dengan judul */}
            <div 
              className="px-6 py-4 border-b border-opacity-20"
              style={{ borderColor: 'black' }}
            >
              <h2 className="text-xl font-semibold text-gray-800">
                Create New Note
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
                  backgroundColor: `${selectedColor}70`, // Tambah sedikit transparansi
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
                }}
                rows={5}
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
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
                onClick={() => setShowModal(false)}
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
                onClick={() => handleCreate()}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
