import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {  Modal } from "react-bootstrap"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/font/bootstrap-icons.css"

const Home = () => {

  const [todos, setTodos] = useState(undefined);
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);
  const [show4, setShow4] = useState(false);
  const [todoView, setTodoView] = useState(undefined);
  const [title, setTitle] = useState(undefined);
  const [content, setContent] = useState(undefined);
  const [deleteId, setDeleteId] = useState(undefined);
  const [modifyId, setModifyId] = useState(undefined);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleClose2 = () => setShow2(false);
    const handleShow2 = () => setShow2(true);

    const handleClose3 = () => setShow3(false);
    const handleShow3 = () => setShow3(true);

    const handleClose4 = () => setShow4(false);
    const handleShow4 = () => setShow4(true);

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
         handleClose2()
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

const deleteTodo = async () => {
  try {
    let response = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_URL}/todo/` + deleteId, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    },
    })
    if (response.status === 200) {
      handleClose3()
      getTodos()
    } else {
    alert("dletion failed")
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

  const modifyTodo = async (e) => {
    e.preventDefault();
    const Todo = { title, content }
    try {
        let response = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_URL}/todo/` + modifyId, {
            method: "PUT",
            body: JSON.stringify(Todo),
            headers: {
                "Content-type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
        })
        if (response.status === 204) {
         handleClose4()
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
        <div key={index}  className="note-container pointer  p-2 m-auto flex flex-col justify-between">
        <div onClick={()=> {handleShow(); setTodoView(todo)}}>
          <h5 className="font-bold text-blue-600 mb-2">{todo.title}</h5>
          <div>
          <span className="text-sm cut-line">{todo.content}</span>
          </div> 
        </div>
        <div className="flex justify-between items-center">
        <span onClick={()=> {handleShow(); setTodoView(todo)}} className="mt-auto font-light text-xs">{todo.updatedAt.slice(0,10) + " · " + todo.updatedAt.slice(11,19)}</span>
        <i className="bi bi-pencil pointer text-green-600" onClick={()=>{handleShow4(); setModifyId(todo.id); setTodoView(todo)}} style={{fontSize: "18px"}}></i>
        <i className="bi bi-trash pointer text-red-600" onClick={()=>{handleShow3(); setDeleteId(todo.id)}} style={{fontSize: "18px"}}></i>
        </div>
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
        <Modal.Body><h6 className="mb-5 font-normal">{todoView && todoView.content}</h6>
        <span className="block mt-auto font-light text-xs">{todoView && todoView.updatedAt.slice(0,10) + " · " + todoView.updatedAt.slice(11,19)}</span></Modal.Body>
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

      <Modal
        size="md"
        show={show3}
        onHide={() => handleClose3()}
        aria-labelledby="example-modal-sizes-title-md"
      >
        <Modal.Header >
          <Modal.Title id="example-modal-sizes-title-md" className="text-blue-600">
           Delete todo
          </Modal.Title>
          <i className="bi bi-x-circle-fill pointer text-blue-600" onClick={handleClose3} style={{fontSize: "25px"}}></i>
        </Modal.Header>
        <Modal.Body><h6>Are you sure to delete todo?</h6>
        <div className="flex">
          <button className="mt-3 mb-2 m-auto border-container bg-green-600 text-white" onClick={(e) => { deleteTodo() }} >Yes</button> 
        <button className="mt-3 mb-2 m-auto border-container bg-red-600 text-white" onClick={(e) => { handleClose3() }} >no</button>
        </div>
        </Modal.Body>
      </Modal>

      <Modal
        size="md"
        show={show4}
        onHide={() => handleClose4()}
        aria-labelledby="example-modal-sizes-title-md"
      >
        <Modal.Header >
          <Modal.Title id="example-modal-sizes-title-md" className="text-blue-600">
           Modify todo
          </Modal.Title>
          <i className="bi bi-x-circle-fill pointer text-blue-600" onClick={handleClose4} style={{fontSize: "25px"}}></i>
        </Modal.Header>
        <Modal.Body><input type="text" defaultValue={todoView && todoView.title} onChange={(e) => { setTitle(e.target.value) }} required className="w-70 m-auto mt-3 mb-3 border-blue-600 border p-1" />
        <textarea required defaultValue={todoView && todoView.content} onChange={(e)=> {setContent(e.target.value)}} className="border p-1 border-blue-600" name="Text1" cols="40" rows="10"></textarea>
        <button className="mt-3 mb-2 m-auto border-container bg-blue-600 text-white" onClick={(e) => { modifyTodo(e) }} >Submit</button></Modal.Body>
      </Modal>
</>
  )
};

export default Home;