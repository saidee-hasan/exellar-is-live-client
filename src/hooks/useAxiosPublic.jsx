import axios from "axios";

const axiosPublic = axios.create({
  baseURL: "https://exellar.vercel.app",
});
function useAxiosPublic() {
  return axiosPublic;
}

export default useAxiosPublic;
