import Image from "next/image";
import localFont from "next/font/local";
import dynamic from "next/dynamic";
import { useQueries } from "@/hooks/useQueries";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { FaTrashAlt, FaPencilAlt } from 'react-icons/fa';
import { useMutation } from "@/hooks/useMutation";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import NoteModal from "./note/[id]"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const LayoutComponent = dynamic(() => import("@/layout"));

export default function Home() {
  const router = useRouter()
  const { mutate } = useMutation()
  const [showModal, setShowModal] = useState(false)
  const [selectedNote, setSelectedNote] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(12)
  const [screenWidth, setScreenWidth] = useState(0);

  const { data: user } = useQueries({
    prefixUrl: "https://localhost:7211/apiAuth/User/me",
    headers: {
      Authorization: `Bearer ${Cookies.get("token")}`,
    }
  });

  const { data: notes, refetch } = useQueries({
    prefixUrl: "https://localhost:7211/apiList/GetAllList",
    headers: {
      Authorization: `Bearer ${Cookies.get("token")}`,
    }
  })
  console.log(notes)

  const filteredNotes = notes?.filter((note) =>
    note.note.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDelete = async (toDoListId) => {
    Swal.fire({
      title: "Are you sure to delete this note?",
      showCancelButton: true,
      confirmButtonColor: "#d33", // Warna merah
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        mutate({
          url: `https://localhost:7211/apiList/DeleteList/${toDoListId}`,
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          }
        });
        Swal.fire("Note has been deleted", "", "success").then(() => {
          router.reload();
        })
      }
    });
  }

  const handleUpdateClick = (note) => {
    setSelectedNote(note);
    setShowModal(true);
  }

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure to logout?",
      showCancelButton: true,
      confirmButtonColor: "#d33", // Warna merah
      confirmButtonText: "Yes",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        Swal.fire("Logout success!", "", "success");
        Cookies.remove('token');
        router.push('/login');
      }
    });
  };

  // set current item notes
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem -itemsPerPage
  const currentNotes = filteredNotes?.slice(indexOfFirstItem, indexOfLastItem)

  // set page
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  // set next page and prev page
  const nextPage = () => {
    if (currentPage < Math.ceil(filteredNotes?.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

   // Set screenWidth after component mounts to get window.innerWidth
   useEffect(() => {
    setScreenWidth(window.innerWidth);
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalPages = Math.ceil(filteredNotes?.length / itemsPerPage);
  let startPage = 1;
  let endPage = totalPages;

  // Logic for 'md' screen
  if (screenWidth <= 1024) {
    if (totalPages > 3) {
      if (currentPage === 1) {
        startPage = 1;
        endPage = 3;
      } else if (currentPage === totalPages) {
        startPage = totalPages - 2;
        endPage = totalPages;
      } else {
        startPage = currentPage - 1;
        endPage = currentPage + 1;
      }
    }
  }

  // Logic for 'lg' screen (greater than 1024px)
  if (screenWidth > 1024) {
    if (totalPages > 10) {
      if (currentPage <= 6) {
        startPage = 1;
        endPage = 10;
      } else if (currentPage + 4 >= totalPages) {
        startPage = totalPages - 9;
        endPage = totalPages;
      } else {
        startPage = currentPage - 5;
        endPage = currentPage + 4;
      }
    }
  }

  return (
    <>
      <LayoutComponent metaTitle="Notes">
        <div className="pb-6 flex flex-col md:flex-row justify-between items-start">
          {/* Header Section */}
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl md:text-5xl font-semibold">Hi {user?.firstName}👋</h1>
            <h3 className="text-lg md:text-3xl font-semibold mt-2 text-slate-700">
              This is your ToDoList
            </h3>
          </div>

          {/* Search and Logout Section */}
          <div className="w-full md:w-auto flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            
            {/* Search Input */}
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="search"
                id="default-search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full py-2 pl-10 pr-3 text-sm border border-gray-600 rounded-full bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search"
              />
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="px-4 py-2 w-full sm:w-auto text-white bg-red-500 rounded-xl hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>

        {/* notes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10  p-6">
          {filteredNotes?.length === 0 ? (
            <div className="col-span-full text-center text-xl text-gray-500">
              Note empty
            </div>
           ) : currentNotes?.map((note) => (
            <div
              key={note.id}
              className="p-4 border rounded-xl flex flex-col justify-between h-full hover:scale-105 duration-500 shadow-md"
              style={{ backgroundColor: note.color }}
            >
              <div className="flex-1">
                <p className="text-lg font-semibold">{note.note}</p>
              </div>
              <div className="mt-12 flex justify-between items-end">
                <p className="text-xs lg:text-sm text-gray-500">
                  {new Date(note.createdOn).toLocaleDateString("en-EN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <div className="flex"> 
                  <button 
                    onClick={() => handleDelete(note.id)}
                    className="p-2 rounded-full bg-red-500 border-2 border-red-300 hover:opacity-90 hover:scale-105 duration-500 mr-1">
                    <FaTrashAlt className="text-white text-[15px] md:text-[18px]" />
                  </button>
                  <button 
                    onClick={() => handleUpdateClick(note)}
                    className="p-2 rounded-full bg-slate-900 border-2 border-slate-700 hover:opacity-90 hover:scale-105 duration-500">
                    <FaPencilAlt className="text-white text-[15px] md:text-[18px]" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          
        </div>

        <div className="flex justify-between items-center mb-4 pb-16 flex-col sm:flex-row">
          <div className="flex items-center space-x-2 mb-4 sm:mb-0">
              <label htmlFor="itemsPerPage" className="text-gray-700">Show:</label>
              <select 
                id="itemsPerPage"
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(parseInt(e.target.value))
                  setCurrentPage(1)
                }}
                className="border rounded px-2 py-1">
                  <option value={12}>12</option>
                  <option option value={9}>9</option>
                  <option value={6}>6</option>
              </select>
          </div>

          {/* Tombol Nomor Halaman */}
          <div className="flex flex-wrap space-x-2 space-y-2 sm:space-y-0 hidden md:block">
            {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => paginate(pageNumber)}
                className={`px-3 py-1 rounded-xl ${currentPage === pageNumber ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                {pageNumber}
              </button>
            ))}
          </div>

          <div>
            <span className="text-gray-500 text-sm mr-2">
              {`Showing ${indexOfFirstItem + 1} to ${Math.min(indexOfLastItem, filteredNotes?.length)} of ${filteredNotes?.length} results`}
            </span>

            {/* button previous */}
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className={`w-full sm:w-auto px-3 py-1 mb-1 md:mb-0 rounded-xl ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white'} mr-2`}
              >
              Previous
            </button>

            {/* button next */}
            <button
              onClick={nextPage}
              disabled={currentPage === Math.ceil(filteredNotes?.length / itemsPerPage)}
              className={`w-full sm:w-auto px-3 py-1 rounded-xl ${currentPage === Math.ceil(filteredNotes?.length / itemsPerPage) ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white'}`}
              >
              Next
            </button>
          </div>
          

        </div>

      </LayoutComponent>
      
      {showModal && selectedNote && (
          <NoteModal 
            isOpen={showModal}
            onClose={() => { setShowModal(false); refetch(); }}
            toDoListId={selectedNote.id}
            initialNote={selectedNote.note}
            backgroundColor={selectedNote.color}
           />
        )}
    
    </>
  );
}
