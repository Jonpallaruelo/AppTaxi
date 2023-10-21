
import { useAppStore } from "@/store/app";
export default async function  getAllData(parameterUrl) {
      let responseData = null;

      try {
        //  import.meta.env.VITE_URLCAllAPI llamamos a la variable de entorno para cargar la parte repedita de la url que usamos en toda la applicación
          console.log(import.meta.env.VITE_URLCAllAPI + parameterUrl)
          const response = await fetch(`${import.meta.env.VITE_URLCAllAPI + parameterUrl}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.status > 201) {

          const store = useAppStore()
          store.onOrOffNotification();
          throw new Error('TooManyRequest');

        } else if(response.status == 200 || response.status == 201) {
          responseData = await response.json();
        }

        return responseData;
      } catch (error) {
        throw new Error(`Error: ${error.message}`);
      }
    }

