/* eslint-disable linebreak-style */
/* eslint-disable eol-last */
/* eslint-disable object-shorthand */
/* eslint-disable function-paren-newline */
/* eslint-disable object-curly-spacing */
/* eslint-disable quotes */
/* eslint-disable space-in-parens */
/* eslint-disable linebreak-style */
/* eslint-disable no-shadow */
/* eslint-disable import/order */
/* eslint-disable key-spacing */
/* eslint-disable semi */
/* eslint-disable padded-blocks */
/* eslint-disable no-trailing-spaces */
/* eslint-disable indent */
/* eslint-disable linebreak-style */
import { headers } from "@/next.config";
import { useCallback, useEffect, useState } from "react"

export const useQueries = ({ prefixUrl = "", headers = {} } = {}) => {
  const [data, setData] = useState({
    data: null,
    isLoading: true,
    isError: false,
  })

  const fetchingData = useCallback(
    async ( {url = "", method = 'GET', headers = {} } = {}) => {
    // setData({
    //   ...data,
    //   isLoading: true,
    // })
    try {
      const response = await fetch(url, { method, headers } );
      const result = await response.json();
      setData({
        ...data,
        data: result,
        isLoading: false,
      })
    } catch (error) {
      setData({
        ...data,
        isError:true,
        isLoading: false,
      })
      
    }
  }, [])

  useEffect(() => {
    if (prefixUrl) {
      fetchingData({ url: prefixUrl, headers: headers })
    }
  }, [])

  return {
    ...data,
    refetch: () => fetchingData({ url: prefixUrl, headers: headers }), // Menambahkan fungsi refetch
  }
  
}