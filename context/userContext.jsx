/* eslint-disable linebreak-style */
/* eslint-disable eol-last */
/* eslint-disable quotes */
/* eslint-disable quote-props */
/* eslint-disable semi */
/* eslint-disable import/order */
/* eslint-disable linebreak-style */
import { createContext } from "react";
import { useQueries } from "@/hooks/useQueries";
import Cookies from "js-cookie";

export const UserContext = createContext({})

export function UserContextProvider({ children, ...props }) {
  const { data } = useQueries({
    prefixUrl: "https://localhost:7211/apiAuth/User/me",
    headers: { 'Authorization': `Bearer ${Cookies.get('token')}` },
  })

  // console.log(userData)
  

  return (
    <UserContext.Provider value={data?.data || null} {...props}>
      {children}
    </UserContext.Provider>
  )
}