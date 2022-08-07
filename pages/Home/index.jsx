import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {  Modal } from "react-bootstrap"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/font/bootstrap-icons.css"

const Home = () => {

  const [todos, setTodos] = useState(undefined);
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [todoView, setTodoView] = useState(undefined);
  const [title, setTitle] = useState(undefined);
  const [content, setContent] = useState(undefined);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleClose2 = () => setShow2(false);
    const handleShow2 = () => setShow2(true);

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

  const createTodo = async (e) => {
    e.preventDefault();
    const Todo = { title, content, userId: localStorage.getItem("userId") }
    try {
        let response = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_URL}/todo`, {
            method: "POST",
            body: JSON.stringify(Todo),
            headers: {
                "Content-type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
        })
        if (response.ok) {
            let data = await response.json()
            console.log(data)
          setShow2(false)
          getTodos()
        } else {
            alert("Creating todo failed")
            if (response.status === 400) {
                alert("bad request")
            }
            if (response.status === 404) {
                alert("page not found")
            }
        }
    } catch (error) {
        console.log(error)
    }
}

  useEffect(() => {getTodos()} ,[])

  return (
    <>
  <div>
    <div className="flex justify-end mb-2">
    <div className="border-container2 text-center p-2 mt-2 mr-2 pointer bg-blue-600 text-white" onClick={handleShow2}>Add todo</div>
      <div className="border-container2 text-blue-600 text-center p-2 mt-2 mr-2 bg-white pointer" onClick={() => { Logout() }} >Logout</div>
    </div>
    <h1 className="text-center font-bold text-blue-600 mb-5">TODOS</h1>
    <div className="grid gap-4 sm:grid-cols-2 m-auto md:grid-cols-4 lg:grid-cols-6">
      {todos && todos.map((todo, index) => { return(
        <div key={index} onClick={()=> {handleShow(); setTodoView(todo)}} className="note-container pointer  p-2 m-auto flex flex-col justify-between">
        <div>
          <h5 className="font-bold text-blue-600 mb-2">{todo.title}</h5>
          <div>
          <span className="text-sm cut-line">{todo.content}</span>
          </div> 
        </div>
        <span className="block mt-auto font-light text-xs">{todo.updatedAt.slice(0,10) + " · " + todo.updatedAt.slice(11,19)}</span>
      </div>)
      })}
    </div>
  </div>
  <Modal
        size="md"
        show={show}
        onHide={() => handleClose()}
        aria-labelledby="example-modal-sizes-title-md"
      >
        <Modal.Header >
          <Modal.Title id="example-modal-sizes-title-md" className="text-blue-600">
            {todoView && todoView.title}
          </Modal.Title>
          <i className="bi bi-x-circle-fill pointer text-blue-600" onClick={handleClose} style={{fontSize: "25px"}}></i>
        </Modal.Header>
        <Modal.Body>{todoView && todoView.content}</Modal.Body>
      </Modal>

      <Modal
        size="md"
        show={show2}
        onHide={() => handleClose2()}
        aria-labelledby="example-modal-sizes-title-md"
      >
        <Modal.Header >
          <Modal.Title id="example-modal-sizes-title-md" className="text-blue-600">
           Create todo
          </Modal.Title>
          <i className="bi bi-x-circle-fill pointer text-blue-600" onClick={handleClose2} style={{fontSize: "25px"}}></i>
        </Modal.Header>
        <Modal.Body><input type="text" placeholder="Insert title..." onChange={(e) => { setTitle(e.target.value) }} required className="w-70 m-auto mt-3 mb-3 border-blue-600 border p-1" />
        <textarea required placeholder="Insert content..." onChange={(e)=> {setContent(e.target.value)}} className="border p-1 border-blue-600" name="Text1" cols="40" rows="5"></textarea>
        <button className="mt-3 mb-2 m-auto border-container bg-blue-600 text-white" onClick={(e) => { createTodo(e) }} >Submit</button></Modal.Body>
      </Modal>
</>
  )
};

export default Home;