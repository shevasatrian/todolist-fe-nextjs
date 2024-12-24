import dynamic from "next/dynamic";
import { useQueries } from "@/hooks/useQueries";
import Cookies from "js-cookie";
import { useMutation } from "@/hooks/useMutation";
import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import { FaSadCry, FaUserEdit } from "react-icons/fa";
import Image from "next/image";
import Swal from "sweetalert2";
import ImageCropper from "@/components/image-cropper";
import { resolve } from "styled-jsx/css";

const LayoutComponent = dynamic(() => import("@/layout"));

export default function Profile() {
    const router = useRouter()
    const { mutate } = useMutation()
    const [isEditing, setIsEditing] = useState(false)

    // state untuk menyimpan data yang diedit
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [photo, setPhoto] = useState(null)

    // crop image
    const [showCropper, setShowCropper] = useState(false)
    const [croppedPhoto, setCroppedPhoto] = useState(null)

    const inputFileRef = useRef(null)

    const { data: user, refetch } = useQueries({
        prefixUrl: "https://localhost:7211/apiAuth/User/me",
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        }
      });

    // Set state saat data user didapatkan
    useEffect(() => {
        if (user) {
            setFirstName(user.firstName || "");
            setLastName(user.lastName || "");
        }
    }, [user]);

    const handleUpdate = async () => {
        if (photo) {
            const allowedFormats = ["image/jpeg", "image/png", "image/jpg"]
            const maxSizeMb = 2;

            if (!allowedFormats.includes(photo.type)) {
                Swal.fire({
                    title: "Invalid format",
                    text: "Only JPG, JPEG and PNG format are allowed",
                    icon: "error"
                })
                return
            }

            if (photo.size > maxSizeMb * 1024 * 1024) {
                Swal.fire({
                    title: "File size too large",
                    text: `File size should not exceed ${maxSizeMb} MB.`,
                    icon: "error"
                })
                return
            }
        }

        const formData = new FormData();
        formData.append("FirstName", firstName);
        formData.append("LastName", lastName);
        if (croppedPhoto) formData.append("ProfilePicture", croppedPhoto);

        for (let [key, value] of formData.entries()) {
            console.log(key, value);
          }
        
        try {
            await mutate({
                url: `https://localhost:7211/apiAuth/Edit`,
                method: "PUT",
                payload: formData,
                headers: {
                  Authorization: `Bearer ${Cookies.get("token")}`,
                },
              });
              Swal.fire({
                  title: "Success",
                  text: "Profile has been updated",
                  icon: "success"
              })
                setCroppedPhoto(null);

                // Kosongkan input file
                if (inputFileRef.current) {
                    inputFileRef.current.value = ""
                }
                setIsEditing(false);
                refetch();
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: "Error updating profile: " + error,
                icon: "error"
            })
        }
        
    };

    const handleEditClick = () => {
        setIsEditing(true)
    }

    const handleCancelClick = () => {
        setIsEditing(false)
        // Kembalikan data ke nilai awal saat cancel
        setFirstName(user?.firstName || "");
        setLastName(user?.lastName || "");
        setPhoto(null);
        setCroppedPhoto(null);

        // Kosongkan input file
        if (inputFileRef.current) {
            inputFileRef.current.value = ""
        }
    }

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0]
        if (selectedFile) {
            setPhoto(selectedFile)
            setShowCropper(true)
        }
    }

    const handleCropComplete = async (croppedAreaPixels) => {
        const croppedImage = await getCroppedImg(photo, croppedAreaPixels)
        setCroppedPhoto(croppedImage)
        setShowCropper(false)
    }

    const handleCancelCrop = () => {
        setPhoto(null)
        setShowCropper(false)
    }

    const getCroppedImg = (imageFile, croppedAreaPixels) => {
        return new Promise((resolve, reject) => {
            const img = document.createElement("img")
            img.src = URL.createObjectURL(imageFile)
            img.onload = () => {
                const canvas = document.createElement("canvas")
                canvas.width = croppedAreaPixels.width
                canvas.height = croppedAreaPixels.height
                const ctx = canvas.getContext("2d")

                ctx.drawImage (
                    img,
                    croppedAreaPixels.x,
                    croppedAreaPixels.y,
                    croppedAreaPixels.width,
                    croppedAreaPixels.height,
                    0,
                    0,
                    croppedAreaPixels.width,
                    croppedAreaPixels.height
                )

                canvas.toBlob((blob) => {
                    if (blob) {
                        resolve(new File([blob], imageFile.name, { type: imageFile.type }))
                    } else {
                        reject(new Error("Failed to crop image"))
                    }
                }, imageFile.type)
            }
            img.onerror = reject
        })
    }

    return (
        <>
            <LayoutComponent metaTitle="Profile">
                <div className="flex flex-col w-full items-center justify-center ">
                    {/* photo profile */}
                    <div className="w-20 h-20 md:w-24 md:h-24 relative overflow-hidden rounded-full border border-gray-300">
                        {croppedPhoto ? (
                            <Image
                            src={URL.createObjectURL(croppedPhoto)}
                            alt="Cropped Profile Picture"
                            layout="fill"
                            objectFit="cover"
                            />
                        ) : user?.profilePicture ? (
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
                    
                    <h3 className="text-2xl md:text-3xl text-gray-700 font-semibold">{user?.firstName} {user?.lastName}</h3>

                    {showCropper && (
                        <ImageCropper
                            photo={photo}
                            onCropComplete={handleCropComplete}
                            onCancel={handleCancelCrop}
                        />
                    )}

                    <form className="pt-10 pb-6 md:w-1/2 lg:w-1/3" action="">

                        <div className="justify-self-end">
                            <button 
                                type="button"
                                className={`py-[0.30rem] px-3 bg-slate-200 rounded-xl text-sm md:text-base border border-gray-500 flex items-center ${
                                    isEditing ? "bg-gray-400 cursor-not-allowed " : "bg-slate-200 hover:opacity-80"
                                  }`}
                                onClick={handleEditClick}
                                disabled={isEditing}
                                >
                                <FaUserEdit className="pr-1 size-5" /> Edit</button>
                        </div>  

                        <div className="py-4">
                            <label className=" text-sm font-medium text-gray-700">First Name</label>
                            <input 
                            type="text" 
                            id="firstName" 
                            name="firstName" 
                            value={firstName}
                            onChange={(event) => setFirstName(event.target.value)}
                            placeholder="First Name"
                            className={`w-full mt-1 px-4 py-2 border border-gray-500 rounded-2xl focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                                isEditing ? "bg-white" : "bg-gray-300"
                              }`}
                              disabled={!isEditing} />
                        </div>

                        <div className="py-4">
                            <label htmlFor="email" className=" text-sm font-medium text-gray-700">Last Name</label>
                            <input 
                            type="text" 
                            id="firstName" 
                            name="firstName" 
                            value={lastName}
                            onChange={(event) => setLastName(event.target.value) ?? ""}
                            placeholder="Last Name"
                            className={`w-full mt-1 px-4 py-2 border border-gray-500 rounded-2xl focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                                isEditing ? "bg-white" : "bg-gray-300"
                              }`}
                            disabled={!isEditing} />
                        </div>

                        <div className="col-span-full py-4">
                            <label htmlFor="photo" className="text-sm font-medium text-gray-700">Photo</label>
                            <div className="mt-1 flex items-center gap-x-3">
                                <svg className="size-16 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" data-slot="icon">
                                <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd" />
                                </svg>
                                <input
                                    type="file"
                                    id="photo"
                                    name="photo"
                                    ref={inputFileRef}
                                    className={`rounded-xl px-2 py-1.5 w-full text-sm font-semibold shadow-sm ring-1 ring-inset ring-gray-300 ${
                                        isEditing ? "cursor-pointer bg-white hover:bg-gray-100" : "cursor-not-allowed bg-gray-300"
                                    }`}
                                    disabled={!isEditing}
                                    onChange={handleFileChange}
                                />
                            </div>
                        </div>

                        <div className="justify-self-end">
                            <button 
                                type="button"
                                className={`py-[0.35rem] px-3 mr-2 rounded-xl text-sm md:text-base border border-gray-500 ${
                                    isEditing ? "cursor-pointer bg-red-500 text-slate-100 hover:opacity-90" : "cursor-not-allowed bg-gray-300"
                                }`}
                                disabled={!isEditing}
                                onClick={handleCancelClick}
                                >Cancel</button>
                            <button 
                                type="button"
                                className={`py-[0.35rem] px-3 rounded-xl text-sm md:text-base border border-gray-500 ${
                                    isEditing ? "cursor-pointer bg-blue-400 text-slate-100 hover:opacity-90" : "cursor-not-allowed bg-gray-300"
                                }`}
                                disabled={!isEditing}
                                onClick={handleUpdate}
                                >Save change</button>
                        </div>
                    </form>
                </div>

            </LayoutComponent>
        </>
    )
}