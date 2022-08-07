import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Home = () => {

  const [todos, setTodos] = useState(undefined);

  const router = useRouter();

  const Logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userId")
    router.push('/')
  }

  const getTodos = async () => {
    try {
       
      const response = await fetch(process.env.NEXT_PUBLIC_LOCAL_URL + "/todo/" + localStorage.getItem("userId"), {
          headers:{
              "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
      });
      const data = await response.json();
      console.log(data)
      setTodos(data);
      
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {getTodos()} ,[])

  return (
  <div>
    <div className="flex justify-end mb-2">
      <div className="border-container2 text-blue-600 text-center p-2 mt-2 mr-2 pointer" onClick={() => { Logout() }} >Logout</div>
    </div>
    <h1 className="text-center font-bold text-blue-600 mb-5">TODOS</h1>
    <div className="grid gap-4 sm:grid-cols-2 m-auto md:grid-cols-4 lg:grid-cols-6">
      {todos && todos.map((todo, index) => { return(
        <div key={index} className="note-container  p-2 m-auto text-blue-600 flex flex-col justify-between">
        <div>
          <h1 className="font-bold mb-2">{todo.title}</h1>
          <div>
          <span className="text-sm cut-line">{todo.content}</span>
          </div> 
        </div>
        <span className="block mt-auto font-light text-xs">{todo.updatedAt.slice(0,10) + " · " + todo.updatedAt.slice(11,19)}</span>
      </div>)
      })}
    </div>
  </div>
  )
};

export default Home;