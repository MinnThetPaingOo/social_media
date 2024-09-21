import axios from "axios";
import { useEffect } from "react";
const useFollow = (id) => {
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.post(
                    "/user/follow/" + id
                );
                console.log(response.data);
            } catch (err) {
                console.log(err.message);
            }
        };
        fetchData();
    }, []);
    return response
}

export default useFollow