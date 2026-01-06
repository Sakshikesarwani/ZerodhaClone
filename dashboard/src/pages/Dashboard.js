import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const Home = () => {
  const navigate = useNavigate();

  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const verifyUser = async () => {
      if (!cookies.token) {
        return navigate("/login");
      }

      try {
        const { data } = await axios.post(
          "http://localhost:3002/auth",
          {},
          { withCredentials: true }
        );

        if (!data.status) {
          removeCookie("token");
          return navigate("/login");
        }

        setUsername(data.user);
        toast.success(`Welcome ${data.user}`);
      } catch (err) {
        console.log(err);
        removeCookie("token");
        navigate("/login");
      }
    };

    verifyUser();
  }, [cookies, navigate, removeCookie]);

  const Logout = () => {
    removeCookie("token");
    navigate("/login");
  };

  return (
    <>
      <div className="home_page">
        <h4>
          Welcome <span>{username}</span>
        </h4>

        <button onClick={Logout}>LOGOUT</button>
      </div>

      <ToastContainer />
    </>
  );
};

export default Home;
