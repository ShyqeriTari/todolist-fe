import { useRouter } from "next/router";

const Home = () => {

    const router = useRouter();

    const Logout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("userId")
        router.push('/')
      }

 return( <div>
    <div className="flex justify-end">
<div className="border-container2 text-center p-2 mt-2 mr-2 pointer" onClick={()=> {Logout()}} >Logout</div>
</div>
<h1>Home</h1>
  </div>)
};

export default Home;