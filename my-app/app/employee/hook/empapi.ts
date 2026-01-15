import axios from "axios";

const empapi = axios.create({
  baseURL: "http://localhost:2500", 
  withCredentials: true,
});


export default empapi;