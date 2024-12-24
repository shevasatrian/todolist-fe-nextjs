
import { useCallback, useState } from "react"

export const useMutation = () => {
  const [data, setData] = useState({
    data: null,
    isLoading: true,
    isError: false,
  })

  const mutate = useCallback(
    async ( {url = "", method = "POST", payload = {}, headers = {} } = {}) => {
      console.log('payload => ', payload)
    // setData({
    //   ...data,
    //   isLoading: true,
    // })
    try {
      // Cek apakah payload adalah FormData
      const isFormData = payload instanceof FormData;

      const response = await fetch(url, { 
        method, 
        headers: {
          ...(isFormData ? {} : { "Content-Type": "application/json" }),
          ...headers
        },
        ...(method !== "GET" && { body: isFormData ? payload : JSON.stringify(payload) }),
       } );
      const result = await response.json();
      setData({
        ...data,
        data: result,
        isLoading: false,
      })
      return { ...result }
    } catch (error) {
      setData({
        ...data,
        isError:true,
        isLoading: false,
      })
      return error
    }
  }, [])

  return { ...data, mutate }
  
}